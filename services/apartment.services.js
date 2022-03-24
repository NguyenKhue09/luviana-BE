import Apartment from "../models/apartment.model.js";
import Address from "../models/address.model.js"


async function getAllApartment() {
    try {
        const apartments = await Apartment.find({});

        if(apartments.length <= 0) {
            return {
                success: false,
                message: "Apartments not found!",
                data: null
            }
        }
        
        return {
            success: true,
            message: "Get apartment list successfully!",
            data: apartments
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

async function getApartmentByPage(aparmentPerPage, currentPage) {
    try {
        const result = await Apartment.find({}).skip(currentPage * aparmentPerPage).limit(aparmentPerPage)
        const maxDocument = await Apartment.estimatedDocumentCount();
        const maxPage = parseInt(maxDocument/aparmentPerPage, 10);

        if(result.length == 0) {
            return {
                success: false,
                message: `Get apartment page ${currentPage} failed!`,
                data: null
            }
        }

        return {
            success: true,
            message: `Get apartment page ${currentPage} successfully!`,
            data: {
                apartment: result,
                totalPage: maxPage
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

async function addNewApartment(address, name, type, rating, description) {
    const session = await Address.startSession();
    try {

        var resultTransaction = await session.withTransaction(async() => {

            const newAddress = await Address.create([address], {session})
            if(newAddress.length > 0) {
                const newApartment = await Apartment.create({address: newAddress[0]._id, name, type, rating, description})

                if(!newApartment) {
                    throw "Create new aparment failed failed!";
                }
            } else {
                throw "Create address of apartment failed!"
            }
        })

        session.endSession();
        return {
            success: true,
            message: "Add new apartment successfully",
            data: resultTransaction
        }
    } catch (error) {

        session.endSession();
        return {
            success: false,
            message: error,
            data: null
        }
    }
}

async function addNewApartmentV2(address, name,  type, rating, description) {
    const session = await Address.startSession();
    try {

        var resultTransaction = await session.withTransaction(async() => {

            const newAddress = await Address.create([address], {session})
            const newApartment = await Apartment.create([{address: newAddress[0]._id, name, type, rating, description}], {session})
        })

        session.endSession();
        return {
            success: true,
            message: "Add new apartment successfully",
            data: resultTransaction
        }
    } catch (error) {

        session.endSession();
        return {
            success: false,
            message: error,
            data: null
        }
    }
}

async function getOneApartment(apartmentId) {
    try {
        const apartment = await Apartment.findById(apartmentId)

        if(!apartment) {
            return {
                success: false,
                message: "Apartment not found!",
                data: null
            }
        }
        
        return {
            success: true,
            message: "Find apartment successful!",
            data: apartment
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        } 
    }
}

async function getApartmentByName (apartmentName) {
    try {
        const apartment = await Apartment.find({name: { $regex: apartmentName, $options: "i" }});

        if(!apartment) {
            return {
                success: false,
                message: "Apartments not found!",
                data: null
            }
        }
        
        return {
            success: true,
            message: "Find apartments successful!",
            data: apartment
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        } 
    }
}

async function updateApartment(apartmentId, apartmentData) {
    try {
        const apartment = await Apartment.findOneAndUpdate({apartmentId}, apartmentData)

        if(!apartment) {
            return {
                success: false,
                message: "Update apartment failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Update apartment successful!",
            data: apartment
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        } 
    }
}

async function filterApartment(name, district, province, country , aparmentPerPage, currentPage) {

    var matchAddress = { $match: {}}

    if(name != null) {
        matchAddress.$match = {
            ...matchAddress.$match,
            "name" : { $regex: name, $options: "i" }
        }
    }

    if(district != null) {
        matchAddress.$match = {
            ...matchAddress.$match,
            "address.district" : { $in : district}
        }
    }

    if(province != null) {
        matchAddress.$match = {
            ...matchAddress.$match,
            "address.province" : { $in : province}
        }
    }

    if(country != null) {
        matchAddress.$match = {
            ...matchAddress.$match,
            "address.country" : { $in : country}
        }
    }

    try {
        const maxDocument = await Apartment.estimatedDocumentCount();
        const maxPage = parseInt(maxDocument/aparmentPerPage, 10);
        const result = await Apartment.aggregate([
            matchAddress,
            { $skip : parseInt(aparmentPerPage) * parseInt(currentPage)},
            { $limit : parseInt(aparmentPerPage) }
        ])

        if(result.length == 0) {
            return {
                success: true,
                message: "Filter apartment not found!",
                data: null
            }
        }

        return {
            success: true,
            message: "Filter apartment successfully",
            data: {
                apartment: result,
                totalPage: maxPage
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

export const ApartmentService = {
    getAllApartment,
    getApartmentByName,
    getApartmentByPage,
    addNewApartment,
    getOneApartment,
    updateApartment,
    addNewApartmentV2,
    filterApartment
} 