document.addEventListener('DOMContentLoaded', () => {
  // Lấy các phần tử HTML bằng ID
  const plainText = document.getElementById('plainText');
  const cypherText = document.getElementById('cypherText');
  const kText = document.getElementById('kText');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');

  // Hàm lấy giá trị khóa từ ô nhập liệu và chuyển thành số nguyên
  const getK = () => {
    let a, b;
    const keyArr = kText.value.split(','); // Tách giá trị khóa thành mảng
    if (keyArr.length >= 2) {
      a = parseInt(keyArr[0].trim()); // Chuyển giá trị đầu tiên thành số nguyên
      b = parseInt(keyArr[1].trim()); // Chuyển giá trị thứ hai thành số nguyên
    } else {
      a = 0;
      b = 0;
    }
    return { a, b }; // Trả về đối tượng chứa hai khóa a và b
  };

  // Hàm chuyển văn bản thành mảng các số, mỗi số đại diện cho một ký tự
  const convertTextToNum = (text) => {
    const x = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      if (char >= 'a' && char <= 'z') {
        x.push(char.charCodeAt(0) - 97); // Chuyển ký tự thành số từ 0 đến 25
      }
    }
    return x; // Trả về mảng các số
  };

  // Hàm mã hóa văn bản
  const ecrypt = () => {
    const { a, b } = getK(); // Lấy giá trị khóa
    const x = convertTextToNum(plainText.value); // Chuyển văn bản thường thành mảng các số
    const resEncrypt = [];
    for (let i = 0; i < x.length; i++) {
      let encryptedValue = (a * x[i] + b) % 26; // Công thức mã hóa Affine
      resEncrypt.push(encryptedValue); // Thêm giá trị mã hóa vào mảng
    }
    console.log('Encrypted Values:', resEncrypt);
    const encryptedText = resEncrypt.map(encryptedNum => String.fromCharCode(encryptedNum + 65)).join(''); // Chuyển mảng số thành văn bản mã hóa
    cypherText.value = encryptedText; // Hiển thị văn bản mã hóa trong ô nhập liệu
  };

  // Hàm tính nghịch đảo modulo của a với modulo m
  const modInverse = (a, m) => {
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;

    if (m == 1)
      return 0;

    while (a > 1) {
      q = Math.floor(a / m); // Tính thương
      t = m;

      m = a % m; // Tính số dư mới
      a = t;
      t = x0;

      x0 = x1 - q * x0; // Cập nhật x0
      x1 = t; // Cập nhật x1
    }

    if (x1 < 0)
      x1 += m0; // Điều chỉnh x1 nếu âm

    return x1; // Trả về nghịch đảo modulo của a
  };

  // Hàm giải mã văn bản
  const decrypt = () => {
    const { a, b } = getK(); // Lấy giá trị khóa
    const a_inv = modInverse(a, 26); // Tính nghịch đảo của a
    const y = convertTextToNum(cypherText.value.toLowerCase()); // Chuyển văn bản mã hóa thành mảng các số
    const resDecrypt = [];
    for (let i = 0; i < y.length; i++) {
      let decryptedValue = (a_inv * (y[i] - b + 26)) % 26; // Công thức giải mã Affine
      resDecrypt.push(decryptedValue); // Thêm giá trị giải mã vào mảng
    }
    console.log('Decrypted Values:', resDecrypt);
    const decryptedText = resDecrypt.map(encryptedNum => String.fromCharCode(encryptedNum + 97)).join(''); // Chuyển mảng số thành văn bản thường
    plainText.value = decryptedText; // Hiển thị văn bản thường trong ô nhập liệu
  };

  // Gắn sự kiện click cho nút mã hóa và giải mã
  encryptButton.addEventListener('click', ecrypt);
  decryptButton.addEventListener('click', decrypt);
});
