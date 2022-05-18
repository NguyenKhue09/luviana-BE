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

export const BookingCalendarServices = {
  getBookingCalendar,
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
