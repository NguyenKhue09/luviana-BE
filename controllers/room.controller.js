import { RoomServices } from "../services/room.services.js";

async function getRoom(req, res) {
    try {
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
    } catch (error) {
        return res.status(500).json({
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
            if (result.data) return res.json(rooms)
            else return res.status(404).json(rooms)
        } else {
            return res.status(500).json(rooms)
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null
        })
    }
}

async function postRoom (req, res) {
    try {
        const { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities} = req.body;

        var newData = { apartmentId, price, description, capacity, rating, thumbnail, pictures, isAvailable, facilities};

        var addNewRoom = await RoomServices.addNewRoom(newData);

        if (addNewRoom.success) {
            if (result.data) return res.json(addNewRoom)
            else return res.status(404).json(addNewRoom)
        } else {
            return res.status(500).json(addNewRoom)
        }
    } catch (error) {
        return res.status(500).json({
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
            if (result.data) return res.json(updateRoom)
            else return res.status(404).json(updateRoom)
        } else {
            return res.status(500).json(updateRoom)
        }
    } catch (error) {
        return res.status(500).json({
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
            if (result.data) return res.json(deleteRoom)
            else return res.status(404).json(deleteRoom)
        } else {
            return res.status(500).json(deleteRoom)
        }
    } catch (error) {
        return res.status(500).json({
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