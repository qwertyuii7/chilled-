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

const bookingSchema = z.object({
    shopId: z.string().trim().min(1),

    customerName: z.string().trim().min(1),

    slot: z.object({
        from: z.string().trim().min(1),
        to: z.string().trim().min(1),
    }),

    date: z.coerce
        .date()
        .refine(
            date => date >= new Date(new Date().setHours(0, 0, 0, 0)),
            {
                message: "Booking date cannot be in the past"
            }
        ),

    status: z.enum([
        "waiting",
        "confirmed",
        "cancelled",
        "done"
    ]).default("waiting")
});

module.exports = {
    shopSchema,
    queuejoinSchema,
    bookingSchema
};

