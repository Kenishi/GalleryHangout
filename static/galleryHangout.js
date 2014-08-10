/*
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License. You may obtain a copy of
* the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/
var serverPath = '//galleryhangout.appspot.com/';

function ImgUr(id) {
	var api_url = '//api.imgur.com/3/image';
	var app_id = id;
	
	this.viewImage_url = '//i.imgur.com/';
	
	this.get = function(id, callback) {
		var url = api_url + '/' + id;
		var jqxhr = $.ajax({
			url: url,
			dataType: "json",
			headers: {
				Authorization: 'Client-ID ' + app_id
			}
		})
		.done(callback.success)
		.fail(callback.error);
	}
	
	this.upload = function(filename, base64_str, callback) {
		if(!filename || !base64_str || !callback) {
			alert("Incorrect upload parameters.");
			return;
		}
		
		var jqxhr = $.ajax({
			url: api_url,
			method: 'POST',
			data: {
				image: base64_str,
				type: 'base64',
				name: filename
			},
			dataType: 'json',
			headers: {
				Authorization: 'Client-ID ' + app_id
			}
		})
		.done(callback.success)
		.fail(callback.error);
	}
	
	xhr = new XMLHttpRequest();
	if(!window.File || !window.FileReader || !window.FileList || !window.Blob || !xhr.upload) {
		alert("File APIs not available in your browser. File uploading unavailable.");
		upload = null;
	}
}

function ImgUr_Callback(row, onAJAXSuccess, onAJAXError) {
	if(!onAJAXError || !onAJAXSuccess) return null;
	var that = this;
	
	var onSuccess = onAJAXSuccess;
	var onError = onAJAXError;
	this.row = row;
	
	this.success = function(e) {
		if(row) onSuccess(that.row, e);
		else onSuccess(e);
	}
	
	this.error = function(e) {
		if(row) onError(that.row, e);
		else onError(e);
	}
}


/*
 * Upload Dialog
 */
function UploadDialog(i) {
	var that = this;
	
	this.FILE_STATUS = Object.freeze({
		NOT_UPLOADED: 0,
		UPLOADING: 1,
		SUCCESS: 2,
		FAIL: 3
	});
	
	this.imgur = new ImgUr(imgur_clientId);
	this.dialog_obj = null;
	this.fileRows = [];
	
	this.removeImage = serverPath + 'static/remove.jpg';
	
	function createRemoveButton() {
		var span = document.createElement("SPAN");
		span.setAttribute("class", "remove-btn");
		span.innerHTML = "X";
		return span;
	}
	
	this.addFile = function(file) {
		if(!that.dialog_obj.dialog("isOpen")) {
			that.dialog_obj.dialog("open");
		}
		
		var row = document.createElement("DIV")
		row.setAttribute("class", "fileRow");
		
		// Attach the File data from File API to this row
		row.filedata = file;
		
		that.changeRowStatus(row, that.FILE_STATUS.NOT_UPLOADED);
		
		var filename_node = document.createTextNode(file.name);

		// Delete from upload button
		//var remove_node = document.createElement("IMG");
		var remove_node = createRemoveButton();
		var remove_url = serverPath + 'static/remove.jpg'; 
		//remove_node.setAttribute("src", remove_url);
		//remove_node.setAttribute("alt", "Remove file from upload list.");
		remove_node.addEventListener("click", function(e) {
			that.removeFile(row);
			e.preventDefault();
			});
		
		row.appendChild(filename_node);
		row.appendChild(remove_node);
		
		// Add this file to the upload and to the quick access
		//   file row array
		that.getUploadList().appendChild(row);
		that.fileRows[that.fileRows.length] = row;
		
	}
	
	this.removeFile = function(row) {
		row.filedata = null;
		for(var i=0; i < that.fileRows.length; ++i) {
			if(that.fileRows[i] == row) {
				that.fileRows.splice(i, 1);
				break;
			}
		}
		row.parentNode.removeChild(row);
		if(that.fileRows.length <= 0) {
			that.hide();
		}
	}
	
	this.fileDragHover = function(e) {
		if(e) {
			e.stopPropagation();
			e.preventDefault();
		}
	}
	
	this.fileSelectHandler = function(e) {
		if(e) {
			that.fileDragHover(e);
			// Get input
			var files = e.target.files || e.dataTransfer.files;

			// Add File(s)
			for(var i=0; i < files.length; ++i) {
				that.addFile(files[i]);
			}
		}
	}
	
	this.postFinish = function(xhr, status) {
		if(status == "success") {
			if(xhr.responseText) {
				var json_obj = jQuery.parseJSON(xhr.responseText);
			}
		}
	}
	
	this.upload_test = function() {
		if(that.fileRows.length > 0) {
			beginUpload();
									
			for(var i=0; i < that.fileRows.length; ++i) {
				var response = {
					data : { id : "EAM4lRQ", deletehash : "" }
				};
				
				success(that.fileRows[i], response);
			}
			finishUpload();
		}
	}
	
	this.upload = function() {
		if(that.fileRows.length > 0) {
			beginUpload();
									
			for(var i=0; i < that.fileRows.length; ++i) {
				(function process(index) {
					reader = new FileReader();
					var filename = that.fileRows[index].filedata.name;
					reader.onload = function(e) {
						var rawData = fixBase64(e.target.result);
						callback = new ImgUr_Callback(that.fileRows[index], success, error);
						that.imgur.upload(filename, rawData, callback);
					}
					reader.readAsDataURL(that.fileRows[i].filedata);
				})(i);
			}
			finishUpload();
		}
	}
	
	function success(row, response) {
		// Get response data
		var id = response.data.id;
		var deleteHash = response.data.deletehash;
				
		// Let other participants know of added image
		var delta = {};
		delta[id] = deleteHash;
		gapi.hangout.data.submitDelta(delta);
		
		// Add to Image Gallery and update the upload dialog
		window.imageGallery.addImage(id);
		that.changeRowStatus(row, that.FILE_STATUS.SUCCESS);

		// If all are complete, clear and hide dialog
		if(isComplete()) {
			setTimeout(function() { 
				that.clear();
				that.hide(); 
				}, 2000); // 2 Sec delay before clear and hide
		}
	}
	
	function error(row, response) {
		$.toastmessage("showErrorToast", 'Error ' + response.status + ": Failed to upload image");
		that.changeRowStatus(row, that.FILE_STATUS.FAIL);
	}
	
	/**
	 * Change the specified row's status
	 */
	this.changeRowStatus = function(row, status) {
		row.status = status;
	}
	
	/**
	 * Clear the file list from the upload dialog
	 */
	this.clear = function() {
		for(var i=0; i < that.fileRows.length; ++i) {
			that.removeFile(that.fileRows[i]);
		}
	}
	
	/**
	 * Show the upload dialog
	 */
	this.show = function() {
		that.dialog_obj.dialog("open");
	}
	
	/**
	 * Hide the upload dialog
	 */
	this.hide = function() {
		that.dialog_obj.dialog("close");
	}
	
	/**
	 * Gets the upload list DIV element
	 */
	this.getUploadList = function() {
		return document.getElementById("upload-list");
	}
	
	/**
	 * Check if all rows show SUCCESS status
	 */
	function isComplete() {
		var isComplete = true;
		for(var i=0; i < that.fileRows.length; ++i) {
			if(that.fileRows[i].status != that.FILE_STATUS.SUCCESS) {
				isComplete = false;
			}
		}
		return isComplete;
	}
	
	function fixBase64(str)  {
		return str.replace(/^data:image\/(png|gif|jpg|jpeg);base64,/,"");
	}
	
	/**
	 * Helper functions to change buttons during upload
	 */
	function beginUpload() {
		document.getElementById("browsebtn").style.display = "none";
		document.getElementById("uploadbtn").disabled = true;
	}
	
	function finishUpload() {
		document.getElementById("browsebtn").style.display = "block";
		document.getElementById("uploadbtn").disabled = false;
	}
	
	/*** Constructor ***/
	
	that.content = document.createElement("DIV");
	that.content.setAttribute("id", "uploadDialog");
	that.content.setAttribute("title", "Upload Image");
	that.content.style.fontSize = "12px";
	
	// File List
	var file_list = document.createElement("DIV");
	file_list.setAttribute("id", "upload-list");
	file_list.style.paddingBottom = "15px";
	that.content.appendChild(file_list);
	
	// Buttons
	var control_buttons = document.createElement("DIV");
	control_buttons.setAttribute("id", "control-buttons");
	
	// Set Upload Button	
	var browse_button = document.createElement("INPUT");
	browse_button.setAttribute("type", "file");
	browse_button.setAttribute("id", "browsebtn");
	browse_button.setAttribute("value", "Select images...");
	browse_button.addEventListener("change", that.fileSelectHandler);
	browse_button.style.marginBottom = "10px";
	
	var upload_button = document.createElement("INPUT");
	upload_button.setAttribute("type", "button");
	upload_button.setAttribute("id", "uploadbtn");
	upload_button.setAttribute("value", "Upload");
	upload_button.addEventListener("click", that.upload);
	
	control_buttons.appendChild(browse_button);
	control_buttons.appendChild(document.createElement("BR"));
	control_buttons.appendChild(upload_button);
	that.content.appendChild(control_buttons);
	$("body").append(that.content);
	
	this.dialog_obj = $(that.content).dialog({"autoOpen" : false});
	console.log("Init finish");
}

/* Hangout App Functions */


/**
 * Callback for when App state changes
 */
function updateState(event) {
	if(event.removedKeys && event.removedKeys.length > 0) {
		for(var i=0; i < event.removedKeys.length; ++i) {
			window.imageGallery.removeImage(event.removedKeys[i].key);
		}
	}
	else if(event.addedKeys && event.addedKeys.length > 0) {
		for(var i=0; i < event.addedKeys.length; ++i) {
			window.imageGallery.addImage(event.addedKeys[i].key);
		}
	}
	else {
		/* Refresh List */
		// Add phase
		for(var i=0; i < event.state.length; ++i) {
			var ele = document.getElementById(event.state[i].key);
			if(ele == null) {
				window.imageGallery.addImage(event.state[i].key);
			}
		}
		// Remove Images not in State
		var node = document.getElementById("img-list").firstChild;
		var end = window.imgListDropZone;
		while(node != end) {
			if(node.tagName == "DIV") {
				if(event.state[node.getAttribute("id")] == null) {
					var next = node.nextSibling;
					window.imageGallery.removeImage(node);
					node = next;
					continue;
				}
			}
			node = node.nextSibling;
		}
	}
}

function ImageGallery(listElement) {
	if(!listElement) return null;
	var that = this;
	
	this.imgList = listElement;
	this.dropzone = document.getElementById("img-list-dropzone");
	
	this.getImageList = function() {
		return that.imgList;
	}
	
	this.addImage = function(id) {
		/* Make sure image doesn't already exist */
		var node = document.getElementById(id);
		if(node) {
			return false;
		}
		
		var imageSlot = createImageSlot(id);
		var imgList = that.getImageList();
		imgList.insertBefore(imageSlot.getDOMElement(), that.dropzone);
	}
	
	this.removeImage = function(imageSlot) {
		var imgList = that.getImageList();
		
		if(imageSlot instanceof ImageSlot) {
			imgList.removeChild(imageSlot.getDOMElement());
		}
		else if(typeof imageSlot === 'string') {
			imgList.removeChild(document.getElementById(imageSlot));
		}
		else if(imageSlot instanceof Node) {
			imgList.removeChild(imageSlot);
		}
	}
	
	function createImageSlot(id) {
		return new ImageSlot(id, that);
	}
}

function ImageSlot(id, list) {
	var that = this;
	this.parent = list;
	this.id = id;
	this.ext = null;
	
	this.setImage = function(url, ext) {
		that.ext = ext;
		
		var dom = that.getDOMElement();
		// Remove 'Loading' text
		var children = dom.childNodes;
		for(var i = 0; i < children.length; ++i) {
			dom.removeChild(children[i]);
		}
		
		// Remove the setImage function
		that.setImage = null;
		
		// Create the image and add it
		var img = document.createElement("IMG");
		img.align = "middle";
		img.setAttribute("src", url);
		dom.appendChild(img);
	}
	
	this.getDOMElement = function() {
		return that.node;
	}
	
	this.getID = function() {
		return that.id;
	}
	
	this.onclick = function(e) {
		if(that.ext) {
			// Change the mainview
			var mainView = $("#img-main-view");
			var url = window.imgur.viewImage_url + that.getID() + that.ext;
			mainView.css("visibility", "visible");
			mainView.attr("src", url);
		}
	}
	
	function fetchImage() {
		if(that.getID()) {
			var callback = new ImgUr_Callback(null, success, fail);
			window.imgur.get(that.getID(), callback);
		}
	}

	function success(data) {
		if(data['success'] == true) {
			var ext = null;
			
			if(data['data']['type'] == 'image/jpeg') {
				ext = '.jpg';
			}
			else if(data['data']['type'] == 'image/gif') {
				ext = '.gif';
			}
			else if(data['data']['type'] == 'image/png') {
				ext = '.png';
			}
			else { // Unknown file type
				fail();
				return;
			}
			
			var url = window.imgur.viewImage_url + data['data']['id'] + 'b' + ext;
			
			if(that.setImage != null) {
				that.setImage(url, ext);
			}
			else { // Set image should not be null
				fail();
				return;
			}
		}
		else {
			fail();
			return;
		}
	}
	
	function fail() {
		var dom = that.getDOMElement();
		
		// Set the slot to Red
		dom.style.borderColor = "red";
		// Set timer to remove slot
		setTimeout(function() { that.parent.removeImage(that); }, 3000);
		// Display a fail message
		$().toastmessage("showErrorToast", "Error fetching image");
	}

	// Create a holder slot while image loads
	this.node = document.createElement("DIV");
	this.node.style.width = "160px";
	this.node.style.height = "160px";
	this.node.style.margin = "5px";
	this.node.style.textAlign = "center";
	this.node.setAttribute("id", id);
	this.node.onclick = this.onclick;
	
	// Set filler text to notify user of loading
	var txt = new Text("Loading...");
	this.node.appendChild(txt);
	
	this.node.instance = this; // Put this object on the node
	fetchImage(); // Get the thumbnail
}


//function onDeleteImage(data) {}


// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log('Init app.');
  
  // Get End of Image list (ie: Add/Drop Img zone)
  window.imgListDropZone = document.getElementById("img-list-dropzone");
  
  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      console.log('API is ready');
      $('body').layout();
      $(".ui-layout-pane").css("background-color", "black");
      window.imgur = new ImgUr(imgur_clientId);
      
      window.imageGallery = new ImageGallery($("#img-list")[0]);
      
      // Register file drops with Upload Dlg
      window.uploadDlg = new UploadDialog();
      
      var filedrop = document.getElementsByClassName("filedrop");
      for(var i=0; i < filedrop.length; ++i) {
		filedrop[i].addEventListener("dragover", function(e) { window.uploadDlg.fileDragHover.call(window.uploadDlg, e); }, false);
		filedrop[i].addEventListener("dragleave", function(e) { window.uploadDlg.fileDragHover.call(window.uploadDlg, e); }, false);
		filedrop[i].addEventListener("drop", function(e) { window.uploadDlg.fileSelectHandler.call(window.uploadDlg, e); }, false);
      }
      
      // Make the dropzone clickable
      window.imgListDropZone.onclick = function() { window.uploadDlg.show.call(window.uploadDlg); }
      
      gapi.hangout.data.onStateChanged.add(function(eventObj) {
        updateState(eventObj);
      });
      
      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  // This application is pretty simple, but use this special api ready state
  // event if you would like to any more complex app setup.
gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);