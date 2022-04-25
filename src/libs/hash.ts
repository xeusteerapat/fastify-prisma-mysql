import crypto from 'crypto';

// !For the sake of simplicity. DO NOT USE IN PRODUCTION
export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return {
    hash,
    salt,
  };
};

export const verifyPassword = ({
  userPassword,
  salt,
  hash,
}: {
  userPassword: string;
  salt: string;
  hash: string;
}) => {
  const userHashPassword = crypto
    .pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512')
    .toString('hex');

  return userHashPassword === hash;
};
