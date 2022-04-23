const httpStatus = require('http-status');
const getQueryParams = require('../utils/getQueryParams');
const fileServices = require('../services/file.services');
const ApiError = require('../utils/ApiError');

const UPLOADS_BASE_URI = '/uploads';

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  const resultPage = await fileServices.queryFiles(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id: fileId } = req.params;
  const file = await fileServices.findFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }

  return res.json(file.toJSON());
}

const uploads = async (req, res) => {
  const { files: uploadedFiles } = req;
  if (!uploadedFiles || uploadedFiles.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file is found');
  }

  const params = uploadedFiles.map((fileInfo) => ({
    name: fileInfo.filename,
    url: `${UPLOADS_BASE_URI}/${fileInfo.filename}`,
    mime: fileInfo.mimetype,
  }));

  const files = await fileServices.createFiles(params);
  return res.status(httpStatus.CREATED).json(files);
};

const deleteOne = async (req, res) => {
  const { id: fileId } = req.params;
  const deletedFile = await fileServices.deleteFileById(fileId);
  if (!deletedFile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }

  res.json(true);
};

module.exports = {
  find,
  findOne,
  uploads,
  deleteOne,
};
