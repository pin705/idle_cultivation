import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['material', 'consumable', 'equipment'], required: true },
    description: String,
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], default: 'common' },
    tier: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], default: 'common' },
    slot: { type: String, enum: ['weapon', 'armor', 'accessory', 'talisman', null], default: null },
    elementTag: { type: String, enum: ['metal', 'wood', 'water', 'fire', 'earth', 'none'], default: 'none' },
    isStackable: { type: Boolean, default: false },
    baseEffects: mongoose.Schema.Types.Mixed, // e.g. { rateAdd: 0.5, rateMult: 1.05 }
    effects: mongoose.Schema.Types.Mixed, // backward compat
    setKey: { type: String, default: '' }
})

export const ItemModel = mongoose.models.Item || mongoose.model('Item', ItemSchema)
