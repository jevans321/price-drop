
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('prices').del()
    .then(() => {
      return knex('prices').insert({
        model_id: 2,
        price: '$1500.00',
        date: new Date()
      });
    })
    .then(() => {
      return knex('prices').insert({
        model_id: 2,
        price: '$2500.00',
        date: new Date()
      });
    })
    .then(() => {
      return knex('prices').insert({
        model_id: 3,
        price: '$500.00',
        date: new Date()
      });
    })
};
