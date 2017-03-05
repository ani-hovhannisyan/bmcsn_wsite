// Defines User class
// Global scope - need to make secure

//Current logged in user data
var userdata = null;
var existsdialog = false;
var users_list = [];
var user = {"id":"c000", "name": "u000"};
var cci = {};
var cco = null; // Current working canvas object

var main = function(){
  console.log("Loading login page.");
  registerStorageEventHandlers();
  login();
};

var registerStorageEventHandlers = function(){
  $(document).on("storage-login", function(e){
    //chrome.app.window.current().maximize();
    user["name"] = e["name"];
    initUserToolbar(e["name"]);
    if (e["stat"]) {
      var cids = e.items[e["name"]];
      userdata = new User(cids);
    } else {
      userdata = new User();
    }
  });
};

var initUserToolbar = function(u_name){
  //Adding current user specific toolbar - top of stage
  var user_t = $('<div id="user_t"></div>');
  $("body").append(user_t);
  //Adiing user toolbar elements
  var l_user = $('<label id ="l_user"></label>')
               .text(u_name.substr(0, 1))
               .attr("title", "Logged as: " + u_name);
  user_t.append(l_user);
  //TODO: Set hover while isn't enabled edit for user settings
  //l_user.bind('click', function(e){
  //  showDialog({
  //    "title": "User settings",
  //    "text": "Username",
  //    "placeholder": l_user.text(),
  //    "el": $(this)
  //  });
  //});
};

var login = function(){
  var i_login = $("#i_login");
  i_login.focus();
  var b_login = $("#b_login");
  i_login.keyup(function(e){
    if (13 == e.keyCode) {
      loginUserData({"name": i_login.val()});
    }
  });
  b_login.bind('click', function(e){
    loginUserData({"name": i_login.val()});
  });
};

var loginUserData = function(data){
  //TODO: Check then for user authentication
  $("section").remove();
  $("#h_title").remove();
  $("#i_login").remove();
  $("#b_login").remove();
  getUserData(data["name"]);
};

var socket;
function init() {
  var host = "ws://127.0.0.1:6767/server/aniws"; // SET THIS TO YOUR SERVER
  try {
    socket = new WebSocket(host);
    log('WebSocket - status '+socket.readyState);
    socket.onopen    = function(msg) { 
      log("Welcome - status "+this.readyState); 
    };
    socket.onmessage = function(msg) { 
      log("Received: "+msg.data); 
    };
    socket.onclose   = function(msg) { 
      log("Disconnected - status "+this.readyState); 
    };
  } catch(ex){ 
    log(ex); 
  }
  $("msg").focus();
};
function send(){
  var txt,msg;
  txt = $("msg");
  msg = txt.value;
  if(!msg) { 
    alert("Message can not be empty"); 
    return; 
  }
  txt.value="";
  txt.focus();
  try { 
    socket.send(msg); 
    log('Sent: '+msg); 
  } catch(ex) { 
    log(ex); 
  }
};
function quit(){
  if (socket != null) {
    log("Goodbye!");
    socket.close();
    socket=null;
  }
};
function reconnect() {
  quit();
  init();
};
function log(msg){
  console.log(msg)
};
var getUserData = function(name){
	init();
  //var url = document.location.href + 'api/server.php' + '/test';
  //  $.ajax({
  //    type : "GET",
//    url : url,
//    dataType : "json",
//    success : function(data) {
//      alert(data);
//    },
//    error : function(data) {
//      console.log("Error in /nodes", data);
//    }
//  });
  //chrome.storage.sync.get(name.toLowerCase(), function(items){
  //if (chrome.runtime.error) {
  //  console.log("Fail: Get user name: Runtime error.");
  //} else {
  //  var d = {
  //    type: "storage-login",
  //    name: name.toLowerCase(),
  //    stat: false,
  //    items: []
  //  };
  //  $.event.trigger(d);
  // }
  //});
};

var showDialog = function(data, callback){
  var d = $('<div id="d_save"></div>')
          .attr("title", data["title"])
          .text(data["text"]);
  var i = $('<input id="i_name" type="text">')
          .css("display", "block")
          .val(data["placeholder"]);
  d.append(i);
  i.keyup(function(e){
    if (13 == e.keyCode) {
      e.stopPropagation();
      $(this).blur();
    }
  });
  alertDialog(d, function(){
    var t = i.val();
    if (t.length) {
      data["el"].text(t);
      user["name"] = t;
    } else {
      //TODO: alert that can't set user name
    }
  }, function(){
        return;
  });
};

var alertDialog = function(el, callbackOk, callbackClose){
  if (! existsdialog) {
    existsdialog = true;
  } else {
    console.log("Can't show new dialog while other is open");
    return;
  }
  $("body").append(el);
  var text = "";
  el.dialog({
    modal: true,
    buttons: [{
      text: "Ok",
      click: function(e){
        e.stopPropagation();
        if (callbackOk){
          callbackOk();
        }
        existsdialog = false;
        $(this).dialog("close");
      }
    }, {
      text: "Cancel",
      click: function(e){
        e.stopPropagation();
        if (callbackClose){
          callbackClose();
        }
        existsdialog = false;
        $(this).dialog("close");
      }
    }],
    close: function(){
      existsdialog = false;
      $(this).dialog("close");
      $(this).remove();
    }
  });
};

var showDialogWindow = function(el, args, callbackOk, callbackClose){
  //wh is width and height json
  if (! existsdialog) {
    existsdialog = true;
  } else {
    console.log("Can't show new dialog while other is open");
    return;
  }
  $("body").append(el);
  var text = "";
  el.dialog({
    modal: true,
    width: args["w"] || 300,
    height: args["h"] || 300,
    buttons: [{
      text: args["button1"] || "OK",
      click: function(e){
        e.stopPropagation();
        if (callbackOk){
          callbackOk();
        }
        existsdialog = false;
        $(this).dialog("close");
      }
    }, {
      text: args["button2"] || "Cancel",
      click: function(e){
        e.stopPropagation();
        if (callbackClose){
          callbackClose();
        }
        existsdialog = false;
        $(this).dialog("close");
      }
    }],
    close: function(){
      existsdialog = false;
      $(this).dialog("close");
      $(this).remove();
    }
  });
};

var notify = function(msg){
    if ( "block" != $(".notify").css("display") ) {
        $(".notify").text(msg)
            .fadeIn(400).delay(2000).fadeOut(400); //4s
    }
};

//////////// MAIN ENTRY ////////////
main();
