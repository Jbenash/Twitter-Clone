import userModel from "../model/user.model.js";

//getting profile info of other users 
const profileInfo = async (req, res) => {
    try {

        const { username } = req.params
        const user = await userModel.findOne({ username }).select("-password")

        if (!user) return res.status(404).json({ success: false, message: "user data not found" })
        res.status(200).json({ success: true, user })

    } catch (error) {
        console.error(`Error is profileInfo Controller ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.user._id

        const updatedData = {}
        const allowedFields = ["fullname", "profileImg", "coverImg", "bio", "link"]

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined)
                updatedData[field] = req.body[field]
        })

        const updatedUser = await userModel.findByIdAndUpdate(userId,
            { $set: updatedData },
            { new: true, runValidators: true })
            .select("-password -username -email")

        if (!updatedUser) return res.status(404).json({ success: false, message: "Failed to update user data" })

        return res.status(200).json({ success: true, message: "User data updated succesfully ", user: updatedUser })

    } catch (error) {
        console.error(`Error is editProfile Controller ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const toggleFollow = async (req, res) => {
    try {
        const userId = req.user._id
        const { userId: targetUserId } = req.params // params returns a string not an object so you have to recive like a object 

        if (userId.toString() === targetUserId) return res.status(400).json({ success: false, message: "You cannot follow yourself" })

        const user = await userModel.findById(userId)
        const targetUser = await userModel.findById(targetUserId)

        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" })

        const isAvailable = user.following.includes(targetUserId) //includes function checks whether the id is there or not 

        if (isAvailable) {
            //unfollow
            user.following.pull(targetUserId)
            targetUser.followers.pull(userId)
        } else {
            //follow
            user.following.push(targetUserId)
            targetUser.followers.push(userId)
        }
        await user.save()
        await targetUser.save()

        return res.status(200).json({
            success: true,
            following: !isAvailable,
            message: isAvailable ? "Unfollowed successfully" : "Followed successfully"
        })
    } catch (error) {
        console.error(`Error in toggleFollow Controller: ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}

export { profileInfo, editProfile, toggleFollow }