console.log('Creating user: ' + process.env.MONGO_DB_USERNAME);
console.log('Creating database: ' + process.env.MONGO_INITDB_DATABASE);
console.log('Creating user with password: ' + process.env.MONGO_DB_PASSWORD);

const appDb = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
appDb.createUser({
    user: process.env.MONGO_DB_USERNAME,
    pwd: process.env.MONGO_DB_PASSWORD,
    roles: [{ role: 'dbOwner', db: process.env.MONGO_INITDB_DATABASE }]
});