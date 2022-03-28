import { RoomServices } from "../services/room.services.js";

async function getRoom(req, res) {
    const response = await RoomServices.getRoomBySortPrice()
    if (response.success) {
        return res.json(response)
    } else {
        return res.status(500).json(response)
    }
}

async function searchRoom (req, res) {
    var checkinDate = req.body.checkinDate
    var checkoutDate = req.body.checkoutDate
    var people = req.body.people
    var city = req.body.city

    var rooms = await RoomServices.searchRoom(checkinDate, checkoutDate, people, city)

    if (rooms.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
    }
}

async function sortRoom(req, res) {
    // true or false 
    const { highToLow } = req.query;

    

}

export const RoomController = {
    getRoom
}