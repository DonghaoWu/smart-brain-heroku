const db = require('../../dbConnection');

class AccountInfoTable {
    static storeAccountInfo({ email, name, joined }) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO accountInfo("email", "name", joined) 
                        VALUES($1, $2, $3) RETURNING *`,
                [email, name, joined],
                (error, response) => {
                    if (error) return reject(error);
                    return resolve({ accountInfo: response.rows[0] })
                }
            )
        })
    };
}

module.exports = AccountInfoTable;