import Bill from "../models/bill.model.js"


async function getMonthlyRevenue(month, year) {
    try {
        
        const result = await Bill.aggregate([
            {
                $project: {
                    totalCost: 1,
                    apartmentId: 1,
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
                    apartmentId: 1,
                    bookingCalendarId: "$bookingCalendar._id",
                    beginDate: "$bookingCalendar.beginDate",
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
            },
            {
                $project: {
                    monthlyRevenue: 1,
                    bookingCalendarId: 1,
                    beginDate: 1,
                    apartmentId: 1,
                    apartmentName: 1,
                    apartmentId: "$_id.apartmentId",
                    _id: 0
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

async function getYearlyRevenue(year) {
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
                }
            },
            {
                $project: {
                    totalCost: 1,
                    bookingCalendarId: 1,
                    beginDate: 1,
                }
            },
            {
                $match: {
                    $expr: { $eq: [ { $year: { date: "$beginDate" }} , year]},
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: { date: "$beginDate", timezone: "Asia/Bangkok" }},
                    },
                    bookingCalendarId: { $first: "$bookingCalendarId" },
                    revenueOfMonth: {$sum: "$totalCost"}
                }
            },
            {
                $project: {
                    month: "$_id.month",
                    revenueOfMonth: 1,
                    bookingCalendarId: 1,
                    _id: 0
                }
            },
            { $sort : { month : 1 } }
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


async function getAllYearlyRevenue() {
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
                }
            },
            {
                $project: {
                    totalCost: 1,
                    bookingCalendarId: 1,
                    beginDate: 1,
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: { date: "$beginDate", timezone: "Asia/Bangkok" }},
                        month: { $month: { date: "$beginDate", timezone: "Asia/Bangkok" }},
                    },
                    bookingCalendarId: { $first: "$bookingCalendarId" },
                    revenueOfMonth: {$sum: "$totalCost"}
                }
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    revenueOfMonth: 1,
                    bookingCalendarId: 1,
                    _id: 0
                }
            },
            { $sort : { month: -1} },
            {
                $group: {
                    _id: "$year",
                    bookingCalendarId: { $first: "$bookingCalendarId" },
                    listRenvenueMonthOfYear: {
                        $push: {
                            month: "$month",
                            revenueOfMonth: "$revenueOfMonth"
                        }
                    }
                }
            },
            {
                $project: {
                    year: "$_id",
                    listRenvenueMonthOfYear: 1,
                    bookingCalendarId: 1,
                    totalRevenueMonthOfYear: {
                        $reduce: {
                          input: "$listRenvenueMonthOfYear",
                          initialValue: 0,
                          in: {
                            $sum: ["$$value", "$$this.revenueOfMonth"],
                          },
                        },
                      },
                    _id: 0
                }
            },
            { $sort : { year : -1, "listRenvenueMonthOfYear.month": -1} }
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
    getMonthlyRevenue,
    getYearlyRevenue,
    getAllYearlyRevenue
}