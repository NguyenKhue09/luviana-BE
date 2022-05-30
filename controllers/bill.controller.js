import { BillService } from "../services/bill.services.js";

async function createBill(req, res) {
    let data = req.body
    const userId = req.userId
    try {

        data = {...data, userId}

        var result = await BillService.createBill(data);

        if (result.success) {
            return res.json(result)
        } else {
            return res.status(400).json(result)
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
}

export const BillController = {
    createBill
}

