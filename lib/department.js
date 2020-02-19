class Department {

    constructor(id,name) {
        this.id = id;
        this.name = name;      
    }
  
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    static buildQuestions() {
        return {
            type: "input",
            message: "What is the name of the new department?",
            name: "name"
          };
    }

   
}

module.exports = Department;