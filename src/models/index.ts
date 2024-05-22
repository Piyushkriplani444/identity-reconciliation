/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[env];

const db: any = {};
const sequelizeObj: any = {};
const databases = Object.keys(config.databases);

/** Add Databases* */
for (let i = 0; i < databases.length; i += 1) {
    const database = databases[i];
    const dbPath = config.databases[database];
    sequelizeObj[i] = new Sequelize(dbPath.database, dbPath.username, dbPath.password, dbPath);
}

const getAllFiles = (dirPath: any, arrayOfFiles1?: any) => {
    const files = fs.readdirSync(dirPath);

    let arrayOfFiles = arrayOfFiles1 || [];

    files.forEach((file: any) => {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
            arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
};

/** Add the Database Models* */
getAllFiles(`${__dirname}/../../src`)
    .filter((file: any) => file.indexOf('.') !== 0 && file !== basename && file.slice(-9) === '.model.ts')
    .forEach((file: any) => {
        const model = require(file)(sequelizeObj[0], Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelizeObj[0];
db.sequelize1 = sequelizeObj[1];
db.Sequelize = Sequelize;

module.exports = db;
