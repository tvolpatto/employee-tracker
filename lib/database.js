const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "company_db"
  });

let open = () => {
    return new Promise(function (resolve) {
        connection.connect(function (err) {
            if(err) throw err;
            resolve();
        });
    });
}

let close = () => {
    connection.end();
}

let addNewRegistry = (query, obj) => {
    return new Promise(function (resolve, reject) {
        connection.query(query, obj, function (err) {
            if(err) reject(err) ;
            resolve("New register created!");

        });
    });
}

let selectAllFrom = (query) => {
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, res) {
            if(err) reject(err) ;
            resolve(res);
        });
    });
}

let selectWithParams = (query, params) => {
    return new Promise(function (resolve, reject) {
        connection.query(query, params, function (err, res) {
            if(err) reject(err) ;
            resolve(res);
        });
    });
}

let update = (query, newValue) => {
    return new Promise(function (resolve, reject) {
        connection.query(query, newValue, function (err, res) {
            if(err) reject(err) ;
            resolve("Register Updated!");
        });
    });
}

let remove = (query, id) => {
    return new Promise(function (resolve, reject) {
        connection.query(query, {id:id}, function (err, res) {
            if(err) reject(err);
            resolve("Register removed!");
        });
    });
}


exports.open = open;
exports.close = close;
exports.addNewRegistry = addNewRegistry;
exports.selectAllFrom = selectAllFrom;
exports.update = update;
exports.remove = remove;
exports.selectWithParams = selectWithParams;



