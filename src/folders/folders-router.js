const path = require('path')
const express = require('express')
const xss = require('xss')
const foldersService = require('./folders-service.js')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name)
})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    foldersService.getAllFolders(knexInstance)
      .then(folder => {
        res.json(folder.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, folderName } = req.body
    const newFolder = { id, folder_name }

    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    foldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${id}`))
          .json(serializeFolder(folder))
      })
      .catch(next)
  })

foldersRouter
  .route('/:folderId')
  .all((req, res, next) => {
    foldersService.getById(
      req.app.get('db'),
      req.params.folderId
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder))
  })
  .delete((req, res, next) => {
    foldersService.deleteFolder(
      req.app.get('db'),
      req.params.folderID
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = foldersRouter



