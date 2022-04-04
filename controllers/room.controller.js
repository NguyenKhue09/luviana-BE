import { RoomServices } from "../services/room.services.js";

async function getRoom(req, res) {
    const { highToLow } = req.query;
    if (highToLow) {
        const response = await RoomServices.getRoomBySortPriceReverse()
        if (response.success) {
            return res.json(response)
        } else {
            return res.status(500).json(response)
        }
    } else {
        const response = await RoomServices.getRoomBySortPrice()
        if (response.success) {
            return res.json(response)
        } else {
            return res.status(500).json(response)
        }
    }
}

async function searchRoom (req, res) {
    const { checkinDate, checkoutDate, people, city } = req.body;

    var rooms = await RoomServices.searchRoom(checkinDate, checkoutDate, people, city)

    if (rooms.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
    }
}

export const RoomController = {
    getRoom, 
    searchRoom
}