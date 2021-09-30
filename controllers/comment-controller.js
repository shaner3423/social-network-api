const { Comment, User } = require('../models');

const commentController = {

  // Get all Comments
  getComments(req, res) {
    Comment.find()
      .sort({ createdAt: -1 })
      .then((dbCommentData) => {
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Get a single Comment by id
  getSingleComment(req, res) {
    Comment.findOne({ _id: req.params.CommentId })
      .then((dbCommentData) => {
        if (!dbCommentData) {
          return res.status(404).json({ message: 'Comment with this ID does not exist.' });
        }
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Create a Comment
  createComment(req, res) {
    Comment.create(req.body)
      .then((dbCommentData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { Comments: dbCommentData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Comment has been created but no user with this id!' });
        }

        res.json({ message: 'Comment has been created!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Update a Comment
  updateComment(req, res) {
    Comment.findOneAndUpdate({ _id: req.params.CommentId }, { $set: req.body }, { runValidators: true, new: true })
      .then((dbCommentData) => {
        if (!dbCommentData) {
          return res.status(404).json({ message: 'Comment with this ID does not exist.' });
        }
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Delete a Comment
  deleteComment(req, res) {
    Comment.findOneAndRemove({ _id: req.params.CommentId })
      .then((dbCommentData) => {
        if (!dbCommentData) {
          return res.status(404).json({ message: 'Comment with this ID does not exist.' });
        }

        // remove Comment id from user's `Comments` field
        return User.findOneAndUpdate(
          { Comments: req.params.CommentId },
          { $pull: { Comments: req.params.CommentId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Comment has been created but no user with this id!' });
        }
        res.json({ message: 'Comment has been deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a reaction to a Comment
  addReaction(req, res) {
    Comment.findOneAndUpdate(
      { _id: req.params.CommentId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((dbCommentData) => {
        if (!dbCommentData) {
          return res.status(404).json({ message: 'User with this ID does not exist.' });
        }
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Remove reaction from a Comment
  removeReaction(req, res) {
    Comment.findOneAndUpdate(
      { _id: req.params.CommentId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbCommentData) => {
        if (!dbCommentData) {
          return res.status(404).json({ message: 'Comment with this ID does not exist.' });
        }
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = commentController;