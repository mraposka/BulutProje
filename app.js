const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
// Yüklemeler için dizin
const uploadDir = path.join(__dirname, 'uploads');

// Sıkıştırılmış dosya uzantısını tanımlayın
const compressed_extension = '.abdulkadir'; // Define your compressed file extension here

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Statik dosyalar için dizin
app.use(express.static('public'));
app.use('/uploads', express.static(uploadDir));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Decompress sayfası
app.get('/decompress', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'decompress.html'));
});

// Dosya yükleme ve sıkıştırma işlemi
app.post('/upload', upload.single('file'), (req, res) => {
    const inputFilePath = path.join(uploadDir, req.file.filename);
    const outputFilePath = `${inputFilePath}${compressed_extension}`; // Keep the original extension and append your compressed extension
    console.log(outputFilePath);
    exec(`./compressor "${inputFilePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Hata: ${error.message}`);
            return res.status(500).send('Dosya sıkıştırılırken bir hata oluştu.');
        }
        if (stderr) {
            console.error(`Standart hata: ${stderr}`);
            return res.status(500).send('Dosya sıkıştırılırken bir hata oluştu.');
        }

        res.send(`
            <h1>Dosya başarıyla yüklendi ve sıkıştırıldı!</h1>
            <a href="/uploads/${path.basename(outputFilePath)}" download>İndirmek için tıklayın</a>
            <br>
            <a href="/">Ana sayfaya dön</a>
        `);
    });
});

// Dosya yükleme ve açma işlemi
app.post('/decompress', upload.single('file'), (req, res) => {
    const inputFilePath = path.join(uploadDir, req.file.filename);
    const outputFilePath = path.join(uploadDir, req.file.originalname.replace(/\.abdulkadir$/, '')); // Restore original name

    exec(`./decompressor "${inputFilePath}" "${outputFilePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Hata: ${error.message}`);
            return res.status(500).send('Dosya açılırken bir hata oluştu.');
        }
        if (stderr) {
            console.error(`Standart hata: ${stderr}`);
            return res.status(500).send('Dosya açılırken bir hata oluştu.');
        }

        res.send(`
            <h1>Dosya başarıyla açıldı!</h1>
            <a href="/uploads/${path.basename(outputFilePath)}" download>İndirmek için tıklayın</a>
            <br>
            <a href="/decompress">Decompress için başka bir dosya yükle</a>
            <br>
            <a href="/">Ana sayfaya dön</a>
        `);
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});
