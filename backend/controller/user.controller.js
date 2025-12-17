import bcrypt from "bcryptjs";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import userModel from "../model/user.model.js";
import createNotification from "../utils/createNotification.js";

//getting profile info of other users
const profileInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username }).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user data not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(`Error is profileInfo Controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

//edit the user profile
const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password, newPassword } = req.body;

    /* ---------------- BUILD UPDATE DATA ---------------- */

    const updatedData = {};
    const allowedFields = ["fullname", "profileImg", "coverImg", "bio", "link"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updatedData[field] = req.body[field];
    });

    /* ---------------- PASSWORD UPDATE ---------------- */
    if (password || newPassword) {
      if (!password || !newPassword)
        return res.status(400).json({
          success: false,
          message: "Both current and new password are required",
        });

      if (newPassword.length < 6)
        return res.status(400).json({
          success: false,
          message: "Password should be minimun 6 characters",
        });

      const user = await userModel.findById(userId).select("password");

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Current password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(newPassword, salt);
    }
    /* ---------------- PROFILE-IMG & COVER-IMG UPDATE ---------------- */

    if (req.files?.profileImg?.[0]) {
      try {
        const result = await uploadToCloudinary(
          req.files.profileImg[0].buffer,
          "twitter_clone/profile"
        );
        updatedData.profileImg = result.secure_url;
      } catch (error) {
        console.error("Cloudinary profile image upload error:", error);
        throw error;
      }
    }

    if (req.files?.coverImg?.[0]) {
      try {
        const result = await uploadToCloudinary(
          req.files.coverImg[0].buffer,
          "twitter_clone/cover"
        );
        updatedData.coverImg = result.secure_url;
      } catch (error) {
        console.error("Cloudinary cover image upload error:", error);
        throw error;
      }
    }
    /* ---------------- FINAL UPDATE ---------------- */
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updatedData },
        { new: true, runValidators: true }
      )
      .select("-password -username -email");

    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "Failed to update user data" });

    return res.status(200).json({
      success: true,
      message: "User data updated succesfully ",
      user: updatedUser,
    });
  } catch (error) {
    console.error(`Error is editProfile Controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

//toggle follow and unfollow
const toggleFollow = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userId: targetUserId } = req.params; // params returns a string not an object so you have to recive like a object

    if (userId.toString() === targetUserId)
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });

    //fetch date from the user and the targetUser
    const [user, targetUser] = await Promise.all([
      userModel.findById(userId),
      userModel.findById(targetUserId),
    ]);

    if (!targetUser || !user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isFollowing = user.following.some(
      (id) => id.toString() === targetUserId.toString()
    ); //convert to string for proper comparison

    if (isFollowing) {
      //unfollow
      user.following.pull(targetUserId);
      targetUser.followers.pull(userId);
    } else {
      //follow
      user.following.push(targetUserId);
      targetUser.followers.push(userId);

      //send notification when user follow someone
      await createNotification({
        from: userId,
        to: targetUserId,
        type: "follow",
      });
    }

    await Promise.all([user.save(), targetUser.save()]);

    return res.status(200).json({
      success: true,
      following: !isFollowing,
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
    });
  } catch (error) {
    console.error(`Error in toggleFollow Controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

//showing suggestions for users
const getSuggestedUsers = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id); //this is best practice to re fetch from the database instead of direclty receiving the req object because it will be a fresh data
    const followingIds = user.following;

    let suggestions = await userModel
      .find({
        _id: {
          $nin: [...followingIds, user._id], //// exclude self + already followed
        },
        followers: {
          $in: followingIds, // followed by people I follow
        },
      })
      .select("username profileImg ")
      .limit(10);

    //fallback -if he is a new user or he has not followed anyone so far

    if (suggestions.length === 0) {
      suggestions = await userModel
        .find({
          _id: { $nin: [user._id] },
        })
        .select("username profileImg ")
        .limit(10);
    }

    return res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error(`Error in sugessted Controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { profileInfo, editProfile, toggleFollow, getSuggestedUsers };
