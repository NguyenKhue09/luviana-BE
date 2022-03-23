import { RoomServices } from "../services/room.services.js";

async function getRoom(req, res) {
    const response = await RoomServices.getRoomBySortPrice()
    if (response.success) {
        return res.json(response)
    } else {
        return res.status(500).json(response)
    }
}

export const RoomController = {
    getRoom
}