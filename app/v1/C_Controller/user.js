const user_model = require("../B_Model/user")
const log_general = require("../E_Log/log_general")
const log_register = require("../E_Log/log_register")
const log_login = require("../E_Log/log_login")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const nodemailer = require("nodemailer")
const userRoutes = require('../D_Route/user');
const user = require("../B_Model/user")

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
                const date = moment().format("YYYYMMDDHHmmss")

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
            const letterMail = `<div class=""> <div class="aHl"></ > <div id=":pm" tabindex="-1"></div> <div id=":pc" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTgyMTMwMzk3NzYwNjUxMDc3NyJd; 4:WyIjbXNnLWY6MTgyMTMwNDUxMDY1MTc2MDMxNiIsbnVsbCxudWxsLG51bGwsMiwxLFsxLDAsMF0sMjksMTg3LG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwxLG51bGwsbnVsbCxbMywwXSxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwwXQ.."> <div id=":pb" class="a3s aiL msg-8383564264117652028"><u></u> <div style="background-color:#f3f5f7;margin:0!important;padding:0!important"><span class="im"> <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;font-family:'Lato',Helvetica,Arial,sans-serif;max-height:0px;max-width:0px;opacity:0;overflow:hidden"> We're thrilled to have you here! Get ready to dive into your new account. </div> </span> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td bgcolor="#fff" align="center"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px"> <tbody> <tr> <td align="center" valign="top" style="padding:50px 10px 50px 10px"> <a href="#m_-8383564264117652028_"> <img alt="Logo" src="https://ci3.googleusercontent.com/meips/ADKq_NYniSuJ9j0EaJchQQmoO0oy6D0miHrJsERlgFx635_uiAeXbmCiwTeFH5zb5XCCLhb2pp9DE_rcDQ_MhOsVw3HBf511hCw86XTcDw=s0-d-e1-ft#https://backend.minjem.com/assets/img/logos/digis.jpg" width="200px" style="display:block;font-family:'Lato',Helvetica,Arial,sans-serif;color:#ffffff;font-size:18px" border="0" class="CToWUd" data-bit="iit"> </a> </td> </tr> </tbody> </table> </td> </tr> <tr> <td bgcolor="#f4f4f4" align="center" style="padding:0px 10px 0px 10px"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px"> <tbody> <tr> <td bgcolor="#ffffff" align="center" valign="top" style="padding:40px 20px 20px 20px;border-radius:4px 4px 0px 0px;color:#111111;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:48px;font-weight:400;letter-spacing:4px;line-height:48px"> <h1 style="font-size:42px;font-weight:400;margin:0">Hi, SOBAT DIGIS</h1> </td> </tr> </tbody> </table> </td> </tr> <tr> <td bgcolor="#f4f4f4" align="center" style="padding:0px 10px 0px 10px"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px"> <tbody> <tr> <td bgcolor="#ffffff" align="left" style="padding:20px 30px 10px 30px;color:#666666;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:25px"> <p style="margin:0">Mohon masukkan kode verifikasi</p> </td> </tr> <tr> <td bgcolor="#ffffff" align="left"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td bgcolor="#ffffff" align="center" style="padding:20px 30px 60px 30px"> <table border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td align="center" style="border-radius:3px" bgcolor="#0183E9"> <a style="font-size:30px;font-family:Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:2px;border:1px solid #0183e9;display:inline-block"> ` + code + ` </a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td bgcolor="#ffffff" align="left" style="padding:0 30px 10px 20px;color:#666666;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:25px"> <p style="margin:0">Mohon untuk tidak membalas email ini.</p> <p style="margin:0">Terima Kasih atas kepercayaan Anda terhadap layanan kami.</p> </td> </tr> <tr> <td bgcolor="#ffffff" align="left" style="padding:0px 30px 40px 20px;border-radius:0px 0px 4px 4px;color:#666666;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:25px"> <p style="margin:0">Hormat Kami,<br> <b>PT Digital Inti Generasi</b> </p> </td> </tr> </tbody> </table> </td> </tr> <tr> <td bgcolor="#f4f4f4" align="center" style="padding:0px 10px 0px 10px"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px"> <tbody> <tr> <td bgcolor="#f4f4f4" align="left" style="padding:0px 30px 30px 30px;color:#aaaaaa;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;line-height:18px"> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <div class="yj6qo"></div> <div class="adL"> </div> </div> <div class="adL"> </div> </div> </div> <div class="WhmR8e" data-hash="0"></div> </div>`
            const date = moment().format("YYYYMMDDHHmmss")
            // expiredOTP 2 Menit
            const expiredOTP = moment().add(2, 'minutes').format("YYYYMMDDHHmmss")

            let update = false
            const data = { email, letterMail, date, code, update }

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: 587,
                secure: false, // use false for STARTTLS; true for SSL on port 465
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });


            // prepare untuk ngirim email
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: data.email,
                subject: "Kode Verifikasi Registrasi",
                html: data.letterMail // isi dari email
            };

            // send ngirim email
            const info = await transporter.sendMail(mailOptions).then(() => {
                user_model.cek_email_otp(data).then((result => {
                    console.log(result)
                    if (result >= 1) {
                        data.update = true
                    } else {
                        data.update = false
                    }
                    user_model.saveOtpAfterSendCode(data).then(() => {
                        return res.status(200).json({
                            status: true,
                            message: "Sukses mengirim OTP",
                            data: { expiredOTP: expiredOTP },
                        })
                    })
                }))
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Ada kesalahan pada server.....",
                data: {},
            })
        }
    },

    confirmOTP: async (req, res) => {
        try {
            const { email, code } = req.body;
            const date = moment().format("YYYYMMDDHHmmss")
            const expired = 2
            const data = { code, date, email, expired }
            // Validate required fields.
            if (!code || !email) {
                return res.status(400).json({
                    status: true,
                    message: "OTP code harus di isi",
                    data: {},
                })
            }
            // cek db ada otp ini atau tidak
            user_model.checkOTPCode(data).then((result) => {
                console.log(result)
                if (result === true) {
                    return res.status(200).json({
                        status: true,
                        message: "OTP Benar",
                        data: {},
                    })
                } else if (result === "expired") {
                    return res.status(400).json({
                        status: false,
                        message: "OTP kode telah kadaluarsa, silahkan kirim ulang OTP anda",
                        data: {},
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "OTP Tidak Benar",
                        data: {},
                    })
                }

            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Ada kesalahan pada server",
                data: {},
            })
        }
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


            const cekberkas = req.files.images_berkas

            //validasi tipe file dan banyak gambar
            for (let xx = 0; xx < cekberkas.length; xx++) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (!allowedTypes.includes(cekberkas[xx].mimetype)) {
                    return res.status(400).json({
                        status: false,
                        message: "Hanya menerima gambar.",
                        data: {}
                    });
                }
            }

            if (!req.files.images_berkas || cekberkas.length !== 3) {
                return res.status(400).json({
                    status: false,
                    message: "Harus upload 3 gambar.",
                    data: {}
                });
            }




            //     console.log(cekberkas)



            // Simpan data ke database
            const saveResult = await user_model.saveUserData(data)





            let insertId = saveResult.data.insertId





            const berkas = req.files.images_berkas
            console.log(berkas)






            let param = []
            let img_berkas = []

            let path_upload = ""
            path_upload = "./upload_berkas/user/"

            try {
                const datetime = moment().format("YYYYMMDDhhmmss")
                let is_update = false


                for (var xx = 0; xx < berkas.length; xx++) {
                    name_berkas = berkas[xx].name.split("-")
                    format_berkas = berkas[xx].name.split(".")
                    berkas_apk = name_berkas[0]



                    param.push(
                        berkas[xx].mv(
                            path_upload + format_berkas[0] + "_" + insertId + "_" + datetime + "." + format_berkas[1]
                        )
                    )

                    img_berkas.push(format_berkas[0] + "_" + insertId + "_" + datetime + "." + format_berkas[1])
                }

                await Promise.all(param, img_berkas).then(() => {
                    user.insertImages(img_berkas, insertId).then(() => {
                        is_update = true
                        return res.status(200).json({
                            status: true,
                            message: "Registrasi berhasil",
                            data: {},
                        })

                    })
                })






            } catch (error) {
                console.log(error)
                log_register.log("info", "E Upload Foto Ktp dan Foto Selfi Error : " + error)
                return res.json({
                    status: false,
                    message: "Update Foto Ktp dan Foto Selfi gagal",
                    data: data,
                })
            }



        }
        catch (err) {
            log_register.log("error", `Regis Gagal | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : | ${JSON.stringify(err)}`)
            return res.status(500).json({
                status: false,
                message: "Terjadi kesalahan pada server.",
                data: {},
            })
        }
    },
    uploadGambarBerkas: async (req, res) => {

        const berkas = req.files.images_berkas

        let param = []
        let img_berkas = []

        let path_upload = ""
        path_upload = "./upload_berkas/user/"

        try {
            const datetime = moment().format("YYYYMMDDhhmmss")
            let berkas_name = {}
            let is_update = false

            for (var xx = 0; xx < berkas.length; xx++) {
                name_berkas = berkas[xx].name.split("-")
                format_berkas = berkas[xx].name.split(".")
                berkas_apk = name_berkas[0]

                param.push(
                    berkas[xx].mv(
                        path_upload + "test" + "_" + datetime + "_" + format_berkas[0] + "." + format_berkas[1]
                    )
                )

                img_berkas.push("test" + "_" + datetime + "_" + format_berkas[0] + "." + format_berkas[1])

                await Promise.all(param)
                data = img_berkas
            }

            await user.insertImages(data).then((result_update) => {
                is_update = true
            })

            return res.json({
                status: true,
                message: "Update Foto Ktp dan Foto Selfi berhasil",
                // data: data,
            })



            // if (is_update) {
            //     return res.json({
            //         status: true,
            //         message: "Update Foto Ktp dan Foto Selfi berhasil",
            //         data: data,
            //     })
            // } else {
            //     return res.json({
            //         status: false,
            //         message: "Update Foto Ktp dan Foto Selfi gagal",
            //         data: data,
            //     })
            // }


        } catch (error) {
            console.log(error)
            log_register.log("info", "E Upload Foto Ktp dan Foto Selfi Error : " + error)
            return res.json({
                status: false,
                message: "Update Foto Ktp dan Foto Selfi gagal",
                data: data,
            })
        }

    },

    login: async (req, res) => {

        try {
            const data = req.body
            // validasi username dan password
            if (!data.username) {
                return res.status(400).json({
                    status: false,
                    message: "Username wajib diisi",
                    data: {},
                })
            }
            if (!data.sandi) {
                return res.status(400).json({
                    status: false,
                    message: "sandi wajib diisi",
                    data: {},
                })
            }

            // Check user avaiable in database or not
            await user_model.login(data).then((response) => {
                if (response.data === "-") {
                    return res.status(401).json({
                        status: false,
                        message: "Username atau sandi anda salah",
                        data: {},
                    })
                } else {

                    const generateToken = (payload) => {
                        const secretKey = process.env.SECRET_KEY; // Replace with your own secret key
                        const options = {
                            expiresIn: '15m', // Token expiration time
                        };

                        const token = jwt.sign({ payload }, secretKey, options);
                        return token;
                    };

                    const token = generateToken(response.data[0]);

                    if (token) {
                        log_login.log("info", `Get Token | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : OK`)
                        return res.json({
                            status: true,
                            message: "OK",
                            data: token,
                        })
                    } else {
                        log_login.log("error", `Error 500 | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : Koneksi gagal mohon coba lagi`)
                        return res.status(500).json({
                            status: false,
                            message: "Koneksi gagal mohon coba lagi.",
                            data: {},
                        })
                    }

                }



            })


        } catch (err) {
            log_login.log("error", `Login Gagal | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : | ${JSON.stringify(err)}`)
            return res.status(500).json({
                status: false,
                message: "Terjadi kesalahan pada server.",
                data: {},
            })
        }
    }

}
