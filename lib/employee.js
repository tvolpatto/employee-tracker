class Employee {

    constructor( id, first_name, last_name, role, manager) {
        this.first_name = first_name;
        this.id = id;
        this.last_name = last_name;
        this.role = role;
        this.manager = manager;

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
        return this.role;
    }

    getManager() {
        return this.manager;
    }

}

module.exports = Employee;