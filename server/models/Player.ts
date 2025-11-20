import mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    realm: {
        major: String,
        minor: Number,
        progress: Number,
        maxProgress: Number,
    },
    attributes: {
        qi: Number,
        body: Number,
        spirit: Number,
        talent: Number,
    },
    resources: {
        spiritStones: Number,
        herbs: Number,
    },
    inventory: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        count: Number
    }],
    cultivation: {
        activeTechnique: String,
        baseRate: Number,
        element: String,
    },
    logs: [{ type: String }],
    updatedAt: { type: Date, default: Date.now }
})

export const PlayerModel = mongoose.models.Player || mongoose.model('Player', PlayerSchema)
