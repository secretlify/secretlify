module.exports = {
  async up(db) {
    await db.collection('githubintegrations').createIndex({ cryptlyProjectId: 1 });
    await db
      .collection('githubintegrations')
      .createIndex({ githubRepositoryId: 1 }, { unique: true });
  },

  async down() {},
};
