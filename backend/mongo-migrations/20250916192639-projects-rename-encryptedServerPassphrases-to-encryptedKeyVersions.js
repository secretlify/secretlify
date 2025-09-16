module.exports = {
  async up(db) {
    await db
      .collection('projects')
      .updateMany(
        { encryptedServerPassphrases: { $exists: true } },
        { $rename: { encryptedServerPassphrases: 'encryptedKeyVersions' } },
      );
  },

  async down(db) {},
};
