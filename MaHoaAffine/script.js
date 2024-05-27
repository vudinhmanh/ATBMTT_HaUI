document.addEventListener('DOMContentLoaded', () => {
  const plainText = document.getElementById('plainText');
  const cypherText = document.getElementById('cypherText');
  const kText = document.getElementById('kText');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');
  const getK = () => {
    let a, b;
    const keyArr = kText.value.split(',');
    if (keyArr.length >= 2) {
      a = parseInt(keyArr[0].trim());
      b = parseInt(keyArr[1].trim());
    } else {
      a = 0;
      b = 0;
    }
    return { a, b };
  };

  const convertTextToNum = (text) => {
    const x = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      if (char >= 'a' && char <= 'z') {
        x.push(char.charCodeAt(0) - 97);
      }
    }
    return x;
  };
  const ecrypt = () => {
    const { a, b } = getK();
    const x = convertTextToNum(plainText.value);
    const resEncrypt = [];
    for (let i = 0; i < x.length; i++) {
      let encryptedValue = (a * x[i] + b) % 26;
      resEncrypt.push(encryptedValue);
    }
    console.log('Encrypted Values:', resEncrypt);
    const encryptedText = resEncrypt.map(encryptedNum => String.fromCharCode(encryptedNum + 65)).join('');
    cypherText.value = encryptedText;
  };

  const modInverse = (a, m) => {
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;

    if (m == 1)
      return 0;

    while (a > 1) {
      q = Math.floor(a / m);
      t = m;

      m = a % m;
      a = t;
      t = x0;

      x0 = x1 - q * x0;
      x1 = t;
    }

    if (x1 < 0)
      x1 += m0;

    return x1;
  };
  const decrypt = () => {
    const { a, b } = getK();
    const a_inv = modInverse(a, 26);
    const y = convertTextToNum(cypherText.value.toLowerCase());
    const resDecrypt = [];
    for (let i = 0; i < y.length; i++) {
      let decryptedValue = (a_inv * (y[i] - b + 26)) % 26; 
      resDecrypt.push(decryptedValue);
    }
    console.log('Decrypted Values:', resDecrypt);
    const decryptedText = resDecrypt.map(encryptedNum => String.fromCharCode(encryptedNum + 97)).join('');
    plainText.value = decryptedText;
  };
  encryptButton.addEventListener('click', ecrypt);
  decryptButton.addEventListener('click', decrypt);
});
