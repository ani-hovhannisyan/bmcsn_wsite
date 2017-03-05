//USER DATA RELATED STYLES, CANVASES, STICKERS

var mainUser = function(){
  console.log("Loading Canvas class.");
};

var User = function(cs){
  var _this = this;
  //data contains list of userid: [canvasid: canvasname,..]
  var _canvases = {};
  var cids = cs || [];
  var _existchanges = true;
  var data = {};

  this.setCanvasId = function(id, name){
    for (var i = 0; i < cids.length; i++){
      if (id == cids[i]["id"]){
        cids[i]["name"] = name;
      }
    }
  };

  this.saveUserCanvasList = function(){
    var data = {};
    for (var i = 0; i < cids.length; i++) {
      if (cids[i]["id"] == cci["id"]) {
        cids[i] = cco.getAttr();
      }
    }
    data[(user["name"]).toLowerCase()] = cids;
    //chrome.storage.sync.set(data, function(e){
    //  if (chrome.runtime.error) {
    //    console.log("Fail: Set user data: Runtime error.");
    //  } else {
    //    var msg = "Saved";
    //    notify(msg);
    //    console.log("Success: Save UserData: to storage");
    //  }
    //});
  };

  var pushCanvas = function(c, canvas_object){
    cids.push(c);
    _canvases[c["id"]] = canvas_object;
  };

  this.createCanvasObject = function(push, data, imported){
      cco = null;
      cci = null;
      var c = new Canvas(user["name"], data, imported);
      cco = c;
      cci = c.getAttr();
      if (push) {
        pushCanvas(cci, c);
      }
      $("#c_name").text(cci["name"]);
  };

  var initUserCanvases = function(){
    var c_name = $('<label id="c_name"></label>');
    $("#user_t").append(c_name);
    if (cids.length) {
      //openCanvastabs
      var d = $("<div id='tabs'></div>");
      var ul = $("<ul></ul>");
      for (var i = 0; i < cids.length; i++) {
	ul.append("<li>" + cids[i]["name"] + "</li>");
        if (cci["id"] != cids[i]["id"]) {
          var ouc = $('<option></option>').attr("value", cids[i]["id"])
                                          .text(cids[i]["name"]);
          //canvas_list.append(ouc);
        }
      }
      d.append(ul); ul.tabs();
      $("body").append(ul);
      //openCanvasDialog(true);
    } else {
      _this.createCanvasObject(true, null);
    }
  };

  var openCanvasDialog = function(logging){
    if (! logging && 1 == cids.length) {
      var msg = 'No other canvases. To add new one click to "New" button.';
      notify(msg);
      return;
    }
    var d = $('<div class="dialog" id="d_open"></div>')
            .attr("title", "Choose Canvas");
    var d_list = $('<div class="user_canvas_list" class="alert_dialog"></div>');
    var l_u = $('<label id="l_user_canvases"></label>').text("My Canvases");
    var canvas_list = $('<select id="canvas_list"></select>');
    for (var i = 0; i < cids.length; i++) {
      if (cci["id"] != cids[i]["id"]) {
        var ouc = $('<option></option>').attr("value", cids[i]["id"])
                                        .text(cids[i]["name"]);
        canvas_list.append(ouc);
      }
    }
    d_list.append(l_u).append("<br/>").append(canvas_list);
    d_list.attr("title", "Canvas Settings");
    showUserCanvasList(d_list, logging);
  };

  var exportCurrentCanvas = function(){
    var n = cco.getAttr("name") + ".bmcsn";
    var config = {type: 'saveFile', suggestedName: n};
    var data = JSON.stringify(getData());
    writeToFile(config, data);
  };

  var importOtherCanvas = function(){
    //Calls read from tools //TODO: Change type to .bmcsn
    readFromFile();
  };

  var showUserCanvasList = function(d_list, logging){
    alertDialog(d_list, function(){
      //If opening after logged //Saving the last opened canvas.";
      if (! logging) {
        //_this.saveUserChanges();
        //var msg = "Saved the last changes.";
        //notify(msg);
      }
      var ch = $("#canvas_list").children(":selected");
      var data = {
        "id": ch.val(),
        "name": ch.text()
      };
      for (var i = 0; i < cids.length; ++i){
        if (ch.val() == cids[i]["id"]){
          _this.createCanvasObject(false, cids[i]);
        }
      }
    }, function(){
      return;
    });
  };

  this.saveUserChanges = function(){
    _this.saveUserCanvasList();
    cco.saveCanvasContentToStorage();
    cco.saveCanvasStickersToStorage();
    //TODO: Save user data json to hdd
  };
  
  var initUserToolbar = function(){
    var d_container = $('<div id="d_container"></div>');
    var canvas_t = $('<div id="canvas_t"></div>');
    d_container.append(canvas_t);
    $("body").append(d_container);
    var b_new = $('<button id="b_new" class=attach></button>')
                .attr("title", "Create a new canvas");
    //TODO: Set New tooltip
    canvas_t.append(b_new);
    //
    b_new.bind("click", function(e){
      e.stopPropagation();
      newCanvas();
    });
    //Add open other canvas button
    var b_open = $('<button id="b_open"></button>')
                 .attr("title", "Open other canvas");
    //TODO: Set Open tooltip
    //TODO: Draw before drawn select list of canvas
    canvas_t.append(b_open);
    b_open.bind("click", function(e){
      e.stopPropagation();
      openCanvasDialog(false);
    });
    var b_export = $('<button id="b_export"></button>')
                   .attr("title", "Export current canvas");
    var b_import = $('<button id="b_import"></button>')
                   .attr("title", "Import other canvas");
    canvas_t.append(b_export);
    //TODO: Set export tooltip
    b_export.bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      exportCurrentCanvas();
    });
    canvas_t.append(b_import);
    //TODO: Set import tooltip
    b_import.bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      importOtherCanvas();
    });
  };

  var newCanvas = function(){
    var i = $('<input id="i_new" class="ade" type="text">').css("width", "")
            .css("width", "100px")
            .val("New Canvas");
    var l = $('<label id="l_new" class="ade"></label>')
            .text("Change canvas name");
    var el = $('<div class="alert_dialog"></div>')
             .append(l).append(i);
    //Adds canvas templates list
    var l_s = $('<label id="l_new_ctempl"></label>')
            .text("Choose name from templates.");
    var templates = _this.getCanvasTemplates();
    var s = $('<select id="s_templates" class="ade"></select>')
            .css("width", "100px");
    for (template in templates) {
      var o = $('<option></option>').attr("value", template)
              .text(template);
      s.append(o);
    }
    s.bind("change", function(e){
      var name = ( $(this).children(":selected") ).text();
      $("#l_name").text(name);
      $("#i_new").val(name);
    });
    i.on('input', function(){
      $("#l_name").text( $(this).val() );
    });
    var ln = $('<label id="l_name" class="ade"></label>')
             .css({
               "font-family": "cursive",
               "font-size": "14px",
               "font-weight": "bold",
               })
            .text(i.val());
    el.append("<br/>").append(l_s)
      .append("<br/>").append(s)
      .append("<br/>").append(ln);
    el.attr("title", "New Canvas Properties");
    //Handle changes to elements
    alertDialog(el, function(){
      var name = $("#l_name").text();
      _this.createCanvasObject(true, {"name": name});
    }, function(){
      return;
    });
  };

  this.getThemes = function(){
    var styles = {
        "icons": {"bgcolor": "#fff", "color": "#489595",
                    "brcolor": "#489595", "icon": 1}
      , "light":   {"bgcolor": "#eee", "color": "#306",
                    "brcolor": "#306", "icon": 0}
      , "simple":  {"bgcolor": "#fff", "color": "#000",
                    "brcolor": "#000", "icon": 0}
    };
    return styles;
  };

  this.getCanvasTemplates = function(){
    var t = {
        "New Canvas": ""
      , "High tech": ""
      , "Aerospace": ""
      , "Education": ""
      , "Oil & Gas": ""
      , "Financial service": ""
      , "Pharmaceuticals": ""
      , "Tourism": ""
      , "Marketing agency": ""
      , "Journalism & News": ""
      , "Agriculture": ""
      , "Healtcare": ""
      , "Retail": ""
    };
    return t;
  };

  this.getCids = function(){
    return cids;
  };

  var getData = function(){
    //TODO: export all data of user
    //var s = {}
    //for(var i = 0; i < cids.length; ++i){ 
    ////no need for if only one canvas saves
    //s.push(d.getCanvasData());
    //}
    var data = cco.getAttr();
    data["v"] = "0.5";
    data["sids"] = cco.getCanvasData();
    return data;
  };

  initUserToolbar();
  initUserCanvases();
};

mainUser();
