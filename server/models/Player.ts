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
    realmPath: { type: String, enum: ['sword', 'alchemy', 'body', 'elementalist', 'none'], default: 'none' },
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
        count: Number,
        uid: String,
        affixes: [mongoose.Schema.Types.Mixed]
    }],
    cultivation: {
        activeTechnique: String,
        baseRate: Number,
        element: String,
    },
    logs: [{ type: String }],
        techniques: {
            unlocked: [String],
            equippedPassives: [String]
        },
        equipment: [{
            slot: { type: String, enum: ['weapon', 'armor', 'accessory', 'talisman'] },
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            affixes: [mongoose.Schema.Types.Mixed]
        }],
        tribulation: {
            active: { type: Boolean, default: false },
            difficulty: { type: Number, default: 1 },
            endsAt: { type: Date, default: null },
            buff: { type: Number, default: 0 } // from talismans or consumables
        },
        sect: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sect', default: null },
            contribution: { type: Number, default: 0 }
        },
        missions: [{
            key: String,
            assignedAt: Date,
            duration: Number,
            reward: mongoose.Schema.Types.Mixed,
            claimed: { type: Boolean, default: false }
        }],
        updatedAt: { type: Date, default: Date.now }
})

export const PlayerModel = mongoose.models.Player || mongoose.model('Player', PlayerSchema)
