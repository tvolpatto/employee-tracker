class Role {

    constructor(id, title, salary, department) {
        this.title = title;
        this.id = id;
        this.salary = salary;
        this.department_id = department;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getSalary() {
        return this.salary;
    }

    getDepartment() {
        return this.department_id;
    }

    static buildQuestions(db, action) {
        if (action === "DELETE") {
            return db.selectAllFrom("select id as value, title as name from role order by title").then(roles => {
                return {
                    type: "list",
                    message: "Select one role to delete:",
                    name: "id",
                    choices: roles
                };
            });
        } else {
            return db.selectAllFrom("select id as value, name from department order by name").then(departments => {
                return [
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
                        choices: departments
                    }];

            });
        }

    }

}

module.exports = Role;