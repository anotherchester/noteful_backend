const path = require('path')
const express = require('express')
const xss = require('xss')
const notesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  modfied: note.modified,
  folderId: note.folderId,
  content: xss(note.content)
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    notesService.getAllNotes(knexInstance)
      .then(note => {
        res.json(note.map(serializeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folderId } = req.body
    const newNote = { note_name, content, folderId }

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    notesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note))
      })
      .catch(next)
  })

notesRouter
  .route('/:noteId')
  .all((req, res, next) => {
    notesService.getNotesById(
      req.app.get('db'),
      req.params.noteId
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    noteService.deleteNote(
      req.app.get('db'),
      req.params.noteID
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter;
