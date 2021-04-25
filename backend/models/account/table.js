const db = require('../../dbConnection');

class AccountTable {
    static storeAccount({ email, hash }) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO account("email", "hash") 
                        VALUES($1, $2)`,
                [email, hash],
                (error, response) => {
                    if (error) return reject(error);
                    return resolve({ message: 'create account success.' });
                }
            )
        })
    };

    static getAccount({ email }) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT email, hash FROM account
            WHERE email = $1`,
                [email],
                (error, response) => {
                    if (error) return reject(error);

                    const hash = response.rows[0].hash;
                    return resolve({ hash });
                }
            )
        })
    }
}

module.exports = AccountTable;