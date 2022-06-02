import mongoose from "mongoose";
import BookingCalendar from "../models/bookingCalendar.model.js";

async function getBookingCalendar(beginDate, endDate) {
  try {
    const result = await BookingCalendar.aggregate([
      {
        $project: {
          _id: 1,
          isAvailable: {
            $and: [
              //{"$beginDate": {$eq: new Date(beginDate)}},
              { $gte: ["$endDate", new Date(endDate)] } ,
            ],
          },
        },
      },
    ]);
    return {
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
}

async function getBookingCalendarOfUser(userId) {
  try {
    const result = await BookingCalendar.aggregate([
      {
        $match: {
          $and: [
            {beginDate: {$gte:  new Date(Date.now())}},
            {endDate: {$gte:  new Date(Date.now())}}
          ],
          owner: new mongoose.Types.ObjectId(userId)
        },
      },
      {
        $group: {
          _id: "$room",
          customer: { $first: "$customer" },
          owner: { $first: "$owner" },
          calendar: {
            $push: {
              beginDate: "$beginDate",
              endDate: "$endDate"
            }
          }
        }
      },
      {
        $project: {
          room: "$_id",
          customer: 1,
          owner: 1,
          calendar: 1,
          _id: 0
        }
      },
      {
        $lookup: {
          from: "rooms",  
          localField: "room",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room"
      },
      {
        $project: {
          room: 1,
          customer: 1,
          owner: 1,
          calendar: 1,
          apartmentId: "$room.apartmentId"
        }
      },
      {
        $lookup: {
          from: "apartments",  
          localField: "apartmentId",
          foreignField: "_id",
          as: "apartment",
        },
      },
      {
        $unwind: "$apartment"
      },
      {
        $group: {
          _id: "$apartment",
          customer: { $first: "$customer" },
          owner: { $first: "$owner" },
          roomsCalendar: {
            $push: {
              room: "$room",
              calendar: "$calendar"
            }
          }
        }
      },
      {
        $project: {
          roomsCalendar: 1,
          owner: 1,
          customer: 1,
          apartment: "$_id",
          _id: 0,
        }
      },
      { $unset: [ "apartment.pictures",  "apartment.__v",  "apartment.isPending", "apartment.isDisable", "apartment.owner", "apartment.description", "apartment.address", "apartment.rating"] }
    ]);

    if(result.length === 0) {
      return {
        success: false,
        data: null,
        message: "No booking calendar found!",
      };
    }

    return {
      success: true,
      data: result,
      message: "Get booking calendar of user success",
    };

  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
}

export const BookingCalendarServices = {
  getBookingCalendar,
  getBookingCalendarOfUser
};

//db.inventory.aggregate([{$match: {$and: [{"instock.end": {$lt: 15}}, {"instock.start": {$gt: 25}}]}}])

// db.inventory.insertMany( [
//     {instock: [ { start: 5, end: 10 }, {start: 15, end: 20 } ] },
//     {instock: [ { start: 5, end: 10 }] },
//  ]);

// db.inventory.aggregate([
//   {
//     $project: {
//       _id: 1,
//       isAvailable: {
//         $and: [{ $lte: ["instock.start", 15] }, { $gte: ["instock.end", 20] }],
//       },
//     },
//   },
// ]);

// db.inventory.aggregate([
//   {
//     $project: {
//       _id: 1,
//       isAvailable: {
//         $lte: ["instock.start", 15],
//       },
//     },
//   },
// ]);
