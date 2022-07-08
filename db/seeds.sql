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
('Victor', 'Aguilar', 1, Null),
('Roberto', 'DSilva', 2, Null),
('Laura', 'Echeverria', 3, Null),
('Victoria', 'Campos', 4, Null),
('Juan', 'Victor', 5, Null),
('Carlos', 'Vergaloca', 5, Null),
('Jose', 'Maniagua', 6, Null),
('Mauricio', 'Pena', 7, Null),
('Carmen', 'Green', 8, Null),
('Robert', 'Guill', 9, Null),
('Javier', 'Brizuela', 10, Null),
('Ana', 'Vazques', 11, Null);