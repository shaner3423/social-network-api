const router = require('express').Router();
const {
  getComments,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
} = require('../../controllers/comment-controller');

// /api/comments
router.route('/').get(getComments).post(createComment);

// /api/thoughts/:commentId
router.route('/:commentId').get(getSingleComment).put(updateComment).delete(deleteComment);

// /api/comments/:commentId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/comments/:commentId/reactions/:reactionId
router.route('/:commentId/reactions/:reactionId').delete(removeReaction);

module.exports = router;