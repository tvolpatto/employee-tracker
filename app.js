var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "company_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  getAllEmployees();
});

function getAllEmployees() {
    let query = "select e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name,' ', m.last_name) as man_name from employee e"+ 
        " left join role r on r.id=e.role_id left join department d on r.department_id=d.id left join employee m on m.id=e.manager_id";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}