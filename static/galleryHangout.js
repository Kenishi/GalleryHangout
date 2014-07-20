/*
* Copyright (c) 2011 Google Inc.
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

/*
 * ImgUr Image Control Functions
 */
var imgur_getImage = '//api.imgur.com/3/image/';
var imgur_postImage = '//api.imgur.com/3/image';
var imgur_viewImage = '//i.imgur.com/';

/**
 * Retrieve image info based on an id.
 * 
 * @param id The id of the image to look up.
 */
function imgur_getImage(id) {
	var url = imgur_getImage + id;
	$.ajax({
		url: url,
		success: imgur_getResponse,
		dataType: "json",
		headers: {"Authorization" : imgur_clientId}
	});
}

/**
 * The callback for the getImage request.
 * 
 * This function will also fill in the respective gallery
 * slot if the image exists.
 * 
 * @param json JSON returned by the getImage request
 * @returns null
 */
function imgur_getResponse(json) {
	var data = $.parseJson(json);
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
		else {
			return {'success':false, 'data':'Unknown file type'}
		}
		
		var url = 'http:' + imgur_viewImage + data['data']['id'] + 'm' + ext;
		
		var addImage = document.getElementById(data['data']['id']).addImage;
		if(addImage != null) {
			addImage(url, ext);
		}
		else {
			document.getElementById(data['data']['id']).fail();
		}
	}
	else {d
		document.getElementById(data['data']['id']).fail();
	}
}

/* Hangout App Functions */


/**
 * Callback for when App state changes
 */
function updateState(event) {
	if(event.removedKeys.length > 0) {
		for(var k in event.removedKeys) {
			removeImageFromGalleryList(k);
		}
	}
	else if(event.addKeys.length > 0) {
		for(var k in event.event.addKeys) {
			addImageToGalleryList(k);
		}
	}
	else if(event.addKeys.length == 0 && event.removeKeys.length == 0) {
		/* Refresh List */
		// Add phase
		for(var key in state) {
			var ele = document.getElementById(key);
			if(ele == null) {
				addImageToGalleryList(key);
			}
		}
		// Remove Images not in State
		var node = document.getElementById("img-list").firstChild;
		var end = document.getElementById("img-list-dropzone");
		while(node != end) {
			if(state[node.getAttribute("id")] == null) {
				document.getElementById("img-list").removeChild(node);
			}
			node = node.nextSibling;
		}
		
	}
}

function addImageToGalleryList(k) {
	/* Make sure image doesn't already exit */
	if(document.getElementById(k) != null) continue;
	
	var slot = createImageSlot(k);
	
	/* Set the AddImage call back for after
	 * polling image info.
	 */
	slot.addImage = function(url,ext) {
		
		// Remove 'Loading' text
		var children = this.childNodes;
		for(var child in children) {
			this.removeChild(child);
		}
		// Remove the addImage function
		this.addImage = null;
		
		// Create the image and set it up
		var img = document.createElement("IMG");
		img.setAttribute("src", url);
		$(img).data("ext", ext);	// Store the file extension for when clicked
		img.onclick = onGalleryImageClick;
	}
	
	slot.fail = function() {
		this.style.borderColor = "red";
		$().toastmessage("showErrorToast", "Error fetching image");
		
		// Remove the node
		var parent = this.parentNode;
		parent.removeChild(this);
	}
	
	// Place slot in list
	var dropnode = document.getElementById("img-list-dropzone"); 
	document.getElementById("img-list").insertBefore(slot, dropnode);
}

function uploadImage(data) {
	
}

//function onDeleteImage(data) {}


/*
 * Show the gallery image on the main pane
 */
function onGalleryImageClick() {
	// Get ID
	var id = this.parentNode.getAttribute("id");
	var ext = $(this).data['ext'];
	
	// Get mainview and change it
	var img = document.getElementById("img-main-view");
	var url = 'http:' + imgur_viewImage + id + ext; 
	img.setAttribute('src', url);
}

/**
 * Remove the specified image from the gallery list.
 * 
 * @param key An id for a slot to remove.
 */
function removeImageFromGalleryList(key) {
	var node = document.getElementById(key);
	if(node) {
		document.getElementById("img-list").removeChild(node);
	}
}

/*
 * Creates a blank slot in the gallery while the thumb loads 
 */
function createImageSlot(key) {

	// Create a holder slot while image loads
	var node = document.createElement("DIV");
	node.style.width = "160px";
	node.style.height = "160px";
	node.style = "5px solid black";
	node.style.textAlign = "center";
	node.setAttribute("id", key);
	
	// Set filler text to notify user of loading
	txt = Text("Loading...");
	node.appendChild(txt);
	
	return node;
}


// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log('Init app.');
  
  // Get End of Image list (ie: Add/Drop Img zone)
  window.imgListDropZone = document.getElementById("img-list-dropzone")
  
  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      console.log('API is ready');

      gapi.hangout.data.onStateChanged.add(function(eventObj) {
        updateStateUi(eventObj.state);
      });

      updateStateUi(gapi.hangout.data.getState());
      updateParticipantsUi(gapi.hangout.getParticipants());

      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  // This application is pretty simple, but use this special api ready state
  // event if you would like to any more complex app setup.
  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
