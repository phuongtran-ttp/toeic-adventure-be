const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    question: {
      text: {
        type: String,
        require: true,
      },
      image: [{ type: Schema.Types.ObjectId, ref: 'File' }],
      sound: [{ type: Schema.Types.ObjectId, ref: 'File' }],
      choices: {
        type: [String],
        require: true,
      },
    },
    answer: {
      text: {
        type: String,
        require: true,
      },
      explanation: String,
    },
    difficultyLevel: {
      type: String,
      enum : ['EASY','MEDIUM', 'DIFFICULT'],
      default: 'EASY',
      require: true,
    },
    part: {
      type: Number,
      enum : [1, 2, 3, 4, 5, 6, 7],
      default: 1,
      require: true,
    },
    childs: [{
      _id: false,
      question: {
        text: {
          type: String,
          require: true,
        },
        image: [{ type: Schema.Types.ObjectId, ref: 'File' }],
        sound: [{ type: Schema.Types.ObjectId, ref: 'File' }],
        choices: {
          type: [String],
          require: true,
        },
      },
      answer: {
        text: {
          type: String,
          require: true,
        },
        explanation: String,
      },
    }],
    originalSource: {
      type: String,
      private: true,
    },
    isSinglePara: Boolean,
  },
  { timestamps: true }
);

questionSchema.plugin(toJSON);
questionSchema.plugin(findPage);

module.exports = mongoose.model('Question', questionSchema);
