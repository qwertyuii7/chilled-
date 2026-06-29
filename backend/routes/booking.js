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


module.exports = {
    bookingrouter
}