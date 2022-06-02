import Room from "../models/room.model.js";
import Apartment from "../models/apartment.model.js";
import mongoose from "mongoose";

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
  const x = new Date(checkinDate).toUTCString();
  const y = new Date(checkoutDate).toUTCString();

  console.log(x + " " + y);
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
      // {
      //   $match: {
      //     $or: [
      //       {
      //         $and: [
      //           {
      //             "rooms.bookingcalendar.beginDate": {
      //               $lt: new Date(checkinDate),
      //             }
      //           },
      //           {
      //             "rooms.bookingcalendar.endDate": {
      //               $lt: new Date(checkinDate),
      //             },
      //           }
      //         ]
      //       },
      //       {
      //         $and: [
      //           {
      //             "rooms.bookingcalendar.beginDate": {
      //               $gt: new Date(checkoutDate),
      //             }
      //           },
      //           {
      //             "rooms.bookingcalendar.endDate": {
      //               $gt: new Date(checkoutDate),
      //             },
      //           }
      //         ]
      //       }
      //     ]
      //   },
      // },
      // {
      //   $group: {
      //     _id: "$_id",
      //     name: { $first: "$name"},
      //     address: { $first: "$address"},
      //     thumbnail: { $first: "thumbnail"},
      //     type: { $first: "$type" },
      //     rating: { $first: "$rating" },
      //     capacities: { $first: "$capacities" },
      //     rooms: {
      //       $push: "$rooms",
      //     },
      //   },
      // },
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

async function searchRoomV3(checkinDate, checkoutDate, people, city) {
  try {
    const result = await Apartment.aggregate([
      {
        $match: {
          "address.province": city,
          isPending: false,
          isDisable: false,
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
          pictures: 0,
          __v: 0,
        },
      },
      {
        $project: {
          name: 1,
          owner: 1,
          address: 1,
          thumbnail: 1,
          type: 1,
          rating: 1,
          description: 1,
          rooms: {
            $filter: {
              input: "$rooms",
              as: "room",
              cond: {
                $lte: ["$$room.isDisable", false],
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          owner: 1,
          address: 1,
          thumbnail: 1,
          type: 1,
          rating: 1,
          description: 1,
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
          totalPeopleOfRoom: {
            $reduce: {
              input: "$rooms",
              initialValue: 0,
              in: {
                $add: ["$$value", "$$this.capacity"],
              },
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
          let: {
            roomId: "$rooms._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$room", "$$roomId"] },
                    {
                      $or: [
                        {
                          $and: [
                            { $gte: ["$beginDate", new Date(checkinDate)] },
                            { $lte: ["$endDate", new Date(checkoutDate)] },
                          ],
                        },
                        {
                          $and: [
                            { $lte: ["$beginDate", new Date(checkinDate)] },
                            { $gte: ["$endDate", new Date(checkinDate)] },
                          ],
                        },
                        {
                          $and: [
                            { $lte: ["$beginDate", new Date(checkoutDate)] },
                            { $gte: ["$endDate", new Date(checkoutDate)] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "rooms.bookingcalendar",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $size: "$rooms.bookingcalendar" }, 0] },
              { $lte: [people, "$totalPeopleOfRoom"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          owner: { $first: "$owner" },
          name: { $first: "$name" },
          address: { $first: "$address" },
          thumbnail: { $first: "$thumbnail" },
          type: { $first: "$type" },
          rating: { $first: "$rating" },
          description: { $first: "$description" },
          capacities: { $first: "$capacities" },
          totalPeopleOfRoom: { $first: "$totalPeopleOfRoom" },
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

async function searchRoomAvailableOfAparment(
  checkinDate,
  checkoutDate,
  people,
  apartmentId
) {
  try {
    const result = await Apartment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(apartmentId),
          isPending: false,
          isDisable: false,
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
          description: 1,
          owner: 1,
          rooms: {
            $filter: {
              input: "$rooms",
              as: "room",
              cond: {
                $lte: ["$$room.isDisable", false],
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
          description: 1,
          owner: 1,
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
          totalPeopleOfRoom: {
            $reduce: {
              input: "$rooms",
              initialValue: 0,
              in: {
                $add: ["$$value", "$$this.capacity"],
              },
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
          let: {
            roomId: "$rooms._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$room", "$$roomId"] },
                    {
                      $or: [
                        {
                          $and: [
                            { $gte: ["$beginDate", new Date(checkinDate)] },
                            { $lte: ["$endDate", new Date(checkoutDate)] },
                          ],
                        },
                        {
                          $and: [
                            { $lte: ["$beginDate", new Date(checkinDate)] },
                            { $gte: ["$endDate", new Date(checkinDate)] },
                          ],
                        },
                        {
                          $and: [
                            { $lte: ["$beginDate", new Date(checkoutDate)] },
                            { $gte: ["$endDate", new Date(checkoutDate)] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "rooms.bookingcalendar",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $size: "$rooms.bookingcalendar" }, 0] },
              { $lte: [people, "$totalPeopleOfRoom"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          owner: { $first: "$owner" },
          name: { $first: "$name" },
          address: { $first: "$address" },
          thumbnail: { $first: "$thumbnail" },
          type: { $first: "$type" },
          rating: { $first: "$rating" },
          description: { $first: "$description" },
          capacities: { $first: "$capacities" },
          totalPeopleOfRoom: { $first: "$totalPeopleOfRoom" },
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
      data: result[0],
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
    delete data.isDisable;

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

// async function deleteRoom(roomId) {
//   try {
//     const result = await Room.findByIdAndDelete(roomId);

//     if (!result) {
//       return {
//         success: false,
//         message: "Delete room failed!",
//         data: null,
//       };
//     }

//     return {
//       success: true,
//       message: "Delete room successfully",
//       data: result,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//       data: null,
//     };
//   }
// }

// get room by apartmentId
async function getRomByApartmentId(apartmentId) {
  try {
    const rooms = await Room.find({ apartmentId });

    if (rooms.length === 0) {
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
    const room = await Room.findById(roomId);

    if (!room) {
      return {
        success: true,
        message: "Room not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Get room successfully!",
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

async function changeCapacity() {
  try {
    const allRooms = await Room.find({}).select("capacity");
    return {
      success: true,
      message: "Get all rooms success",
      data: allRooms,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function disableRoom(roomId) {
  try {
    const result = await Room.findByIdAndUpdate(roomId, {isDisable: true});

    if (!result) {
      return {
        success: false,
        message: "Disable room failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Disable room successfully",
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

async function activateRoom(roomId) {
  try {
    const result = await Room.findByIdAndUpdate(roomId, {isDisable: false});

    if (!result) {
      return {
        success: false,
        message: "Activate room failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Activate room successfully",
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

export const RoomServices = {
  getRoomBySortPrice,
  getRoomBySortPriceReverse,
  getRomByApartmentId,
  getRoomById,
  searchRoom,
  searchRoomV2,
  searchRoomV3,
  searchRoomAvailableOfAparment,
  addNewRoom,
  updateRoom,
  disableRoom,
  activateRoom,
  changeCapacity,
};
