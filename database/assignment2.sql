-- 1. The Tony Stark insert SQL statement works.
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update, Tony Stark update SQL statement works.
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. The delete Tony Stark SQL statement works.
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4.The description update SQL statement works.
UPDATE inventory
SET inv_description = REPLACE(inv_description,'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. The select query using a JOIN SQL statement works.
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update image path in inv_image column
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/');

--Update thumbnail path in inv_thumbnail column
UPDATE inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


