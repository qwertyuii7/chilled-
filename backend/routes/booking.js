const { Router } = require("express");

const bookingrouter = Router();

const { bookingSchema } = require("../zod_schema/zod_schema");
const mongoose = require("mongoose");

const { JoinQueue_model } = require("../models/queuedb");
const { Booking_model } = require("../models/queuedb");
const { shop_model } = require("../models/queuedb");

const STATUS = {
    WAITING: "waiting",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    DONE: "done"
};


bookingrouter.post("/create_booking", async function (req, res) {
    try {
        const validation = bookingSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "validation error",
                errors: validation.error.issues
            });
        }

        const { shopId, customerName, slot, date, status } = validation.data;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }

        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const existing = await Booking_model.findOne({
            shopId,
            date,
            "slot.from": slot.from,
            "slot.to": slot.to,
            status: { $in: [STATUS.WAITING, STATUS.CONFIRMED] }
        });

        if (existing) {
            return res.status(400).json({ message: "This slot is already booked" });
        }

        const booking_slot = await Booking_model.create({
            shopId,
            customerName,
            slot,
            date,
            status: status ?? STATUS.WAITING
        });

        return res.status(201).json({ message: "Booking done!", data: booking_slot });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating booking!",
            error: error.message
        });
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
            });
        }

        const { shopId, customerName, slot, date, status } = validation.data;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }

        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const booking = await Booking_model.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const existing = await Booking_model.findOne({
            _id: { $ne: bookingId },
            shopId,
            date,
            "slot.from": slot.from,
            "slot.to": slot.to,
            status: { $in: [STATUS.WAITING, STATUS.CONFIRMED] }
        });

        if (existing) {
            return res.status(400).json({ message: "This slot is already booked" });
        }

        booking.shopId = shopId;
        booking.customerName = customerName;
        booking.slot = slot;
        booking.date = date;
        booking.status = status ?? STATUS.WAITING;

        await booking.save();

        return res.status(200).json({
            message: "Booking updated successfully",
            data: booking
        });

    } catch (e) {
        return res.status(500).json({
            message: "Error updating booking information",
            error: e.message
        });
    }
});


bookingrouter.delete("/booking/:bookingId", async function (req, res) {
    try {
        const { bookingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid bookingId" });
        }

        const deletedBooking = await Booking_model.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({
            message: "Booking deleted successfully",
            data: deletedBooking
        });
    } catch (e) {
        return res.status(500).json({
            message: "Error deleting booking",
            error: e.message
        });
    }
});


bookingrouter.get("/bookings", async function (req, res) {
    try {
        const { shopId, status, date } = req.query;

        if (!shopId) {
            return res.status(400).json({ message: "shopId is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }

        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const filter = { shopId };

        if (status) {
            filter.status = status;
        }

        if (date) {
            const selectedDate = new Date(date);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);

            filter.date = {
                $gte: selectedDate,
                $lt: nextDay
            };
        }

        const bookings = await Booking_model
            .find(filter)
            .sort({ date: 1, "slot.from": 1 });

        return res.status(200).json({
            total: bookings.length,
            data: bookings
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
});


bookingrouter.get("/dashboard", async function (req, res) {
    try {
        const { shopId } = req.query;

        if (!shopId) {
            return res.status(400).json({ message: "shopId is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }

        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            todayBookings,
            bookingWaiting,
            bookingConfirmed,
            bookingDone,
            bookingCancelled,
            queueWaiting,
            nextInQueue
        ] = await Promise.all([

            Booking_model.countDocuments({
                shopId,
                date: { $gte: today, $lt: tomorrow }
            }),

            Booking_model.countDocuments({ shopId, status: STATUS.WAITING }),
            Booking_model.countDocuments({ shopId, status: STATUS.CONFIRMED }),
            Booking_model.countDocuments({ shopId, status: STATUS.DONE }),
            Booking_model.countDocuments({ shopId, status: STATUS.CANCELLED }),

            JoinQueue_model.countDocuments({ shopId, status: STATUS.WAITING }),

            JoinQueue_model
                .findOne({ shopId, status: STATUS.WAITING })
                .sort({ joinedAt: 1 })
                .select("customerName")
        ]);

        return res.status(200).json({
            bookings: {
                today: todayBookings,
                waiting: bookingWaiting,
                confirmed: bookingConfirmed,
                done: bookingDone,
                cancelled: bookingCancelled
            },
            queue: {
                waiting: queueWaiting,
                nextCustomer: nextInQueue ? nextInQueue.customerName : null
            }
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
});


module.exports = {
    bookingrouter
};