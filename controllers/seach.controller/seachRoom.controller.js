import { RoomServices } from '../../services/room.services'

module.exports.searchRoom = async (req, res) => {
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

module.exports.searchRoomByPrice = async (req, res) => {
    
}