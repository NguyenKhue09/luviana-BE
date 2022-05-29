import Bill from "../models/bill.model.js"
import Apartment from "../models/apartment.model.js"
import BookingCalendar from "../models/bookingCalendar.model.js"
import Room from "../models/room.model.js"


async function getMonthlyRevenue(month, year) {
    try {
        
        const result = await Bill.aggregate([
            {
                $project: {
                    totalCost: 1,
                    bookingCalendar: { $first: "$bookingCalendar" }
                }
            },
            {
                $lookup: {
                    from: "bookingcalendars",
                    localField: "bookingCalendar",
                    foreignField: "_id",
                    as: "bookingCalendar",
                },
            },
            {
                $unwind: "$bookingCalendar"
            },
            {
                $project: {
                    totalCost: 1,
                    bookingCalendarId: "$bookingCalendar._id",
                    beginDate: "$bookingCalendar.beginDate",
                    room: "$bookingCalendar.room"
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
                    totalCost: 1,
                    bookingCalendarId: 1,
                    beginDate: 1,
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
                $project: {
                    totalCost: 1,
                    bookingCalendarId: 1,
                    beginDate: 1,
                    apartmentId: 1,
                    apartmentName: "$apartment.name"
                }
            },
            {
                $match: {
                    $expr: { $and: [{ $eq: [ { $month: { date: "$beginDate" }} , month]},{ $eq: [ { $year: { date: "$beginDate" }} , year]},] },
                }
            },
            {
                $group: {
                    _id: {
                        apartmentId: "$apartmentId"
                    },
                    beginDate: { $first: "$beginDate" },
                    apartmentName: { $first: "$apartmentName" },
                    apartmentId: { $first: "$apartmentId" },
                    bookingCalendarId: { $first: "$bookingCalendarId" },
                    monthlyRevenue: {$sum: "$totalCost"}
                }
            }
        ])

        if(result.length === 0) {
            return {
                success: false,
                message: "No data found!",
                data: null
            }
        }

        return {
            success: true,
            message: "Get monthly revenue success!",
            data: result
        } 

    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

export const RevenueServices = {
    getMonthlyRevenue
}