const path = require('path')
const express = require('express')
const xss = require('xss')
const notesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  noteName: xss(note.noteName),
  modfied: note.modified,
  folderId: note.folderId,
  content: xss(note.content)
})

