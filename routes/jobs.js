const express = require('express');
const router = express.Router();

const {
  getAllJobs,
  createJob,
  getJobForm,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');

const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/')
  .get(getAllJobs)
  .post(createJob);

router.route('/new')
  .get(getJobForm);

router.route('/edit/:id')
  .get(getJobForm);

router.route('/update/:id')
  .post(updateJob);

router.route('/delete/:id')
  .post(deleteJob);

module.exports = router;
