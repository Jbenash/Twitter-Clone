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


export { profileInfo, editProfile }