mysql < tests/tables.sql
mysql < tests/rows.sql
mocha tests/test.js --reporter spec --colors --recursive