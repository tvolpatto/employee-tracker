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


let getAllEmployees = () => {
    return new Promise(function (resolve) {
        const query = "select e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name,' ', m.last_name) as manager from employee e" +
            " left join role r on r.id=e.role_id left join department d on r.department_id=d.id left join employee m on m.id=e.manager_id";

        connection.query(query, function (err, res) {
            if(err) throw err;

            resolve(res);
        });

    });
}

let addNewRegistry = (query, obj) => {
    return new Promise(function (resolve, reject) {
        connection.query(query, obj, function (err) {
            if(err) throw err;
            resolve("New register was added!");

        });
    });
}

exports.open = open;
exports.close = close;
exports.getAllEmployees = getAllEmployees;
exports.addNewRegistry = addNewRegistry;

