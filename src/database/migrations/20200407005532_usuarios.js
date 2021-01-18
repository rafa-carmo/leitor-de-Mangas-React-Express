
exports.up = function(knex) {
    return knex.schema.createTable("users", function(table){
        table.string('id').primary();
        table.string('nome').notNullable();
        table.json('favoritos')
        table.datetime('ultimo_acesso');
        table.json('mangas');

    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
