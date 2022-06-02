import Apartment from "../models/apartment.model.js";
import mongoose from "mongoose";

async function getAllApartment() {
  try {
    const apartments = await Apartment.find({}).select("name address isPending thumbnail type description");

    if (apartments.length <= 0) {
      return {
        success: false,
        message: "Apartments not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Get apartment list successfully!",
      data: apartments,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function getApartmentByPage(aparmentPerPage, currentPage, type) {
  try {
    let filterType = {};

    if (type) {
      filterType = { type };
    }

    const result = await Apartment.find(filterType)
      .skip(currentPage * aparmentPerPage)
      .limit(aparmentPerPage);
    const maxDocument = await Apartment.estimatedDocumentCount(filterType);
    const maxPage = parseInt(maxDocument / parseInt(aparmentPerPage), 10);

    if (result.length == 0) {
      return {
        success: false,
        message: `Get apartment page ${currentPage} failed!`,
        data: null,
      };
    }

    return {
      success: true,
      message: `Get apartment page ${currentPage} successfully!`,
      data: {
        apartment: result,
        totalPage: maxPage,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function addNewApartment(
  name,
  owner,
  address,
  thumbnail,
  pictures,
  type,
  rating,
  description,
  isPending
) {
  try {
    const newApartment = await Apartment.create({
      name,
      owner,
      address,
      thumbnail,
      pictures,
      type,
      rating,
      description,
      isPending
    });

    if (!newApartment) {
      throw "Create new aparment failed failed!";
    }

    return {
      success: true,
      message: "Add new apartment successfully",
      data: newApartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
}

async function getOneApartment(apartmentId) {
  try {
    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return {
        success: false,
        message: "Apartment not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Find apartment successful!",
      data: apartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function getApartmentByName(apartmentName) {
  try {
    const apartment = await Apartment.find({
      name: { $regex: apartmentName, $options: "i" },
    });

    if (!apartment) {
      return {
        success: false,
        message: "Apartments not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Find apartments successful!",
      data: apartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function updateApartment(apartmentId, apartmentData) {
  try {
    delete apartmentData.isPending
    delete apartmentData.isDisable

    //console.log(apartmentData)

    let updateData = apartmentData

    let updateObject = {}

    if(updateData.pictures != null) {
      updateObject = {...updateObject, $set: {"pictures": updateData.pictures}}
      delete updateData.pictures
    }

    updateObject = {...updateData, ...updateObject}

    console.log(updateObject)
    
    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      updateObject
    );
    
    //console.log(apartment)

    if (!apartment) {
      return {
        success: false,
        message: "Update apartment failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Update apartment successful!",
      data: apartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function filterApartment(
  name,
  district,
  province,
  country,
  aparmentPerPage,
  currentPage
) {
  var matchAddress = { $match: {} };

  if (name != null) {
    matchAddress.$match = {
      ...matchAddress.$match,
      name: { $regex: name, $options: "i" },
    };
  }

  if (district != null) {
    matchAddress.$match = {
      ...matchAddress.$match,
      "address.district": { $in: district },
    };
  }

  if (province != null) {
    matchAddress.$match = {
      ...matchAddress.$match,
      "address.province": { $in: province },
    };
  }

  if (country != null) {
    matchAddress.$match = {
      ...matchAddress.$match,
      "address.country": { $in: country },
    };
  }

  try {
    const maxDocument = await Apartment.estimatedDocumentCount();
    const maxPage = parseInt(maxDocument / aparmentPerPage, 10);
    const result = await Apartment.aggregate([
      matchAddress,
      { $skip: parseInt(aparmentPerPage) * parseInt(currentPage) },
      { $limit: parseInt(aparmentPerPage) },
    ]);

    if (result.length == 0) {
      return {
        success: true,
        message: "Filter apartment not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Filter apartment successfully",
      data: {
        apartment: result,
        totalPage: maxPage,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function getAllPendingApartment() {
    try {
        const apartments = await Apartment.find({isPending: true});
    
        if (apartments.length <= 0) {
          return {
            success: false,
            message: "Apartments not found!",
            data: null,
          };
        }
    
        return {
          success: true,
          message: "Get pending apartment list successfully!",
          data: apartments,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
}

async function confirmPendingApartment(apartmentId) {
    try {
        const apartment = await Apartment.findByIdAndUpdate(apartmentId, {isPending: false})
        //console.log(apartment)
        if (!apartment) {
          return {
            success: false,
            message: "Apartments not found!",
            data: null,
          };
        }
    
        return {
          success: true,
          message: "Update pending apartment successfully!",
          data: apartment,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
}

async function removePendingApartment(apartmentId) {
    try {
        const apartment = await Apartment.findByIdAndDelete(apartmentId)
    
        if (!apartment) {
          return {
            success: false,
            message: "Apartments not found!",
            data: null,
          };
        }
    
        return {
          success: true,
          message: "Delete pending apartment successfully!",
          data: apartment,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
}

async function deleteApartment(apartmentId) {
  try {
    const apartment = await Apartment.findByIdAndUpdate(apartmentId, {isDisable: true})

    if (!apartment) {
      return {
        success: false,
        message: "Apartments not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Delete apartment successfully!",
      data: apartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function getApartmentCities() {
  try {
    const apartment = await Apartment.distinct("address.province")
    if (apartment.length == 0) {
      return {
        success: false,
        message: "Apartment cities not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Get apartment cites successfully!",
      data: apartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function updateAllOldApartmentOwner() {
  try {
    const apartment = await Apartment.updateMany({}, {owner: "628c9b7796dc4b39c79b4fc8"})

    console.log(apartment)
    if (apartment == 0) {
      return {
        success: false,
        message: "Update owner failed!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Update owner success",
      data: apartment,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

async function getApartmentOfUser(userId) {
  try {
    
    const aparments = await Apartment.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "apartmentId",
          as: "rooms",
        },
      },
    ])

    if(aparments.length === 0) {
      return {
        success: false,
        message: "Apartment not found!",
        data: null
      }
    }

    return {
      success: true,
      message: "Get apartment of user success",
      data: aparments
    }

  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    }
  }
}

// async function activateDisableApartment(apartmentId, ) 

export const ApartmentService = {
  getAllApartment,
  getApartmentByName,
  getApartmentByPage,
  getAllPendingApartment,
  addNewApartment,
  getOneApartment,
  updateApartment,
  confirmPendingApartment,
  removePendingApartment,
  deleteApartment,
  filterApartment,
  getApartmentCities,
  getApartmentOfUser
};
