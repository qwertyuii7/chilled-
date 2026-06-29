const mongoose = require("mongoose");
const schema = mongoose.Schema;

// ================= QUEUE =================

const joinSchema = new schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["waiting", "done"],
        default: "waiting"
    },

    joinedAt: {
        type: Date,
        default: Date.now
    },

    servedAt: {
        type: Date
    }

}, { timestamps: true });


// ================= BOOKING =================

const bookingSchema = new schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    slot: {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    },

    date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["waiting", "confirmed", "cancelled", "done"],
        default: "waiting"
    }

}, { timestamps: true });


const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serviceType: { type: String, required: true },
    shopName: { type: String, required: true },

    address: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });


// ================= MODELS =================

const shop_model = mongoose.model("Shop", shopSchema);
const JoinQueue_model = mongoose.model("JoinQueue", joinSchema);
const Booking_model = mongoose.model("Booking", bookingSchema);

module.exports = {
    JoinQueue_model,
    Booking_model,
    shop_model
};