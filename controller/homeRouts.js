const router = require("express").Router();
const { User, Comment, Post } = require("../models");
const withAuth = require("../utils/auth");

router.get("/search", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Please provide a search query" });
  }

  try {
    const searchResults = await User.findOne({
      where: {
        username: username,
      },

      include: [
        {
          model: Post,
        },
      ],
    });
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching users" });
  }
});

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "username"],
        },
        {
          model: Comment,
          attributes: ["comment", "user_id"],
        },
      ],
    });
    
    const posts = await Promise.all(
      postData.map(async (f) => {
        const comments = f.comments;
        const users = await Promise.all(
          comments.map((c) =>
            User.findByPk(c.user_id, { attributes: ["username"] })
          )
        );
        const commentsWithUsernames = comments.map((c, i) => ({
          ...c.toJSON(),
          username: users[i].username,
        }));
        return { ...f.toJSON(), comments: commentsWithUsernames };
      })
    );
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Post,
        },
      ],
    });
    const user = userData.get({ plain: true });
    res.render("user", {
      ...user,
    });
  } catch (err) {
    console.log("h");
    res.status(500).json({err: "its here 1"});
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json({err: "its here2"});
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Food.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
        },
      ],
    });
    const post = postData.get({ plain: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({err: "its here3"});
  }
});

module.exports = router;
