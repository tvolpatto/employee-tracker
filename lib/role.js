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

}

module.exports = Role;