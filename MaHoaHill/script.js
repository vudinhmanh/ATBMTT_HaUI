const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const matrixContainer = document.getElementById('matrix-container');
const plainText = document.getElementById('plainText');
const cipherText = document.getElementById('cipherText');
const encryptButton = document.getElementById('encryptButton');

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
// Hàm addPaddingText thêm padding cho text để đảm bảo độ dài của text chia hết cho số cột của ma trận K
const addPaddingText = (text, cols) => {
  const paddingChar = 'X';
  const paddedLength = Math.ceil(text.length / cols) * cols;
  return text.padEnd(paddedLength, paddingChar);
  // phương thức padEnd của chuỗi được sử dụng để thêm các ký tự 'X' 
  // vào cuối chuỗi text cho đến khi độ dài của chuỗi đạt paddedLength.
};
//Hàm convertTextToMatrix để chuyển văn bản nhập vào thành ma trận (A = 0, B = 1, ..., Z = 25)
const convertTextToMatrix = (text, cols) => {
  const matrixText = [];
  for (let i = 0; i < text.length; i += cols) { // i lặp với bước nhảy cols với mỗi lần lặp sẽ xử lý cols ký tự để tạo 1 hàng mới
    const tmpRow = []; // row là một mảng tạm thời sẽ chứa các giá trị số nguyên của các ký tự trong khối hiện tại.
    for (let j = 0; j < cols; j++) { // j duyệt qua từng ký tự trong khối cols hiện tại
      tmpRow.push(text.charCodeAt(i + j) - 65);
    }
    matrixText.push(tmpRow);
  }
  return matrixText;
};
// hàm getMatrixK lấy ra ma trận K vừa nhập
const getMatrixK = (rows, cols) => {
  const matrixK = [];
  const inputK = document.querySelectorAll('.matrix-cell');
  for (let i = 0; i < rows; i++) {
    const row = []; //Khởi tạo một hàng mới để lưu trữ các giá trị của hàng.
    for (let j = 0; j < cols; j++) {
      row.push(parseInt(inputK[i * cols + j].value)); //i là index hàng của ma trận, cols số cột, j index của cột ma trận
      //Nếu i = 0 (hàng đầu tiên) và j = 0 (cột đầu tiên), thì i * cols + j = 0.

    }
    matrixK.push(row);
  }
  return matrixK;
};
// Hàm multiplyMatrices nhân 2 ma trận matrixText và matrixK sau đó mod 26
// Syntax 
// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
// array.map(function(currentValue, index, arr), thisValue)
const multiplyMatrices = (matrixText, matrixK) => {
  return matrixText.map(row => // Duyệt qua từng hàng của ma trận matrixText
    row.map((_, j) => // Duyệt qua từng cột của mỗi hàng
      row.reduce((sum, _, i) => sum + row[i] * matrixK[i][j], 0) % 26
      // Tính tổng của tích vô hướng giữa hàng hiện tại của matrixText và cột thứ j của matrixK
    )
  );
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
  const encryptedText = cipherText.value.toUpperCase();
  const matrixK = getMatrixK(rows, cols);
  try {
    var inverseMatrixK = math.inv(matrixK);
  } catch (error) {
    alert(error)
  }
// Tính ma trận kết quả bằng cách nhân ma trận văn bản đã mã hóa với ma trận nghịch đảo
const encryptedMatrix = convertTextToMatrix(encryptedText, cols);
console.log('====================================');
console.log(encryptedMatrix);
console.log('====================================');
const decryptedMatrix = multiplyMatrices(encryptedMatrix, inverseMatrixK);
// Chuyển ma trận kết quả thành văn bản đã giải mã
const decryptedText = decryptedMatrix.flat().map(num => String.fromCharCode(num + 65)).join('');
plainText.value = decryptedText;
}
rowsInput.addEventListener('input', generateMatrix);
colsInput.addEventListener('input', generateMatrix);
encryptButton.addEventListener('click', encryptText);
dencryptButton.addEventListener('click', dencryptText);
