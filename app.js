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
      value: "addEmployee"
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
      addEmployee()
      break;
    case "addRole":
      addRole();
      break;
    case "addDepartment":
      addDepartment();
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
  const question = {
    type: "input",
    message: "What is the name of the new department?",
    name: "name"
  };
  inquirer.prompt(question).then((answer) => {
    var department = new Department(null, answer.name);
    db.addNewRegistry("insert into department set ?", department).then((res) => {
      console.log(res);
      viewDepartments();
    });
  });
}

function addRole() {
  db.selectAllFrom("select * from department order by name").then(departments => {
    const choices = []
    departments.forEach(d => {
      choices.push({
        name: d.name,
        value: d.id
      });
    });

    const questions = [
      {
        type: "input",
        message: "What is the title of the new role?",
        name: "title"
      },
      {
        type: "number",
        message: "How much will be the role salary?",
        name: "salary"
      },
      {
        type: "list",
        message: "Select the new role department:",
        name: "department",
        choices: choices
      }];

    inquirer.prompt(questions).then(answers => {
      const role = new Role(null, answers.title, answers.salary, answers.department);

      db.addNewRegistry("insert into role set ?", role).then((res) => {
        console.log(res);
        viewRoles();
      });
    })
  });

}

function addEmployee() {
  db.selectAllFrom("select id as value, title as name from role order by title").then(roles => {
    db.selectAllFrom("select id as value, CONCAT(first_name,' ', last_name) as name from employee order by name").then(managers => {

      const questions = [
        {
          type: "input",
          message: "What is the employee first name?",
          name: "first_name"
        },
        {
          type: "input",
          message: "What is the employee last name?",
          name: "last_name"
        },
        {
          type: "list",
          message: "Select the new employee's role:",
          name: "role",
          choices: roles
        },
        {
          type: "confirm",
          message: "Do you want to set up a manager?",
          name: "need_manager",
        },
        {
          type: "list",
          message: "Select the new employee's manager:",
          name: "manager",
          choices: managers,
          when: function (answer) {
            if (!answer.need_manager) {
              return null;
            } else {
              return this;
            }
          }
        }];

      inquirer.prompt(questions).then(answers => {
        const employee = new Employee(null, answers.first_name, answers.last_name, answers.role, answers.manager);
    
        db.addNewRegistry("insert into employee set ?", employee).then((res) => {
          console.log(res);
          viewEmployees();
         });
      });
    });
  });

}


start();
