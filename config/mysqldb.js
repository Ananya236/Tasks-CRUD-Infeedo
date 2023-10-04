import { Sequelize } from 'sequelize';

const databaseName = ''; // 'your_database_name';
const username = ''; // 'your_database_username';
const password = ''; // 'your_database_password';
const host = 'localhost';
const dialect = 'mysql'; 

// Create a new Sequelize instance
const sequelize = new Sequelize(databaseName, username, password, {
  host: host,
  dialect: dialect,
  logging: false, // Set to true to log SQL queries to the console
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
