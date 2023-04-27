const express = require("express");
const router = express.Router();
const { Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/:id/post", withAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = await Comment.create({
      comment: req.body.comment,
      user_id: req.session.user_id,
      food_id: post.id,
    });
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;