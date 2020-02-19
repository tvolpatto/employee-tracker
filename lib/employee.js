class Employee {

    constructor(id, first_name, last_name, role, manager) {
        this.first_name = first_name;
        this.id = id;
        this.last_name = last_name;
        this.role_id = role;
        this.manager_id = manager;

    }

    getId() {
        return this.id;
    }

    getFirstName() {
        return this.first_name;
    }

    getLastName() {
        return this.last_name;
    }

    getRole() {
        return this.role_id;
    }

    getManager() {
        return this.manager_id;
    }

    static buildQuestions(db, action) {
        return db.selectAllFrom("select id as value, title as name from role order by title").then(roles => {
            return db.selectAllFrom("select id as value, CONCAT(first_name,' ', last_name) as name from employee order by name").then(employees => {
                if (action === "ADD") {
                    return newEmployeeQuestions(roles, employees);
                } else if (action === "UPDATE_ROLE") {
                    return updateRole(roles, employees);
                } else {
                    return updateManager(employees);
                }
            });
        });
    }
}

function updateRole(roles, employees) {
    return [
        {
            type: "list",
            message: "Select the employee to update:",
            name: "id",
            choices: employees
        },
        {
            type: "list",
            message: "Select the employee's new role:",
            name: "role",
            choices: roles
        }       
    ];
}

function updateManager(employees) {
    return [
        {
            type: "list",
            message: "Select the employee to update:",
            name: "id",
            choices: employees
        },
        {
            type: "list",
            message: "Select the employee's new manager:",
            name: "manager",
            choices: employees
        }       
    ];
}

function newEmployeeQuestions(roles, managers) {
    return [
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
        }
    ];

}

module.exports = Employee;