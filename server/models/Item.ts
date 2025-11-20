import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['material', 'consumable', 'equipment'], required: true },
    description: String,
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], default: 'common' },
    effects: mongoose.Schema.Types.Mixed, // e.g. { qi: 100, rate: 0.1 }
})

export const ItemModel = mongoose.models.Item || mongoose.model('Item', ItemSchema)
