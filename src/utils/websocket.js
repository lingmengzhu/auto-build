if (window.WebSocket) {
  var ws = new WebSocket("ws://192.168.1.149:8009");

  ws.onopen = function () {
    ws.send("conn success");
  };
  ws.onclose = function () {
    console.log("服务器关闭");
  };
  ws.onerror = function () {
    console.log("连接出错");
  };

  ws.onmessage = function (e) {
    console.log("e", e);
    let value = document.getElementById("textarea").value;
    document.getElementById("textarea").value = value + e.data;
  };
}
