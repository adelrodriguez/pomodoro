$(document).ready(function() {
	var sessionTime;
	var breakTime;
	var timerID;
	var audio = new Audio('https://dl.dropboxusercontent.com/s/02y8d8zetwdz6rn/Ding%20-%20Sound%20Effects%20YouTube.wav');

	var pomodoro = {
		setTimes: function(action) {
			switch (action) {
				case "subtract-session":
					// set one minute as minimum session length
					if (sessionTime > 1) {
						sessionTime--;
					}
					break;
				case "add-session":
					sessionTime++;
					break;
				case "subtract-break":
					// set one minute as minimum break time
					if (breakTime > 1) {
						breakTime--;
					}
					break;
				case "add-break":
					breakTime++;
					break;
			}

			pomodoro.displayTimes(sessionTime);
		},
		displayTimes: function(currentTime) {
			$("#set-session .time").text(sessionTime);
			$("#set-break .time").text(breakTime);
			$("#timer .time").text(currentTime + ':00');

			// update progress bar to set data total to session value
			$('.progress').progress({
				total: currentTime * 60
			});
		},
		runTimer: function() {
		 	var displayTime = $("#timer .time").text().split(':');
		 	pomodoro.timer(displayTime[0], displayTime[1]);
		},
		pauseTimer: function() {
			clearTimeout(timerID);
		},
		timer: function(minutes, seconds) {
			if (seconds > 0) {
				timerID = setTimeout(function () {
					seconds--;
					$(".progress").progress('increment');
					$("#timer .time").text(minutes + ':' + (seconds < 10 ? '0' + seconds : seconds));
					pomodoro.timer(minutes, seconds);
				}, 1000);
			} else {
				if (minutes > 0) {
					pomodoro.timer(--minutes, 60);
				} else {

					pomodoro.isBreak = !pomodoro.isBreak;
					pomodoro.changeSession();
				}
			}
		},
		changeSession: function() {
			// play audio when changing lesson
			audio.play();
			
			$(".progress").progress('reset');
			if (pomodoro.isBreak) {
				pomodoro.displayTimes(breakTime);
				$(".label").text("Break " + pomodoro.count++);
			} else {
				pomodoro.displayTimes(sessionTime);
				$(".label").text("Session " + pomodoro.count);
			}

			pomodoro.runTimer();
		},
		reset: function() {
			$(".progress").progress('reset');
			pomodoro.displayTimes(sessionTime);
			pomodoro.isBreak = false;
			pomodoro.count = 1;
			$(".label").text("Session " + pomodoro.count);
		},
		isBreak: false,
		count: 1,
	};

	init();

	function init() {
		// set initial length for break and session
		sessionTime = 25;
		breakTime = 5;
		pomodoro.displayTimes(sessionTime);
	}

	$(".switch").click(function() {
		if ($(this).hasClass("play")) {
			pomodoro.runTimer();
			$(this).html('<i class="pause icon"></i> Pause');
			$(".reset").attr("disabled", true);
		} else if ($(this).hasClass("pause")) {
			pomodoro.pauseTimer();
			$(this).html('<i class="play icon"></i> Play');
			$(".reset").attr("disabled", false);
		}

		$(".plus, .minus").attr("disabled", true);
		$(this).toggleClass("play").toggleClass("pause");
	});

	$(".plus, .minus").click(function() {
		pomodoro.setTimes($(this).val());
	});

	$(".reset").click(function() {
		pomodoro.reset();
		$(".plus, .minus").attr("disabled", false);
	});
});