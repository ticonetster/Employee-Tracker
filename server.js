const db = require('./config/db_connect');
const inquirer = require('inquirer'); 
const chalk = require('chalk');
const validate = require('./utils/validate');

db.connect((error) => {
  if(error) throw error;
  console.log("**Employee Tracker**");
  promptUser();
});
const promptUser = () => {
  inquirer.prompt([
    {
      name: "options",
      type: "list",
      message: "Select one of the following options:",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "View employees by manager",
        "View employees by department",
        "View total utilized budget per department",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee role",
        "Update employee manager",
        "Delete employee",
        "Delete department",
        "Delete role",
        "Quit"
      ]
    }
  ]).then((answers) => {
    const { options } = answers;
    switch(options){
      case "View all departments":
        viewAllDepts();
        break;
      case "View all roles":
        viewAllRoles();
        break;
      case "View all employees":
        viewAllEmps();
        break;
      case "View employees by manager":
        viewEmpByMng();
        break;
      case "View employees by department":
        viewEmpByDept();
        break;
      case "View total utilized budget per department":
        viewTotalBudDept();
        break;
      case "Add a department":
        addDept();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmpl();
        break;
      case "Update employee role":
        updtEmpRole();
        break;
      case "Update employee manager":
        updtEmpMan();
        break;
      case "Delete employee":
        delEmp();
        break;
      case "Delete department":
        delDep();
        break;
      case "Delete role":
        delRole();
        break;
      case "Quit":
        console.log("exiting...");
        db.end();
        process.exit(0);
    } 
  });
};

//View all employees
const viewAllEmps = () => {
  const sqlEmployee = `SELECT * FROM employee`;
  db.promise().query(sqlEmployee).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
}

//View all departments
const viewAllDepts = () => {
  const sqlDept = `SELECT * FROM department`;
  db.promise().query(sqlDept).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
}

//View all roles
const viewAllRoles = () => {
  const sqlRole = `SELECT * FROM role`;
  db.promise().query(sqlRole).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
}

//View employee order by manager
const viewEmpByMng = () => {
  const sqlviewByMng = 
  `SELECT 
  e.id 'ID', concat(e.first_name, ' ', e.last_name) 'Employee',
  m.id 'Manager ID', concat(m.first_name, ' ', m.last_name) 'Manager'
  FROM employee e
  LEFT JOIN employee m
  ON (e.manager_id = m.id)
  ORDER BY m.id
  `;
  db.promise().query(sqlviewByMng).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
}

//View employee order by department
const viewEmpByDept = () => {
  const sqlviewByDept = 
  `SELECT employee.first_name AS 'First Name', 
  employee.last_name AS 'Last Name', 
  department.name AS Department 
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id
  ORDER BY department.id
  `;
  db.promise().query(sqlviewByDept).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
}

//View department by budget
const viewTotalBudDept = () => {
  const sqlviewByDeptByBud = 
  `SELECT department_id AS 'Department ID', 
  department.name AS Department,
  SUM(salary) AS Budget
  FROM  role  
  INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id
  ORDER BY department_id
  `;
  db.promise().query(sqlviewByDeptByBud).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
}

// Add a new employee
const addEmpl = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'fistName',
    message: "What is the employee's first name?",
    validate: validate.validateString
  },
  {
    type: 'input',
    name: 'lastName',
    message: "What is the employee's last name?",
    validate: validate.validateString
  }]).then(answer => {
    const newEmp = [answer.fistName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    db.promise().query(roleSql).then(([rows]) => {
      const roles = rows.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([{
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: roles
      }]).then(roleChoice => {
        const role = roleChoice.role;
        newEmp.push(role);
        const managerSql =  `SELECT * FROM employee`;
        db.promise().query(managerSql).then(([rows]) => {
          const managers = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: "Who is the employee's manager?",
              choices: managers
            }
          ]).then(managerChoice => {
            const manager = managerChoice.manager;
            newEmp.push(manager);
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            db.promise().query(sql, newEmp).then(() => {
              console.log(chalk.greenBright("Employee has been added!"));
              viewAllEmps();
            }).catch(err => {
              console.log(err);
            });
          });
        });
      });
    });
  });
};

// Add a role
const addRole = () => {
  const sql = 'SELECT * FROM department'
  db.promise().query(sql).then(([rows]) => {
    const depts = rows.map(({ id, name }) => ({ name: name, value: id }));
    console.log(rows);
    console.log(depts);
    inquirer.prompt([{
      name: 'departmentName',
      type: 'list',
      message: 'Which department is this new role in?',
      choices: depts
    }]).then((answer) => {
      const newRoleInfo = [answer.departmentName];
      inquirer.prompt([{
        name: 'newRole',
        type: 'input',
        message: 'What is the name of your new role?',
        validate: validate.validateString
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of this new role?',
        validate: validate.validateSalary
      }]).then((answer) => {
        var roleName = answer.newRole;
        var roleSalary = answer.salary;
        newRoleInfo.push(roleName, roleSalary);
        const sql =   `INSERT INTO role (department_id, title, salary) VALUES (?, ?, ?)`;
        db.promise().query(sql, newRoleInfo).then(() => {
          console.log(chalk.greenBright(roleName + `Role successfully created!`));
          viewAllRoles();
        }).catch(err => {
          console.log(err);
        });
      });
    });
  });
};

// Add a department
const addDept = () => {
  inquirer.prompt([{
    name: 'newDepartment',
    type: 'input',
    message: 'What is the name of your new Department?',
    validate: validate.validateString
  }]).then((answer) => {
    const sql = `INSERT INTO department (department.name) VALUES (?)`;
    db.promise().query(sql, answer.newDepartment).then(()=> {
      console.log(chalk.greenBright(`${answer.newDepartment} Department successfully created!`));
      viewAllDepts();
    }).catch(err => {
      console.log(err);
    });
  });
};

// Update an Employee's Role
const updtEmpRole = () => {
  const sql = `SELECT * FROM employee`;
  db.promise().query(sql).then(([rows]) => {
    let employeeNamesArray = [];
    rows.forEach((employee) => {employeeNamesArray.push(`${employee.id} ${employee.first_name} ${employee.last_name}`);});
    inquirer.prompt([{
      name: 'chosenEmployee',
      type: 'list',
      message: 'Which employee has a new role?',
      choices: employeeNamesArray
    }]).then((answer) => {
      const chosenEmp = answer.chosenEmployee.split(" ");
      //console.log(chosenEmp[0]);
      const sql = `SELECT * FROM role`;
      db.promise().query(sql).then(([rows]) => {
        let rolesArray = [];
        rows.forEach((role) => {rolesArray.push(`${role.id} ${role.title}`);});
        inquirer.prompt([{
          name: 'chosenRole',
          type: 'list',
          message: 'What is their new role?',
          choices: rolesArray
        }]).then((answer) => {
          const chosenRole = answer.chosenRole.split(" ");
          //console.log(chosenRole[0]);
          const sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          db.promise().query(sqls, [chosenRole[0], chosenEmp[0]]).then(()=> {
            console.log(chalk.greenBright(`Employee Role Updated`));
            viewAllEmps();
          }).catch(err => {
            console.log(err);
          });
        });
      });
    });
  });
};

//Function to Update Employee Manager
const updtEmpMan = () => {
  const sqlEmployee = `SELECT * FROM employee`;
  db.promise().query(sqlEmployee).then(([rows]) => {
    const employees = [];
    rows.forEach((employee) => {
      employees.push(`${employee.id} ${employee.first_name} ${employee.last_name}`);
    });
    inquirer.prompt([{
      type: "list",
      name: "employee",
      message: "Select an employee to update:",
      choices: employees
    },
    {
      type: "list",
      name: "manager",
      message: "Select the manager:",
      choices: employees
    }]).then((selected) => {
      const employeeInfo = selected.employee;
      const managerInfo = selected.manager;
      const employeeId = employeeInfo.split(" ");
      const managerId = managerInfo.split(" ");
      const sqlUpdate = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`
      db.promise().query(sqlUpdate, [managerId[0], employeeId[0]]);
      viewAllEmps();
    }).catch((error) => {
      if (error.isTtyError) {
        console.log("Couldn't be rendered in the current environment");
      }else {
        console.log("Something else went wrong");
      }
    });
  });
};

// Delete employee
const delEmp = () => {
  const sqlEmployee = `SELECT * FROM employee`;
  db.promise().query(sqlEmployee).then(([rows]) => {
    const employees = [];
    rows.forEach((employee) => {
      employees.push(`${employee.id} ${employee.first_name} ${employee.last_name}`);
    });
    inquirer.prompt([{
      type: "list",
      name: "employee",
      message: "Select the employee you would like to remove:",
      choices: employees
    }]).then(choice => {
      const chosenEmp = choice.employee.split(" ");
      const sql = `DELETE FROM employee WHERE employee.id = ?`;
      db.promise().query(sql, chosenEmp[0]).then(() => {
        console.log(chalk.greenBright(`Employee (${chosenEmp[1]} ${chosenEmp[2]}) has been deleted!`));
        viewAllEmps();
      }).catch(err => {
        console.log(err);
      });
    });
  });
};

// Delete department
const delDep = () => {
  const sqlDept = `SELECT * FROM department`;
  db.promise().query(sqlDept).then(([rows]) => {
    const departments = [];
    rows.forEach((department) => {
      departments.push(`${department.id} ${department.name}`);
    });
    inquirer.prompt([{
      type: "list",
      name: "department",
      message: "Select the department you would like to remove:",
      choices: departments
    }]).then(choice => {
      const chosenDept = choice.department.split(" ");
      const sql = `DELETE FROM department WHERE department.id = ?`;
      db.promise().query(sql, chosenDept[0]).then(() => {
        console.log(chalk.greenBright(`${chosenDept[1]} Department has been deleted!`));
        viewAllDepts();
      }).catch(err => {
        console.log(err);
      });
    });
  });
};

// Delete role
const delRole = () => {
  const sqlRole = `SELECT * FROM role`;
  db.promise().query(sqlRole).then(([rows]) => {
    const roles = [];
    rows.forEach((role) => {
      roles.push(`${role.id} ${role.title}`);
    });
    inquirer.prompt([{
      type: "list",
      name: "role",
      message: "Select the role you would like to remove:",
      choices: roles
    }]).then(choice => {
      const chosenRole = choice.role.split(" ");
      const sql = `DELETE FROM role WHERE role.id = ?`;
      db.promise().query(sql, chosenRole[0]).then(() => {
        console.log(chalk.greenBright(`${chosenRole[1]} Department has been deleted!`));
        viewAllRoles();
      }).catch(err => {
        console.log(err);
      });
    });
  });
};