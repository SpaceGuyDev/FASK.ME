const Follow = require('../models/followModel');
const User = require('../models/userModel');


// @desc    Get Followers
// @route   GET /api/followers/:username
// @access  Private
const getFollowers = async (req, res) => {
    try {
        const followers = await Follow.find({ following: req.user._id })
        .populate({
            path: 'follower',
            populate: {
                path: 'profile',
            }
        });

        if (followers) {
            return res.status(200).json({
                followers: followers
            });
        } else {
            return res.status(400).json({
                msg: 'Not authorized'
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


// @desc    Get Following
// @route   GET /api/following/:username
// @access  Private
const getFollowing = async (req, res) => {
    try {
        const following = await Follow.find({ follower: req.user._id })
        .populate({
            path: 'following',
            populate: {
                path: 'profile',
            }
        });

        if (following) {
            return res.status(200).json({
                following: following
            });
        } else {
            return res.status(400).json({
                msg: 'Not authorized'
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


// @desc    Follow User
// @route   POST /api/follow/:id
// @access  Private
const followUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        if (user) {
            const follow = await Follow.create({
                follower: req.user._id,
                following: user._id
            });

            return res.status(200).json(follow);
        } else {
            return res.status(400).json({
                msg: 'User not found'
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


// @desc    Unfollow User
// @route   DELETE /api/follow/:id
// @access  Private
const unfollowUser = async (req, res) => {
    try {
        const follow = await Follow.findOne({
            follower: req.user._id,
            following: req.params.id
        });

        if (follow) {
            await follow.remove();

            return res.status(200).json(follow);
        } else {
            return res.status(400).json({
                msg: 'Not authorized'
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}



module.exports = {
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser
}