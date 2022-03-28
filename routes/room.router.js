import express from "express"
import { RoomController } from "../controllers/room.controller.js"

const RoomRouter = express.Router()

RoomRouter.get("/get", RoomController.getRoom);

export default RoomRouter;