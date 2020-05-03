// 引入WebSocket模块
var ws = require("nodejs-websocket");
var PORT = 8001;

// on就是addListener，添加一个监听事件调用回调函数
// Scream server example:"hi"->"HI!!!",服务器把字母大写
var server = ws
  .createServer(function(conn) {
    console.log("New connection");
    conn.on("text", function(str) {
      console.log("Received： " + str);
      conn.sendText(str.toUpperCase() + "!!!"); //大写收到的数据
    });
    conn.on("close", function(code, reason) {
      console.log("connection closed");
    });
    conn.on("error", function(err) {
      console.log("handle err");
      console.log(err);
    });
  })
  .listen(PORT);

console.log("websocket server listening on port " + PORT);
