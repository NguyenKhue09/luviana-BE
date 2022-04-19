import express from "express"
import { RoomController } from "../controllers/room.controller.js"

const RoomRouter = express.Router()

RoomRouter
    .get(RoomController.getRoom)
    .post(RoomController.postRoom)
    .put(RoomController.updateRoom)
    .delete(RoomController.deleteRoom)


RoomRouter.get("/search", RoomController.searchRoom);

export default RoomRouter;