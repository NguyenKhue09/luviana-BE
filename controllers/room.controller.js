import { RoomServices } from "../services/room.services.js";

async function getRoom(req, res) {
    try {
        const { highToLow } = req.query;
        if (highToLow) {
            const response = await RoomServices.getRoomBySortPriceReverse()
            if (response.success) {
                return res.status(200).json(response)
            } else {
                return res.status(400).json(response)
            }
        } else {
            const response = await RoomServices.getRoomBySortPrice()
            if (response.success) {
                return res.status(200).json(response)
            } else {
                return res.status(400).json(response)
            }
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
    
}

async function searchRoom (req, res) {
    try {
        const { checkinDate, checkoutDate, people, city } = req.body;

        var rooms = await RoomServices.searchRoom(checkinDate, checkoutDate, people, city)

        if (rooms.success) {
            if (rooms.data) return res.status(200).json(rooms)
            else return res.status(404).json(rooms)
        } else {
            return res.status(400).json(rooms)
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
}

async function postRoom (req, res) {
    try {
        const { bedName, name, square, apartmentId, price, capacity, rating, thumbnail, isAvailable, facilities} = req.body;

        var newData = { bedName, name, square, apartmentId, price, capacity, rating, thumbnail, isAvailable, facilities};

        var addNewRoom = await RoomServices.addNewRoom(newData);

        if (addNewRoom.success) {
            if (addNewRoom.data) return res.status(200).json(addNewRoom)
            else return res.status(404).json(addNewRoom)
        } else {
            return res.status(400).json(addNewRoom)
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
}

async function updateRoom (req, res) {
    try {
        const roomId = req.body.roomId;
        const { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities} = req.body;

        var updateData = { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities};

        var updateRoom = await RoomServices.updateRoom(roomId, updateData);

        if (updateRoom.success) {
            if (updateRoom.data) return res.status(200).json(updateRoom)
            else return res.status(404).json(updateRoom)
        } else {
            return res.status(400).json(updateRoom)
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
}

async function deleteRoom (req, res) {
    try {
        const roomId = req.body.roomId;

        var deleteRoom = await RoomServices.deleteRoom(roomId);

        if (deleteRoom.success) {
            if (deleteRoom.data) return res.json(deleteRoom)
            else return res.status(404).json(deleteRoom)
        } else {
            return res.status(400).json(deleteRoom)
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
}

export const RoomController = {
    getRoom, 
    searchRoom,
    postRoom,
    updateRoom,
    deleteRoom
}