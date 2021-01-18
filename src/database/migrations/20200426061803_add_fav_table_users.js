
exports.up = function(knex) {
	return knex.schema.table("users", function(table){
		table.string('favoritos');
	})
  
};

exports.down = function(knex) {
  return knex.schema.table("users", function(table){
	  table.dropColumn('favoritos');
  })
};
