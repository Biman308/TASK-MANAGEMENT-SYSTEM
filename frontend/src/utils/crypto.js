import CryptoJS from "crypto-js";

const SECRET_KEY = "encryption-key";

export const encryptData = (data) => {
  const strData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(strData, SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedStr);
};
