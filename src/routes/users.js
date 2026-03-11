const express = require('express');
const router = express.Router();
const { getUsers, inviteUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require auth
router.use(authorize('admin', 'superadmin'));

router.route('/')
  .get(getUsers)
  .post(inviteUser);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;
