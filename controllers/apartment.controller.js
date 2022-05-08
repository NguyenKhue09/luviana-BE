import { ApartmentService } from "../services/apartment.services.js"

async function getApartment(req, res) {
    let { name, district, province, country, page, apartmentPerPage } = req.query;
    if (district != null)
        district = district.split(",")
    if (country != null)
        country = country.split(",")
    if (province != null)
        province = province.split(",")

    console.log(district)
    
    if (page != null || apartmentPerPage != null) {
        if (page == null) page = 0;
        if (apartmentPerPage == null) apartmentPerPage = 5;
        const response = await ApartmentService.filterApartment(name, district, province, country, apartmentPerPage, page);
        if (response.success) {
            return res.status(200).json(response)
        }
        else return res.status(500).json(response)
    }
    const result = await ApartmentService.getAllApartment()
    if (result.success) {
        return res.status(200).json(result)
    }
        
    else return res.status(500).json(result)
}

async function addNewApartment(req, res) {
    try {
        console.log("Req body: " + req.body)
        const address = {
            apartmentNumber: req.body.apartmentNumber,
            street: req.body.street,
            district: req.body.district,
            province: req.body.province,
            country: req.body.country
        }
        const name = req.body.name
        const rating = req.body.rating
        const type  = req.body.type
        const description = req.body.description
        const thumbnail = req.body.thumbnail

        const result = await ApartmentService.addNewApartment(address, name, type, rating, description, thumbnail)

        if(result.success) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(result)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error,
            data: null
        })
    }
}


async function getOneApartment(req, res) {
    const { id } = req.params;

    if (!id) 
        return res.status(400).json({
            success: false,
            message: "Please provide room id",
            data: null
        });
    const response = await ApartmentService.getOneApartment(id)

    if (response.success) {
        return res.json(response)
    } else {
        return res.status(404).json(response)
    }
}

async function updateApartment(req, res) {
    const { apartmentId, apartmentData } = req.body;
    
    if (!apartmentId) {
        return res.status(400).json({
            success: false,
            message: "Please provide apartment id",
            data: null
        })
    }
    if (!apartmentData) {
        return res.status(400).json({
            success: false,
            message: "Please provide data to update",
            data: null
        })
    }

    const response = await ApartmentService.updateApartment(apartmentId, apartmentData);
    if (response.success) {
        return res.json(response)
    } else {
        return res.status(400).json(response)
    }
}

export const ApartmentController = {
    getApartment,
    getOneApartment,
    addNewApartment,
    updateApartment
}