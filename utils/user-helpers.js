// This file manages users in memory.
// In a real-world application, this would be replaced with a database.
const users = [];

/**
 * Adds a user to the list of users.
 * @param {string} id - The socket ID of the user.
 * @param {string} username - The nickname of the user.
 * @param {string} room - The room the user is joining.
 * @returns {object} The user object.
 */
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

/**
 * Gets the current user by their socket ID.
 * @param {string} id - The socket ID.
 * @returns {object|undefined} The user object or undefined if not found.
 */
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

/**
 * Removes a user from the list when they disconnect.
 * @param {string} id - The socket ID.
 * @returns {object|undefined} The user object that was removed.
 */
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

/**
 * Gets all users currently in a specific room.
 * @param {string} room - The name of the room.
 * @returns {Array} An array of user objects.
 */
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
