USE employee_db;
INSERT INTO department (name)
VALUES  ('IT'),
        ('Sales'),
        ('Accounting'),
        ('Supply'),
        ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES  ('Software Lead', 85000, 1),
        ('Software Developer', 85000, 1),
        ('Software Engineer', 120000, 1),
        ('Sales Lead', 90000, 2),
        ('Sales Rep', 75000, 2), 
        ('Accountant', 100000, 3),
        ('Financial Advisor', 110000, 3),
        ('Logistics Tech', 75000, 4), 
        ('Cargo Rep', 80000, 4),
        ('Project Manager', 100000, 5),
        ('Operations Manager', 90000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Victor', 'Aguilar', 1, null),
('Roberto', 'DSilva', 2, 1),
('Laura', 'Echeverria', 3, 1),
('Victoria', 'Campos', 4, null),
('Juan', 'Victor', 5, 4),
('Carlos', 'Vergaloca', 5, 4),
('Jose', 'Maniagua', 6, 10),
('Mauricio', 'Pena', 7, 10),
('Carmen', 'Green', 8, 11),
('Robert', 'Guill', 9, 11),
('Javier', 'Brizuela', 10, null),
('Ana', 'Vazques', 11, null);