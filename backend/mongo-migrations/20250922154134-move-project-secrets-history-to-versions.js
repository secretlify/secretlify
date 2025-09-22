const { ObjectId } = require('mongodb');

module.exports = {
  async up(db) {
    const projects = await db
      .collection('projects')
      .find({
        encryptedSecretsHistory: { $exists: true, $not: { $size: 0 } },
      })
      .toArray();

    for (const project of projects) {
      let authorId = null;
      if (project.members) {
        for (const [userId, role] of Object.entries(project.members)) {
          if (role === 'owner') {
            authorId = userId;
            break;
          }
        }

        if (!authorId && Object.keys(project.members).length > 0) {
          authorId = Object.keys(project.members)[0];
        }
      }

      const versions = project.encryptedSecretsHistory.map((encryptedSecret) => ({
        projectId: project._id,
        authorId: authorId ? new ObjectId(authorId) : null,
        encryptedSecrets: encryptedSecret,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      if (versions.length > 0) {
        await db.collection('projectsecretsversions').insertMany(versions);
      }
    }

    await db.collection('projects').updateMany({}, { $unset: { encryptedSecretsHistory: '' } });

    await db.collection('projectsecretsversions').createIndex({ projectId: 1, createdAt: -1 });
  },

  async down(db) {
    // one-way migration
  },
};
