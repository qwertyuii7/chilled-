

const { Router } = require("express");

const joinrouter = Router();

const { JoinQueue_model } = require("../models/queuedb")
const { shop_model } = require("../models/queuedb")

joinrouter.post("/join", async function (req, res) {
    try {
        const { customerName, shopId } = req.body;

        if (!customerName || customerName.trim() === "") {
            return res.status(400).json({ message: "customerName is required" });
        }

        if (!shopId) {
            return res.status(400).json({ message: "shopId is required" });
        }

        
        const shopExists = await shop_model.findById(shopId);
        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        
        const existing = await JoinQueue_model.findOne({ 
            customerName,
            shopId,
            status: "waiting"  
        });

        if (existing) {
            return res.status(400).json({ message: "Already in queue" });
        }

        const saved = await JoinQueue_model.create({
            shopId,
            customerName,
            status: "waiting",
            joinedAt: new Date()
        });

        res.status(201).json({
            message: "Joined queue",
            data: saved
        });

    } catch (e) {
        res.status(500).json({
            message: "Error joining queue",
            error: e.message
        });
    }
});



module.exports = {
    joinrouter  
}