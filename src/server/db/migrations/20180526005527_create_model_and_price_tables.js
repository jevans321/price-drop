exports.up = function(knex, Promise) {
    return knex.schema.createTable('models', function(table) {
      table.increments('id').primary().notNullable();
      table.string('model', 30).notNullable();
      table.string('title', 60).notNullable();
      table.string('image', 30);
    })
    .createTable('prices', function(table) {
      table.increments('id').primary().notNullable();
      table.integer('model_id').unsigned().notNullable().references('models.id');
      table.string('price', 10).notNullable();
      table.integer('flag', 1).notNullable();
      table.dateTime('date').notNullable();
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('prices').dropTable('models');
  };
