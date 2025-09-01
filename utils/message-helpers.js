/**
 * Generates a unique ID for a message.
 * @returns {string} A random string ID.
 */
function generateMessageId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Formats a message object.
 * @param {string} username - The sender's username.
 * @param {string} content - The message content (text, image data, etc.).
 * @param {string} [type='text'] - The type of message ('text', 'image', 'file', 'notification').
 * @returns {object} The formatted message object.
 */
function formatMessage(username, content, type = 'text') {
    return {
        id: generateMessageId(),
        username,
        content,
        type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: {} // e.g., { '👍': ['user1', 'user2'] }
    };
}

module.exports = {
  formatMessage,
  generateMessageId
};
