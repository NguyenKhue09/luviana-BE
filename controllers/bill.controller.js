import { BillService } from "../services/bill.services.js";

async function createBill(req, res) {
    const data = req.body
    try {
        var result = await BillService.createBill(data);

        if (result.success) {
            if (result.data) return res.json(result)
            else return res.status(404).json(result)
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

