var inquirer = require("inquirer");
var table = require("console.table");
var db = require("./lib/database");

function start() {
  db.open().then(() => {
    db.getAllEmployees().then((res, err)=>{
      if(err) throw err;
      console.table(res);
      db.close();
    });

  });
}

start();



function addDepartment(department) {
  db.addNewRegistry("insert into department set ?", department).then((res) =>{
    console.log(res);
  });
}

function addRole(role) {
  db.addNewRegistry("insert into role set ?", role).then((res) =>{
    console.log(res);
  });
}

function addEmployee(employee) {
  db.addNewRegistry("insert into employee set ?", employee).then((res) =>{
    console.log(res);
  });
}

