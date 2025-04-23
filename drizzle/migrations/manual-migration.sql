-- Step 1: Drop the existing foreign key constraint (if it exists)
SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE users DROP FOREIGN KEY users_company_id_companies_id_fk;
SET FOREIGN_KEY_CHECKS = 1;

-- Step 2: Add or modify the company_id column to be nullable
ALTER TABLE users
ADD COLUMN company_id INT DEFAULT NULL,
ADD CONSTRAINT users_company_id_companies_id_fk
FOREIGN KEY (company_id) REFERENCES companies(id)
ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 3: Verify the change
SHOW CREATE TABLE users;