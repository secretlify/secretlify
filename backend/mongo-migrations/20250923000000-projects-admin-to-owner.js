module.exports = {
  async up(db) {
    const projects = await db.collection('projects').find({}).toArray();

    for (const project of projects) {
      let ownerId = null;
      for (const [memberId, role] of Object.entries(project.members)) {
        if (role === 'admin') {
          ownerId = memberId;
          break;
        }
      }

      if (ownerId) {
        const newMembers = { ...project.members };
        newMembers[ownerId] = 'owner';

        await db
          .collection('projects')
          .updateOne({ _id: project._id }, { $set: { members: newMembers } });
      }
    }
  },

  async down() {
    // not needed
  },
};
