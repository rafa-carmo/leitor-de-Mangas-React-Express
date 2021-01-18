
exports.up = function(knex) {
    return knex.schema.createTable("mangas", function(table){
        table.increments();
        table.string('name').notNullable();
        table.string('outrosTitulos').notNullable();
        table.string('generos').notNullable();
        table.string('autor').notNullable();
        table.string('artista').notNullable();
        table.string('sinopse').notNullable();
        table.string('capitulos').notNullable();
        table.string('totalCapitulos').notNullable();
        table.datetime('ultima_alteracao');
        table.string('status').notNullable();
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('mangas');
};
