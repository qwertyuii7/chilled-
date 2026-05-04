const { Router } = require("express");

const bookingrouter = Router();

const { JoinQueue_model } = require("../models/queuedb")
const { Booking_model } = require("../models/queuedb")
const { shop_model } = require("../models/queuedb")

bookingrouter.post("/create_booking", async function (req, res) {
    try {
        const { shopId, customerName, slot, date, status } = req.body;

        if (!shopId || !customerName || !slot || !date) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        
        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }

        
        const existing = await Booking_model.findOne({
            shopId,
            customerName,
            "slot.from": slot.from,
            "slot.to": slot.to,
            status: { $ne: "cancelled" }
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
            status: status || "pending"
        });

        res.status(201).json({ message: "Booking done!", data: booking_slot });

    } catch (error) {
        res.status(500).json({
            message: "Error creating booking!",
            error: error.message
        });
    }
});


module.exports = {
    bookingrouter
}