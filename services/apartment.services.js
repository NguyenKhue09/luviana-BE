import Apartment from "../models/apartment.model.js";


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

async function getApartmentByPage(aparmentPerPage, currentPage, type) {
    try {
        const filterType = {}

        if(!type) {
            filterType = {type : { $elemMatch: { $eq: type} }}
        }

        const result = await Apartment.find(filterType).skip(currentPage * aparmentPerPage).limit(aparmentPerPage)
        const maxDocument = await Apartment.estimatedDocumentCount(filterType);
        const maxPage = parseInt(maxDocument/parseInt(aparmentPerPage), 10);

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

async function addNewApartment(address, name, type, rating, description, thumbnail, pictures) {
    try {

      
        const newApartment = await Apartment.create({address, name, type, rating, description, thumbnail, pictures})

        if(!newApartment) {
            throw "Create new aparment failed failed!";
        }

        return {
            success: true,
            message: "Add new apartment successfully",
            data: newApartment
        }
    } catch (error) {
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
        const apartment = await Apartment.findByIdAndUpdate(apartmentId, apartmentData)
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
    filterApartment
} 