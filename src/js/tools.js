//Defines global variables and methods, such as sticker toolbars, controls
//TODO: reimplement as class or part of others class 
var existToolbar = false;

var createToolsArrow = function(){
  var d_arrow = $('<div id="d_arrow"></div>');
  $("body").append(d_arrow);
  d_arrow.bind("click", function(e){
    e.stopPropagation();
    e.stopImmediatePropagation();
      if (! existToolbar) {
        showStickerToolbar();
      } else {
        hideStickerToolbar();
      }
  });
};

var initToolbarHandlers = function(){
  $("#i_fill").bind("click", function(e){
    e.stopPropagation();
    e.stopImmediatePropagation();
    var colorpicker_fill = $("#colorpicker_fill");
    colorpicker_fill.click();
  });
  $("#i_font").bind("click", function(e){
    e.stopPropagation();
    e.stopImmediatePropagation();
    var colorpicker_font = $("#colorpicker_font");
    colorpicker_font.click();
  });
  $("#i_hide").bind("click", function(e){
    e.stopPropagation();
    e.stopImmediatePropagation();
    //Show hide confirmation dialog for hiding sticker view
    var so = cco.getSelectedSticker();
    var sv = cco.getSelectedStickerView();
    sv["view"].css({"border": "1px dotted #808080"});
    var el = $('<div class="alert_dialog"></div>')
             .attr("title", "Sticker Settings");
    var l = $('<label id="l_s"></label>')
            .text("The selected sticker will be hided.\n If agree press OK.");
    el.append("<br/>").append("<br/>").append(l);
    alertDialog(el, function(){
      so.setAttr("vis", -1);
      sv["view"].fadeOut();
      //reset all settings for sticker, hide toolbar
      $("#d_toolbar").hide();
      existToolbar = false;
    }, function(){
      sv["view"].css({"border": "none"});
      return;
    });
  });
  $('#i_file').bind('click', function(e) {
    uploadAttachment();
  });
};

var createStickerToolbar = function(){
  var d_toolbar = $('<div id="d_toolbar"></div>');
  var i_hide = $('<img id="i_hide" class="stbi" src="src/res/hide.svg"/>')
               .attr("title", "Hide sticker from canvas");
  var i_fill = $('<img id="i_fill" class="stbi" src="src/res/fill.svg"/>')
               .attr("title", "Change sticker background color");
  var i_font = $('<img id="i_font" class="stbi" src="src/res/font.svg"/>')
               .attr("title", "Change sticker text color");
  var i_file = $('<img id="i_file" class="stbi" src="src/res/file.svg"/>')
               .attr("title", "Upload sticker attachment");
  var attach_save = $("<div id=attach-save></div>");
  d_toolbar.append(i_fill);
  d_toolbar.append(i_font);
  d_toolbar.append(i_file);
  d_toolbar.append(i_hide);
  $("body").append(d_toolbar);
  $("body").append(attach_save);
  initToolbarHandlers();
};

createToolsArrow();
createStickerToolbar();
//TODO: create colorpicker

var showStickerToolbar = function(){
  $("#d_arrow").css("background-image", "url(src/res/arrowup.svg)");
  var d_toolbar = $("#d_toolbar");
  existToolbar = true;
  var sv = cco.getSelectedStickerView();
  d_toolbar.css({
      "top": sv["view"].offset().top - 33
    , "left": sv["view"].offset().left - 1
  });
  d_toolbar.show();
};

var hideStickerToolbar = function(){
  $("#d_arrow").css("background-image", "url(src/res/arrowdown.svg)");
  existToolbar = false;
  $("#d_toolbar").hide();
};
