
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const matrixContainer = document.getElementById('matrix-container');
const plainText = document.getElementById('plainText');
const cipherText = document.getElementById('cipherText');
const encryptButton = document.getElementById('encryptButton');


function generateMatrix() {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  matrixContainer.innerHTML = '';
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    return;
  }
  matrixContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.classList.add('matrix-cell');
      matrixContainer.appendChild(input);
    }
  }
}
function hillEncrypt() {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    alert('Vui lòng nhập số dòng và số cột hợp lệ');
    return;
  }
  let text = plainText.value.replace(/[^A-Za-z]/g, '').toUpperCase();
  const paddingChar = 'X';
  const paddedLength = Math.ceil(text.length / cols) * cols;
  text = text.padEnd(paddedLength, paddingChar);

  const matrixText = [];
  for(let i = 0; i < text.length; i += cols) {
    const row = [];
    for(let j = 0; j < cols; j++) {
      row.push(text.charCodeAt(i + j) - 65);
    }
    matrixText.push(row);
  }
  const matrixK = [];
  const inputK = document.querySelectorAll('.matrix-cell');
  for(let i = 0; i < rows; i++){
    const row = [];
    for(let j = 0; j < cols; j++) {
      row.push(parseInt(inputK[i * cols + j].value));
    }
    matrixK.push(row);
  }
  const resMatrix = matrixText.map(row => {
    return row.map((_,j) => {
      return row.reduce((sum,_,k) => {
        return sum + row[k] * matrixK[k][j]
      }, 0) % 26;
    })
  })
  const encryptedText = resMatrix.flat().map(num => String.fromCharCode(num + 65)).join('');
  cipherText.value = encryptedText
}
rowsInput.addEventListener('input', generateMatrix);
colsInput.addEventListener('input', generateMatrix);
encryptButton.addEventListener('click', hillEncrypt);
