/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload and retrieval
 */

/**
 * @swagger
 * /upload/{folder}:
 *   post:
 *     summary: Upload a file to a specific folder
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *         description: The folder where the file will be uploaded
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       400:
 *         description: No file uploaded or invalid file type
 */

/**
 * @swagger
 * /upload/{folder}/{fileName}:
 *   get:
 *     summary: Retrieve an uploaded file
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *         description: The folder where the file is stored
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */

var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define folder where uploaded files will be stored
const uploadFolder = path.join(process.cwd(), "public", "uploads");
// Create the upload folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}
// Define storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.params.folder; // Folder based on the route parameter
        const folderPath = path.join(uploadFolder, folder);

        // Ensure the folder exists, or create it
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const uniqueName = `${timestamp}${extension}`; // New file name with timestamp
        cb(null, uniqueName);
    },
});

// Initialize multer with the defined storage engine
const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/webp", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.")
            );
        }
        cb(null, true);
    },
});


router.post("/:folder", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.status(200).send({
        message: "File uploaded successfully!",
        fileName: req.file.filename,
        filePath: `/uploads/${req.params.folder}/${req.file.filename}`,
    });
});

// Route to serve the uploaded files
router.get("/:folder/:fileName", (req, res) => {
    const filePath = path.join(
        uploadFolder,
        req.params.folder,
        req.params.fileName
    );
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found.");
    }
});

module.exports = router;
