import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const adminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'admin',
        }
    },
    {
        timestamps: true
    }
)

adminSchema.pre('save', async function (next) {
    const admin = this;

    if (!admin.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.password, salt);

        admin.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
})

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;