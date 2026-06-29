

const { Router } = require("express");

const joinrouter = Router();

const { JoinQueue_model } = require("../models/queuedb")
const { shop_model } = require("../models/queuedb")

const { queuejoinSchema } = require("../zod_schema/zod_schema");

joinrouter.post("/join", async function (req, res) {
    try {
        const validation = queuejoinSchema.safeParse(req.body);

        if(!validation.sucess){
            return res.status(400).json({
                message: "validation error",
                errors: validation.error.issues
            })
        }

        const {customerName, shopId, phone} = validation.data;

        if(!mongoose.Types.ObjectId.isValid(shopId)){
            return res.status(400).json({ message: "Invalid shopId" });
        }


        
        const shopExists = await shop_model.findById(shopId);
        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        
        const existing = await JoinQueue_model.findOne({ 
            customerName,
            shopId,
            phone,
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

        return res.status(201).json({
            message: "Joined queue",
            peopleAhead: await JoinQueue_model.countDocuments({
                shopId,
                status: "waiting",
                joinedAt: { $lt: saved.joinedAt }
            }),
            position: peopleAhead + 1,
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