import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imagePath: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

export default Product;