import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                itemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                imagePath: {
                    type: String,
                }
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        deliveryDetails: [
            {
                name: {
                    type: String,
                    required: true,
                },
                address: {
                    type: String,
                    required: true,
                },
                phoneNumber: {
                    type: Number,
                    required: true,
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;