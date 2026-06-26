const { Router } = require("express");

const shop_router = Router();

const { shop_model } = require("../models/queuedb")

const mongoose = require("mongoose");

shop_router.post("/create", async function (req, res) {
    try {
        let { name, serviceType, shopName, address, phone } = req.body;

        name = name?.trim();
        serviceType = serviceType?.trim();
        shopName = shopName?.trim();
        address = address?.trim();
        phone = phone?.trim();



        if (
            !name ||
            !serviceType ||
            !shopName ||
            !address ||
            !phone
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Invalid phone number"
            });
        }

        const existing_shop = await shop_model.findOne({
            phone
        });

        if (existing_shop) {
            return res.status(400).json({
                message: "shop already exist"
            })
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
        const shops = await shop_model.find().sort({ createdAt: -1 });

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

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({
                message: "Invalid shop id"
            });
        }

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


shop_router.put('/:shopId', async function (req, res) {
    try {
        const { shopId } = req.params;
        const { name, serviceType, shopName, address, phone } = req.body;


        if (
            !name?.trim() ||
            !serviceType?.trim() ||
            !shopName?.trim() ||
            !address?.trim() ||
            !phone?.trim()
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({
                message: "Invalid phone number"
            });
        }



        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({
                message: "Invalid shop id"
            });
        }

        const find_shop = await shop_model.findById(shopId);

        const existingShop = await shop_model.findOne({
            phone,
            _id: { $ne: shopId }
        });

        if (existingShop) {
            return res.status(400).json({
                message: "Phone number already in use"
            });
        }

        if (!find_shop) {
            return res.status(404).json({
                message: "shop doesn't exist"
            })
        }




        find_shop.name = name.trim();
        find_shop.serviceType = serviceType.trim();
        find_shop.shopName = shopName.trim();
        find_shop.address = address.trim();
        find_shop.phone = phone.trim();


        await find_shop.save();

        return res.status(200).json({
            message: "your data is successfully updated",
            data: find_shop
        });

    } catch (e) {
        return res.status(500).json({
            message: "internal server error",
            error: e.message
        });
    }

});


shop_router.delete('/:shopId', async function (req, res) {
    try {
        const { shopId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({
                message: "invalid shop id "
            })
        }

        const find_shop = await shop_model.findById(shopId);

        if (!find_shop) {
            return res.status(404).json({
                message: "shop not found"
            })
        }

        await find_shop.deleteOne();

        return res.status(200).json({
            message: "shop deleted successfully"
        })
    } catch (e) {
        return res.status(500).json({
            message: "internal server error",
            error: e.message
        })
    }
});


module.exports = {
    shop_router
}