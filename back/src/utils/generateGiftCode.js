const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateGiftCode = (prefix = 'CAP') => {
  let code = prefix;
  for (let i = 0; i < 9; i += 1) {
    if (i % 3 === 0) code += '-';
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};

module.exports = generateGiftCode;
