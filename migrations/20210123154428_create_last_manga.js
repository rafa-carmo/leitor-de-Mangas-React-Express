
exports.up = function(knex) {
    return knex.schema.createTable('last_mangas', table => {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.string('chapter').notNullable();
        table.datetime('created').notNullable();
        table.integer('mangaId').references('id').inTable('mangas').onDelete("CASCADE").notNull()
    })
  
}

exports.down = function(knex) {
  return knex.schema.dropTable('last_mangas')
};
