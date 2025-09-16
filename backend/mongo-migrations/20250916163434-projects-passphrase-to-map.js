module.exports = {
  async up(db, client) {
    const cursor = db.collection('projects').find({
      encryptedPassphrase: { $exists: true, $ne: null },
    });

    for await (const project of cursor) {
      const encryptedServerPassphrases = {
        [project.owner.toString()]: project.encryptedPassphrase,
      };

      await db.collection('projects').updateOne(
        { _id: project._id },
        {
          $set: { encryptedServerPassphrases },
          $unset: { encryptedPassphrase: '' },
        },
      );
    }
  },

  async down(db, client) {},
};
