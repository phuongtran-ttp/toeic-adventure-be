const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const lessonSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    topic: { type: Schema.Types.ObjectId, ref: 'LessonTopic' },
  },
  { timestamps: true }
);

lessonSchema.plugin(toJSON);
lessonSchema.plugin(findPage);

module.exports = mongoose.model('Lesson', lessonSchema);
