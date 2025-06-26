import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const secret = "encryption-key";

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};
