var user;
window.addEventListener('load', function(){
	user = prompt("Enter your name", "user");
	$.ajax({
	 	method:"GET",
	  	url:"/memory/intro",
	  	data: {'username':user},
	  	success: displayGame,
	  	dataType:'json'
	});
}) // Ready

function displayGame(data) {
	console.log("Ajax received!");
	//$("#userPrompt").text(data.question);
	$("#gameboard").empty();
	var tempBoard; // Store the board as its built
	/*
	for (var i = 0; i < data.options.length; i++) {
		var tempDiv = $("<div class ='tile' data-index='" + i + "'></div>");
		tempDiv.css("background-color", data.options[i]);
		tempDiv.click(chooseTile);
		tempBoard.append(tempDiv);

	} */

	for (var i = 0; i < data.level; i++) {
		var tempRow = $("<tr></tr>");
		for (var j = 0l j < data.level; j++) {
			
		}
	}
	$("#gameboard").append(tempBoard);

}

function chooseTile(){
	var selectedColor = $(this).attr('data-index');
	$.ajax({
		method:"GET",
		url:"/colors/choice",
		data: {'username': user, 'choice': selectedColor},
		success: displayGame,
		datatype: 'json'
	});
}