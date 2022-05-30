import { RevenueServices } from "../services/revenue.services.js";

async function getMonthlyRevenue(req, res) {
    try {
        
        const {month, year } = req.query
        const result = await RevenueServices.getMonthlyRevenue(parseInt(month), parseInt(year))

        if(result.success) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(result)
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        })
    }
}

async function getYearlyRevenue(req, res) {
    try {
        
        const { year } = req.query
        const result = await RevenueServices.getYearlyRevenue(parseInt(year))
        
        if(result.success) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(result)
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        })
    }
}

async function getAllYearlyRevenue(req, res) {
    try {
        
        const result = await RevenueServices.getAllYearlyRevenue()
        
        if(result.success) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(result)
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        })
    }
}

export const RevenueController = {
    getMonthlyRevenue,
    getYearlyRevenue,
    getAllYearlyRevenue
}