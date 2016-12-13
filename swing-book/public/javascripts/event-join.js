function f() {

	// Change join button text if user is already in database
	document.addEventListener('DOMContentLoaded', function() {
		var joinButtons = document.getElementsByClassName('joinEvent');
		// for each button, check if user is 'attending' the event
		var requests = [];
		for (var i = 0; i < joinButtons.length; i++) {
			var button = joinButtons[i];
			var request = new XMLHttpRequest();
			var slug = button.getAttribute('data-slug');
			request.open('POST', '/events/'+slug+'/check', true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			requests.push([request, button]);
		};

		requests.forEach(function(ele) {
			var request = ele[0];
			var button = ele[1];
			request.send();
			request.onreadystatechange = function() {
				// console.log(request.readyState);
				if (request.readyState == 4 && request.status == 200) {
					if (request.responseText === 'attending') {
						button.innerHTML = "Unattend Event";

						// update the class to btn-inverse
						button.className = "joinEvent btn btn-s btn-inverse btn-block";
					}
				}
			}
		});

		for (var i = 0; i < joinButtons.length; i++) {
			var button = joinButtons[i];
			button.addEventListener('click', function(evt) {
				handleClick(evt.target);
			});
		}

		function handleClick(button) {
			// console.log("inside handle click with slug: " + slug);
			// var join;
			// get the button by slug
			// for (var i = 0; i < joinButtons.length; i++) {
			// 	if (joinButtons[i].getAttribute('data-slug') === slug) {
			// 		console.log("found the correct button.");
			// 		join = joinButtons[i];
			// 		break;
			// 	}
			// }
			var join = button;
			var slug = button.getAttribute('data-slug');
			var req = new XMLHttpRequest();
			if (join.innerHTML === "Unattend Event") {
				req.open('POST', '/events/'+slug+'/remove', true);
				console.log("requesting url: /events/"+slug+'/remove');
			}
			else {
				req.open('POST', '/events/'+slug+'/join', true);
				console.log("requesting url: /events/"+slug+'/join');
			}
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			// req.send('director='+director+'&title='+title+'&year='+year);
			req.send();
			req.onreadystatechange = function() {
				console.log(req.readyState);
				if(req.readyState == 4 && req.status == 200) {
					var res = req.responseText.split(",");
					if (res[0] === "failed") {
						window.location.href = '/';
					}
					else if (res[0] === 'added') {
						// incremenet num attendees on the event
						var numAttendingEle = document.getElementById('numAttending');
						if (numAttendingEle) {
							var numAttending = parseInt(numAttendingEle.innerHTML);
							numAttendingEle.innerHTML = (numAttending+1)+"";
						}

						// Update The Join button to correct string
						join.innerHTML = "Unattend Event";

						// update the class to btn-inverse
						join.className = "joinEvent btn btn-s btn-inverse btn-block";

						// Change the list to display proper attendees
						var attendingList = document.getElementById('attendingUsers');
						if (attendingList) {
							var li = document.createElement('li');
							var firstName = res[1];
							var lastName = res[2];
							var a = document.createElement('a');
							a.href = "#";
							a.appendChild(document.createTextNode(firstName + ' ' + lastName));
							li.appendChild(a);
							attendingList.appendChild(li);
						}
					}
					else if (res[0] === 'removed') {
						// console.log("User was removed: res = " + JSON.stringify(res));
						// Decrement num attendees on the event
						var numAttendingEle = document.getElementById('numAttending');
						if (numAttendingEle) {
							var numAttending = parseInt(numAttendingEle.innerHTML);
							numAttendingEle.innerHTML = (numAttending-1)+"";
						}

						// Update The Join button to correct string
						join.innerHTML = "Join Event";

						// update the class to btn-inverse
						join.className = "joinEvent btn btn-s btn-primary btn-block";

						// Change the list to display proper attendees
						var attendingList = document.getElementById('attendingUsers');
						if (attendingList) {
							var items = attendingList.getElementsByTagName('li');
							for (var i = 0; i < items.length; i++) {
								var nameCheck = res[1] + ' ' + res[2];
								if (items[i].getElementsByTagName('a')[0].innerHTML === nameCheck) {
									console.log("Matched li with user: " + nameCheck + "| removing");
									items[i].remove();
								}
							}
						}
					}
					else {
						console.log(req.responseText);
					}
				}
			}
		}
	});
}

f();