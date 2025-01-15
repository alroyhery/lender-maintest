const sql = require("../A_Config/database")
const log_register = require("../E_Log/log_register")
const moment = require("moment")
const axios = require("axios")

module.exports = {
    cek_regis: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM tbl_regis a
                WHERE (a.username = ? OR a.no_hp = ? OR a.email = ? OR a.npwp = ? OR a.nik = ?) 
                AND a.deleted IS NULL
            `

            sql.query(query, [data.username, data.no_hp, data.email, data.npwp, data.nik], (err, result) => {
                if (err) {
                    log_register.log("error", `Get Data user error | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : ${err.message}`)
                    return reject(err)
                }

                if (result.length > 0) {
                    const duplicateData = {
                        username: result.some((item) => item.username === data.username),
                        no_hp: result.some((item) => item.no_hp === data.no_hp),
                        email: result.some((item) => item.email === data.email),
                        npwp: result.some((item) => item.npwp === data.npwp),
                        nik: result.some((item) => item.nik === data.nik),
                    }

                    const duplicateFields = Object.keys(duplicateData).filter((key) => duplicateData[key])

                    resolve({ duplicates: duplicateFields, data: result })
                } else {
                    const notFoundMessage = "Data tidak ditemukan di database"
                    log_register.log("error", `Get Data user | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : ${notFoundMessage}`)
                    resolve({ duplicates: [], data: [] })
                }
            })
        })
    },
    cek_email_otp: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT COUNT(*) AS total
                FROM tbl_otp_email a
                WHERE a.email = ? AND a.deleted IS NULL
                GROUP BY a.email
            `

            sql.query(query, [data.email], (err, result) => {
                if (err) {
                    log_register.log("error", `Get Data email error | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : ${err.message}`)
                    return reject(err)
                }

                if (result.length > 0) {
                    resolve(result)
                } else {
                    resolve([])
                }
            })
        })
    },
    saveUserData: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tbl_regis 
                (nama_lengkap, username, sandi, npwp, nik, email, no_hp, jenis_kelamin, tgl_lahir) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `

            const values = [data.nama_lengkap, data.username, data.sandi, data.npwp, data.nik, data.email, data.no_hp, data.jenis_kelamin, data.tgl_lahir]

            sql.query(query, values, (err, result) => {
                if (err) {
                    log_register.log("error", `Save Data user error | TIME : ${moment().format("YYYY-MM-DD HH:mm:ss")} | RESULT : ${err.message}`)
                    return reject(err)
                }

                resolve({
                    status: true,
                    message: "Data berhasil disimpan",
                    data: result,
                })
            })
        })
    },
    sendotp: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                email: data.email,
                mail_code: data.code,
            }
            const url = "https://backend.minjem.com/api/verifikasi_email/send_otp"

            axios
                .post(url, params)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getMostRecentUserId: async (callback) => {
        const query = 'SELECT id_regis FROM tbl_regis ORDER BY created_at DESC LIMIT 1';
        sql.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length > 0) {
                return callback(null, results[0].id_regis);  // Return the most recent user ID
            } else {
                return callback(null, null);  // No users found
            }
        });
    },
    
    insertImages: async (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tbl_doc (foto_ktp, foto_selfi, foto_npwp)
                VALUES 
                    ('${data.img[0]}','${data.img[1]}','${data.img[2]}')`;
            
            const values = [data.img[0], data.img[1], data.img[2]];
    
            sql.query(query, values, (err, result) => {
                if (err) {
                    console.error("Error saving image data:", err.message);
                    return reject(err);
                }
    
                resolve(result);  // Return the result of the insert operation
            });
        });
    },
}
