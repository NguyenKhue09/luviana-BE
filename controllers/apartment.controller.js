import { ApartmentService } from "../services/apartment.services.js"

async function getAllApartment(req, res) {
    const result = await ApartmentService.getAllApartment()
    if (result.success)
        return res.json(result)
    else return res.status(500).json(result)
}

export const ApartmentController = {
    getAllApartment
}