const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = require('./config/connection');

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
            updateRole();
        }
    });
};

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


promptUser();