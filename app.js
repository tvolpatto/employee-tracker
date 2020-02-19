var inquirer = require("inquirer");
var table = require("console.table");
var db = require("./lib/database");
const Department = require("./lib/department");
const Role = require("./lib/role");
const Employee = require("./lib/employee");

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
      name: "View all employees.",
      value: "viewEmployee"
    },
    {
      name: "View all departments.",
      value: "viewDepartment"
    },
    {
      name: "View all all roles.",
      value: "viewRole"
    },
    {
      name: "Add a new department.",
      value: "addDepartment"
    },
    {
      name: "Add a new role.",
      value: "addRole"
    },
    {
      name: "Add a new employee.",
      value: "addEmployee"
    },
    {
      name: "Update an employee role.",
      value: "updateEmployeeRole"
    },
    {
      name: "Update an employee manager.",
      value: "updateEmployeeManager"
    },
    {
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
      addEmployee()
      break;
    case "addRole":
      addRole();
      break;
    case "addDepartment":
      addDepartment();
      break;
    case "updateEmployeeRole":
      updateEmployeeRole();
      break
    case "updateEmployeeManager":
      updateEmployeeManager();
      break
    case "exit":
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
  const query = "select r.id, r.title, r.salary, d.name as department from role r left join department d on d.id=r.department_id;";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.table(res);

    promptUser();
  });
}

function addDepartment() {
  inquirer.prompt(Department.buildQuestions()).then((answer) => {
    var department = new Department(null, answer.name);
    db.addNewRegistry("insert into department set ?", department).then((res) => {
      console.log(res);
      viewDepartments();
    });
  });
}

function addRole() {
  Role.buildQuestions(db).then(questions => {
    inquirer.prompt(questions).then(answers => {
      const role = new Role(null, answers.title, answers.salary, answers.department);

      db.addNewRegistry("insert into role set ?", role).then((res) => {
        console.log(res);
        viewRoles();
      });
    });
  });
}

function addEmployee() {
  Employee.buildQuestions(db, "ADD").then(questions => {
    inquirer.prompt(questions).then(answers => {
      const employee = new Employee(null, answers.first_name, answers.last_name, answers.role, answers.manager);

      db.addNewRegistry("insert into employee set ?", employee).then((res) => {
        console.log(res);
        viewEmployees();
      });
    });
  });
}

function updateEmployeeRole() {
  Employee.buildQuestions(db, "UPDATE_ROLE").then(questions => {
    inquirer.prompt(questions).then(answers => {
      const data = [{ role_id: answers.role }, { id: answers.id }];

      db.update("update employee set ? where ?", data).then((res) => {
        console.log(res);
        viewEmployees();
      });
    });
  });
}

function updateEmployeeManager() {
  Employee.buildQuestions(db, "UPDATE_MANAGER").then(questions => {
    inquirer.prompt(questions).then(answers => {
      if (answers.manager == answers.id) {
        answers.manager = null;
      }
      const data = [{ manager_id: answers.manager }, { id: answers.id }];

      db.update("update employee set ? where ?", data).then((res) => {
        console.log(res);
        viewEmployees();
      });
    });
  });
}

start();
