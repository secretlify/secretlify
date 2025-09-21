module.exports = {
  async up(db) {
    const projects = await db.collection('projects').find({}).toArray();

    for (const project of projects) {
      const newMembers = {};

      if (project.owner) {
        newMembers[project.owner.toString()] = 'owner';
      }

      if (Array.isArray(project.members)) {
        for (const memberId of project.members) {
          const memberIdStr = memberId.toString();
          if (!newMembers[memberIdStr]) {
            newMembers[memberIdStr] = 'member';
          }
        }
      }

      await db.collection('projects').updateOne(
        { _id: project._id },
        {
          $set: { members: newMembers },
          $unset: { owner: '' },
        },
      );
    }
  },

  async down(db) {},
};
