require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGO_URL,
    databaseName: 'test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'mongo-migrations',
  changelogCollectionName: 'migrations',
  lockCollectionName: 'migrations_lock',
  lockTtl: 0,
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
