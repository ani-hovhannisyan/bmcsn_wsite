// Defines Sticker class
var Sticker = function(canvasId, s){
  //Temporary fix for many trigger bug
  //if (s && ("block" == $("#" + s["id"]).css("display"))) {
  //  console.log("BUG: Removing already exists sticker");
  //  return;
  //}
  if (! canvasId) {
    console.log("Can't create Sticker, no canvas id");
    return;
  }

  var generateId = function(){
    // u000c000 + s000
    return canvasId + "_s_" + Date.now();
  };

  var _attr = {
      "id": (s && s["id"]) || generateId()
    , "top": (s && s["top"]) || "10px"
    , "left": (s && s["left"]) || "10px"
    , "z": (s && s["x"]) || 10
    , "tit": (s && s["tit"]) || ""
    , "txt": (s && s["txt"]) || ""
    , "vis": (s && s["vis"]) || 1

    , "width": (s && s["width"]) || "100px"
    , "height": (s && s["height"]) || "90px"
    , "bgcolor": s["bgcolor"] || "#fffe9f"
    , "color": s["color"] || "#808080"
    , "icon": s["icon"] || "src/res/logo_128.svg"
    , "file": s["file"] || ""
    , "attach": s["attach"] || ""
  };
  var stickerView = {
      "view" : null
    , "title": null
    , "text": null

    , "icon": null
    , "file": null
  };

  var setStickerOptions = function(){
    stickerView["view"].hover(function(){
      if (! stickerView["view"].draggable("option", "disabled")) {
        $(this).css("cursor", "move");
      } else {
        $(this).css("cursor", "pointer");
      }
    });
    stickerView["title"].hover(function(){
      if (! stickerView["view"].draggable("option", "disabled")) {
        $(this).css("cursor", "move");
      } else {
        $(this).css("cursor", "text");
      }
    });
    stickerView["text"].hover(function(){
      if (! stickerView["view"].draggable("option", "disabled")) {
        $(this).css("cursor", "move");
      } else {
        $(this).css("cursor", "text");
      }
    });
    //Draggable
    stickerView["view"].draggable({
      cancel: false,
      start: function(){
        cco.setSelected(_attr["id"]);
      },
      drag: function(){
        var d_arrow = $('#d_arrow').css({
            "top": stickerView["view"].offset().top - 5
          , "left": stickerView["view"].offset().left - 8
            + stickerView["view"].width()
        });
        stickerView["attach"].css({
              "top": stickerView["view"].offset().top + 13,
              "left": stickerView["view"].offset().left - 8
                     + stickerView["view"].width(),
        });
        if (existToolbar) {
            var d_toolbar = $("#d_toolbar");
            d_toolbar.css({
                "top": stickerView["view"].offset().top - 33
                , "left": stickerView["view"].offset().left - 1
            });
        }
      },
      stop: function(){
        _attr["top"] = parseInt($(this).css("top"));
        _attr["left"] = parseInt($(this).css("left"));

        var d_arrow = $('#d_arrow').css({
            "top": stickerView["view"].offset().top - 5
          , "left": stickerView["view"].offset().left - 8
            + stickerView["view"].width()
        });
        stickerView["attach"].css({
              "top": stickerView["view"].offset().top + 13,
              "left": stickerView["view"].offset().left - 8
                     + stickerView["view"].width(),
        });
        //if (! existToolbar) {
        //  showStickerToolbar();
        //}
      }
    });
    //Resizable
    stickerView["view"].resizable({
      start: function(e){
        _attr["width"] = parseInt($(this).css("width"));
        _attr["height"] = parseInt($(this).css("height"));
        cco.setSelected(_attr["id"]);
        //if (existToolbar) {
        //  hideStickerToolbar();
        //}
      }, 
      resize: function(){
        var d_arrow = $('#d_arrow').css({
            "top": stickerView["view"].offset().top - 5
          , "left": stickerView["view"].offset().left - 8
            + stickerView["view"].width()
        });
        stickerView["attach"].css({
              "top": stickerView["view"].offset().top + 13,
              "left": stickerView["view"].offset().left - 8
                     + stickerView["view"].width(),
        });
        if (existToolbar) {
            var d_toolbar = $("#d_toolbar");
            d_toolbar.css({
                "top": stickerView["view"].offset().top - 33
                , "left": stickerView["view"].offset().left - 1
            });
        }
      },
      stop: function(e){
        _attr["width"] = parseInt($(this).css("width"));
        _attr["height"] = parseInt($(this).css("height"));

        var d_arrow = $('#d_arrow').css({
            "top": stickerView["view"].offset().top - 5
          , "left": stickerView["view"].offset().left - 8
            + stickerView["view"].width()
        });
        stickerView["attach"].css({
              "top": stickerView["view"].offset().top + 13,
              "left": stickerView["view"].offset().left - 8
                     + stickerView["view"].width(),
        });
        if (existToolbar) {
            var d_toolbar = $("#d_toolbar");
            d_toolbar.css({
                "top": stickerView["view"].offset().top - 33
                , "left": stickerView["view"].offset().left - 1
            });
        }
        //if (! existToolbar) {
        //  showStickerToolbar();
        //}
      }
    });
  };

  //Adds Sticker top delete, tools arrow
  /*var addStickerTools = function() {
    var d_tools = $('<div id="d_tools"></div>');
    var b_arrow = $('<button class="st" id="b_arrow"></button>')
                  .attr("title", "Show Toolbar");
    var b_delete = $('<button classs="st" id="b_delete"></button>')
                  .attr("title", "Delete");
    d_tools.append(b_delete)
           .append(b_arrow)
           .css({
               "top": stickerView["view"].css("top").split("px")[0] - 33
             , "left": stickerView["view"].css("left").split("px")[0] - 1
           });
    $("body").append(d_tools);
    d_tools.bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (existToolbar) {
        hideStickerToolbar();
      } else {
        showStickerToolbar();
      }
    });
    b_delete.bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      //Show delete confirmation dialog.
      var so = cco.getSelectedSticker();
      var sv = cco.getSelectedStickerView();
      //sv["view"].css({"border": "1px dotted #808080"});
      sv["view"].css({"border": "1px dotted #808080"});
      var el = $('<div class="alert_dialog"></div>')
               .attr("title", "Sticker Settings");
      var l = $('<label id="l_s"></label>')
              .text("The selected sticker will be deleted forever.\n If agree press OK.");
      el.append("<br/>").append("<br/>").append(l);
      alertDialog(el, function(){
        sv["view"].hide();
        //TODO: delete from storage
        so.setAttr("vis", -1);
        //reset all settings for sticker, hide toolbar
        if (existToolbar) {
          hideStickerToolbar();
        }
      }, function(){
        return;
      });
    });
  };*/

  var addStickerParts = function(){
    stickerView["view"] = $('<div class="d_stick" id="' + _attr["id"] + '"></div>');
    stickerView["title"] = $('<input id="t_title" type="text">');
    stickerView["text"] = $('<textarea id="t_text">');

    stickerView["attach"] = $('<div id="'
            + _attr["id"] + '" class="i_attach"></div>')
            .attr("title", "Show attachment.");

    //stickerView["icon"] = $('<img id="i_img"/>')
    //                      .attr("src", stickerView["icon"]);
    //stickerView["file"] = $('<img id="i_img"/>')
    //                      .attr("src", stickerView["file"]);

    if (_attr["tit"]) {
      stickerView["title"].val(_attr["tit"]);
    } else {
      stickerView["title"].attr("placeholder", _attr["tit"] || "Title ...");
    }
    if (_attr["txt"]) {
      stickerView["text"].val(_attr["txt"]);
    } else {
      stickerView["text"].attr("placeholder", _attr["txt"] || "Notes ...");
    }
    if (_attr["attach"]) {
      $("body").append(stickerView["attach"]);
      stickerView["attach"].show();
    }
    stickerView["title"].change(function(){
      _attr["tit"] = $(this).val();
      $(this).blur();
    });
    stickerView["text"].change(function(){
      _attr["txt"] = $(this).val();
      $(this).blur();
    });
    //Makes sticker input fields editable if clicks on its
    //Sticker draggable is always on so it prevents clicks on inputs
    stickerView["title"].dblclick(function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      $(this).focus().css("cursor", "text");
      stickerView["view"].draggable("disable");
    });
    stickerView["text"].dblclick(function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      $(this).focus().css("cursor", "text");
      stickerView["view"].draggable("disable");
    });
    stickerView["attach"].bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      var l = $('<div id="file-content"></div>')
              .css({
                "display": "block",
                "margin": "5px",
                "width": "90%",
                "height": "90%",
                "color": "#808080"
              }).text(_attr["attach"]);
      var el = $('<div class="alert_window"></div>');
      el.append(l);
      el.attr("title", "Attached file content.");
      var args = { "button1": "Ok", "button2": "Remove"};
      showDialogWindow(el, args, function(){
          //TODO: Handle ok button 
      }, function(){
          _attr["attach"] = "";
          stickerView["attach"].remove();
      });
    });
    stickerView["view"].append(stickerView["title"])
                       .append(stickerView["text"])
                       .append(stickerView["icon"])
                       .append(stickerView["file"]);
    $("body").append(stickerView["view"]);
  };

  var setStickerStyles = function(){
    stickerView["view"].css({
        "top": _attr["top"]
      , "left": _attr["left"]
      , "z-index": _attr["z"]

      , "width": _attr["width"]
      , "height": _attr["height"]
      , "background-color": _attr["bgcolor"]
      , "color": _attr["color"]
    });
    stickerView["title"].css({
        "color": _attr["color"]
      , "placeholder": _attr["color"]
      , "background-color": _attr["bgcolor"]
    });
    stickerView["text"].css({
        "color": _attr["color"]
      , "placeholder": _attr["color"]
      , "background-color": _attr["bgcolor"]
    });
  };

  var initSticker = function(){
    addStickerParts();
    setStickerStyles();
    //addStickerTools();
    setStickerOptions();
    stickerView["view"].show();
    //TODO: move the arrow adding part to 
    var d_arrow = $('#d_arrow').css({
        "top": stickerView["view"].offset().top - 5
      , "left": stickerView["view"].offset().left - 8
       + stickerView["view"].width()
    });
    d_arrow.show();
    //TODO: Move attach styling to methods
    stickerView["attach"].css({
          "top": stickerView["view"].offset().top + 13,
          "left": stickerView["view"].offset().left - 8
                 + stickerView["view"].width(),
    });
  };

  this.saveStickerToStorage = function(){
    var data = {};
    data[ _attr["id"] ] = _attr;
    //chrome.storage.sync.set(data, function(e){
    //  if (chrome.runtime.error) {
    //    console.log("Fail: Save sticker: Runtime error.");
    //  } else {
    //    console.log("Success: Save sticker: " + this.args[1] + " to storage");
    //  }
    //});
  };

  this.getAttr = function(key){
    return key ? _attr[key] : _attr;
  };

  this.setAttr = function(key, value){
    _attr[key] = value;
  };

  this.getId = function(){
    var d = {
      "id": _attr["id"],
      "name": _attr["name"]
    };
    return d;
  };

  this.isVisible = function(){
    return (_attr["vis"]);
  };

  var currentSelectionHandler = function(){
    stickerView["view"].bind("click", function(e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      cco.setSelected(_attr["id"]);
      /*if (existToolbar) {
        hideStickerToolbar();
      } else {
        showStickerToolbar();
      }*/
    });
  };

  var setFocused = function(){
    stickerView["text"].focus();
  };

  this.getView = function(){
    return stickerView;
  };

  this.addStickerAttachment = function(s){
    _attr["attach"] = s;
    $("body").append(stickerView["attach"]);
    stickerView["attach"].css({
          "top": stickerView["view"].offset().top + 13,
          "left": stickerView["view"].offset().left - 8
                 + stickerView["view"].width(),
    });
    stickerView["attach"].show();
  };

  var drawSticker = function(){
    if (-1 == _attr["vis"]) {
      console.log("New sticker: hided: " + _attr["id"]);
      return;
    }
    initSticker();
    currentSelectionHandler(); 
    setFocused();
    console.log("New sticker: shown: " + _attr["id"]);
  };

  drawSticker();
};
