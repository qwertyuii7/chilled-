const { Router } = require("express");
const queue_router = Router();

const { JoinQueue_model } = require("../models/queuedb");
const { shop_model } = require("../models/queuedb");


queue_router.get("/", async function (req, res) {
    try {
        const { shopId } = req.query;

        if (!shopId) {
            return res.status(400).json({ message: "shopId required" });
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

        res.json({
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
            return res.status(400).json({ message: "shopId required" });
        }
        const shopExists = await shop_model.findById(shopId);
        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const nextUser = await JoinQueue_model
            .findOne({ shopId, status: "waiting" })
            .sort({ joinedAt: 1 });

        if (!nextUser) {
            return res.status(404).json({
                message: "No customer left"
            });
        }

        nextUser.status = "done";
        await nextUser.save();

        const remaining = await JoinQueue_model.countDocuments({
            shopId,
            status: "waiting"
        });

        res.json({
            message: "Next customer served",
            servedCustomer: nextUser.customerName,
            remaining
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = {
    queue_router
};