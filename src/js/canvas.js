// Defines Canvas class
//Fast fix for knows BUG of new canvas.
var alreadyRegistered;

var mainCanvas = function(){
  console.log("Loading Canvas class.");
  alreadyRegistered = false;
};

var registerCanvasHandlers = function(){
  alreadyRegistered = true;
  $(document).on("storage-canvas", function(e){
    //Remove after fix: Temporary fix for many trigger bug
    if (cci && ("block" == $("#" + cci["id"]).css("display"))) {
      console.log("BUG: Returning from already exists canvas");
      return;
    }
    cco.drawCanvas();
    if (e["stat"]) {
      cco.setSids(e.items[e["name"]]);
      cco.initCanvasStickers();
    } else {
      console.log("Can't find canvas: " + e["name"]);
      return;
    }
  });

  $(document).on("storage-sticker", function(e){
    if (e["stat"]) {
      var a = e.items[e["name"]];
      //Remove after fix: Temporary fix for many trigger bug
      //Temporary fix for many trigger bug
      if (a && ("block" == $("#" + a["id"]).css("display"))) {
        console.log("BUG: Retruning from already exists sticker");
        return;
      }
      var s = new Sticker(cco.getAttr()["id"], a);
      //_stickers[ a["id"] ] = s;
      cco.pushSticker(s.getId(), s); // pushes sticker objects
      cco.setSelected(s.getId()["id"]);
    } else {
      console.log("Can't find sticker: " + e["name"]);
      return;
    }
  })
};

var Canvas = function(userId, c, imported){
  var _this = this;
  if (! userId) {
    console.log("Can't create Canvas, no user id");
    return;
  }
  cco = this;
  var generateId = function(){
    return userId + "_c_" + Date.now()
  };

  var _attr = {
      "id": (c && c["id"]) || generateId()
    , "name": (c && c["name"]) || "new canvas"
    , "saved": (c && c["saved"]) || 0
    , "vis": (c && c["vis"]) || false
    , "bgcolor": (c && c["bgcolor"]) || "#fff"
    , "z": (c && c["x"]) || 10
    , "icon": (c && c["icon"]) || 0
    , "brcolor": (c && c["brcolor"]) || "#808080"
    , "color": (c && c["color"]) || "#808080"
    , "textcolor": (c && c["textcolor"]) || "#808080"
    , "theme": (c && c["theme"]) || "simple"
  };
  var parts = {
      "kp":"Key Partners"
    , "ka": "Key Activities"
    , "kr": "Key Resources"
    , "vp": "Value Propositions"
    , "cr": "Customer Relationships"
    , "cs": "Customer Segments"
    , "c": "Channels"
    , "ct": "Cost Structure"
    , "rs": "Revenue Streams"
  };
  var sids = []; //Stickers id: with names
  var _stickers = {}; // Stiker objects
  var sso = null; // Selected Sticker Object
  var ssv = null; // Selected Sticker HTML View

  var getCanvasFromStorage = function(){
    if (! alreadyRegistered) {
      registerCanvasHandlers();
    }
    //chrome.storage.sync.get(_attr["id"], function(items){
    //  if (chrome.runtime.error) {
    //    console.log("Fail: Get canvas: Runtime error.");
    //  } else {
    //    console.log("Success: Get canvas: " + this.args[1] + " from storage");
        var d = {
          type: "storage-canvas",
          name: _attr["id"],
          stat: false,
          items: []
        };
        $.event.trigger(d);
    //  }
    //});
  };


  var initCanvasToolbar = function(){
    hideStickerToolbar();
    $(".d_stage").remove();
    $(".d_stick").fadeOut();
    $(".d_stick").remove();
    $("#colorpicker_fill").remove();
    $("#colorpicker_font").remove();
    $("#choose-file").remove();
    //TODO: Set Edit tooltip
    var b_edit = $('<button id="b_edit"></button>')
                 .attr("title", "Edit current canvas properties");
    //TODO: Set Save tooltip
    var b_save = $('<button id="b_save"></button>')
                 .attr("title", "Save current canvas");
    //TODO: Set Edit tooltip
    b_save.bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      cco.saveCanvas();
    });
    b_edit.bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      editCanvas();
    });
    //TODO: Check for existance toolbar buttons
    var canvas_t = $("#canvas_t");
    canvas_t.find("#b_save").remove();
    //canvas_t.append(b_save);
    canvas_t.find("#b_edit").remove();
    canvas_t.append(b_edit);
    initColorPicker();
  };

  this.saveCanvas = function(){
    //userdata.saveUserChanges();
  };

  //Method for dealing with local Storage
  this.saveCanvasContentToStorage = function(){
    var data = {};
    data[ _attr["id"]] = sids;
    //chrome.storage.sync.set(data, function(e){
    //  if (chrome.runtime.error) {
    //    console.log("Fail: Set user canvases: Runtime error.");
    //  } else {
    //    console.log("Success: Save canvas: to storage");
    //  }
    //});
  };

  this.setCanvasStyles = function(attr){
    var t_bmc = $("#t_bmc");
    t_bmc.css({
        "background-color": attr["bgcolor"]
    });
    t_bmc.find("fieldset").css({
        "border-left": "1px solid " + attr["brcolor"]
      , "border-top": "1px solid " + attr["brcolor"]
    });
    t_bmc.find("legend").css({
      "color": attr["color"]
    });
    var img = t_bmc.find("img");
    img.css({"display": attr["icon"] ? "block" : "none"});
  };

  var editCanvas = function(){
    var i = $('<input id="i_cur_can_name" type="text">')
            .val(cci["name"]);
    var l = $('<label id="l_cur_can"></label>')
            .text("Edit current canvas name ");
    var el = $('<div class="alert_dialog"></div>').append(l).append(i);
    //add styles
    var l_s = $('<label id="l_s"></label>')
              .text("Select canvas theme.");
    var styles = userdata.getThemes();
    var s = $('<select id="s_edits"></select>');
    for (style in styles) {
      var o = $('<option></option>').attr("value", style)
              .text(style);
      s.append(o);
    }
    s.val(_attr["theme"]);
    el.append("<br/>").append(l_s).append("<br/>").append(s);
    el.attr("title", "Canvas Settings");
    alertDialog(el, function(){
      var ch = $("#s_edits").children(":selected").val();
      cco.setCanvasStyles(styles[ch]);

      var t = $("#i_cur_can_name").val();
      $("#c_name").text(t);
      cci["name"] = t;
      cco.setAttr("name", t);
      cco.setAttr("bgcolor", styles[ch]["bgcolor"]);
      cco.setAttr("brcolor", styles[ch]["brcolor"]);
      cco.setAttr("color", styles[ch]["color"]);
      cco.setAttr("icon", styles[ch]["icon"]);
      userdata.setCanvasId(_attr["id"], t);
    });
  };

  //Adding BMC stage
  var initCanvasStage = function(){
    //Canvas Parts
    var r = {
        "kp": "src/res/kp.svg"
      , "ka": "src/res/ka.svg"
      , "kr": "src/res/kr.svg"
      , "vp": "src/res/vp.svg"
      , "cr": "src/res/cr.svg"
      , "cs": "src/res/cs.svg"
      , "c": "src/res/c.svg"
      , "ct": "src/res/ct.svg"
      , "rs": "src/res/rs.svg"
    };

    var id = [
        "b_kp"
      , "b_ka"
      , "b_kr"
      , "b_vp"
      , "b_cr"
      , "b_cs"
      , "b_c"
      , "b_ct"
      , "b_rs"
    ];
    var d_stage = $('<div class="d_stage" id="' + _attr["id"] + '"></div>');
    var t_bmc = $('<table id="t_bmc" cellspacing="0"></table>');
    var tr_1 = $('<tr></tr>');
    var tr_2 = $('<tr></tr>');
    var tr_3 = $('<tr></tr>');

    var td_kp = $('<td id="td_kp" colspan="2" rowspan="2"></td>');
    var td_ka = $('<td id="td_ka" colspan="2"></td>');
    var td_vp = $('<td id="td_vp" colspan="2" rowspan="2"></td>');
    var td_cr = $('<td id="td_cr" colspan="2"></td>');
    var td_cs = $('<td id="td_cs" colspan="2" rowspan="2"></td>');
    var td_kr = $('<td id="td_kr" colspan="2"></td>');
    var td_c = $('<td id="td_c" colspan="2"></td>');
    var td_ct = $('<td id="td_ct" colspan="5"></td>');
    var td_rs = $('<td id="td_rs" colspan="5"></td>');

    var b = '<button id="';
    var bn = '" title="Choose sticker from templates" styel="display:none;"></button>';

    td_kp.append('<fieldset><legend>' + parts.kp + '</legend>' + b + id[0] + bn + '<img src="' + r["kp"] + '"/></fieldset>');
    td_ka.append('<fieldset><legend>' + parts.ka + '</legend>' + b + id[2] + bn + '<img src="' + r["ka"] + '"/></fieldset>');
    td_vp.append('<fieldset><legend>' + parts.vp + '</legend>' + b + id[3] + bn + '<img src="' + r["vp"] + '"/></fieldset>');
    td_cr.append('<fieldset><legend>' + parts.cr + '</legend>' + b + id[4] + bn + '<img src="' + r["cr"] + '"/></fieldset>');
    td_cs.append('<fieldset><legend>' + parts.cs + '</legend>' + b + id[5] + bn + '<img src="' + r["cs"] + '"/></fieldset>');
    td_kr.append('<fieldset><legend>' + parts.kr + '</legend>' + b + id[6] + bn + '<img src="' + r["kr"] + '"/></fieldset>');
    td_c.append( '<fieldset><legend>' + parts.c  + '</legend>' + b + id[7] + bn + '<img src="' + r["c"] + '"/></fieldset>');
    td_ct.append('<fieldset><legend>' + parts.ct + '</legend>' + b + id[8] + bn + '<img src="' + r["ct"] + '"/></fieldset>');
    td_rs.append('<fieldset><legend>' + parts.rs + '</legend>' + b + id[9] + bn + '<img src="' + r["rs"] + '"/></fieldset>');

    tr_1.append(td_kp).append(td_ka).append(td_vp).append(td_cr).append(td_cs);
    tr_2.append(td_kr).append(td_c);
    tr_3.append(td_ct).append(td_rs);
    t_bmc.append(tr_1).append(tr_2).append(tr_3);
    d_stage.append(t_bmc);
    $("#d_container").append(d_stage);
    handlePartsAdd(id);
  };

  var handlePartsAdd = function(b){
    var t = [
        "Sticker template info for kp"
      , "Sticker template info for ka"
      , "Sticker template info for kr"
      , "Sticker template info for vp"
      , "Sticker template info for cr"
      , "Sticker template info for cs"
      , "Sticker template info for c"
      , "Sticker template info for ct"
      , "Sticker template info for rs"
    ];
    for (var i = 0; i < b.length; i++) {
      console.log ("Clicked canvas part: " + b[i] );
      //b[i].bind('click', function(e){
      //  e.stopPropagation();
      //  e.stopImmediatePropagation();
      //  var l = $('<label id="l_cur_can"></label>')
      //      .text(t[i]);
      //  el.attr("title", "Choose sticker template");
      //  alertDialog(el, function(){
      //  });
      //});
    }
  };

  var handleCanvasPartsClicks = function(){
    for (p in parts) {
      var args = {"button1": "Ok"};
      $("#td_"+ p).find("legend").bind("click", function(e){ //mouse in
        e.stopPropagation();
        e.stopImmediatePropagation();
        var el = $('<div class="alert_dialog"></div>');
        var l = $('<p id="help"></p>').css("color", "#808080")
        el.append("<br/>").append(l);
        el.attr("title", this.innerText + " Info");
        el.find("#help").text(help["short"][this.innerText]);
        var args = {"button1": "Ok", "button2": "More Info"};
        showDialogWindow(el, args);
      });
    }
  };

  var initCanvasOptions = function(){
    //Resets and sets all stickers again draggable
    $(".d_stage").bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (ssv && ssv["view"].draggable("option", "disabled") ) {
        ssv["view"].draggable("enable");
      }
      var d_toolbar = $("#d_toolbar");
      if ("block" == d_toolbar.css("display")) {
        hideStickerToolbar();
      }
    });
    var d_arrow = $("#d_arrow");
    if ("block" == d_arrow.css("display")) {
        d_arrow.hide();
        $(".i_attach").remove();
    }
    //Handles canvas parts info view
    handleCanvasPartsClicks();
  };

  var addCanvasOptions = function(){
    $(".d_stage").bind("dblclick", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      var c = {};
      //TODO: Check x,y for not beeing outside of stage frame
      //c["top"] = (e.pageY >= $(this).css("top")) ? 1 : e.pageY;
      //c["left"] = (e.pageX >= $(this).css("left")) ? 1 : e.pageX;
      var swc = 50; // sticker default width center
      var shc = 45; // sticker default height center
      c["top"] = e.pageY - swc;
      c["left"] = e.pageX - shc;
      var s = new Sticker(_attr["id"], c);
      cco.pushSticker(s.getId(), s);
      cco.setSelected(s.getId()["id"]);
    });
  };

  this.pushSticker = function(s, sticker_object){
    console.log("Added new sticker to current canvas" + s["id"]);
    sids.push(s);
    _stickers[s["id"]] = sticker_object;
  };

  this.getAttr = function(key){
    if (key){ return _attr[key]; }
    return _attr;
  };

  this.setSids = function(ss){
    sids = ss;
  };

  this.setAttr = function(key, val){
    _attr[key] = val;
  };

  this.getId = function(){
    var d = {
    "id": _attr["id"],
    "name": _attr["name"]
    };
    return d;
  };

  this.getSids = function(){
    return sids;
  };

  this.saveCanvasStickersToStorage = function(){
    for (stick in _stickers) {
      var s = _stickers[stick];
      s.saveStickerToStorage();
    }
  };

  this.initCanvasStickers = function(){
    if (sids.length) {
      for (var i = 0; i < sids.length; i++) {
        getStickerData(sids[i]["id"]);
      }
    } else {
      console.log("No stickers");
    }
  };

  var getStickerData = function(id){
    //chrome.storage.sync.get(id, function(items){
    //  if (chrome.runtime.error) {
    //    console.log("Fail: Get user name: Runtime error.");
    //  } else {
        var d = {
          type: "storage-sticker",
          name: id,
          stat: false,
          items: []
        };
        $.event.trigger(d);
    //  }
    //});
  };

  var initColorPicker = function(){
    //add hidden colorpicker
    var colorpicker_fill = $('<input type="color" id="colorpicker_fill" >');
    var colorpicker_font = $('<input type="color" id="colorpicker_font">');
    var chooseFile = $('<input type="file" id="choose-file"/>');
    $("body").append(colorpicker_fill);
    $("body").append(colorpicker_font);
    $("body").append(chooseFile);
    colorpicker_fill.change(function(e){
      e.stopPropagation();
      sso.setAttr("bgcolor", $(this).val());
      ssv["view"].css({
        "background-color": sso.getAttr("bgcolor")
      });
      ssv["title"].css({
        "background-color": sso.getAttr("bgcolor")
      });
      ssv["text"].css({
        "background-color": sso.getAttr("bgcolor")
      });
    });
    colorpicker_font.change(function(e){
      e.stopPropagation();
      sso.setAttr("color", $(this).val());
      ssv["view"].css({
        "color": sso.getAttr("color")
      });
      ssv["title"].css({
        "color": sso.getAttr("color")
      });
      ssv["text"].css({
        "color": sso.getAttr("color")
      });
    });
    chooseFile.bind("change", function(e) {
      var formdata = new FormData();
      var fileinfo = {};
      formdata.append(1, this.files[0]);
      fileinfo.name = e.currentTarget.files[0].name;
      fileinfo.path = URL.createObjectURL(event.target.files[0]);
      console.log(fileinfo.path);
      sso.setAttr("icon", $(this).val());
      ssv["icon"].attr("src", sso.getAttr("icon"));
    });
  };

  //resets last selected sticker options, sets draggable again
  var resetLastSelectedSticker = function(){
    if (ssv && ssv["view"].draggable("option", "disabled") ) {
      ssv["view"].draggable("enable");
    }
  };

  this.setSelected = function(id){
    resetLastSelectedSticker();
    sso = _stickers[id];
    ssv = _stickers[id].getView();
    var d_arrow = $("#d_arrow").css({
        "top": ssv["view"].offset().top - 3 
      , "left": ssv["view"].offset().left + ssv["view"].width() - 8
    });
    if (existToolbar){
      hideStickerToolbar();
    }
    d_arrow.show();
  };

  this.getSelectedSticker = function(){
    return sso;
  };

  this.getSelectedStickerView = function(){
    return ssv;
  };

  this.getCanvasData = function(){
    var d = [];
    for(var i = 0; i < sids.length; ++i){ 
        d[i] = _stickers[ sids[i]["id"] ].getAttr();
    }
    return d;
  };

  this.drawCanvas = function(){
    initCanvasToolbar();
    initCanvasStage();
    initCanvasOptions();
    this.setCanvasStyles(_attr);
    addCanvasOptions();
  };

  if (! imported){
      getCanvasFromStorage();
  } else {
    _this.drawCanvas();
    for(var i = 0; i < c["sids"].length; ++i){
        var s = new Sticker(_this.getAttr()["id"], c["sids"][i]);
        _this.pushSticker(s.getId(), s);
        _this.setSelected(s.getId()["id"]);
    }
  }
};

//////////// MAIN ENTRY ////////////
mainCanvas();
