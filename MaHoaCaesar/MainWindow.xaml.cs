using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MaHoaCaesar
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent(); // Khởi tạo các thành phần được định nghĩa trong tệp XAML
        }

        // Xử lý sự kiện cho nút mã hóa
        private void MaHoa(object sender, RoutedEventArgs e)
        {
            string plainText = txtPlain.Text; // Lấy văn bản gốc từ TextBox đầu vào
            string ciphertext = ""; // Khởi tạo một chuỗi rỗng để lưu trữ văn bản mã hóa
            int key = int.Parse(txtKhoaK.Text); // Lấy và chuyển đổi khóa mã hóa từ TextBox

            // Duyệt qua từng ký tự trong văn bản gốc
            foreach (char ch in plainText)
            {
                if (char.IsUpper(ch)) // Kiểm tra nếu ký tự là chữ hoa
                {
                    // Mã hóa ký tự sử dụng công thức mã hóa Caesar cho chữ hoa
                    char encryptedChar = (char)((ch + key - 'A') % 26 + 'A');
                    ciphertext += encryptedChar; // Thêm ký tự đã mã hóa vào văn bản mã hóa
                }
                else if (char.IsLower(ch)) // Kiểm tra nếu ký tự là chữ thường
                {
                    // Mã hóa ký tự sử dụng công thức mã hóa Caesar cho chữ thường
                    char encryptedChar = (char)((ch + key - 'a') % 26 + 'a');
                    ciphertext += encryptedChar; // Thêm ký tự đã mã hóa vào văn bản mã hóa
                }
                else
                {
                    // Nếu ký tự không phải chữ hoa hay chữ thường, giữ nguyên ký tự đó
                    ciphertext += ch;
                }
            }
            txtCipher.Text = ciphertext; // Đặt kết quả văn bản mã hóa vào TextBox tương ứng
        }

        // Xử lý sự kiện cho nút giải mã
        private void GiaiMa(object sender, RoutedEventArgs e)
        {
            string ciphertext = txtCipher.Text; // Lấy văn bản mã hóa từ TextBox
            string plainText = ""; // Khởi tạo một chuỗi rỗng để lưu trữ văn bản gốc sau khi giải mã
            int key = int.Parse(txtKhoaK.Text); // Lấy và chuyển đổi khóa mã hóa từ TextBox

            // Duyệt qua từng ký tự trong văn bản mã hóa
            foreach (char ch in ciphertext)
            {
                if (char.IsUpper(ch)) // Kiểm tra nếu ký tự là chữ hoa
                {
                    // Giải mã ký tự sử dụng công thức giải mã Caesar cho chữ hoa
                    char decryptedChar = (char)((ch - key - 'A' + 26) % 26 + 'A');
                    plainText += decryptedChar; // Thêm ký tự đã giải mã vào văn bản gốc
                }
                else if (char.IsLower(ch)) // Kiểm tra nếu ký tự là chữ thường
                {
                    // Giải mã ký tự sử dụng công thức giải mã Caesar cho chữ thường
                    char decryptedChar = (char)((ch - key - 'a' + 26) % 26 + 'a');
                    plainText += decryptedChar; // Thêm ký tự đã giải mã vào văn bản gốc
                }
                else
                {
                    // Nếu ký tự không phải chữ hoa hay chữ thường, giữ nguyên ký tự đó
                    plainText += ch;
                }
            }
            txtPlain.Text = plainText; // Đặt kết quả văn bản gốc vào TextBox tương ứng
        }
    }
}
