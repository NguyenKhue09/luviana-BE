import { add } from "nodemon/lib/rules";
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

async function postRoom (req, res) {
    const { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities} = req.body;

    var newData = { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities};

    var addNewRoom = await RoomServices.addNewRoom(newData);

    if (addNewRoom.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
    }
}

async function updateRoom (req, res) {
    const roomId = req.body.roomId;
    const { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities} = req.body;

    var updateData = { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities};

    var updateRoom = await RoomServices.updateRoom(roomId, updateData);

    if (updateRoom.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
    }
}

async function deleteRoom (req, res) {
    const roomId = req.body.roomId;

    var deleteRoom = await RoomServices.deleteRoom(roomId);

    if (deleteRoom.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
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
    searchRoom,
    postRoom,
    updateRoom,
    deleteRoom
}