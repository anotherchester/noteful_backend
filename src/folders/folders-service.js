
const foldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders')
  },


insertFolder(knex, newFolder) {
  return knex.insert(newFolder)
  .into('folders')
  .returning('*')
  .then(rows => {
    return rows[0]
  })
},

getByID(knex,id) {
 return knex
  .from('folders')
  .select('*')
  .where('id', id)
  .first() 
},

deleteFolder(knex, id) {
  return knex('folders')
    .where({id})
    .delete
}
}

module.exports = foldersService

