const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const vocabularySchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
    meaning: {
      type: String,
      require: true,
    },
    phonetic: {
      type: String,
      require: true,
    },
    audio: { type: Schema.Types.ObjectId, ref: 'File' },
    theme: { type: Schema.Types.ObjectId, ref: 'VocabularyTheme' },
  },
  { timestamps: true }
);

vocabularySchema.plugin(toJSON);
vocabularySchema.plugin(findPage);

module.exports = mongoose.model('Vocabulary', vocabularySchema);
