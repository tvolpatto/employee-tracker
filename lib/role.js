class Role {

    constructor(id, title, salary, department) {
        this.title = title;
        this.id = id;
        this.salary = salary;
        this.department = department;
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

    getDeparment() {
        return this.department;
    }

}

module.exports = Role;