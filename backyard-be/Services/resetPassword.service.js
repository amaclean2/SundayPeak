import { transporter } from '../Config/mailer.js';
import { generatePasswordResetToken, validatePasswordResetToken } from '../Crypto';
import { getUser, savePasswordResetToken, getPasswordResetEmail } from '../DB';

const createPasswordResetTemplate = (options) => `
<h1>Here's the link to reset your email</h1>
${options.token}
`;

export const sendEmail = async (email) => {

    const user = await getUser(email);

    if (!user) {
        throw returnError({ message: 'noAccountExists' });
    }

    const token = await generatePasswordResetToken({ email });

    const mailOptions = {
        from: 'andrew.n.maclean@gamil.com',
        to: email,
        subject: 'Node Mailer',
        html: createPasswordResetTemplate({ token })
    };

    return new Promise((res, rej) => {
        console.log("MAIL_SENDING", mailOptions);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('ERROR_WITH_EMAIL_CLIENT', error);
                rej(error);
            } else {
                console.log("INFO_FROM_MAIL_CLIENT", info);
                savePasswordResetToken({ email, token }).then((resp) => {
                    console.log("RESET_TOKEN_SAVED", resp);
                    res({ info, resp });
                }).catch((error) => {
                    console.error('ERROR_SAVING_RESET_TOKEN', error);
                    rej(error);
                });
            }
        });
    });
};

export const validateSignatureAndSave = async ({ signature, new_password }) => {
    const { email } = await getPasswordResetEmail({ token: signature });

    const verified = await validatePasswordResetToken({ signature, email });

    console.log("VERIFIED", verified);
    return email;
};