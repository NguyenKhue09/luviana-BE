import Apartment from "../models/apartment.model";


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

async function addNewApartment(newApartment) {
    try {
        const apartment = await Apartment.create(newApartment);

        if(!apartment) {
            return {
                success: false,
                message: "Add new apartment failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Add new apartment successfully!",
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