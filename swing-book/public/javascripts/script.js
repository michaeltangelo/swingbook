function handleSubmitClick(evt) {
	// console.log("Handle submit click called.");
	evt.preventDefault();
	var formTextField = document.getElementById('testText');
	var data = formTextField.value;
	console.log("The data received from the testForm post is: " + data);
	var newDiv = document.createElement('p');
	newDiv.innerHTML = data;
	formTextField.value = "";
	var dataDiv = document.getElementById('testData');
	dataDiv.appendChild(newDiv);
}

function f() {
	// console.log("Script.js loaded.");
	document.addEventListener("DOMContentLoaded", function(evt) {
		// console.log("Dom is loaded.");
		var submit = document.getElementById('submit');
		submit.addEventListener('click', handleSubmitClick, false)
		// document.getElementById('testData').innerHTML
	});
}

f();