const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { getVideoDurationInSeconds } = require('get-video-duration')
const ffmpeg = require('fluent-ffmpeg');  // Não havia importação de ffmpeg no código fornecido
const { PDFDocument } = require('pdf-lib'); // Importação de pdf-lib
const app = express();
const PORT = 5000;

// Definindo o limite para 5 GB para os uploads
app.use(express.json({ limit: '5000mb' })); // Middleware para JSON com limite aumentado
app.use(express.urlencoded({ limit: '5000mb', extended: true })); // Middleware para dados urlencodados com limite aumentado

// Set up storage in the public/uploads folder
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../../public/files'),
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 * 1024 } });

app.post('/api/content', upload.array('files', 30), (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'No content data provided' });
        return;
    }

    const files = req.files;
    const filePaths = files.map(file => `/${file.filename}`);
    res.json({ message: 'Content posted successfully', filePaths });
});

app.delete('/api/content', (req, res) => {
    const { urls } = req.body;

    // Certifique-se de que o email foi fornecido
    if (!urls) {
        return res.status(400).json({ error: 'Urls is required' });
    }

    // Lógica de deleção de arquivos com base no email
    const deletedFiles = deleteFilesByUrls(urls); // Defina esta função para deletar arquivos com base no email

    if (deletedFiles.length === 0) {
        return res.status(404).json({ error: 'No files found for this Urls' });
    }

    // Retorno de sucesso
    res.json({ message: 'Files deleted successfully', deletedFiles });
});

// Função para deletar arquivos (exemplo)
function deleteFilesByUrls(urls) {
    const fs = require('fs');
    const filesDir = path.join(__dirname, '../../../public/files');

    const deletedFiles = [];
    // Aqui você pode listar os arquivos e deletar os que correspondem ao email
    fs.readdirSync(filesDir).forEach(file => {
        if (urls.includes(file)) {
            fs.unlinkSync(path.join(filesDir, file)); // Remove o arquivo
            deletedFiles.push(file); // Adiciona o arquivo deletado à lista
        }
    });

    return deletedFiles;
}

// Endpoint to get video duration (in seconds) by receiving the file
app.post('/api/video-duration', upload.none(), (req, res) => {
    const { path: videoPath } = req.body;

    if (!videoPath) {
        return res.status(400).json({ error: 'No path provided' });
    }

    try {
        console.log("Received path:", videoPath);

        // Resolve the full file path
        const filePath = path.join(__dirname, '../../../public/files', videoPath);

        getVideoDurationInSeconds(filePath)
            .then((duration) => {
                console.log("Video duration:", duration);
                res.json({ duration }); // Send the actual duration
            })
            .catch((error) => {
                console.error('Error calculating video duration:', error);
                res.status(500).json({ error: 'Error processing video' });
            });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Error processing video' });
    }
});

// Endpoint to get PDF page count by receiving the file
app.post('/api/pdf-page-count', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const pdfBuffer = req.file.buffer;

    PDFDocument.load(pdfBuffer)
        .then(pdfDoc => {
            const pageCount = pdfDoc.getPageCount();
            res.json({ pageCount });
        })
        .catch(err => {
            res.status(500).json({ error: 'Error processing PDF' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
