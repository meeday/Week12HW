var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var managers = [];
var departments = [];
var roles = [];




var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_trackerDB"
});


connection.connect(function(err) {
  if (err) throw err;
  start();

});

// function which prompts the user for what action they should take
function start() {

    var query = `select distinct concat(manager.first_name," ",manager.last_name) as name from employee inner join employee manager on employee.manager_id = manager.id`;

    connection.query(query, function(err, res) {
        if (err) throw err;
        
        res.forEach(manager => {
            if(managers.indexOf(manager.name == -1)){
                managers.push(manager.name)
            }
        });

    // });

    var query = `select name from department`;

    connection.query(query, function(err, res) {
        if (err) throw err;
        
        res.forEach(dept => {
            if(departments.indexOf(dept.name == -1)){
                departments.push(dept.name)
            }
        });
        
    // });

    var query = `select title from role`;

    connection.query(query, function(err, res) {
        if (err) throw err;
        
        res.forEach(role => {
            if(roles.indexOf(role.title == -1)){
                roles.push(role.title)
            }
        });
        // console.log(roles);
    // });

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "Add Role", "Update Role", "View All Departments", "Update Deparment", "Add Department","Exit"]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View All Employees":
              viewEmployees();
              break;
      
            case "View All Employees By Department":
              viewEmpsByDep();
              break;
      
            case "View All Employees By Manager":
              viewEmpsByMgr();
              break;
      
            case "Add Employee":
              addEmployee();
              break;

            case "Remove Employee":
              removeEmployee();
              break;

            case "Update Employee Role":
              updateEmpRole();
              break;

            case "Update Employee Manager":
              updateEmpMgr();
              break;

            case "View All Roles":
                viewAllRoles();
                break;

            case "Add Role":
                addRole();
                break;

            case "Update Role":
                updateRole();
                break;

            case "View All Departments":
                viewAllDepts();
                break;
                
            case "Update Deparment":
                updateDepartment();
                break;
                
            case "Add Department":
                addDepartment();
      
            case "Exit":
              connection.end();
              break;
        }
    });
    });
});
    });
    
}


function viewEmployees() {

    var query = `select employee.id as EmployeeID, employee.first_name as "First Name", employee.last_name as "Last Name", 
    role.title as "Job Title",  department.name as Department, role.salary as Salary, concat(manager.first_name," ",manager.last_name) as Manager
    from employee
    left join role on employee.role_id = role.id
    left join department on department.id = role.department_id
    left join employee manager on employee.manager_id = manager.id`;
      connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);    
        // 
        
        start();
      });
}

function viewEmpsByDep() {

    var query = `select name from department`;
    connection.query(query, function(err, res) {
        if (err) throw err;
        var depts = [];
        res.forEach(employee => {
            if(depts.indexOf(employee.name == -1)){
                depts.push(employee.name)
            }
        });
        inquirer
            .prompt({
                name: "dept",
                type: "list",
                message: "Which Department would you like to view?",
                choices: depts
            })
            .then(function(answer) {
                var query = `select employee.id as EmployeeID, employee.first_name as "First Name", employee.last_name as "Last Name", 
                role.title as "Job Title",  department.name as Department, role.salary as Salary, concat(manager.first_name," ",manager.last_name) as Manager
                from employee
                left join role on employee.role_id = role.id
                left join department on department.id = role.department_id
                left join employee manager on employee.manager_id = manager.id where department.name = ?`;
                connection.query(query,answer.dept, function(err, res) {
                    if (err) throw err;
                    console.table(res);    
                    start();
            });
             
      });
    });
      
}

function viewEmpsByMgr() {
    
        inquirer
            .prompt({
                name: "mgr",
                type: "list",
                message: "Which team would you like to view?",
                choices: managers
            })
            .then(function(answer) {
                var query = `select employee.id as EmployeeID, employee.first_name as "First Name", employee.last_name as "Last Name", 
                role.title as "Job Title",  department.name as Department, role.salary as Salary, concat(manager.first_name," ",manager.last_name) as Manager
                from employee
                left join role on employee.role_id = role.id
                left join department on department.id = role.department_id
                left join employee manager on employee.manager_id = manager.id where concat(manager.first_name," ",manager.last_name) = ?`;
                connection.query(query,answer.mgr, function(err, res) {
                    if (err) throw err;
                    console.table(res);    
                    start();
                // console.log(answer.mgr);
            });
             
      });
   
   
}

function addEmployee(){
    inquirer
    .prompt([
      {
        name: "firstName",
        message: "Enter employee's first name: ",
      },
      {
        name:"lastName",
        message:"Enter employee's last name: "
      },
      { 
        name: "manager",
        type: "list",
        message: "Select employee's manager: ",
        choices: ["None", ...managers]
      },
      {
        name: "role",
        type: "list",
        message: "Select employee's role: ",
        choices: roles
      }
    ])
    .then(function(answer) {

        var query = `SELECT id FROM role WHERE title = ?`;
        connection.query(query, [answer.role], function(err, res) {
        if (err) throw err;
          
        var query = `SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?`;
        connection.query(query, answer.manager, function(err, res1) {
        if (err) throw err;
          
    
        
        var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)`;
        connection.query(query, [answer.firstName, answer.lastName,res[0].id,res1[0].id], function(err, res) {
        if (err) throw err;
          
    });
}); 
       
    });
});
}

function removeEmployee(){

}

function updateEmpRole(){
    
}

function updateEmpMgr(){

}

function viewAllRoles(){

}

function addRole(){

}

function updateRole(){

}

function viewAllDepts(){

}

function updateDepartment(){

}

function addDepartment(){

}

function getID(table,col,x){
    var query = `SELECT id FROM ?? WHERE ?? = ?`;
    connection.query(query, [table, col, x], function(err, res) {
        if (err) throw err;
        return res[0].id;  
    });   
}

function getMgrID(mgrName){
    var query = `SELECT id FROM EMPLOYEE WHERE CONCAT(first_name," ",last_name) = ?`;
    connection.query(query, mgrName, function(err, res) {
        if (err) throw err;
        return res[0].id;  
    });

}