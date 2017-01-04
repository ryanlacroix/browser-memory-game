// Ryan Lacroix, 100901696
// Assignment 3

var user;
var level;
var guesses = 0;
var complete = false;
window.addEventListener('load', function(){
	user = prompt("Enter your name", "user");
	getNewBoard();
}) // Ready

function displayGame(data) {
	console.log("Ajax received!");
	complete = false;
	level = data.level;
	$("#dif").text(level);
	$("#gameboard").empty();
	for (var i = 0; i < data.level; i++) {
		var tempRow = $("<tr></tr>");
		for (var j = 0; j < data.level; j++) {
			var tempCard = $("<div class='card' data-column='" + j + "' data-row='" + i + "'></div>");
			tempCard.click(chooseCard);
			tempRow.append(tempCard);
		}
		$("#gameboard").append(tempRow);
	}
}

var noClick = false; // Locks card selection
function chooseCard(){
	if (noClick === true)
		return;
	var thisCard = $(this); // Needed for the setTimeout (for some reason)
	if (!$(this).hasClass("faceUp")){
		// Card not already faceup
		if (!$('*').hasClass("active")) {
			// No other cards active
			$(this).toggleClass("faceUp");
			$(this).toggleClass("active");
			getCardInfo($(this));
		} else if ($('*').hasClass("active")) {
			// Temporarily disallow selection of other cards.
			noClick = true;
			getCardInfo($(this));
			thisCard.toggleClass("faceUp");
			var otherCard = $(".active");
			// Wait 1/5th of a second before comparing values.
			// Super bad way to do this. Use until I figure out something better.
			setTimeout(function(){
				if (otherCard.text() == thisCard.text()){
					console.log("match!");
					otherCard.removeClass("active");
					thisCard.removeClass("active");
					noClick = false;
					guesses++;
					checkIfComplete();
				} else {
					setTimeout(function(){
						// Allow the user time to view the cards.
						otherCard.removeClass("active");
						otherCard.removeClass("faceUp");
						thisCard.removeClass("faceUp");
						thisCard.text("");
						otherCard.text("");
						noClick = false;
						guesses++;
					},1000);
				}
			}, 200)
		}
	}
}

function checkIfComplete(){
	if ($('.faceUp').length == (level * level)) {
		alert("You've won with " + guesses + " guesses! Next one will be tougher.");
		guesses = 0;
		complete = true;
		getNewBoard();
	}
}

function getNewBoard() {
	$.ajax({
	 	method:"GET",
	  	url:"/memory/intro",
	  	data: {'username':user, 'complete':complete.toString()},
	  	success: displayGame,
	  	dataType:'json'
	});
}

function getCardInfo(card){
	function infoArrived(data){
		card.text(data.cardValue);
	}
	var row = card.attr("data-row");
	var column = card.attr("data-column");
	$.ajax({
	 	method:"GET",
	  	url:"/memory/card",
	  	data: {'row': row, 'column': column, 'username':user},
	  	success: infoArrived,
	  	dataType:'json'
	});
}
