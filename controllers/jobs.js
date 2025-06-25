const Job = require('../models/Job');
const parseValidationErrors = require('../utils/parseValidationErrs');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort('createdAt');
  res.render('jobs', { jobs });
};

const getJobForm = async (req, res, next) => {
  const { id: jobId } = req.params;

  if (jobId) {
    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.user._id,
    });

    if (!job) {
      req.flash('error', 'Job not found or you do not have permission to access it.');
      return res.redirect('/jobs');
    }
    res.render('job', { job });
  } else {
    res.render('job', { job: null });
  }
};

const createJob = async (req, res, next) => {
  req.body.createdBy = req.user._id;
  try {
    await Job.create(req.body);
    req.flash('info', 'Job created successfully!');
    res.redirect('/jobs');
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseValidationErrors(e, req);
    } else {
      return next(e);
    }
    res.render('job', { job: req.body, errors: req.flash('error') });
  }
};

const updateJob = async (req, res, next) => {
  const { id: jobId } = req.params;
  try {
    const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      req.flash('error', 'Job not found or you do not have permission to update it.');
      return res.redirect('/jobs');
    }
    req.flash('info', 'Job updated successfully!');
    res.redirect('/jobs');
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseValidationErrors(e, req);
    } else {
      return next(e);
    }
    const job = await Job.findOne({ _id: jobId, createdBy: req.user._id });
    res.render('job', { job: job || req.body, errors: req.flash('error') });
  }
};

const deleteJob = async (req, res, next) => {
  const { id: jobId } = req.params;
  try {
    const job = await Job.findOneAndDelete({
      _id: jobId,
      createdBy: req.user._id,
    });

    if (!job) {
      req.flash('error', 'Job not found or you do not have permission to delete it.');
    } else {
      req.flash('info', 'Job deleted successfully!');
    }
    res.redirect('/jobs');
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getAllJobs,
  createJob,
  getJobForm,
  updateJob,
  deleteJob,
};
