import mongoose from 'mongoose'

const SecretRealmSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    tier: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
    duration: { type: Number, default: 120 }, // seconds to complete
    ticketCost: { type: Number, default: 1 },
    requirements: {
        minRealm: { type: String, default: 'Luyện Khí' },
        minQi: { type: Number, default: 0 }
    },
    lootTable: [{
        itemName: String,
        itemType: { type: String, enum: ['equipment', 'material', 'consumable'] },
        dropRate: { type: Number, min: 0, max: 1 },
        quantity: { min: Number, max: Number }
    }],
    rewards: {
        qi: { min: Number, max: Number },
        spiritStones: { min: Number, max: Number },
        herbs: { min: Number, max: Number }
    }
}, { timestamps: true })

export const SecretRealmModel = mongoose.models.SecretRealm || mongoose.model('SecretRealm', SecretRealmSchema)
