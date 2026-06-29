const { Router } = require("express");
const queue_router = Router();

const { JoinQueue_model } = require("../models/queuedb");
const { shop_model } = require("../models/queuedb");

const { queuejoinSchema } = require("../zod_schema/zod_schema");
const mongoose = require("mongoose");


queue_router.get("/", async function (req, res) {
    try {
        const { shopId } = req.query;

        if (!shopId) {
            return res.status(400).json({ message: "shopId required" });
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ message: "Invalid shopId" });
        }


        const shopExists = await shop_model.findById(shopId);
        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const queue = await JoinQueue_model.find({
            shopId,
            status: "waiting"
        }).sort({ joinedAt: 1 });

        const formatted = queue.map((user, index) => ({
            _id: user._id,
            customerName: user.customerName,
            position: index + 1,
            peopleAhead: index,
            joinedAt: user.joinedAt
        }));


        return res.status(200).json({
            total: formatted.length,
            queue: formatted
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

queue_router.post("/next", async function (req, res) {
    try {
        const { shopId } = req.body;


        if (!shopId) {
            return res.status(400).json({
                message: "shopId is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({
                message: "Invalid shopId"
            });
        }


        const shopExists = await shop_model.findById(shopId);

        if (!shopExists) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }


        const nextUser = await JoinQueue_model
            .findOne({
                shopId,
                status: "waiting"
            })
            .sort({ joinedAt: 1 });

        if (!nextUser) {
            return res.status(404).json({
                message: "No customer left in queue"
            });
        }


        nextUser.status = "done";
        nextUser.servedAt = new Date();
        await nextUser.save();


        const upcoming = await JoinQueue_model
            .findOne({
                shopId,
                status: "waiting"
            })
            .sort({ joinedAt: 1 });


        const remaining = await JoinQueue_model.countDocuments({
            shopId,
            status: "waiting"
        });

        return res.status(200).json({
            message: "Next customer served",
            servedCustomer: nextUser.customerName,
            nextCustomer: upcoming ? upcoming.customerName : null,
            remaining
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});


module.exports = {
    queue_router
};