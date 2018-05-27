
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('models').del()
    .then(() => {
      return knex('models').insert({
        id: 1,
        model: 'FJ9000',
        title: '3D Wide-screen',
        image: null
      });
    })
    .then(() => {
      return knex('models').insert({
        id: 2,
        model: 'XJ9000',
        title: 'Oculous Wide-screen',
        image: null
      });
    })
    .then(() => {
      return knex('models').insert({
        id: 3,
        model: 'ZJ9000',
        title: '4K Wide-screen',
        image: null
      });
    })
};
