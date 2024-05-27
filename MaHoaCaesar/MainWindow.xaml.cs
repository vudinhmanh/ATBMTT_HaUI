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
            InitializeComponent();
        }
        private void MaHoa(object sender, RoutedEventArgs e)
        {
            string plainText = txtPlain.Text;
            string ciphertext = "";
            int key = int.Parse(txtKhoaK.Text);
            foreach (char ch in plainText)
            {
                if (char.IsUpper(ch))
                {
                    char encryptedChar = (char)((ch + key - 'A') % 26 + 'A');
                    ciphertext += encryptedChar;
                }
                else if (char.IsLower(ch))
                {
                    char encryptedChar = (char)((ch + key - 'a') % 26 + 'a');
                    ciphertext += encryptedChar;
                }
                else
                {
                    ciphertext += ch;
                }
            }
            txtCipher.Text = ciphertext;
        }
        private void GiaiMa(object sender, RoutedEventArgs e)
        {
            string ciphertext = txtCipher.Text;
            string plainText = "";
            int key = int.Parse(txtKhoaK.Text);

            foreach (char ch in ciphertext)
            {
                if (char.IsUpper(ch))
                {
                    char decryptedChar = (char)((ch - key - 'A' + 26) % 26 + 'A');
                    plainText += decryptedChar;
                }
                else if (char.IsLower(ch))
                {
                    char decryptedChar = (char)((ch - key - 'a' + 26) % 26 + 'a');
                    plainText += decryptedChar;
                }
                else
                {
                    plainText += ch;
                }
            }
            txtPlain.Text = plainText;
        }
    }
}