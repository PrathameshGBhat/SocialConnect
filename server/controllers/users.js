import User from "../models/User";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedfriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; //formates the user's friends in this format
      }
    );
    res.status(200).json(formattedfriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.include(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);//if friend_id is in users friend_list, then remove it from user's
      friend.friends = friend.friends.filter((id) => id !== id);//even remove user's id from friend's profile list
    } else {
      user.friends.push(friendId);//if not friend then add it by pushing into friends list
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedfriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; //formates the user's friends in this format
      }
    );
    res.status(200).json(formattedfriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
