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

promptUser();