import WebSocket from 'ws'
const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', (ws, req) => {
  console.log('Client connected',req)
  // 當收到client消息時
  ws.on('message', data => {
    // 收回來是 Buffer 格式、需轉成字串
    const bufferData = Buffer.from(data).toString();
    const formData = JSON.parse(bufferData);
    ws.channelId = formData.channelId;
    ws.username = formData.username;
    console.log(bufferData) // 可在 terminal 看收到的訊息

    /// 發送消息給client 
    // ws.send(data)

    // 發送給所有client： 
    wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.channelId === ws.channelId
      ) {
        formData.num = wss.clients.size;
        client.send(JSON.stringify(formData));
      }
    });
  })
  // 當連線關閉
  ws.on('close', (data) => {
    const formData = {};
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && ws.username) {
        formData.event = 'out';
        formData.num = wss.clients.size;
        formData.username = ws.username;
        client.send(JSON.stringify(formData));
      }
    });
  });
})

module.exports = {
  handleUpgrade (request, socket, head) {
    // console.log('request, socket, head')
    wss.handleUpgrade(request, socket, head, ws => {
      // console.log('wssssss',ws)
      wss.emit('connection', ws)
    })
  },

  // getActiveClients () {
  //   console.log('getActiveClients')
  //   console.log('socket',wss.clients)
  //   return [...wss.clients].filter(
  //     client => client.readyState === WebSocket.OPEN
  //     )
  // }
}