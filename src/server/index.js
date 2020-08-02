import '@babel/polyfill'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import express from 'express'
import bodyParser from 'body-parser'
import { StaticRouter } from 'react-router'

import App from '../client/App'

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(express.static('build/public'))

app.get('*', (req, res) => {
  const title = 'Hacker News'

  const context = {}

  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>,
  )

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta content="IE=edge" http-equiv="X-UA-Compatible">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <title>${title}</title>
        </head>
        <body>
            <div id="root">${markup}</div>
            <script src="client_bundle.js"></script>
        </body>
        </html>`

  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
