import * as nodeCrypto from 'crypto';

export const encryptQr = (qrData: string, secret: string): string => {
  const secretHash = nodeCrypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
  const iv = nodeCrypto.randomBytes(16);
  const cipher = nodeCrypto.createCipheriv('aes-256-cbc', Buffer.from(secretHash), iv);
  let encrypted = cipher.update(qrData, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

export const decryptQr = (encryptedQr: string, secret: string): string => {
  const cryptedParts: string[] = encryptedQr.split(':');
  if (cryptedParts.length < 2) {
    throw new Error('Invalid crypted QR');
  } else {
    const secretHash = nodeCrypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
    const iv = Buffer.from(cryptedParts.shift()!, 'hex');
    const encrypted = cryptedParts.join(':');
    const decipher = nodeCrypto.createDecipheriv('aes-256-cbc', Buffer.from(secretHash), iv);
    let decryptedQr = decipher.update(encrypted, 'hex', 'utf8');
    decryptedQr += decipher.final('utf8');
    return decryptedQr;
  }
};
