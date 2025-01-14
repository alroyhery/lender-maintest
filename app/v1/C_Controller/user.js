const user_model = require("../B_Model/user")
const log_general = require("../E_Log/log_general")
const log_register = require("../E_Log/log_register")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const nodemailer = require("nodemailer")
const app = express();
const upload = require('../middlewares/multerConfig');
const userRoutes = require('../D_Route/user');

module.exports = {
    firstoken: async (req, res) => {
        try {
            const { passToken } = req.body

            // Validasi token input
            if (!passToken) {
                return res.status(400).json({
                    status: false,
                    message: "Token tidak boleh kosong.",
                    data: {},
                })
            }

            // Verifikasi passToken dengan environment variable
            if (passToken === process.env.passToken) {
                const random = Math.floor(Math.random() * 10000 + 1)
                const date = moment().format("YYYYMMDDhhmmss")

                const gabung = `${random}dumi${date}`

                // Pembuatan JWT
                const token = await jwt.sign({ gabung }, process.env.SECRET_KEY, {
                    expiresIn: "10m",
                })

                if (token) {
                    log_general.log("info", `Get Token | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : OK`)
                    return res.json({
                        status: true,
                        message: "OK",
                        data: token,
                    })
                } else {
                    log_general.log("error", `Error 500 | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : Koneksi gagal mohon coba lagi`)
                    return res.status(500).json({
                        status: false,
                        message: "Koneksi gagal mohon coba lagi.",
                        data: {},
                    })
                }
            } else {
                log_general.log("error", `Error 403 | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : Anda tidak mempunyai Akses`)
                return res.status(403).json({
                    status: false,
                    message: "Anda tidak mempunyai Akses.",
                    data: {},
                })
            }
        } catch (error) {
            // Tangkap error yang terjadi
            log_general.log("error", `Error 500 | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : ${error.message}`)
            return res.status(500).json({
                status: false,
                message: "Terjadi kesalahan pada server.",
                data: {},
            })
        }
    },
    sendOtp: async (req, res) => {
        try {
            const { email } = req.body
            const code = Math.floor(Math.random() * 1000000 + 1)
            const data = { email, code }
            const cek_email_otp = await user_model.cek_email_otp(data)

            if (cek_email_otp.length < 1) {
                const send_otp = await user_model.sendotp(data)
                log_general.log("info", `Get Token | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : ${JSON.stringify(send_otp)}`)
                return res.status(200).json({
                    status: send_otp.status,
                    message: send_otp.message,
                    data: {},
                })
            }
            return res.status(500).json({
                status: false,
                message: "Gagal mengirim OTP",
                data: cek_email_otp.length,
            })
        } catch (err) {
            log_general.log("error", `Error 500 | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : Gagal mengirim OTP`)
            return res.status(500).json({
                status: false,
                message: "Gagal mengirim OTP",
                data: { cek_email_otp },
            })
        }
    },
    uploadGambar: async (req, res) => {
       
        upload.array('images_berkas', 3)(req, res, async (err) => {

            console.log(req.files)
            if (err) {
                console.error("Error occurred:", err);
                return res.status(500).json({
                    status: false,
                    message: `Multersdadas Error: ${err.message}`,
                });
            }

            console.log("Uploaded files:", req.files);
            console.log(req.body)
            console.log(req.files)
            // Check if files were uploaded
            if (!req.files || req.files.length !== 3) {
                return res.status(400).json({
                    status: false,
                    message: "You must upload exactly 3 images.",
                });
            }
             


            console.log("Uploaded files:", req.files);

              // Read uploaded images as binary data
            let img_ktp, img_npwp, img_selfie;

            req.files.forEach(file => {
                try {
                    console.log(`File Fieldname: ${file.fieldname}, Filename: ${file.filename}`);
                    // const imageData = fs.readFileSync(file.path);
                    console.log(req.files[0].filename)

                    const baseName = path.parse(file.originalname).name;

                if (baseName.includes('img_ktp')) {
                    img_ktp = file.filename;
                } else if (baseName.includes('img_npwp')) {
                    img_npwp = file.filename;
                } else if (baseName.includes('img_selfie')) {
                    img_selfie = file.filename;
                }
                } catch (readError) {
                    console.error(`asdasError reading file ${file.fieldname}:`, readError.message);
                }
            });
        
            // const img_ktp = req.files['img_ktp'] ? req.files['img_ktp'][0].path : null;
            // const img_npwp = req.files['img_npwp'] ? req.files['img_npwp'][0].path : null;
            // const img_selfie = req.files['img_selfie'] ? req.files['img_selfie'][0].path : null;
            

            console.log(img_ktp)
            console.log(img_npwp)
            console.log(img_selfie)
            console.log("body", req.body)
            // Validasi input kosong
           
           

                // if (file.originalname === 'img_ktp.png') {
                //     img_ktp = file.name;
                // }

                if (!img_ktp || !img_npwp || !img_selfie) {
                    return res.status(400).json({ status: false, message: "saddAll images (KTP, NPWP, Selfie) must be uploaded." });
                }
                
                console.log("KTP Image Path:", img_ktp);
                console.log("NPWP Image Path:", img_npwp);
                console.log("Selfie Image Path:", img_selfie);

    
                // Check if all images were properly assigned
                if (!img_ktp || !img_npwp || !img_selfie) {
                    return res.status(400).json({
                        status: false,
                        message: "All images (KTP, NPWP, Selfie) must be uploaded.",
                    });
                }
    
              
    
                return res.status(200).json({
                    status: true,
                    message: "Images uploaded successfully."
                });

                res.send("File uploaded successfully!");
            });
            //akhir


            // const latestUser = await user_model.getMostRecentUserId();
            
                    //     if (!latestUser) {
                    //         return cb(new Error('Failed to retrieve user ID'));
                    //     }
            
                    // const id_regis = latestUser.id_regis;

            // const imagedata = { img_ktp, img_selfie, img_npwp, id_regis}
   
            // Simpan data ke database
            // const saveimage = await user_model.insertImages(imagedata)
    },
    regis: async (req, res) => {
        try {
            const { nama_lengkap, username, sandi, npwp, nik, email, no_hp, jenis_kelamin, tgl_lahir } = req.body

            // Validasi input kosong
            if (!nama_lengkap || !username || !sandi || !npwp || !email || !nik || !no_hp || !jenis_kelamin || !tgl_lahir) {
                log_register.log("error", `Form-data error | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : Semua data wajib diisi`)
                return res.status(400).json({
                    status: false,
                    message: "Semua data wajib diisi",
                    data: {},
                })
            }

            // Validasi panjang username dan sandi
            if (username.length < 5 || username.length > 20) {
                return res.status(400).json({
                    status: false,
                    message: "Username harus memiliki panjang antara 5-20 karakter",
                    data: {},
                })
            }

            // Validasi username tidak boleh mengandung spasi
            if (/\s/.test(username)) {
                return res.status(400).json({
                    status: false,
                    message: "Username tidak boleh mengandung spasi",
                    data: {},
                })
            }

            if (sandi.length < 8) {
                return res.status(400).json({
                    status: false,
                    message: "Kata sandi harus memiliki panjang minimal 8 karakter",
                    data: {},
                })
            }

            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: false,
                    message: "Format email tidak valid",
                    data: {},
                })
            }

            // Validasi format nomor HP (hanya angka dan panjang 10-15)
            const phoneRegex = /^\d{10,15}$/
            if (!phoneRegex.test(no_hp)) {
                return res.status(400).json({
                    status: false,
                    message: "Nomor HP harus berupa angka dan memiliki panjang antara 10-15 karakter",
                    data: {},
                })
            }

            // Validasi NIK (panjang harus 16 digit)
            if (!/^[0-9]{16}$/.test(nik)) {
                return res.status(400).json({
                    status: false,
                    message: "NIK harus berupa 16 digit angka",
                    data: {},
                })
            }

            // Validasi NPWP (format angka dengan panjang 15 digit)
            if (!/^[0-9]{15}$/.test(npwp)) {
                return res.status(400).json({
                    status: false,
                    message: "NPWP harus berupa 15 digit angka",
                    data: {},
                })
            }

            // Validasi jenis kelamin (hanya bisa "Laki-laki" atau "Perempuan")
            if (!["Laki-laki", "Perempuan"].includes(jenis_kelamin)) {
                return res.status(400).json({
                    status: false,
                    message: "Jenis kelamin harus berupa 'Laki-laki' atau 'Perempuan'",
                    data: {},
                })
            }

            // Validasi tanggal lahir (format YYYY-MM-DD)
            if (!moment(tgl_lahir, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).json({
                    status: false,
                    message: "Format tanggal lahir tidak valid (gunakan format YYYY-MM-DD)",
                    data: {},
                })
            }

            // Panggil cek_regis untuk memeriksa apakah data sudah ada
            const data = { nama_lengkap, username, sandi, npwp, nik, email, no_hp, jenis_kelamin, tgl_lahir }
            const cek_regis = await user_model.cek_regis(data)

            if (cek_regis.duplicates.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: `Data duplikat ditemukan: ${cek_regis.duplicates.join(", ")}. Gunakan data terbaru`,
                    data: {},
                })
            }

            // Simpan data ke database
            const saveResult = await user_model.saveUserData(data)
            return res.status(200).json({
                status: true,
                message: "Registrasi berhasil",
                data: {},
            })
        } catch (err) {
            log_register.log("error", `Regis Gagal | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : | ${JSON.stringify(err)}`)
            return res.status(500).json({
                status: false,
                message: "Terjadi kesalahan pada server.",
                data: {},
            })
        }
    },
    
}
