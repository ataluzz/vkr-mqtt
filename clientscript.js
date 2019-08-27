    var count = 10;
    var circleGroup = new Group();
    var dest = [];
    var cent = [];
    var topics = [];
    var circle = new Path.Circle({
      center: [0, 0],
      radius: 30,
      strokeColor: 'black'
    });
  var symbol = new Symbol(circle);
  var maxPoint = new Point(440, 440);

  function createObjects() {
  for (var i = 0; i < count; i++) {
      var destination = maxPoint * Point.random();
      dest.push(destination);
      var center = Point.random() * maxPoint;
      cent.push(center);
      var placedSymbol = symbol.place(center);
      circleGroup.addChild(placedSymbol);
      var name = "object" + i.toString();
      topics.push(name);
  }
}

var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.56.102";
var port = 8083;

function onFailure(message) {
  console.log("Connection attempt to host "+host+" Failed");
  setTimeout(MQTTconnect, reconnectTimeout);
}
 

function senddata(a) {
  text = "x = " + circleGroup.children[a].position.x + "; y = " + circleGroup.children[a].position.y;
  message = new Paho.MQTT.Message(text.toString());
  message.destinationName = topics[a];
  mqtt.send(message);
}


function onConnect() {
  console.log("Connected");
  createObjects();
  view.onFrame = function(event) {
   for (i = 0; i < count; i++) {
   var vector = dest[i] - cent[i];
   if (circleGroup.children[i].position.x > 30 && circleGroup.children[i].position.x < 480 && circleGroup.children[i].position.y > 30 && circleGroup.children[i].position.y < 480) {
   circleGroup.children[i].position += vector/500;
   senddata(i);
  } else {
    //circleGroup.children[i].removeOnDrag();
    dest[i] = maxPoint * Point.random();
    vector = dest[i] - maxPoint * Point.random();
    circleGroup.children[i].position += vector/500;
    senddata(i); 
  }
   }
  }
}

function MQTTconnect() {
    console.log("connecting to " + host + " " + port);
    mqtt = new Paho.MQTT.Client(host, port, "clientjs");
  var options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure,
  };
  mqtt.connect(options);
}
  
MQTTconnect();
