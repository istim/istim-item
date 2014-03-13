mysql --user="root" --password="" < tests/tables.sql
mysql --user="root" --password="" < tests/rows.sql
mocha tests/test.js --reporter spec --colors --recursive