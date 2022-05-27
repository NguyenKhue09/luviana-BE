import express from "express"
import { RoomController } from "../controllers/room.controller.js"

const RoomRouter = express.Router()

RoomRouter
    .route("/")
    .get(RoomController.getRoom)
    .post(RoomController.postRoom)
    .put(RoomController.updateRoom)
    .delete(RoomController.deleteRoom)


RoomRouter.get("/search", RoomController.searchRoom);
RoomRouter.post("/searchV2", RoomController.searchRoomV2);
RoomRouter.post("/available-apartment", RoomController.searchRoomAvailableOfAparment);
RoomRouter.get("/apartment/:apartmentId", RoomController.searchRoomByApartmentId);
RoomRouter.get("/get-room-by-id/:roomId", RoomController.getRoomById);
RoomRouter.get("/change-capacity", RoomController.changeCapacity);

export default RoomRouter;