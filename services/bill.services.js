import Bill from "../models/bill.model.js";
import BookingCalendar from "../models/bookingCalendar.model.js";
import mongoose from "mongoose"

async function createBill(data) {
  try {
    const session = await mongoose.startSession();

    const bookingCalendarDocuments = data.roomIds.map((id) => {
      return {
        customer: data.customer,
        owner: data.owner,
        beginDate: data.beginDate,
        endDate: data.endDate,
        room: id,
      };
    });

    await session.withTransaction(async () => {

        const bookingCalendarDocumentSaved = await BookingCalendar.create(bookingCalendarDocuments, {session})

        const billDocument = {
            userId: data.userId,
            apartmentId: data.apartmentId,
            totalBookingPeople: data.totalBookingPeople,
            userBookingInfos: data.userBookingInfos,
            note: data.note,
            bookingCalendar: bookingCalendarDocumentSaved.map((d) => d._id),
            totalCost: data.totalCost
        }

        await Bill.create([billDocument], {session});

    });

    session.endSession();
    return {
      success: true,
      message: "Create bill successful!",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

export const BillService = {
    createBill,
};
