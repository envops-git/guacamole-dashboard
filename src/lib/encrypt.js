import crypto from 'crypto';

const CRYPT_SECRET = process.env.CRYPT_SECRET;

const clientOptions ={
  cypher: 'AES-256-CBC',
  key: CRYPT_SECRET,
};

const encrypt = (value) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(clientOptions.cypher, clientOptions.key, iv);

  let crypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
  crypted += cipher.final('base64');

  const data = {
    iv: iv.toString('base64'),
    value: crypted,
  };

  let jsonstr = JSON.stringify(data);
  let encoded = new Buffer(jsonstr).toString('base64');
  return encoded;
};

export default encrypt;