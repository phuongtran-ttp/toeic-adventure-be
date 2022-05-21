const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const fullTestHistorySchema = new Schema(
  {
    correctSentences: {
      listening: {
        type: Number,
        required: true,
      },
      reading: {
        type: Number,
        required: true,
      },
    },
    score: {
      listening: {
        type: Number,
        require: true,
      },
      reading: {
        type: Number,
        require: true,
      },
    },
    totalScore:  {
      type: Number,
      require: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    test: { type: Schema.Types.ObjectId, ref: 'FullTest' },
  },
  { timestamps: true }
);

fullTestHistorySchema.plugin(toJSON);
fullTestHistorySchema.plugin(findPage);

module.exports = mongoose.model('FullTestHistory', fullTestHistorySchema);
