const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;
const fs = require('fs');
const path = require('path');
const fileServices = require('../services/file.services');

const BASE_UPLOAD_URI = 'uploads/skill-tests';

const generateFileName = (skillTest) => {
  let fileName = skillTest.name.toLowerCase().replace(/ /g, '_');
  return Date.now() + '_' + fileName + '.json';
};

const skillTestSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    jsonFile: { type: Schema.Types.ObjectId, ref: 'File' },
    part: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7],
      default: 1,
      require: true,
    },
    difficultyLevel: {
      type: String,
      enum : ['EASY','MEDIUM', 'DIFFICULT'],
      default: 'EASY',
      require: true,
    },
  },
  { timestamps: true }
);

skillTestSchema.plugin(toJSON);
skillTestSchema.plugin(findPage);

module.exports = mongoose.model('SkillTest', skillTestSchema);
