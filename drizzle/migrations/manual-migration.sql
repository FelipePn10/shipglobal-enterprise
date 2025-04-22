-- Step 1: Drop the existing foreign key constraint (if it exists)
ALTER TABLE users DROP FOREIGN KEY users_company_id_companies_id_fk;

-- Step 2: Add or modify the company_id column to be nullable
ALTER TABLE users
MODIFY COLUMN company_id INT DEFAULT NULL;

-- Step 3: Add the foreign key constraint
ALTER TABLE users
ADD CONSTRAINT users_company_id_companies_id_fk
FOREIGN KEY (company_id) REFERENCES companies(id)
ON DELETE SET NULL ON UPDATE CASCADE;