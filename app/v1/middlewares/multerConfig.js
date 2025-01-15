const multer = require("multer");
const path = require("path");
const express = require("express");
const app = express();
const user_model = require("../B_Model/user")
const sql = require("../A_Config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload_berkas/user'); // Directory to save uploaded files
    },
    filename: async (req, file, cb) => {
        const latestUser = await user_model.getMostRecentUserId();

            if (!latestUser) {
                return cb(new Error('Failed to retrieve user ID'));
            }

        const id_regis = latestUser.id_regis;
        id_regis = req.id_regis;  // Access id_regis passed from the controller
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed!'), false);
        }
    }
});

module.exports = upload;