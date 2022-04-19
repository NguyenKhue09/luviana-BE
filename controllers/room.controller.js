import { RoomServices } from "../services/room.services.js";

async function getRoom(req, res) {
    const response = await RoomServices.getRoomBySortPrice()
    if (response.success) {
        return res.json(response)
    } else {
        return res.status(500).json(response)
    }
}

async function searchRoom(req, res) {
    const { checkinDate, checkoutDate, people, city } = req.query;
    const response = RoomController.searchRoom(checkinDate, checkoutDate, people, city);
    if (response.success) {
        res.json(response);
    } else {
        res.status(400).json(response);
    }
}

export const RoomController = {
    getRoom,
    searchRoom
}