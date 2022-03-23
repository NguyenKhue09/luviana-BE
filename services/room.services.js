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
            message: error,
            data: null
        }
    }
}

export const RoomServices = {
    getRoomBySortPrice
}