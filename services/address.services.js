import Address from "../models/address.model";


async function addNewAddress(address) {
    try {
        const result = await Address.create(address)

        if(!result) {
            return {
                success: false,
                message: "Create new address failed!",
                data: null
            }
        }
        
        return {
            success: true,
            message: "Create new address successfully",
            data: result
        }
    } catch (error) {
        return {
            success: false,
            message: error,
            data: null
        }
    }
}

export const AddressServices = {
    addNewAddress
}