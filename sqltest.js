/*
 * TagoIO - Analysis Example
 * Hello World
 *
 * Check out the SDK documentation on: https://js.sdk.tago.io
 *
 * Learn how to send messages to the console located on the TagoIO analysis screen.
 * You can use this principle to show any information during and after development.
*/

const { Analysis } = require("@tago-io/sdk");
const { Connection, Request } = require("tedious");

// The function myAnalysis will run when you execute your analysis
function myAnalysis(context, scope) {
  // This will log "Hello World" at the TagoIO Analysis console
  context.log("Hello World");

  // This will log the context to the TagoIO Analysis console
  context.log("Context:", context);

  // This will log the scope to the TagoIO Analysis console
  context.log("my scope:", scope);

  // Create connection to database
  const config = {
    authentication: {
      options: {
        userName: "sqlsmartuser00", // update me
        password: "Matt00n!23" // update me
      },
      type: "default"
    },
    server: "sql-smart-products-01.database.windows.net", // update me
    options: {
      database: "sqldb-smart-products-01", //update me
      encrypt: true
    }
  };

  const connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
      queryDatabase(connection, context);
    }
  });
}

//module.exports = new Analysis(myAnalysis);

function queryDatabase(connection, context) {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `select * from customer`,
    (err, rowCount) => {
      if (err) {
        context.log(err.message);
      } else {
        context.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      context.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}

// To run analysis on your machine (external)
module.exports = new Analysis(myAnalysis, { token: "5e3264d4-b803-4699-ba16-8261416220c1" });
