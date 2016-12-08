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
			}
			else req.open('POST', '/events/'+slug+'/join', true);
			// console.log("requesting url: /events/"+slug+'/join');
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			// req.send('director='+director+'&title='+title+'&year='+year);
			req.send();
			req.onreadystatechange = function() {
				// console.log(req.readyState);
				if(req.readyState == 4 && req.status == 200) {
					if (req.responseText === "failed") {
						window.location.href = '/';
					}
					else if (req.responseText === 'added') {
						join.innerHTML = "Unattend Event";
					}
					else if (req.responseText === 'removed') {
						join.innerHTML = "Join Event";
					}
					else {
						// console.log(req.responseText);
					}
				}
			}
		}
	});
}

f();