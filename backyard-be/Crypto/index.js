import {
    randomBytes,
    scryptSync,
    timingSafeEqual,
    generateKeyPairSync,
    createSign,
    createVerify
} from 'crypto';

export const hashPassword = (password) => {
    const salt = randomBytes(16).toString('base64');
    const passwordHash = scryptSync(password, salt, 64).toString('base64');
    return `${salt}:${passwordHash}`;
};

export const comparePassword = (password, hashedPassword) => {
    const [salt, key] = hashedPassword.split(':');
    const hashedBuffer = scryptSync(password, salt, 64);

    const keyBuffer = Buffer.from(key, 'base64');
    const match = timingSafeEqual(hashedBuffer, keyBuffer);

    return match;
};

const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'sect239k1'
});

export const generatePasswordResetToken = async ({ email }) => {

    const sign = createSign('SHA256');
    sign.write(email);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');
    console.log(publicKey, signature);

    return signature;
};

export const validatePasswordResetToken = async ({ signature, email }) => {
    const verify = createVerify('SHA256');
    verify.write(email);
    verify.end();

    console.log(publicKey, signature);

    return verify.verify(publicKey, signature);
};