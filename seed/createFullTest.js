const fullTestServices = require('../src/services/fullTest.services');
const Question = require('../src/models/question.model');
const Collection = require('../src/models/collection.model');

module.exports = async () => {
  const questionIds = [];
  let count = 0;
  // add part 1 question
  const part1 = await Question.aggregate([
    { $match: { part: 1 } },
    { $sample: { size: 6 } },
  ]);

  part1.forEach(q => {
    // q: question
    questionIds.push(q._id);

    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 2 question
  const part2 = await Question.aggregate([
    { $match: { part: 2 } },
    { $sample: { size: 25 } },
  ]);

  part2.forEach(q => {
    // q: question
    questionIds.push(q._id);

    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });
  
  // add part 3 question
  const part3 = await Question.aggregate([
    { $match: { part: 3 } },
    { $sample: { size: 13 } },
  ]);

  part3.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 4 question
  const part4 = await Question.aggregate([
    { $match: { part: 4 } },
    { $sample: { size: 10 } },
  ]);

  part4.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 5 question
  const part5 = await Question.aggregate([
    { $match: { part: 5 } },
    { $sample: { size: 30 } },
  ]);

  part5.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 6 question
  const part6 = await Question.aggregate([
    { $match: { part: 6 } },
    { $sample: { size: 4 } },
  ]);

  part6.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 7 single paragraph question with 2 child
  const part7SinglePara2Child = await Question.aggregate([
    { $match: { part: 7, isSinglePara: true, childs: { $size: 2 } } },
    { $sample: { size: 4 } },
  ]);

  part7SinglePara2Child.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 7 single paragraph question with 3 child
  const part7SinglePara3Child = await Question.aggregate([
    { $match: { part: 7, isSinglePara: true, childs: { $size: 3 } } },
    { $sample: { size: 3 } },
  ]);

  part7SinglePara3Child.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 7 single paragraph question with 24child
  const part7SinglePara4Child = await Question.aggregate([
    { $match: { part: 7, isSinglePara: true, childs: { $size: 4 } } },
    { $sample: { size: 3 } },
  ]);

  part7SinglePara4Child.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // add part 7 multi paragraph question
  const part7MultiPara = await Question.aggregate([
    { $match: { part: 7, isSinglePara: false, childs: { $size: 5 } } },
    { $sample: { size: 5 } },
  ]);

  part7MultiPara.forEach(q => {
    // q: question
    questionIds.push(q._id);
    
    if (q.childs.length != 0) {
      count += q.childs.length;
    } else {
      count += 1;
    }
  });

  // random collection for new full test
  const [collection] = await Collection.aggregate([
    { $sample: { size: 1 } },
  ]);

  const number = await fullTestServices.count();
  await fullTestServices.create({
    name: 'Full Test ' + (number + 1),
    questions: questionIds,
    testCollection: collection._id
  });

  console.log(count);
};