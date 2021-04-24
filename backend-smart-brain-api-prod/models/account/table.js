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

    static updateSessionId({ sessionId, usernameHash }) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE account SET "sessionId"=$1 WHERE "usernameHash" = $2`,
                [sessionId, usernameHash],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            )
        })
    }

    static updateBalance({ accountId, value }) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE account SET "balance"= balance + $1 WHERE "id" = $2`,
                [value, accountId],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            )
        })
    }
}

module.exports = AccountTable;