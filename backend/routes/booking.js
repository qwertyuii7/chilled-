const { Router } = require("express");

const bookingrouter = Router();

const { bookingSchema } = require("../zod_schema/zod_schema");
const mongoose = require("mongoose");

const { JoinQueue_model } = require("../models/queuedb")
const { Booking_model } = require("../models/queuedb")
const { shop_model } = require("../models/queuedb")

bookingrouter.post("/create_booking", async function (req, res) {
    try {
        const validation = bookingSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "validation error",
                errors: validation.error.issues
            })
        }

        const { shopId, customerName, slot, date, status } = validation.data;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }



        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }


        const existing = await Booking_model.findOne({
            shopId,

            date,
            "slot.from": slot.from,
            "slot.to": slot.to,
            status: {
                $in: ["waiting", "confirmed"]
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "This slot is already booked"
            });
        }


        const booking_slot = await Booking_model.create({
            shopId,
            customerName,
            slot,
            date,
            status: status
        });

        return res.status(201).json({ message: "Booking done!", data: booking_slot });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating booking!",
            error: error.message
        });
    }
});


bookingrouter.get("/booking/:shopId", async function (req, res) {
    try {
        const { shopId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }

        const exist = await shop_model.findById(shopId);

        if (!exist) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const bookings = await Booking_model.find({ shopId }).sort({ date: 1, "slot.from": 1 });

        return res.status(200).json({
            message: "Bookings fetched successfully",
            data: bookings
        });



    } catch (e) {
        return res.status(500).json({
            messsage: " error fetching bookings",
            error: e.message
        })
    }
});


bookingrouter.get("/booking/:bookingId", async function (req, res) {
    try {
        const { bookingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid bookingId" });
        }

        const booking = await Booking_model.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({
            message: "Booking fetched successfully",
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching booking",
            error: error.message
        });
    }
});


bookingrouter.put("/booking/:bookingId", async function (req, res) {
    try {
        const { bookingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid bookingId" });
        }

        const validation = bookingSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "validation error",
                errors: validation.error.issues
            })
        }

        const { shopId, customerName, slot, date, status } = validation.data;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }

        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }

        const existing = await Booking_model.findOne({
            _id: { $ne: bookingId },
            shopId,
            date,
            "slot.from": slot.from,
            "slot.to": slot.to,
            status: {
                $in: ["waiting", "confirmed"]
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "This slot is already booked"
            });
        }

        const updatedBooking = await Booking_model.findByIdAndUpdate(
            bookingId,
            { shopId, customerName, slot, date, status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            data: updatedBooking
        });     



    }catch (e) {
    return res.status(500).json({
        message: "Error updating booking information",
        error: e.message
    });
}   
})


bookingrouter.delete("/booking/:bookingId",async function (req , res){
    try{
        const { bookingId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(bookingId)){
            return res.status(400).json({ message: "Invalid bookingId" });
        }

        const deletedBooking = await Booking_model.findByIdAndDelete(bookingId);

        if(!deletedBooking){
            return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({
            message: "Booking deleted successfully",
            data: deletedBooking
        }); 
    }catch (e) {
        return res.status(500).json({
            message: "Error deleting booking",
            error: e.message
        });
    }
});



module.exports = {
    bookingrouter
}