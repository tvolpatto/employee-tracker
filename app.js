var inquirer = require("inquirer");
var table = require("console.table");
var db = require("./lib/database");

function start() {
  db.open().then(() => {
    viewEmployees();
  });
}

function promptUser() {
  inquirer.prompt(getQuestions()).then((answer) => {
    setNextAction(answer.action);
  });
}

function getQuestions() {
  const questionChoices = [
    {
      key: 1,
      name: "View all employees.",
      value: "viewEmployee"
    },
    {
      key: 2,
      name: "View all departments.",
      value: "viewDepartment"
    },
    {
      key: 3,
      name: "View all all roles.",
      value: "viewRole"
    },
    {
      key: 4,
      name: "Add a new department.",
      value: "addDepartment"
    },
    {
      key: 5,
      name: "Add a new role.",
      value: "addRole"
    },
    {
      key: 6,
      name: "Add a new employee.",
      value: "addRole"
    },
    {
      key: 7,
      name: "Exit.",
      value: "exit"
    }
  ];

  return [{
    type: "list",
    message: `What would you like to do?`,
    name: "action",
    choices: questionChoices
  }];
}

function setNextAction(action) {

  switch (action) {
    case "viewEmployee":
      viewEmployees();
      break;
    case "viewRole":
      viewRoles()
      break;
    case "viewDepartment":
      viewDepartments();
      break;
    case "addEmployee":
      break;
    case "addRole":
      break;
    case "addDepartment":
      break;
    case "exit" :
      return db.close();

  }
}

function viewEmployees() {
  const query = "select e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name,' ', m.last_name) as manager from employee e" +
  " left join role r on r.id=e.role_id left join department d on r.department_id=d.id left join employee m on m.id=e.manager_id";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.table(res);

    promptUser();
  });
}

function viewDepartments() {
  const query = "select * from department;";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.table(res);

    promptUser();
  });
}

function viewRoles() {
  const query = "select * from role;";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.table(res);

    promptUser();
  });
}


function addDepartment(department) {
  db.addNewRegistry("insert into department set ?", department).then((res) => {
    console.log(res);
  });
}

function addRole(role) {
  db.addNewRegistry("insert into role set ?", role).then((res) => {
    console.log(res);
  });
}

function addEmployee(employee) {
  db.addNewRegistry("insert into employee set ?", employee).then((res) => {
    console.log(res);
  });
}


start();
