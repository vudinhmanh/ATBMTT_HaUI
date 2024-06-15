const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const matrixContainer = document.getElementById('matrix-container');
const plainText = document.getElementById('plainText');
const cipherText = document.getElementById('cipherText');
const encryptButton = document.getElementById('encryptButton');
const dencryptButton = document.getElementById('dencryptButton');

const generateMatrix = () => {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  matrixContainer.innerHTML = '';
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    return;
  }
  matrixContainer.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.classList.add('matrix-cell');
      matrixContainer.appendChild(input);
    }
  }
};

const addPaddingText = (text, cols) => {
  const paddingChar = 'X';
  const paddedLength = Math.ceil(text.length / cols) * cols;
  return text.padEnd(paddedLength, paddingChar);
};

const convertTextToMatrix = (text, cols) => {
  const matrixText = [];
  for (let i = 0; i < text.length; i += cols) {
    const tmpRow = [];
    for (let j = 0; j < cols; j++) {
      tmpRow.push(text.charCodeAt(i + j) - 65);
    }
    matrixText.push(tmpRow);
  }
  return matrixText;
};

const getMatrixK = (rows, cols) => {
  const matrixK = [];
  const inputK = document.querySelectorAll('.matrix-cell');
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(parseInt(inputK[i * cols + j].value));
    }
    matrixK.push(row);
  }
  return matrixK;
};

const multiplyMatrices = (matrixA, matrixB) => {
  const result = [];
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrixB[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < matrixB.length; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      result[i][j] = sum % 26;
      if (result[i][j] < 0) result[i][j] += 26; // Ensure non-negative result
    }
  }
  return result;
};

const encryptText = () => {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    alert('Vui lòng nhập số dòng và số cột hợp lệ');
    return;
  }
  let text = plainText.value.replace(/[^A-Za-z]/g, '').toUpperCase();
  text = addPaddingText(text, cols);

  const matrixText = convertTextToMatrix(text, cols);
  const matrixK = getMatrixK(rows, cols);

  const resMatrix = multiplyMatrices(matrixText, matrixK);
  const encryptedText = resMatrix.flat().map(num => String.fromCharCode(num + 65)).join('');
  cipherText.value = encryptedText;
};

const dencryptText = () => {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  const encryptedText = cipherText.value.replace(/[^A-Za-z]/g, '').toUpperCase();
  const matrixK = getMatrixK(rows, cols);

  // Tính ma trận nghịch đảo
  try {
    var inverseMatrixK = key_inverse_cal(matrixK);
  } catch (error) {
    alert('Lỗi khi tính ma trận nghịch đảo: ' + error.message);
    return;
  }

  // Chuyển đổi encryptedText thành ma trận dữ liệu đã mã hóa
  const encryptedMatrix = convertTextToMatrix(encryptedText, cols);

  // Giải mã dữ liệu
  const decryptedMatrix = multiplyMatrices(encryptedMatrix, inverseMatrixK);

  // Chuyển ma trận đã giải mã thành văn bản
  const decryptedText = decryptedMatrix.flat().map(num => {
    return String.fromCharCode(((num % 26) + 26) % 26 + 65); // Đảm bảo trong khoảng 'A'-'Z'
  }).join('');

  // Xóa các ký tự 'X' đệm
  plainText.value = decryptedText.replace(/X+$/g, '');
};
rowsInput.addEventListener('input', generateMatrix);
colsInput.addEventListener('input', generateMatrix);
encryptButton.addEventListener('click', encryptText);
dencryptButton.addEventListener('click', dencryptText);
