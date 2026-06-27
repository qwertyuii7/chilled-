const { Router } = require("express");

const shop_router = Router();

const { shop_model } = require("../models/queuedb")

const {shopSchema  } = require ("../zod_schema/zod_schema");

const mongoose = require("mongoose");

shop_router.post("/create", async function (req, res) {
    try {

        const validation =shopSchema.safeParse(req.body);

        if(!validation.success){

            return res.status(400).json({
                message: "validation error",
                errors: validation.error.issues
            })
        }

        let { name, serviceType, shopName, address, phone } = validation.data;



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




shop_router.put("/:shopId", async function (req, res) {
    try {

        const { shopId } = req.params;

      
        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({
                message: "Invalid shop id"
            });
        }

        const validation = shopSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }))
            });
        }

        const {
            name,
            serviceType,
            shopName,
            address,
            phone
        } = validation.data;

      
        const findShop = await shop_model.findById(shopId);

        if (!findShop) {
            return res.status(404).json({
                message: "Shop doesn't exist"
            });
        }

      
        const existingShop = await shop_model.findOne({
            phone,
            _id: { $ne: shopId }
        });

        if (existingShop) {
            return res.status(400).json({
                message: "Phone number already in use"
            });
        }

        Object.assign(findShop, {
            name,
            serviceType,
            shopName,
            address,
            phone
        });

        
        await findShop.save();

   
        return res.status(200).json({
            message: "Shop updated successfully",
            data: findShop
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
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