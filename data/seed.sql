
-- insert int department first;
insert into department (name)
	values ("IT"), 
    ("Corporate"), 
    ("Customer Support"),
    ("Marketing"), 
    ("Human Resources");


insert into role (title, salary, department_id)
	values ("Jr. developer", 60000,1),
     ("Business Analyst",50000, 2), 
     ("Marketing Specialist", 50000, 4), 
     ("HR psychiatrist", 60000, 5);

insert into employee (first_name, last_name, role_id, manager_id)
	values ("Tony","Stark",2,null), 
     ("Peter","Parker", 1, 1),
     ("John","Travolta", 3, null), 
     ("Harley","Quinn", 4, null);