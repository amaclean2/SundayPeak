const deleteStatements = [
    `DELETE FROM users`,
    `DELETE FROM adventures`,
    `DELETE FROM followers`,
    `DELETE FROM adventure_editors`,
    `DELETE FROM ticks`,
    `DELETE FROM activities`,
    `DELETE FROM user_images`,
    `DELETE FROM password_reset_tokens`
];

const testCreateUserStatement = 'INSERT INTO users (email, password, first_name, last_name) VALUES("user@email.com", ?, "Test", "User")';
const testCreateSecondUserStatement = 'INSERT INTO users (email, password, first_name, last_name) VALUES("second@email.com", ?, "Second", "User")';
const getTestUserIdStatement = 'SELECT id FROM users WHERE email = "user@email.com";';

module.exports = {
    deleteStatements,
    testCreateUserStatement,
    testCreateSecondUserStatement,
    getTestUserIdStatement
};