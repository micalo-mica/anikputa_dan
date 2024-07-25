import otpGenerator from "otp-generator";

export const genOtp = () => {
  const otp = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};
