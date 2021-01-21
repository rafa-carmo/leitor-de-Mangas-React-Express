
exports.up = function(knex) {
    return knex.schema.createTable("mangas", function(table){
        table.increments('id');
        table.text('name').notNullable();
        table.string('folder');
        table.string('banner');
        table.string('rate');
        table.text('outrosTitulos').notNullable();
        table.json('generos').notNullable();
        table.string('autor').notNullable();
        table.string('artista').notNullable();
        table.text('sinopse').notNullable();
        table.json('capitulos').notNullable();
        table.string('totalCapitulos').notNullable();
        table.datetime('ultima_alteracao');
        table.string('status').notNullable();
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('mangas');
};
