import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, this should be hashed!
    createdAt: { type: Date, default: Date.now }
})

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)
