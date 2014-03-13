mysql -e < tests/tables.sql
mysql -e < tests/rows.sql
mocha tests/test.js --reporter spec --colors --recursive