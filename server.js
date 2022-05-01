const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = require('./config/connection');
const { listenerCount } = require('./config/connection');

const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select an option',
            choices: ['View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role'         
            ]
        }
    ])
    .then ((answers) => {
        const {choices} = answers;

        if(choices === 'View All Departments') {
            viewAllDepartments();
        }

        if(choices === 'View All Roles') {
            viewAllRoles();
        }

        if(choices === 'View All Employees') {
            viewAllEmployees();
        }

        if(choices === 'Add a Department') {
            addADepartment();
        }

        if(choices === 'Add a Role') {
            addARole();
        }

        if(choices === 'Add an Employee') {
            addAnEmployee();
        }

        if(choices === 'Update an Employee Role') {
            updateEmployee();
        }
    });
};

//functions to capture things

//View all departments
const viewAllDepartments = () => {
    const sql = 'SELECT * FROM departments';

    connection.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
};

//View all Roles
const viewAllRoles = () => {
    const sql = `SELECT roles.title, roles.id, departments.department_name AS department_name, roles.salary
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
};

//View all employees
const viewAllEmployees = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
};

//Add a department
const addADepartment = () => {
    inquirer.prompt ([
        {
            name: 'department_name',
            type: 'input',
            message: 'What is the department name?'
        }
    ])
    .then ((answer) => {
        const sql = `INSERT INTO departments(department_name) VALUES(?)`;
        connection.query(sql, answer.department_name, (err, response) => {
            if (err) throw err;
            viewAllDepartments();
        });           
    });
};

//Add a role
const addARole = () => {
    const displayRoles = `SELECT * FROM roles`
    connection.query(displayRoles, (err, results) => {
        if (err) throw err;

        console.table(('List of current Roles:'), results);
        
        inquirer.prompt ([
            {
                name: 'role_title',
                type: 'input',
                message: 'What is the role title?'
            },
            {
                name: 'role_salary',
                type: 'input',
                message: 'What is the salary for the role?'
            },
            {
                name: 'role_department',
                type: 'list',
                choices: [connection.query(`SELECT * FROM departments`, (err, results) =>{ 
                    results.map(function(data){
                        return data.departments_id;
                    })
                })],
                message: 'Select the Department for this new Role'
            }
        ])
        .then ((answer) => {
            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: answer.role_title,
                    salary: answer.role_salary,
                    department_id: answer.role_department
                })   
                if (err) throw err;
                    viewAllRoles();         
        });
    });
};

//Add employee
const addAnEmployee = () => {
    const displayEmployees = `SELECT * FROM employees`
    connection.query(displayEmployees, (err, results) => {
        if (err) throw err;

        console.table(('List of current Employees:'), results);
        
        inquirer.prompt ([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the employees first name?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'what is the employees last name?'
            },
            {
                name: 'role_department',
                type: 'list',
                choices: [connection.query(`SELECT * FROM departments`, (err, results) =>{ 
                    results.map(function(data){
                        return data.departments_id;
                    })
                })],
                message: 'What is the employees role'
            },
            {
                name: 'role_manager',
                type: 'list',
                choices: [connection.query(`SELECT * FROM departments`, (err, results) =>{ 
                    results.map(function(data){
                        return data.departments_id;
                    })
                })],
                message: 'Who is the employees manager?'
            }
        ])
        .then ((answer) => {
            connection.query(
                "INSERT INTO employees SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_department,
                    manager_id: answer.role_manager
                })   
                if (err) throw err;
                    viewAllEmployees();         
        });
    });
};

//Update employee
const updateEmployee = () => {
    const empQuery = `SELECT CONCAT (first_name," ", last_name) AS full_name FROM employees`
    connection.query(empQuery, (err, results)=> {
        if (err) throw err;

        inquirer.prompt ([
            {
                name: 'employee',
                type: 'list',
                choices: function() {
                    let choiceArray = results.map(choice => choice.full_name);
                    return choiceArray;
                },
                message: 'Select an employee to update their role'
            }
        
        ])
        .then (()=>{
            viewAllEmployees();
        });
    })
}


promptUser();