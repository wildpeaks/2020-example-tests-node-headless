"use strict";

window.MyLibrary = function(container) {
	if (container) {
		var tag = document.createElement("b");
		tag.innerText = "Hello World";
		container.appendChild(tag);
	}
};
