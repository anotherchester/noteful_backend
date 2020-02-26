const path = require('path')
const express = require('express')
const xss = require('xss')
const foldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folders => ({
  id: folders.id,
  folderName: xss(folders.folderName)
})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    foldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, folderName } = req.body
    const newFolder = { id, folderName }

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
      .then(folders => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${id}`))
          .json(serializeFolder(folders))
      })
      .catch(next)
  })

foldersRouter
  .route('/:folderId')
  .all((req, res, next) => {
    foldersService.getById(
      req.app.get('db'),
      req.params.foldersId
    )
      .then(folders => {
        if (!folders) {
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
      req.params.foldersID
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = foldersRouter



