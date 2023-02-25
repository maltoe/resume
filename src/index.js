import contentJson from './content.crypt.html'
import settingsJson from './settings.crypt.json'
import * as base64 from 'arraybuffer-encoding/base64/url'

const algorithm = 'AES-CBC';

const decodeText = (data) => new TextDecoder().decode(data);

const importKey = async (key) => {
  const buffer = base64.Decode(key);
  return await crypto.subtle.importKey('raw', buffer, { name: algorithm }, true, ['encrypt', 'decrypt']);
}

const decrypt = async ({ encrypted: b64Encrypted, iv: b64Iv }, b64Key) => {
  const encrypted = base64.Decode(b64Encrypted);
  const iv = base64.Decode(b64Iv);
  const key = await importKey(b64Key);

  try {
    const decrypted = await crypto.subtle.decrypt({ iv, name: algorithm }, key, encrypted);
    return decodeText(decrypted);
  } catch {
    return null;
  }
}

const contentEncrypted = JSON.parse(contentJson);
const settingsEncrypted = JSON.parse(settingsJson);

const decryptWithKeyFromEnvelope = async ({ content, envelopes }, key) => {
  const secretKey = await findKeyFromEnvelopes(envelopes, key);
  if (!secretKey) return null;

  return await decrypt(content, secretKey);
};

const findKeyFromEnvelopes = async (envelopes, key) => {
  while (envelopes.length > 0) {
    const encryptedEnvelope = envelopes.pop();
    const dec = await decrypt(encryptedEnvelope, key);
    if (dec) return dec;
  }

  return null;
};

const noAccess = () => {
  document.getElementById("content").innerHTML = "<p>Decoding failure. Please provide password using fragment identifier.</p>";
};

window.addEventListener('load', async () => {
  const key = window.location.hash.substr(1);
  if(!key) return noAccess();
  if (!/^[0-9a-zA-Z_\-]{43}$/.test(key)) return noAccess();

  const content = await decryptWithKeyFromEnvelope(contentEncrypted, key);
  if(!content) return noAccess();

  const settings = await decryptWithKeyFromEnvelope(settingsEncrypted, key);
  if(!settings) return noAccess();

  document.getElementById("content").innerHTML = content;

  const { title } = JSON.parse(settings);
  document.title = title;
});
