import Room from "../models/room.model.js";


async function getRoomBySortPrice() {
    try {

        const result = await Room.find({}).sort({"price": 1})

        if(result.length == 0) {
            return {
                success: false,
                message: "Get room by sort price failed!",
                data: result
            }
        }
        return {
            success: true,
            message: "Get room by sort price successfully",
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

async function getRoomBySortPriceReverse() {
    try {

        const result = await Room.find({}).sort({"price": -1})

        if(result.length == 0) {
            return {
                success: false,
                message: "Get room by sort price failed!",
                data: result
            }
        }
        return {
            success: true,
            message: "Get room by sort price successfully",
            data: result
        }
    } catch (error) {
        return {
            success: false,
            message: error,
            data: null
        }
    }
}

async function searchRoom(checkinDate, checkoutDate, people, city) {
    try {
        const result = await Room.aggregate([
            {
                $match: {
                    "capacity": people
                },
            },
            {
                $lookup: {
                    from: "apartments",
                    localField: "apartmentId",
                    foreignField: "_id",
                    as: "apartment"
                },
            },
            {
                $unwind: "$apartment"
            },
            {
                $match: {
                    "apartment.address.province": city
                }
            },
            {
                $lookup: {
                    from: "bookingcalendars",
                    localField: "_id",
                    foreignField: "room",
                    as: "bookingcalendar"
                },
            },
            {
                $match: {
                    'bookingcalendar.beginDate': {
                        $ne: new Date(checkinDate),
                    },
                    'bookingcalendar.endDate': {
                        $ne: new Date(checkoutDate),
                    }
                }
            }
        ])

        if(result.length == 0) {
            return {
                success: true,
                message: "Rooms not found!",
                data: null
            }
        }

        return {
            success: true,
            message: "Find rooms available successfully",
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

async function addNewRoom(data) {
    try {
        
        const result = await Room.create(data)

        if(!result) {
            return {
                success: false,
                message: "Add new room failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Add new room successfully",
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

async function updateRoom(roomId, data) {
    try {
        const result = await Room.findByIdAndUpdate(roomId, data)

        if(!result) {
            return {
                success: false,
                message: "update room failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Update room successfully",
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

async function deleteRoom(roomId) {
    try {
        const result = await Room.findByIdAndDelete(roomId)

        if(!result) {
            return {
                success: false,
                message: "Delete room failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Delete room successfully",
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


export const RoomServices = {
    getRoomBySortPrice,
    getRoomBySortPriceReverse,
    searchRoom,
    addNewRoom,
    updateRoom,
    deleteRoom
}