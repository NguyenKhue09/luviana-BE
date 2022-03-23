import { ApartmentService } from "../services/apartment.services.js"

async function getApartment(req, res) {
    let { page, apartmentPerPage } = req.query;
    if (page != null || apartmentPerPage != null) {
        if (page == null) page = 0;
        if (apartmentPerPage == null) apartmentPerPage = 5;
        const response = await ApartmentService.getApartmentByPage(apartmentPerPage, page);
        if (response.success) {
            return res.json(response)
        }
        else return res.status(500).json(response)
    }
    const result = await ApartmentService.getAllApartment()
    if (result.success)
        return res.json(result)
    else return res.status(500).json(result)
}

async function addNewApartment(req, res) {
    try {
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

        const result = await ApartmentService.addNewApartment(address, name, type, rating, description)

        if(result.success) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(result)
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null
        })
    }
}

async function addNewApartmentv2(req, res) {
    try {
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

        const result = await ApartmentService.addNewApartmentV2(address, name, type, rating, description)

        if(result.success) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(result)
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null
        })
    }
}
export const ApartmentController = {
    getApartment,
    addNewApartment,
    addNewApartmentv2
}