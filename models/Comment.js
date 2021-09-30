const { Schema, model } = require('mongoose');
const moment = require('moment');
const reactionSchema = require('./Reaction');

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: 'A commentis required',
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => moment(timestamp).format('MMM Do, YYYY [at] hh:mm a'),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

commentSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;