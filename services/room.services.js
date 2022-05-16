import Room from "../models/room.model.js";
import Apartment from "../models/apartment.model.js";

async function getRoomBySortPrice() {
  try {
    const result = await Room.find({}).sort({ price: 1 });

    if (result.length == 0) {
      return {
        success: false,
        message: "Get room by sort price failed!",
        data: result,
      };
    }
    return {
      success: true,
      message: "Get room by sort price successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function getRoomBySortPriceReverse() {
  try {
    const result = await Room.find({}).sort({ price: -1 });

    if (result.length == 0) {
      return {
        success: false,
        message: "Get room by sort price failed!",
        data: result,
      };
    }
    return {
      success: true,
      message: "Get room by sort price successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
}

async function searchRoom(checkinDate, checkoutDate, people, city) {
  try {
    const result = await Room.aggregate([
      {
        $match: {
          capacity: people,
        },
      },
      {
        $lookup: {
          from: "apartments",
          localField: "apartmentId",
          foreignField: "_id",
          as: "apartment",
        },
      },
      {
        $unwind: "$apartment",
      },
      {
        $match: {
          "apartment.address.province": city,
        },
      },
      {
        $lookup: {
          from: "bookingcalendars",
          localField: "_id",
          foreignField: "room",
          as: "bookingcalendar",
        },
      },
      {
        $match: {
          "bookingcalendar.beginDate": {
            $ne: new Date(checkinDate),
          },
          "bookingcalendar.endDate": {
            $ne: new Date(checkoutDate),
          },
        },
      },
    ]);

    if (result.length == 0) {
      return {
        success: true,
        message: "Rooms not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Find rooms available successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function searchRoomV2(checkinDate, checkoutDate, people, city) {
  
  try {
    const result = await Apartment.aggregate([
      {
        $match: {
          "address.province": city,
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "apartmentId",
          as: "rooms",
        },
      },
      {
        $project: {
          description: 0,
          pictures: 0,
          __v: 0,
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          thumbnail: 1,
          type: 1,
          rating: 1,
          rooms: {
            $filter: {
              input: "$rooms",
              as: "room",
              cond: {
                $setIsSubset: [["$$room.capacity"], people],
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          thumbnail: 1,
          type: 1,
          rating: 1,
          rooms: 1,
          capacities: {
            $reduce: {
              input: "$rooms",
              initialValue: [],
              in: {
                $setUnion: ["$$value", ["$$this.capacity"]],
              },
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: { $setEquals: ["$capacities", people] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $unwind: "$rooms",
      },
      {
        $lookup: {
          from: "bookingcalendars",
          localField: "rooms._id",
          foreignField: "room",
          as: "rooms.bookingcalendar",
        },
      },
      {
        $match: {
          "rooms.bookingcalendar.beginDate": {
            $ne: new Date(checkinDate),
          },
          "rooms.bookingcalendar.endDate": {
            $ne: new Date(checkoutDate),
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name"},
          address: { $first: "$address"},
          thumbnail: { $first: "thumbnail"},
          type: { $first: "$type" },
          rating: { $first: "$rating" },
          capacities: { $first: "$capacities" },
          rooms: {
            $push: "$rooms",
          },
        },
      },
    ]);

    if (result.length == 0) {
      return {
        success: true,
        message: "Rooms not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Find rooms available successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function addNewRoom(data) {
  try {
    const result = await Room.create(data);

    if (!result) {
      return {
        success: false,
        message: "Add new room failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Add new room successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function updateRoom(roomId, data) {
  try {
    const result = await Room.findByIdAndUpdate(roomId, data);

    if (!result) {
      return {
        success: false,
        message: "update room failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Update room successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function deleteRoom(roomId) {
  try {
    const result = await Room.findByIdAndDelete(roomId);

    if (!result) {
      return {
        success: false,
        message: "Delete room failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Delete room successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

// get room by apartmentId
async function getRomByApartmentId(apartmentId) {
  try {
    const rooms = await Room.find({apartmentId})

    if(rooms.length === 0) {
      return {
        success: true,
        message: "Empty rooms!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Get rooms success",
      data: rooms,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

// get room by Id
async function getRoomById(roomId) {
  try {
    const room = await Room.findById(roomId)

    if(!room) {
      return {
        success: true,
        message: "Room not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Get room success",
      data: room,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}
 
export const RoomServices = {
  getRoomBySortPrice,
  getRoomBySortPriceReverse,
  getRomByApartmentId,
  getRoomById,
  searchRoom,
  searchRoomV2,
  addNewRoom,
  updateRoom,
  deleteRoom,
};
