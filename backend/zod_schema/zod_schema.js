const { z } = require("zod");

const shopSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Name is required" }),
    serviceType: z
        .string()
        .trim()
        .min(1, { message: "Service type is required" }),

    shopName: z
        .string()
        .trim()
        .min(1, { message: "Shop name is required" }),
    address: z
        .string()
        .trim()
        .min(1, { message: "address is required" }),
    phone: z
        .string()
        .trim()
        .regex(/^\d{10}$/, { message: "Invalid phone number" })
});


const queuejoinSchema = z.object({
    customerName: z
        .string()
        .trim()
        .min(1, { message: "Customer name is required" }),
    shopId: z
        .string()
        .trim()
        .min(1, { message: "Shop ID is required" }),       
    phone: z
        .string()
        .trim()
        .regex(/^\d{10}$/, { message: "Invalid phone number" })
});




module.exports = {
    shopSchema,
    queuejoinSchema
}

