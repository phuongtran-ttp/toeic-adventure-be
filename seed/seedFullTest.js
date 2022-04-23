const axios = require('axios').default;
const questionServices = require('../src/services/question.services');
const fullTestServices = require('../src/services/fullTest.services');
const fileServices = require('../src/services/file.services');
const logger = require('../src/utils/logger');
const _ = require('lodash');

let testCount = 0;
const level = ['EASY', 'MEDIUM', 'DIFFICULT'];
const getPart = {
  '1636615697542': 1,
  '1636615720709': 2,
  '1636615725762': 3,
  '1636615729794': 4,
  '1636615733972': 5,
  '1636615742506': 6,
  '1636615746924': 7,
}

const getTestIds = async (id) => {
  const url =
    'https://estudyme.test-toeic.online/api/offset-topics-by-parent-id';
  const payload = {
    field: 'orderIndex',
    userId: '625c21d0010ad628afcaecde',
    skip: 0,
    limit: 100,
    courseId: '619da03e776cf622cda357fb',
    parentId: id,
  };

  const { data: result } = await axios({
    method: 'POST',
    data: payload,
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'axios 0.21.1',
    },
  });

  const testIds = result.data.map((e) => e._id);
  return testIds;
};

const extractImageAndSound = async (question) => {
  const image = [];
  if (question.image && question.image.length > 0) {
    const imageFile = await fileServices.createFile({
      name: question.image.split('/').reverse()[0],
      url: 'https://storage.googleapis.com' + question.image,
      mime: 'image/png',
    });

    image.push(imageFile._id);
  }

  const sound = [];
  if (question.sound && question.sound.length > 0) {
    const soundFile = await fileServices.createFile({
      name: question.sound.split('/').reverse()[0],
      url: 'https://storage.googleapis.com/' + question.sound,
      mime: 'audio/mp3',
    });

    sound.push(soundFile._id);
  }

  return { image, sound };
};

const formatParagraphPart6 = (paragraph) => {
  return paragraph
    .replace(' (01) ', '---(01)---')
    .replace(' (02) ', '---(02)---')
    .replace(' (03) ', '---(03)---')
    .replace(' (04) ', '---(04)---')
};

const createQuestion = async ({
  _id,
  question,
  answer,
  difficultyLevel,
  childCards,
  part,
}) => {
  const { image, sound } = await extractImageAndSound(question);
  const childs = await Promise.all(
    childCards.map(async (child) => {
      const { image: childImage, sound: childSound } =
        await extractImageAndSound(child.question);
      return {
        question: {
          text: part === 6 ? formatParagraphPart6(child.question.text) : child.question.text,
          image: childImage,
          sound: childSound,
          choices: [...child.answer.texts, ...child.answer.choices].sort(),
        },
        answer: {
          text: child.answer.texts[0],
          explanation: child.answer.hint,
        },
      };
    })
  );

  const params = {
    question: {
      text: part === 6 ? formatParagraphPart6(question.text) : question.text,
      image,
      sound,
      choices: [...answer.texts, ...answer.choices].sort(),
    },
    answer: {
      text: answer.texts[0],
      explanation: answer.hint,
    },
    part,
    difficultyLevel,
    originalSource: _id,
    childs,
  };
  return await questionServices.create(params);
};

const seedData = async (pageId) => {
  try {
    const count = await fullTestServices.count();
    if (count > 0) {
      logger.info(`[Full Test]: already seeded`);
      return;
    }
    
    const testIds = (await getTestIds(pageId));
    console.log(testIds);
    let initialTestCount = testCount;
    let questionIds = [];
    const batch = _.chunk(testIds, 3);
  
    for (const chuck of batch) {
      const promises = chuck.map(async (testId) => {
        // Get questions of the test
        const url = 'https://estudyme.test-toeic.online/api/get-card-by-topic-id';
        const payload = {
          topicId: testId,
          type: [],
        };
        const { data: test } = await axios({
          method: 'POST',
          data: payload,
          url: url,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'axios 0.21.1',
          },
        });
  
        // save questions to db and create skill tests
        for (const question of test) {
          question.part = getPart[question.type];
          question.difficultyLevel = level[Math.floor(Math.random() * 3) + 1];
          const { _id } = await createQuestion(question);
          questionIds.push(_id);
        }

        await fullTestServices.create({
          name: 'Full Test ' + (testCount + 1),
          questions: questionIds,
        });
        questionIds = [];
        testCount += 1;
      });
      await Promise.allSettled(promises);
    }
  
    logger.info(`[Full Test]: seeded ${testCount - initialTestCount} tests`);
  } catch (error) {
    logger.error(error);
    logger.info(`[Full Test]: seeding data failure`);
  }
};

module.exports = async () => {
  const pageIds = [
    '619da054776cf622cda35800'
  ];

  for (const id of pageIds) {
    await seedData(id);
  }
}