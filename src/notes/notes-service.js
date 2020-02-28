const notesService = {
  getAllNotes(knex) {
    return knex.select('*').from('notes').catch(err => console.log(err))
  },
  getNotesById(knex, id) {
    return knex.select('*')
      .from('notes')
      .where({ id })
      .first()
      .catch(err => console.log(err))
  },
  insertNote(knex, newNote) {
    return knex('notes')
      .insert(newNote)
      .returning('*')
      .then(rows => {
        return rows[0]
      })
      .catch(err => console.log(err))
  },
  deleteNote(knex, id) {
    return knex('notes')
      .where({ id })
      .delete()
      .catch(err => console.log(err))
  },
  updateNote(knex, id, newFields) {
    return knex('notes')
      .where({ id })
      .update(newFields)
      .catch(err => console.log(err))
  }
}

module.exports = notesService;