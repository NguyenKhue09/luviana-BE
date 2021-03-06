import { ApartmentService } from "../services/apartment.services.js";
import { ReviewService } from "../services/review.services.js";

async function getApartment(req, res) {
    try {
        const result = await ApartmentService.getAllApartment();
        if (result.success) {
            return res.status(200).json(result);
        } else return res.status(500).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }

}

async function getApartmentByPage(req, res) {
    let { currentPage, apartmentPerPage, type } = req.query;

    try {
        if (currentPage == null) currentPage = 0;
        if (apartmentPerPage == null) apartmentPerPage = 5;

        const response = await ApartmentService.getApartmentByPage(
            apartmentPerPage,
            currentPage,
            type
        );

        if (response.success) {
            return res.status(200).json(response);
        } else return res.status(500).json(response);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function addNewApartment(req, res) {
    try {
        const address = {
            apartmentNumber: req.body.apartmentNumber,
            street: req.body.street,
            district: req.body.district,
            province: req.body.province,
            country: req.body.country,
            ward: req.body.ward
        };
        const name = req.body.name;
        const rating = req.body.rating;
        const type = req.body.type;
        const description = req.body.description;
        const thumbnail = req.body.thumbnail;
        const pictures = req.body.pictures
        const owner = req.body.owner
        const isPending = true

        const result = await ApartmentService.addNewApartment(
            name,
            owner,
            address,
            thumbnail,
            pictures,
            type,
            rating,
            description,
            isPending
        );

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        //console.log(error);
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function getOneApartment(req, res) {
    const { id } = req.params;

    if (!id)
        return res.status(400).json({
            success: false,
            message: "Please provide room id",
            data: null,
        });
    const response = await ApartmentService.getOneApartment(id);

    if (response.success) {
        return res.json(response);
    } else {
        return res.status(400).json(response);
    }
}

async function getAllPendingApartment(req, res) {
    try {
        const pendingApartments = await ApartmentService.getAllPendingApartment()

        if (pendingApartments.success) {
            return req.json(pendingApartments)
        } else {
            return res.status(500).json({
                success: false,
                message: pendingApartments.message,
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function updateApartment(req, res) {
    const { apartmentId, apartmentData } = req.body;

    if (!apartmentId) {
        return res.status(400).json({
            success: false,
            message: "Please provide apartment id",
            data: null,
        });
    }
    if (!apartmentData) {
        return res.status(400).json({
            success: false,
            message: "Please provide data to update",
            data: null,
        });
    }

    const response = await ApartmentService.updateApartment(
        apartmentId,
        apartmentData
    );

    if (response.success) {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
}

async function confirmPendingApartment(req, res) {
    const { apartmentId } = req.body
    try {
        const apartment = await ApartmentService.confirmPendingApartment(apartmentId)

        //console.log(apartment)
        if (apartment.success) {
            return res.json(apartment)
        } else {
            return res.status(500).json({
                success: false,
                message: apartment.message,
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function removePendingApartment(req, res) {
    const { apartmentId } = req.query
    try {
        const apartment = await ApartmentService.removePendingApartment(apartmentId)

        if (apartment.success) {
            return res.json(apartment)
        } else {
            return res.status(500).json({
                success: false,
                message: apartment.message,
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function deleteApartment(req, res) {
    const { apartmentId } = req.body
    try {
        const apartment = await ApartmentService.deleteApartment(apartmentId)

        if (apartment.success) {
            return res.json(apartment)
        } else {
            return res.status(500).json({
                success: false,
                message: apartment.message,
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function getApartmentCities(req, res) {
    try {
        const apartmentCities = await ApartmentService.getApartmentCities()
        if (apartmentCities.success) {
            return res.json(apartmentCities)
        } else {
            return res.status(500).json({
                success: false,
                message: apartmentCities.message,
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

async function addReview(req, res) {
    const { apartmentId, content, rating } = req.body;
    const user = req.userId;
    if (!user || !apartmentId || !content || !rating) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
            data: null,
        });
    }
    try {
        const response = await ReviewService.addReview(user, apartmentId, content, rating);
        if (response.success) {
            return res.json(response);
        } else return res.status(500).json(response);
    } catch (e) {
       // console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            data: null
        })
    }
}

async function getReviews(req, res) {
    const { id } = req.query;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Please provide apartment id",
            data: null,
        });
    }
    try {
        const response = await ReviewService.getReviews(id, page, limit);
        if (response.success) {
            return res.json(response);
        } else return res.status(500).json(response);
    } catch (e) {
        //console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            data: null
        })
    }
}

async function getAvgRating(req, res) {
    let { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Please provide apartment id",
            data: null,
        });
    }

    try {
        const response = await ReviewService.getAvgRating(id);

        if (response.success) {
            return res.json(response);
        } else return res.status(500).json(response);
    } catch(e) {
        //console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            data: null
        })
    }
}

async function getApartmentOfUser(req, res) {
    
    try {
        const userId = req.userId

        const aparments = await ApartmentService.getApartmentOfUser(userId);

        if (aparments.success) {
            return res.json(aparments);
        } else return res.status(500).json(aparments);
    } catch(e) {
        //console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            data: null
        })
    }
}


async function activateDisableApartment(req, res) {
    const { apartmentId} = req.body;

    if (!apartmentId) {
        return res.status(400).json({
            success: false,
            message: "Please provide apartment id",
            data: null,
        });
    }
    const response = await ApartmentService.activateDisableApartment(
        apartmentId
    );

    if (response.success) {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
}

export const ApartmentController = {
    getApartment,
    getOneApartment,
    addNewApartment,
    updateApartment,
    getApartmentByPage,
    getAllPendingApartment,
    confirmPendingApartment,
    removePendingApartment,
    deleteApartment,
    getApartmentCities,
    addReview,
    getReviews,
    getAvgRating,
    getApartmentOfUser,
    activateDisableApartment
};
