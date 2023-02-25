const fs = require('node:fs');
const crypto = require('node:crypto').webcrypto;
const base64 = require('arraybuffer-encoding/base64/url');

const algorithm = 'AES-CBC'

const encodeText = (data) => new TextEncoder().encode(data);

const importKey = async (key) => {
  const buffer = base64.Decode(key);
  return await crypto.subtle.importKey('raw', buffer, { name: algorithm }, true, ['encrypt', 'decrypt']);
}

const exportKey = async (key) => {
  const buffer = await crypto.subtle.exportKey('raw', key);
  return base64.Encode(buffer);
}

const generateKey = async () => {
  const key = await crypto.subtle.generateKey({ name: algorithm, length: 256}, true, ['encrypt', 'decrypt']);
  return await exportKey(key);
}

const generateIv = () => {
  return crypto.getRandomValues(new Uint8Array(16));
}

const encrypt = async (data, b64Key) => {
  const key = await importKey(b64Key);
  const iv = generateIv();

  const encoded = encodeText(data);
  const encrypted = await crypto.subtle.encrypt({ iv, name: algorithm }, key, encoded);

  return { encrypted: base64.Encode(encrypted), iv: base64.Encode(iv) };
};

module.exports = async function(source) {
  const { secretsPath } = this.getOptions();
  const secrets = JSON.parse(fs.readFileSync(secretsPath, { encoding: 'utf8' }));

  const secretKey = await generateKey();
  const content = await encrypt(source, secretKey);

  const envelopes =
    await Promise.all(
      secrets['keys'].map(async (key) => await encrypt(secretKey, key))
    );

  return JSON.stringify({ content, envelopes });
}
