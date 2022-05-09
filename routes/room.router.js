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
RoomRouter.get("/searchV2", RoomController.searchRoomV2);

export default RoomRouter;