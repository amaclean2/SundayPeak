const logger = require('../Config/logger.js');
const { transporter } = require('../Config/mailer.js');
const queries = require('../DB');
const cryptoHandlers = require('../Crypto');

const createPasswordResetTemplate = (options) => `
<h1>Here's the link to reset your email</h1>
${options.token}
`;

const sendEmail = async (email) => {
    const { savePasswordResetToken } = queries;

    const user = await getUser(email);

    if (!user) {
        throw returnError({ message: 'noAccountExists' });
    }

    const token = await cryptoHandlers.generatePasswordResetToken({ email });

    const mailOptions = {
        from: 'andrew.n.maclean@gamil.com',
        to: email,
        subject: 'Node Mailer',
        html: createPasswordResetTemplate({ token })
    };

    return new Promise((res, rej) => {
        logger.debug('MAIL_SENDING', mailOptions);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error('ERROR_WITH_EMAIL_CLIENT', error);
                rej(error);
            } else {
                logger.debug('INFO_FROM_MAIL_CLIENT', info);
                savePasswordResetToken({ email, token }).then((resp) => {
                    logger.debug('RESET_TOKEN_SAVED', resp);
                    res({ info, resp });
                }).catch((error) => {
                    logger.error('ERROR_SAVING_RESET_TOKEN', error);
                    rej(error);
                });
            }
        });
    });
};

const validateSignatureAndSave = async ({ signature, new_password }) => {
    const { getPasswordResetEmail } = queries;

    const { email } = await getPasswordResetEmail({ token: signature });

    const verified = await validatePasswordResetToken({ signature, email });

    return email;
};

module.exports = {
    sendEmail,
    validateSignatureAndSave
};