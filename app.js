var inquirer = require("inquirer");
var table = require("console.table");
var db = require("./lib/database");
const Department = require("./lib/department");
const Role = require("./lib/role");
const Employee = require("./lib/employee");
const menu = require("./lib/menu-builder");

function start() {
  db.open().then(() => {
    viewEmployees();
  });
}

function promptUser() {
  inquirer.prompt(menu.menuOptions()).then((answer) => {
    setNextAction(answer.action);
  });
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
    case "viewDepartmentBudget":
      viewDepartmentBudget();
      break;
    case "viewEmployeeByManager":
      viewEmployeeByManager();
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
    case "delEmployee":
      deleteEmployee()
      break;
    case "delRole":
      deleteRole();
      break;
    case "delDepartment":
      deleteDepartment();
      break;
    case "exit":
      return db.close();

  }
}

function viewEmployees() {
  const query = "select e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name,' ', m.last_name) as manager from employee e" +
    " left join role r on r.id=e.role_id left join department d on r.department_id=d.id left join employee m on m.id=e.manager_id";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.log("\n --------------------------");
    console.table(res);

  }).catch(err => {
    promptError(err);
  }).finally(promptUser());
}

function viewEmployeeByManager() {
  const query = "select e.id, CONCAT(e.first_name,' ', e.last_name) as employee,  r.title,r.salary from employee e" +
    " left join role r on r.id=e.role_id left join employee m on m.id=e.manager_id where ?";
  Employee.buildQuestions(db, "VIEW_MANAGER").then(questions => {
    inquirer.prompt(questions).then(answer => {
     console.log(answer);
      db.selectWithParams(query, {'e.manager_id': answer.manager_id}).then((res, err) => {
        if (err) throw err;
        console.log("\n --------------------------");
        console.table(res);

      }).catch(err => {
        promptError(err);
      }).finally(promptUser());
    });
  });
}

function viewDepartmentBudget() {
  const query = "select  d.name, sum(r.salary) as total_budget, count(e.id) as number_employees from role r left join department d" +
    " on r.department_id=d.id left join employee e on r.id=e.role_id group by  d.name having count(e.id) >0";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.log("\n Total used budget by department");
    console.table(res);

  }).catch(err => {
    promptError(err);
  }).finally(promptUser());
}

function viewDepartments() {
  const query = "select * from department;";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.log("\n --------------------------");
    console.table(res);

  }).catch(err => {
    promptError(err);
  }).finally(promptUser());
}

function viewRoles() {
  const query = "select r.id, r.title, r.salary, d.name as department from role r left join department d on d.id=r.department_id;";
  db.selectAllFrom(query).then((res, err) => {
    if (err) throw err;
    console.log("\n --------------------------");
    console.table(res);

  }).catch(err => {
    promptError(err);
  }).finally(promptUser());

}

function addDepartment() {
  inquirer.prompt(Department.buildQuestions()).then((answer) => {
    var department = new Department(null, answer.name);
    db.addNewRegistry("insert into department set ?", department).then((res) => {
      console.log(res);

    }).catch(err => {
      promptError(err);
    }).finally(viewDepartments());
  });

}

function addRole() {
  Role.buildQuestions(db).then(questions => {
    inquirer.prompt(questions).then(answers => {
      const role = new Role(null, answers.title, answers.salary, answers.department);

      db.addNewRegistry("insert into role set ?", role).then((res) => {
        console.log(res);
      }).catch(err => {
        promptError(err);
      }).finally(viewRoles());
    });
  });
}

function addEmployee() {
  Employee.buildQuestions(db, "ADD").then(questions => {
    inquirer.prompt(questions).then(answers => {
      const employee = new Employee(null, answers.first_name, answers.last_name, answers.role, answers.manager);

      db.addNewRegistry("insert into employee set ?", employee).then((res) => {
        console.log(res);
      }).catch(err => {
        promptError(err);

      }).finally(viewEmployees());
    });
  });
}

function updateEmployeeRole() {
  Employee.buildQuestions(db, "UPDATE_ROLE").then(questions => {
    inquirer.prompt(questions).then(answers => {
      const data = [{ role_id: answers.role }, { id: answers.id }];

      db.update("update employee set ? where ?", data).then((res) => {
        console.log(res);
      }).catch(err => {
        promptError(err);

      }).finally(viewEmployees());
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
      }).catch(err => {
        promptError(err);

      }).finally(viewEmployees());
    });
  });
}

function deleteEmployee() {
  Employee.buildQuestions(db, "DELETE").then(questions => {
    inquirer.prompt(questions).then(answer => {

      db.remove("delete from  employee where ?", answer.id).then((res) => {
        console.log(res);

      }).catch(err => {
        promptError(err);
      }).finally(viewEmployees());
    });
  });
}

function deleteRole() {
  Role.buildQuestions(db, "DELETE").then(questions => {
    inquirer.prompt(questions).then(answer => {
      db.remove("delete from role where ?", answer.id).then((res) => {
        console.log(res);

      }).catch(err => {
        promptError(err);
      }).finally(viewRoles());
    });
  });
}

function deleteDepartment() {
  Department.buildQuestions(db, "DELETE").then(questions => {
    inquirer.prompt(questions).then(answer => {
      db.remove("delete from department where ?", answer.id).then((res) => {
        console.log(res);
      }).catch(err => {
        promptError(err);
      }).finally(viewDepartments());
    });
  });
}

function promptError(err) {
  console.log("\n------------------------------");
  console.log("ERROR. Reason: " + err.code);
  console.log("------------------------------");
}

start();
