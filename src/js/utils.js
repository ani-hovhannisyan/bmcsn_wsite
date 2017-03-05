//Global methods to read/write file

var errorHandler = function(e){
  console.error(e);
};

var readAsText = function(fileEntry, callback){
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.readAsText(file);
  });
};

//Start of Importing methods
var readFromFile = function(t){
  if (!t){ t = 'text/*'; }
  var accepts = [{ mimeTypes: [t] }];
  chrome.fileSystem.chooseEntry(
    {type: 'openFile', accepts: accepts}, function(theEntry) {
    if (! theEntry) { console.log('No file selected.'); return; }
    var filename = theEntry.name.split(".");
    var e = filename[filename.length - 1];
    if ("bmcsn" != e){
        var el = $('<div class="alert_dialog"></div>')
                 .attr("title", "Failed import");
        var l = $('<label id="l_s"></label>')
                .text("Selected file isn't BMCSN canvas.");
        el.append("<br/>").append("<br/>").append(l);
        alertDialog(el);
       return;
    }
    theEntry.file(function(file) {
      readAsText(theEntry, loadImportedCanvas);
    });
  });
};

var loadImportedCanvas = function(result) {
  console.log(result);
  var c = JSON.parse(result);
  var l1 = $('<label></label>').text("Canvas title is: " + c["name"]);
  var l2 = $('<label></label>').text("Canvas version is: " + c["v"]);
  var d = $('<div id="file-content"></div>')
          .css({
            "margin": "5px",
            "width": "90%",
            "height": "90%",
            "color": "#808080"
          });
  var el = $('<div class="alert_window"></div>');
  el.append(l1).append('</br>').append(l2).append('</br>').append(d);
  el.attr("title", "Imported canvas properties.");
  var args = {"button1": "Upload", "button2": "Discard"};
  showDialogWindow(el, args, function(){
      userdata.createCanvasObject(true, c, true);
  });
};
//End of Importing methods

//Start of  Uploading attachment
var uploadAttachment = function(t){
  if (!t){ t = 'text/*'; }
  var accepts = [{ mimeTypes: [t] }];
  chrome.fileSystem.chooseEntry(
    {type: 'openFile', accepts: accepts}, function(theEntry) {
    if (!theEntry) {
      console.log('No file selected.'); return;
    }
    var filename = theEntry.name.split(".");
    if ("pdf" == filename[filename.length - 1]){
        var el = $('<div class="alert_dialog"></div>')
                 .attr("title", "Failed upload");
        var l = $('<label id="l_s"></label>')
                .text("Does not support for selected file type.");
        el.append("<br/>").append("<br/>").append(l);
        alertDialog(el);
       return;
    }
    theEntry.file(function(file) {
      readAsText(theEntry, loadAttachedFile);
    });
  });
};

var loadAttachedFile = function(result) {
  cuf = result;
  console.log(cuf);
  var d = $('<div id="file-content"></div>')
          .css({
            "margin": "5px",
            "width": "90%",
            "height": "90%",
            "color": "#808080"
          }).text(result);
  var el = $('<div class="alert_window"></div>');
  el.append(d);
  el.attr("title", "Selected file content.");
  var args = {"button1": "Upload", "button2": "Discard"};
  showDialogWindow(el, args, function(){
    var msg = 'Started uploading selected file.';
    notify(msg);
    var uploadedfilename = cco.getSelectedSticker().getId()["id"]
        + "f" + Date.now();;
    var config = {type: 'saveFile', suggestedName: uploadedfilename};
    var so = cco.getSelectedSticker();
    so.addStickerAttachment(cuf);
  });
};

//End of Uploading attachment

//Start of Exporing to file
var writeToFile = function(config, data){
  chrome.fileSystem.chooseEntry(config, function(writableEntry) {
    var blob = new Blob([data], {type: 'text/plain'});
    writeFileEntry(writableEntry, blob, function(e) {
       console.log('Write file completed.');
    });
  });
};

var writeFileEntry = function(writableEntry, opt_blob, callback){
  if (!writableEntry) {
    console.log('Nothing selected.'); return;
  }
  writableEntry.createWriter(function(writer) {
    writer.onerror = errorHandler;
    writer.onwriteend = callback;
    if (! opt_blob) { return; }
    writer.truncate(opt_blob.size);
    waitForIO(writer, function() {
      writer.seek(0);
      writer.write(opt_blob);
    });
  }, errorHandler);
};

var waitForIO = function(writer, callback){
  // set a watchdog to avoid eventual locking:
  var start = Date.now();
  // wait for a few seconds
  var reentrant = function() {
    if (writer.readyState === writer.WRITING && Date.now() - start < 4000) {
      setTimeout(reentrant, 100);
      return;
    }
    if (writer.readyState === writer.WRITING) {
      console.error("Writing is longer, readyState is " + writer.readyState);
      writer.abort();
    } else {
      callback();
    }
  };
  setTimeout(reentrant, 100);
};
//End of Exporing to file
