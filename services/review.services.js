import Review from "../models/review.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js"
import Apartment from "../models/apartment.model.js";

async function addReview(user, apartmentId, content, rating) {
    try {
        const checkUserIdExists = await User.exists({ _id: mongoose.Types.ObjectId(user) });
        const checkApartmentExists = await Apartment.exists({ _id: mongoose.Types.ObjectId(apartmentId) });
        if (!checkUserIdExists) {
            return {
                success: false,
                message: "User does not exist!",
                data: null
            }
        }

        if (!checkApartmentExists) {
            return {
                success: false,
                message: "Apartment does not exist!",
                data: null
            }
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        const review = new Review({
            user,
            content,
            rating,
            date: new Date()
        })
        await review.save()
        const result = await Apartment.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(apartmentId)
        }, {
            $push: {
                reviews: {
                    $each: [review._id],
                    $position: 0
                }
            }
        }, {
            session,
            returnDocument: "after"
        });
        await session.commitTransaction();
        await session.endSession();

        if (!result) {
            return {
                success: false,
                message: "Review not saved!",
                data: null
            }
        }
        return {
            success: true,
            message: "Review saved!",
            data: result
        }
    } catch (e) {
        //console.log(e);
        return {
            success: false,
            message: "Unexpected error!",
            data: null
        }
    }
}

async function getReviews(apartmentId, page, limit) {
    try {
        const checkApartmentExists = await Apartment.exists({ _id: mongoose.Types.ObjectId(apartmentId) });
        if (!checkApartmentExists) {
            return {
                success: false,
                message: "Apartment does not exist!",
                data: null
            }
        }

        const result = await Apartment.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(apartmentId) } },
            { $project: { reviews: 1 } },
            {
                $set: {
                    reviews: {
                        $slice: ["$reviews", (page - 1) * limit, limit]
                    }
                }
            }
        ]);
        let final = await Apartment.populate(result, { path: "reviews" });
        final = await Apartment.populate(final, { path: "reviews.user" });
        final[0].currentPage = page;
        final[0].maxPage = Math.ceil(result[0].reviews.length / limit);

        return {
            success: true,
            message: "Reviews fetched!",
            data: final[0],
        }
    } catch (e) {
        //console.log(e);
        return {
            success: false,
            message: "Unexpected error!",
            data: null
        }
    }
}

async function getAvgRating(apartmentId) {
    const checkApartmentExists = await Apartment.exists({ _id: mongoose.Types.ObjectId(apartmentId) });
    try {
        if (!checkApartmentExists) {
            return {
                success: false,
                message: "Apartment does not exist!",
                data: null
            }
        }

        const result = await Apartment.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(apartmentId) } },
        ]);

        const final = await Apartment.populate(result, { path: "reviews" });
        if (final[0].reviews == null) return {
            success: true,
            message: "Average rating calculated!",
            data: 0
        }
        const avgRating = final[0].reviews.reduce((acc, cur) => acc + cur.rating, 0) / final[0].reviews.length;
        return {
            success: true,
            message: "Average rating calculated!",
            data: avgRating
        }
    } catch(e) {
       // console.log(e);
        return {
            success: false,
            message: "Unexpected error!",
            data: null
        }
    }
}

export const ReviewService = {
    addReview,
    getReviews,
    getAvgRating
}