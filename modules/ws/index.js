const wss = require('./wss')

export default function () {
  this.nuxt.hook('listen', server => {
    server.on('upgrade', wss.handleUpgrade)
  })
}