module.exports = {
  async up(db) {
    await db.collection('projects').updateMany(
      {
        encryptedSecrets: { $exists: true, $type: 'string' },
      },
      [
        {
          $set: {
            encryptedSecretsHistory: ['$encryptedSecrets'],
          },
        },
        {
          $unset: 'encryptedSecrets',
        },
      ],
    );
  },

  async down() {
    // one-way migration
  },
};
