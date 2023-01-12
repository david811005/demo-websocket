<template>
  <div id="app">
      <div v-if="isShow" class="login-wrapper">
        <p>
          暱稱 :
          <input v-model="username" type="text" />
        </p>
        <p>
          頻道 :
          <input v-model="channelId" type="text" />
        </p>
        <button @click="logingChat()">進入聊天室</button>
      </div>
      <div v-else class="chat-wrapper">
        <h2>{{channelId }}</h2>
        <div class="channel">
          <div>
            <input v-model="message" class="input-message" type="text" />
            <button type="button" class="send-btn" @click="sendMessage()">
              送出訊息
            </button>
            <ul class="message-wrapper">
              <li v-for="(item, index) in messageList" :key="index + item">
                <span :class="[ item.username === username ? '' : 'user-name']">{{ item.username }}</span> : {{
                item.message }}
              </li>
            </ul>
          </div>
          <div class="user-list">
            <div v-for="(item, index) in userList" :key="index + item">
              <div v-if="item.event === 'login'">
                歡迎 :
                <span class="user-name">{{ item.username }}</span> 進入頻道
              </div>
              <div v-else>
                <span class="user-name">{{ item.username }}</span> 已經離開頻道
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'TestPage',
  data() {
    return {
      list: [],
      message: '',
      ws: {},
      username: '',
      isShow: true,
      onlineNum: '',
      channelId: '一袋米扛幾樓',
      messageList: [],
      userList: [],
    }
  },
  mounted () {
    this.ws = new WebSocket(process.env.wsUrl)
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
    this.ws.onerror = this.onError;
    // this.$axios.get('api/test').then(res=>{
    //   console.log(res)
    // })
    const isFirst = function (callback) {
      console.log('is first!');
      callback.on(); // 執行傳入的 isSecond()
      console.log('is first2')
    }

// callback function
    const isSecond = {
        on:()=>{
            console.log('on')
        }
    }
    isFirst(isSecond)
  },
  methods: {
    onOpen() {
      console.log(`open : ${this.ws.readyState}`);
    },
    onMessage(event) {
      const obj = JSON.parse(event.data);
      this.onlineNum = obj.num;
      if (obj.event === 'message') {
        this.messageList.push(obj);
      } else {
        this.userList.push(obj);
      }
    },
    onClose() {
      console.log(`close : ${this.ws.readyState}`);
    },
    onError() {
      console.log(`error : ${this.ws.readyState}`);
    },
    sendMessage() {
      this.ws.send(
        JSON.stringify({
          event: 'message',
          username: this.username,
          channelId: this.channelId,
          message: this.message,
        })
      );
      this.message = '';
    },
    // 登入
    logingChat() {
      if (this.username.trim() === '') {
        alert('請輸入姓名');
        return;
      }
      this.isShow = false;
      this.ws.send(
        JSON.stringify({
          event: 'login',
          username: this.username,
          channelId: this.channelId,
        })
      );
    },
  },
  
}
</script>

<style>
.channel {
  display: flex;
}

.user-name {
  color: #c37b89;
}

.user-list {
  margin-left: 30px;
  color: #bccc9a;
  font-size: 12px;
}
</style>