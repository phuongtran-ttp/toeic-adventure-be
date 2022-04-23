const axios = require('axios').default;
const questionServices = require('../src/services/question.services');
const skillTestServices = require('../src/services/skillTest.services');
const fileServices = require('../src/services/file.services');
const logger = require('../src/utils/logger');
const _ = require('lodash');

let testCount = 0;
const getTestIds = async (id) => {
  const url =
    'https://estudyme.test-toeic.online/api/offset-topics-by-parent-id';
  const payload = {
    field: 'orderIndex',
    userId: '625c21d0010ad628afcaecde',
    skip: 0,
    limit: 100,
    courseId: '611220911e6e0c7cbe105835',
    parentId: id,
  };

  const { data: result } = await axios({
    method: 'POST',
    data: payload,
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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

const seedData = async ({ part, id }) => {
  try {
    const count = await skillTestServices.count({
      part: part,
    });
    if (count > 0) {
      logger.info(`[Skill Test] Part ${part}: already seeded`);
      return;
    }
    
    const testIds = await getTestIds(id);
    let questionCount = 0;
    let initialTestCount = testCount;
    const level = ['EASY', 'MEDIUM', 'DIFFICULT'];
    let difficultyLevel = level[Math.floor(Math.random() * 3) + 1];
    let questionIds = [];
    const batch = _.chunk(testIds, 10);
  
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
          },
        });
  
        // save questions to db and create skill tests
        for (const question of test) {
          question.part = part;
          question.difficultyLevel = difficultyLevel;
          const { _id } = await createQuestion(question);
          questionIds.push(_id);
          questionCount += 1;
          if (questionIds.length === 10) {
            await skillTestServices.create({
              name: 'Skill Test ' + (testCount + 1),
              questions: questionIds,
              part,
              difficultyLevel,
            });
            questionIds = [];
            testCount += 1;
            difficultyLevel = level[Math.floor(Math.random() * 3) + 1];
          }
        }
      });
      await Promise.allSettled(promises);
    }
  
    logger.info(`[Skill Test] Part ${part}: seeded ${questionCount} questions, ${testCount - initialTestCount} tests`);
  } catch (error) {
    logger.error(error);
    logger.info(`[Skill Test] Part ${part}: seeding data failure`);
  }
};

module.exports = async () => {
  const parts = [
    { part: 1, id: '614be5e065d71f3a51f67194' },
    { part: 2, id: '614be5ef65d71f3a51f67195' },
    { part: 3, id: '61123a8c1e6e0c7cbe1059c4' },
    { part: 4, id: '6135c39d08e2737191f34a96' },
    { part: 5, id: '613ffc9d65d71f3a51f6282e' },
    { part: 6, id: '6140000a65d71f3a51f62a91' },
    { part: 7, id: '6140116b65d71f3a51f62c40' },
  ];

  for (const e of parts) {
    await seedData(e);
  }
}