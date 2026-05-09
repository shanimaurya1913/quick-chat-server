const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("./../models/user");
const cloudinary = require("../cloudinary");

//GET Details of current logged-in user
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    res.send({
      success: true,
      message: "user fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const allUsers = await User.find({ _id: { $ne: userId } });

    res.send({
      message: "All users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/upload-profile-pic", authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;

    //UPLOAD THE IMAGE TO CLOUDINARY
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "quick-chat",
    });

    //UPDATE THE USER MODEL & SET THE PROFILE PIC PROPERTY
    const user = await User.findByIdAndUpdate(
      { _id: req.body.userId },
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    res.send({
      message: "Profile picture uploaded successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
