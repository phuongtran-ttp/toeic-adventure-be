const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    thumbnail: { type: Schema.Types.ObjectId, ref: 'File' },
  },
  { timestamps: true }
);

collectionSchema.plugin(toJSON);
collectionSchema.plugin(findPage);

module.exports = mongoose.model('TestCollection', collectionSchema);
