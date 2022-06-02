import express from "express"
import { RoomController } from "../controllers/room.controller.js"
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";

const RoomRouter = express.Router()

RoomRouter
    .route("/")
    .get(RoomController.getRoom)
    .post(RoomController.postRoom)
    .put(RoomController.updateRoom)


RoomRouter.get("/search", RoomController.searchRoom);
RoomRouter.post("/searchV2", RoomController.searchRoomV2);
RoomRouter.post("/available-apartment", RoomController.searchRoomAvailableOfAparment);
RoomRouter.get("/apartment/:apartmentId", RoomController.searchRoomByApartmentId);
RoomRouter.get("/get-room-by-id/:roomId", RoomController.getRoomById);
RoomRouter.get("/change-capacity", RoomController.changeCapacity);

// Admin
RoomRouter.put("/disable-admin-room", AuthMiddleWare.requireAdmin, RoomController.deleteRoom)
RoomRouter.put("/activate-admin-room", AuthMiddleWare.requireAdmin, RoomController.activateRoom)

// User
RoomRouter.put("/disable-user-room", AuthMiddleWare.requireUser, RoomController.deleteRoom)
RoomRouter.put("/activate-user-room", AuthMiddleWare.requireUser, RoomController.activateRoom)

export default RoomRouter;