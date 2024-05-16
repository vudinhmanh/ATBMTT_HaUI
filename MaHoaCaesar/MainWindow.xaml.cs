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
            for (int i = 0; i < plainText.Length; i++)
            {
                var indexPlainText = (int)plainText[i];
                if(indexPlainText >= 65 && indexPlainText <= 90) {
                    int res = (indexPlainText - 65 + key) % 26;
                    ciphertext += (char)(res + 65);
                }
                else if (indexPlainText >= 97 && indexPlainText <= 122){
                    int res = (indexPlainText - 97 + key) % 26;
                    ciphertext += (char)(res + 97);
                }
                else
                {
                    ciphertext += plainText[i];
                }
            }
            txtCipher.Text = ciphertext;
        }
        private void GiaiMa(object sender, RoutedEventArgs e)
        {
            string ciphertext = txtCipher.Text;
            string plainText = "";
            int key = int.Parse(txtKhoaK.Text);
            for (int i = 0; i < ciphertext.Length; i++)
            {
                var indexCipherText = (int)ciphertext[i];
                if (indexCipherText >= 65 && indexCipherText <= 90)
                {
                    int res = (indexCipherText - 65 - key) % 26;
                    plainText += (char)(res + 65);
                }
            }
            txtPlain.Text = plainText;
        }
    }
}