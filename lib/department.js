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

    static buildQuestions(db, action) {
        if(action === "DELETE") {
            return db.selectAllFrom("select id as value,  name from department order by name").then(departments => {
                return {
                    type: "list",
                    message: "Select one department to delete:",
                    name: "id",
                    choices :  departments
                  };
            });
        }else {
            return {
                type: "input",
                message: "What is the name of the new department?",
                name: "name"
              };

        }
    }

   
}

module.exports = Department;