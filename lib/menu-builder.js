var inquirer = require("inquirer");

const  menuOptions = () => {
  const questionChoices = [
    new inquirer.Separator(),
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
    new inquirer.Separator(),
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
    new inquirer.Separator(),
    {
      name: "Update an employee role.",
      value: "updateEmployeeRole"
    },
    {
      name: "Update an employee manager.",
      value: "updateEmployeeManager"
    },
    new inquirer.Separator(),
    {
      name: "Delete department.",
      value: "delDepartment"
    },
    {
      name: "Delete role.",
      value: "delRole"
    },
    {
      name: "Delete employee.",
      value: "delEmployee"
    },
    new inquirer.Separator(),
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
};

exports.menuOptions = menuOptions;
