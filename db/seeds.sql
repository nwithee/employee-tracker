INSERT INTO departments (department_name)
VALUES
  ('HR'),
  ('Finance'),
  ('Compliance');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Manager', 100000, 2),
  ('Senior', 80000, 1),
  ('Analyst', 60000, 2),
  ('Junior', 40000, 3);


INSERT INTO employees (first_name, last_name, role_id)
VALUES
  ('Jane', 'Smith', 1),
  ('Tim', 'Edwards', 2),
  ('Diane', 'Johnson', 4);
 
  

