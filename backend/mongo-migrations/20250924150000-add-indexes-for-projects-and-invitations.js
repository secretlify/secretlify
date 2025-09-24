module.exports = {
  async up(db) {
    await db.collection('projects').createIndex({ 'members.$**': 1 });
    await db.collection('invitations').createIndex({ authorId: 1 });
  },

  async down() {},
};
