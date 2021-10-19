require('dotenv').config()
const express = require('express')
const controllers = require('./controllers')

const PORT = 3001
require('express')()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static('public'))
  .post('/text-tagging', controllers.sendWithTextTags)
  .post('/embedded-signing', controllers.embeddedSigning)
  .get('*', controllers.handleCatchAll)
  .post('*', controllers.handleCatchAll)
  .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))