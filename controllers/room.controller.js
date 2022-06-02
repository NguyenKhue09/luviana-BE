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

async function searchRoomV2 (req, res) {
    try {
        const { checkinDate, checkoutDate, people, city } = req.body;

        let remasteredPeople = 2

        if(people == 1) { remasteredPeople = 2 } else {remasteredPeople = people}

        var rooms = await RoomServices.searchRoomV3(checkinDate, checkoutDate, remasteredPeople, city)

        if (rooms.success) {
            if (rooms.data) return res.json(rooms)
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

async function searchRoomAvailableOfAparment (req, res) {
    try {
        const { checkinDate, checkoutDate, people, apartmentId } = req.body;

        let remasteredPeople = 2

        if(people == 1) { remasteredPeople = 2 } else {remasteredPeople = people}

        var rooms = await RoomServices.searchRoomAvailableOfAparment(checkinDate, checkoutDate, remasteredPeople, apartmentId)

        if (rooms.success) {
            if (rooms.data) return res.json(rooms)
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

async function searchRoomByApartmentId (req, res) {
    try {
        const { apartmentId } = req.params;

        var rooms = await RoomServices.getRomByApartmentId(apartmentId)

        if (rooms.success) {
            if (rooms.data) return res.json(rooms)
            else return res.status(204).json(rooms)
        } else {
            return res.status(400).json(rooms)
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
        return res.status(500).json({
            success: false,
            message: error,
            data: null
        })
    }
}

async function updateRoom (req, res) {
    try {

        const data = req.body
        const { roomId } = data;

        delete data.roomId

        const updateData  = data;

        var updateRoom = await RoomServices.updateRoom(roomId, updateData);

        console.log(updateRoom)

        if (updateRoom.success) {
            if (updateRoom.data) return res.status(200).json(updateRoom)
            else return res.status(404).json(updateRoom)
        } else {
            return res.status(400).json(updateRoom)
        }
    } catch (error) {
        console.log(error)
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

        var deleteRoom = await RoomServices.disableRoom(roomId);

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

async function activateRoom (req, res) {
    try {
        const roomId = req.body.roomId;

        var deleteRoom = await RoomServices.activateRoom(roomId);

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

async function getRoomById(req, res) {
    const { roomId } = req.params;
    
    try {
        const response = await RoomServices.getRoomById(roomId);
        if (response.success) {
            return res.status(200).json(response)
        } else {
            return res.status(400).json(response)
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            data: null
        })
    }
}

async function changeCapacity(req, res) {
    
    try {
        const response = await RoomServices.changeCapacity();
        if (response.success) {
            return res.status(200).json(response)
        } else {
            return res.status(400).json(response)
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            data: null
        })
    }
}


export const RoomController = {
    getRoom, 
    searchRoom,
    searchRoomV2,
    searchRoomByApartmentId,
    searchRoomAvailableOfAparment,
    postRoom,
    updateRoom,
    deleteRoom,
    getRoomById,
    changeCapacity,
    activateRoom
}