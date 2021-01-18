
exports.up = function(knex) {
    return knex.schema.table('mangas',function(table) {
        table.string('favorito');
    })
  
};

exports.down = function(knex) {
    return knex.schema.table('mangas', function(table){
        table.dropColumn('favorito')
    })
  
};
