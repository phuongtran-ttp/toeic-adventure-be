const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const topicSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

topicSchema.plugin(toJSON);
topicSchema.plugin(findPage);

module.exports = mongoose.model('LessonTopic', topicSchema);
