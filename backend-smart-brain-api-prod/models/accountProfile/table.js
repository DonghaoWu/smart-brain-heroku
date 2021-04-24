const db = require('../../dbConnection');

class AccountProfileTable {
    static storeAccountProfile({ email, name, joined }) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO accountProfile("email", "name", joined) 
                        VALUES($1, $2, $3) RETURNING *`,
                [email, name, joined],
                (error, response) => {
                    if (error) return reject(error);
                    return resolve({ accountProfile: response.rows[0] });
                }
            )
        })
    };

    static getAccountProfileById({ id }) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM accountProfile WHERE id = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    return resolve({ accountProfile: response.rows[0] });
                }
            )
        })
    };

    static getAccountProfileByEmail({ email }) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM accountProfile WHERE email = $1`,
                [email],
                (error, response) => {
                    if (error) return reject(error);
                    return resolve({ accountProfile: response.rows[0] });
                }
            )
        })
    };

    static updateAccountProfile({ name, age, pet, id }) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE accountProfile SET name=$1, age=$2, pet=$3 WHERE id = $4`,
                [name, age, pet, id],
                (error, response) => {
                    if (error) return reject(error);
                    return resolve();
                }
            )
        })
    }
}

module.exports = AccountProfileTable;