const { Router } = require("express");

const shop_router = Router();

const { shop_model } = require("../models/queuedb")

shop_router.post("/create", async function (req, res) {
    try {
        const { name, serviceType, shopName, address, phone } = req.body;

        if (!name || !serviceType || !shopName || !address || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const saving_data = await shop_model.create({
            name,
            serviceType,
            shopName,
            address,
            phone
        });

        return res.status(201).json({
            message: "Shop created successfully",
            data: saving_data
        });

    } catch (e) {
        return res.status(500).json({
            message: "Error saving data",
            error: e.message  
        });
    }
});
shop_router.get("/shops", async function (req, res) {
    try {
        const shops = await shop_model.find().sort({ createdAt: 1 });

        res.status(200).json({
            message: "Registered shops fetched",
            data: shops
        });
    } catch (e) {
        res.status(500).json({
            message: "Error finding shops",
            error: e.message
        });
    }
});


shop_router.get("/:shopId", async function (req, res) {
    try {
        const { shopId } = req.params; 

        const findshop = await shop_model.findById(shopId); 

        if (!findshop) { 
            return res.status(404).json({
                message: "Shop doesn't exist"
            });
        }

        res.status(200).json({ 
            message: "Shop found!",
            data: findshop
        });

    } catch (e) {
        res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
});

module.exports = {
    shop_router
}