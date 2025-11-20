import mongoose from 'mongoose'

const SectSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  treasury: { spiritStones: { type: Number, default: 0 } },
  techniques: [String],
  createdAt: { type: Date, default: Date.now }
})

export const SectModel = mongoose.models.Sect || mongoose.model('Sect', SectSchema)
