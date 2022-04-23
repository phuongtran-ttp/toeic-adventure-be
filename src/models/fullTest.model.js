const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const fullTestSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    jsonFile: { type: Schema.Types.ObjectId, ref: 'File' },
    testCollection: { type: Schema.Types.ObjectId, ref: 'TestCollection' },
  },
  { timestamps: true }
);

fullTestSchema.plugin(toJSON);
fullTestSchema.plugin(findPage);

module.exports = mongoose.model('FullTest', fullTestSchema);
