//-- access to stylesheet within express app
const path = require('path');
//-- Express
const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;


//-- Feeding Express server info it needs to be used

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-- this MUST be above routes
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);


//------------------------------------------------------------------------------
//-- Create Database Connection

// turn on connection to db and server
/* 
    - { force: true } == database connection must sync with the model definitions and
     associations.
    
     - By forcing the sync method to true, we will make the tables re-create if
    there are any association changes.

 */

//-- use xisting tables if exist, start connection to express and SQL
sequelize.sync({ force: false }).then(() => {
//-- Overvwrite existing tables if exist, start connection to express and SQL
// sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://127.0.0.1:${PORT}`));
});
