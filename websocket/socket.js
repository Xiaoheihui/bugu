// 引入WebSocket模块
var ws = require("nodejs-websocket");
var axios = require("axios");
var moment = require("moment");
var PORT = 8001;

let to_json = function (str_text) {
  return JSON.parse(str_text);
}

let to_str = function (json_text) {
  return JSON.stringify(json_text);
}

// 实时聊天人数数组，通过随机数生成
let conns = {};
let message_welcome = {};
let message_member = {};
let message_between = {};
let heart_beat = 9999; //要求每个连接每9999秒心跳一次，否则断线,建议调到50

// on就是addListener，添加一个监听事件调用回调函数
// Scream server example:"hi"->"HI!!!",服务器把字母大写
var server = ws.createServer(function (conn) {
  let uid = ""; // 记录当前用户id
  //计算心跳时间
  conn.heart_time = 0
  let timer = setInterval(() => {
    if (conn.heart_time > heart_beat) {
      clearInterval(timer);
      conn.close()
    }
    conn.heart_time++
  }, 1000);

  conn.on('text', function (str) {
    //重置心跳
    conn.heart_time = 0;

    var data = to_json(str);
    console.log(data);

    switch (data.type) {
      case 'heart':
        message_between = {
          user_id: data.user_id,
          content: "Heart_Beat",
          type: "success"
        };
        conns[data.user_id].sendText(to_str(message_between));
      case 'login':
        uid = data.user_id;
        if (conns.hasOwnProperty(data.user_id)) { // 该用户已登录
          let change = async () => {
            conns[data.user_id].close();
          };
          change().then(() => conns[data.user_id] = conn);
          console.log("已经登录了！！");
          return;
        }
        conns[data.user_id] = conn; //更新在线用户数组
        message_welcome = {
          user_id: data.user_id,
          type: "login"
        }
        //console.log(conns[data.user_id]);
        conn.sendText(to_str(message_welcome));
        console.log(data.user_id);
        console.log("" + data.user_id + ":" + (conns.hasOwnProperty(data.user_id)));
        break;
      case 'logout':
        message_bye = {
          user_id: data.user_id,
          type: "logout"
        };
        //console.log(conns[data.user_id]);
        conn.sendText(to_str(message_bye));
        conns[data.user_id].close();
        break;
      case 'chat':
        let time = moment().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');

        memberlist = data.target_userIdList;

        for (let i = 0; i < memberlist.length; i++) {
          let member_id = memberlist[i];
          //如果群成员在线
          if (conns.hasOwnProperty(member_id) && member_id != data.user_id) {
            //********施工中********
            message_between = {
              user_id: data.user_id,
              session_id: data['session_id'],
              content: data['content'],
              transmit_time: time,
              sender_name: data['sender_name'],
              if_receive: false,
              type: "success"
            };
            console.log("toOthers");
            console.log(to_str(message_between));
            //发送给别人
            conns[member_id].sendText(to_str(message_between));
          }
        }

        //发给自己
        message_between = {
          user_id: data.user_id,
          session_id: data['session_id'],
          content: data['content'],
          transmit_time: time,
          sender_name: data['sender_name'],
          if_receive: false,
          type: "success"
        };

        console.log(conns[data.user_id].readyState);
        conns[data.user_id].sendText(to_str(message_between));

        //更新该会话的最后一条消息时间
        axios.post("https://af8ko6.toutiao15.com/update_last_time", {
          session_id: data['session_id'],
          updatetime: time,
        }).then((res) => {
          if (res.data.state == "0") {
            console.log("最后一条消息时间修改成功");
          } else {
            console.log("最后一条消息时间修改失败");
          }
        });

        //存储聊天记录
        axios.post("https://af8ko6.toutiao15.com/add_char_history", {
          session_id: data['session_id'],
          sender_id: data['user_id'],
          sender_name: data['sender_name'],
          content: data['content'],
          time: time,
        }).then((res) => {
          if (res.data.state == "0") {
            console.log("保存成功");
          } else {
            console.log("保存失败");
          }
        });


        let time_1 = moment().add(1, 's').utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');  //加1s
        axios.post("https://af8ko6.toutiao15.com/update_leave_time", {
          user_id: uid,
          session_id: data['session_id'],
          updatetime: time_1,
        }).then((res) => {
          if (res.data.state == "0") {
            console.log("聊天中-离开时间修改成功");
          } else {
            console.log("聊天中-离开时间修改失败");
          }
        });


default:
  break;
}
})
;

//断开连接的回调
conn.on('close', function () {
  delete conns[uid];
  //删除成员信息
  console.log("close:   " + conns.hasOwnProperty(uid));
});

//处理错误事件信息
conn.on('error', function (err) {
  //异常conn就直接删除
  //conn.close();
  delete conns[uid];
  console.log("异常发生");
  console.log(conns.hasOwnProperty(uid));
});
}).
listen(PORT);

console.log("websocket server listening on port " + PORT);
