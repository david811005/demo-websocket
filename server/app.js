import express from 'express'
// const wss = require('../modules/ws/wss')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.get('/test', (_req, res) => {
//   console.log(wss)
//   for (let client of wss.getActiveClients()) {
//     client.send('broadcast!')
//   }

//   res.json({ status: 'success' })
// })




module.exports = {
  path: 'api',
  handler: app,
}