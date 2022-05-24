const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const vocabularyThemeSchema = new Schema(
  {
    enName: {
      type: String,
      required: true,
    },
    vnName: {
      type: String,
      require: true,
    },
    wordCount: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  { timestamps: true }
);

vocabularyThemeSchema.plugin(toJSON);
vocabularyThemeSchema.plugin(findPage);

module.exports = mongoose.model('VocabularyTheme', vocabularyThemeSchema);
