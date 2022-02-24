const mysql = require('mysql');
const dotenv = require('dotenv');
const res = require('express/lib/response');
let instance = null;
let index = null;
dotenv.config();
let finalres = null;
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: '',
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {

    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }


    async insertUser(email, password, firstname, lastname) {

        try {
            const insertemail = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users VALUES (?,?,?,?);";

                connection.query(query, [email, password, firstname, lastname], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertemail);
                })
            });
            return {
                email: insertemail,
            };
        } catch (error) {
            console.log(error);
        }
    }

async login(email, password) {
        try {
            const res = await new Promise((resolve, reject) => {
                const query = "SELECT *  FROM users;";
                connection.query(query,[email,password], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowBy(email) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM users WHERE email = ?";
                connection.query(query, [email] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    
    async updateNameById(email,password, firstname, lastname) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE users SET password = ?,firstname = ?,lastname = ? WHERE email = ?";
    
                connection.query(query, [password, firstname, lastname,email] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}

module.exports = DbService;