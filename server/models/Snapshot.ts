import mongoose from 'mongoose'

const SnapshotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  data: mongoose.Schema.Types.Mixed
})

export const SnapshotModel = mongoose.models.Snapshot || mongoose.model('Snapshot', SnapshotSchema)
