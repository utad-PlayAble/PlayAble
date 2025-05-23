"use strict"
// Board buttons theme, graphical only
let theme = 1;
let level = 0;
// For create level mode.
let placemode = 0;
// Gamemode 0 = Regular play; Gamemode 1 = Level editor
let gamemode = 0;
// This are for sound/music toggles
let playSound = 1;
let playMusic = 1;
// Keeps track of which levels we've unlocked so the player can chose them from the menu
let unlockedLevels = 0;
// Tracks and shows the number of moves per level
let clicks = 0;
// This is all of our levels.
let levelArray = [
	[1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1],
	[1,0,0,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,1],
	[1,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,1],
	[0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0],
	[0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0],
	[1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
	[0,0,1,1,0,0,0,1,0,1,1,0,1,0,0,0,1,0,0,0,0,1,1,1,0],
	[1,0,0,0,1,0,1,0,1,0,1,1,0,1,1,1,0,0,0,1,1,0,0,0,1],
	[1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
	[0,0,0,0,0,0,0,1,1,1,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0],
	[0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
	[0,1,0,1,0,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,0,1,0,1,0],
	[0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,1,1,1,1,0,0,1,1,0,0],
	[1,0,1,0,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,0,1,0,1],
	[1,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1],
	[1,1,0,1,0,0,0,1,1,0,0,1,0,1,0,0,1,1,0,0,0,1,0,1,1],
	[1,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,1,0,1,0],
	[0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,1,1,0],
	[1,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1,1],
	[0,1,0,1,0,1,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,1],
	[0,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0],
	[0,1,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,1,1,1,0,1,0],
	[0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0],
	[0,0,1,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,0,0],
	[1,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,0,1,0,1,0,0,1,1,0],
	[0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
	[1,1,0,1,1,1,0,0,0,1,1,1,0,1,1,1,0,0,0,1,1,1,0,1,1],
	[0,0,0,1,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,0,0,0],
	[1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,1],
	[1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0],
	[1,0,0,1,0,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,1,0,0,1,0],
	[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
	[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1],
	[0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0],
	[1,1,0,1,1,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,1,1,0,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
	[0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0],
	[0,1,0,1,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,0,1,0,1,0],
	[0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0],
	[0,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],
	[0,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,0,0,1,0,0],
	[0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,1,1,0,1,1,1,0,0,0,1],
	[0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0],
	[0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0],
	[1,0,1,0,0,0,1,1,0,1,0,0,1,1,1,0,1,1,0,1,1,0,1,0,0],
	[1,0,1,0,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1],
	[0,0,1,0,0,1,1,0,1,0,1,0,1,1,1,1,1,0,0,1,0,0,1,0,1],
	[0,1,1,1,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,1,1,1,0],
	[1,1,1,1,1,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,1,1,1,1,1],
	[1,1,0,1,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,1,0,1,0,1,1],
	[1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,1]
];
// This will be changeable in the future in custom game modes
let gameboardSize = 5;
// Grabs all links within the gameboard table
let gamepieces = document.getElementById("gameboard").querySelectorAll("a");
// Grabs all links within the level editor gameboard table
let gamepiecesCreate = document.getElementById("gameboard_create").querySelectorAll("a");

// =========== Sounds ============
let menuSound = new Audio("files/menuToggle.wav");
let pressSound = new Audio("files/beep.mp3");
let resetSound = new Audio("files/reset.wav");
let winSound = new Audio("files/win.mp3");
let clickSound = new Audio("files/click.wav");

let menuMusic = document.getElementById("menuMusic_element");
	menuMusic.loop = true;
let audio = new Audio();
let gameMusic = [
	"music/awesome_blynn.mp3",
	"music/cold.mp3",
	"music/erotic malfunction.mp3",
	"music/inflight.mp3",
	"music/anette.mp3",
	"music/nicole_fabian.mp3",
	"music/night-in-tunesia.mp3",
	"music/stop the press.mp3",
	"music/whispering silence.mp3"
]

// =========== Menu Code ============
let menuItems = document.getElementById("menu").querySelectorAll("a");
for(let a = 0; a < menuItems.length; a++){
	menuItems[a].addEventListener("mouseenter", (event) => {
		if(playSound) { menuSound.play(); }
	})
}

// Plays menu music
window.addEventListener("load", (event) => {
	if(playMusic == 1)
		menuMusic.volume = 0.4
		menuMusic.play();
});

function playGameMusic() {
	menuMusic.pause();
	//let random = Math.floor(Math.random() * gameMusic.length);
	let methods = {};
    let i = 0;

	audio.addEventListener('ended', function () {
	    i = ++i < gameMusic.length ? i : 0;
	    audio.src = gameMusic[i];
	    audio.play();
	}, true);
	audio.volume = 0.4;
	audio.loop = false;
	audio.src = gameMusic[0];
	if(playMusic == 1) { audio.play() };

	methods.stop = function() {
		audio.pause();
	}

	return methods;
}

// Menu Navigation button codes go here
document.getElementById('play').onclick = function() {
	changeScreen("menu", "main");
	gamemode = 0;
	loadLevel();
};
document.getElementById("load").onclick = function() {
	userLevelLoad();
}
document.getElementById('create').onclick = function() {
	gamemode = 1;
	changeScreen("menu", "createPage");
};
document.getElementById('about').onclick = function() {
	changeScreen("menu", "aboutPage");
};
	document.querySelector('#aboutPage a.button').onclick = function() {
		changeScreen("aboutPage", "menu");
	};
document.getElementById('settings').onclick = function() {
	changeScreen("menu", "settingsPage");
};
	document.querySelector('#settingsPage a.back').onclick = function() {
		changeScreen("settingsPage", "menu");
	};

// Settings page buttons go here
	// Sound toggles
document.querySelector('#settingsPage #soundSlider').onclick = function() {
	if(playSound == 1) { playSound = 0; }
	else { playSound = 1; }
}
	// Sets the slider to display the right setting
if(playSound == 1)
	document.querySelector('#settingsPage #soundSlider').checked = true;
if(playSound == 0)
	document.querySelector('#settingsPage #soundSlider').checked = false;

	// Music toggles
document.querySelector('#settingsPage #musicSlider').onclick = function() {
	if(playMusic == 1)
		{ playMusic = 0; menuMusic.pause(); }
	else 
		{ playMusic = 1; menuMusic.play(); }
}
	// Sets the slider to display the right setting
if(playMusic == 1)
	document.querySelector('#settingsPage #musicSlider').checked = true;
if(playMusic == 0)
	document.querySelector('#settingsPage #musicSlider').checked = false;

	// This just makes sure the correct theme is selected whenever you visit the Settings page
if(theme == 1){
	document.querySelector('#settingsPage #theme1').checked = true;
if(theme == 2)
	document.querySelector('#settingsPage #theme2').checked = true;
if(theme == 3)
	document.querySelector('#settingsPage #theme3').checked = true;
}

// Lets the player choose the board theme
document.querySelector('#settingsPage #theme1').onclick = function() {
	theme = 1;
	document.querySelector('#settingsPage #theme1').checked = true;
}
document.querySelector('#settingsPage #theme2').onclick = function() {
	theme = 2;
	document.querySelector('#settingsPage #theme2').checked = true;
}
document.querySelector('#settingsPage #theme3').onclick = function() {
	theme = 3;
	document.querySelector('#settingsPage #theme3').checked = true;
}

// Reset game data
document.getElementById("resetProgress").onclick = function() {
	if(confirm("Are you sure? This will set you back to level 1.")){
		level = 0;
	}
}

// This generic function changes the screens on the page
function changeScreen(exitPage, enterPage){
	if(playSound) { clickSound.play() };
	// If we're leaving the menu, make sure we stop the music
	if(exitPage == "menu"){ if(playMusic == 1) { menuMusic.pause(); } }
	// If we're entering the menu, on the other hand, play the menu music
	if(enterPage == "menu") { if(playMusic == 1) { menuMusic.play(); } }
	// If we're leaving the gameboard, make sure we stop the music
	if(exitPage == "main"){ if(playMusic == 1) { audio.pause();; } }
	// If we're entering the gameboard, on the other hand, play the menu music
	if(enterPage == "main") { if(playMusic == 1) { playGameMusic(); } }

	document.getElementById(exitPage).style.display = "none";
	document.getElementById(enterPage).style.display = "block";
}

// =========== Game Code ============
// Attaches a click event to each link on the gameboard
for(let x = 0; x < gamepieces.length; x++){
	gamepieces[x].onclick = function() { pressLight(gamepieces) };
}
// Does the same thing, but for the level editor
for(let x = 0; x < gamepieces.length; x++){
	gamepiecesCreate[x].onclick = function() { pressLight(gamepiecesCreate) };
}

// Function to toggle lights on the board
function pressLight(gamepiecesArray) {
	// Get the light we've been sent by pulling its ID
	let currentLight = event.target.id;
	let lightIndex = "";
	// Search through the gamepieces array to find that ID
	// Custom array search function. I couldn't find a built-in that handles this, though I maybe just didn't look hard enough
	for(let y = 0; y < gamepiecesArray.length; y++){
		if(gamepiecesArray[y].id == currentLight)
			lightIndex = y;
	}
	// Send it to a function that does the following: Toggle the original light, the light -1 index from it, the light +1 index from it, the light gameboardSize-1 from it and the light gameboardSize+1 from it. Check to make sure each exists because if it doesn't, it's at the edge of the board.
	checkLights(lightIndex, gamepiecesArray);
	// Eventually that code my be replaced for an alternate "X" mode that I want to add later on

	return 0;
}

function checkLights(index, gamepiecesArray) {
	// Calculate width of rows
	let rowLength = gamepieces.length / gameboardSize;

	// This checks to see if we're in Single Place Mode in the create board.
	if(placemode == 1){
		// Places a single light instead of the grid
		toggleLight(index, gamepiecesArray);
		if(playSound) { pressSound.play(); }
	}
	else{
		// if we're on the right edge of the board
		if((index+1) % rowLength == 0){
			// Clicked piece
			toggleLight(index, gamepiecesArray);
			// Top piece
			toggleLight(index-5, gamepiecesArray);
			// Bottom piece
			toggleLight(index+5, gamepiecesArray);
			// Left piece
			toggleLight(index-1, gamepiecesArray);
		}
		// if we're on the left edge of the board
		else if((index+1) % rowLength == 1){
			// Clicked piece
			toggleLight(index, gamepiecesArray);
			// Top piece
			toggleLight(index-5, gamepiecesArray);
			// Bottom piece
			toggleLight(index+5, gamepiecesArray);
			// Right piece
			toggleLight(index+1, gamepiecesArray);
		}
		// All other sides and middle
		else {
			// Clicked piece
			toggleLight(index, gamepiecesArray);
			// Top piece
			toggleLight(index-5, gamepiecesArray);
			// Bottom piece
			toggleLight(index+5, gamepiecesArray);
			// Left piece
			toggleLight(index-1, gamepiecesArray);
			// Right piece
			toggleLight(index+1, gamepiecesArray);
		}
		if(playSound) { pressSound.play(); }

		// This part only gets processed if we're in gameplay mode, and not level editor mode
		if(gamemode == 0){
			let win = checkWin();
			if(win == 1){
				if(playSound) { winSound.play(); }
				// Maybe do something fancy here?
				level++;
				unlockedLevels++;
				if(levelArray[level]){
					loadLevel();
				}
				else{
					// We've completed all levels
					// Populate the modular dialog box and show it on screen.
					document.getElementById("modular").style.display = "block";
					document.querySelector("#modular h1").innerHTML = "Congratulations!!!";
					document.querySelector("#modular p").innerHTML = "You've beaten all the levels in the game! Wow! How about making some of your own now?" + "<p><a href='#' class='button'>Back</a></p>";
					// Hide the modular box and the game board and show the menu when the user clicks the "back" button
					document.querySelector("#modular .button").onclick = function() { changeScreen("modular", "menu"); changeScreen("main", "menu"); }
					// Reset the level count to the beginning
					level = 0;
				}
			}
		}
	}
}

// Non game piece buttons are here (menu, settings, etc.)
// Reset button
document.getElementById("resetButton").onclick = function() { loadLevel(); if(playSound) { resetSound.play(); } };
document.getElementById("resetButton_create").onclick = function() {
	emptyBoard(gamepiecesCreate);
	if(playSound) { resetSound.play(); }
};
// Menu button
document.getElementById("backToMenu").onclick = function() { changeScreen("main", "menu"); }
document.getElementById("backToMenu_create").onclick = function() { changeScreen("createPage", "menu"); }

// =========== Game functions ===========
 // In-game settings menu
let settingsButtons = document.querySelectorAll(".settingsButton");
settingsButtons[0].onclick = settingsButtons[1].onclick = function() {
	let modular = document.getElementById("modular");
	modular.querySelector("h1").innerHTML = "Settings";
	modular.querySelector("p").innerHTML = "Music: <label class='switch' for='musicSlider_mod'><input type=checkbox id='musicSlider_mod'><span class='slider'></span></label><br>";
	modular.querySelector("p").innerHTML += "Sound: <label class='switch' for='soundSlider_mod'><input type=checkbox id='soundSlider_mod'><span class='slider'></span></label><br>";
	document.querySelector("#modular p").innerHTML += "<p><a href='#' class='button'>Back</a></p>";

	// Sets the slider to display the right setting
	if(playMusic == 1)
		document.querySelector('#modular #musicSlider_mod').checked = true;
	if(playMusic == 0)
		document.querySelector('#modular #musicSlider_mod').checked = false;
	document.querySelector('#modular #musicSlider_mod').onclick = function() {
		if(playMusic == 1) { playMusic = 0; }
		else { playMusic = 1; }
	}

	// Sets the slider to display the right setting
	if(playSound == 1)
		document.querySelector('#modular #soundSlider_mod').checked = true;
	if(playSound == 0)
		document.querySelector('#modular #soundSlider_mod').checked = false;
	document.querySelector('#modular #soundSlider_mod').onclick = function() {
		if(playSound == 1) { playSound = 0; }
		else { playSound = 1; }
	}
	// Hide the modular box and the game board and show the menu when the user clicks the "back" button
	document.querySelector("#modular .button").onclick = function() { changeScreen("modular", "main"); }

	modular.style.display = "block";
}

 // This handles the level select button at the top of the game board
document.getElementById("levelSelectDisplay").onclick = function() {
	// This uses the modular dialog box, so we'll have to populate it with all the content here.
	document.getElementById("modular").style.display = "block";
	document.querySelector("#modular h1").innerHTML = "Select Level";
	document.querySelector("#modular p").innerHTML = level+1;
	document.querySelector("#modular p").innerHTML += "<p><a href='#' class='button'>Back</a></p>";

	// Hide the modular box and the game board and show the menu when the user clicks the "back" button
	document.querySelector("#modular .button").onclick = function() { changeScreen("modular", "main"); }

}

// Toggles the actual lights
function toggleLight(index, gamepiecesArray){
	if(gamepiecesArray[index]){
		if(gamepiecesArray[index].className == "off" + theme)
			gamepiecesArray[index].className = "on" + theme;
		else
			gamepiecesArray[index].className = "off" + theme;
	}
}

// Checks for win condition and returns 1 if true. Dialogs and stuff are taken care of elsewhere
function checkWin() {
	// Checks to see if we won, and if so displays a message
	for(let z = 0; z < gamepieces.length; z++){
		if(gamepieces[z].className == "on" + theme){
			return 0;
		}
	}
	return 1;
}

// This just clears the board completely. Used in a few different areas
function emptyBoard(board){
	for(let b=0; b < board.length; b++){
		board[b].className = "off" + theme;
	}
}

// Loads the current level
function loadLevel() {
	// Loads a level
	let currentLevel = levelArray[level];
	// Check to make sure the level exists. If it doesn't we've completed all of them and won the entire game!

	// First we have to blank the board out. This could probably be spun off into a separate function
	emptyBoard(gamepieces);
	// Loop through the current level array. For each time we come across a "1", just use the toggleLights function to turn the light on.
	for(let b=0; b < gamepieces.length; b++){
		if(currentLevel[b] == 1)
			toggleLight(b, gamepieces);
	}

	// Now we just make sure the level display is showing the right number
	document.getElementById("levelSelectDisplay").innerHTML = "Level " + (level+1);
}

document.getElementById("getCode").onclick = function() { getCode(); }
// This is for getting the level code once you've finished making it in the Level Creator
function getCode() {
	let level = new Array();
	let levelPrint = "[";
	// This just loops through the game board and marks down into a new array each time we have a light that's on.
	for(let c = 0; c < gamepiecesCreate.length; c++){
		let currentClass = gamepiecesCreate[c].className;

		if(currentClass.search("on"))
			level.push(0);
		else
			level.push(1);
	}

	//This converts the new array to a nice string that looks good when we print it out
	for(let c = 0; c < gamepiecesCreate.length; c++){
		levelPrint += level[c] + ","
	}
	// Trim off that trailing comma...
	levelPrint = levelPrint.substring(0, levelPrint.length - 1);
	levelPrint += "]"

	// This populates the dialog box and displays it to the user
	let modular = document.getElementById("modular");
	modular.querySelector("h1").innerHTML = "Level Code";
	modular.querySelector("p").innerHTML = "Copy and paste the below code somewhere, and then paste it into the box that appears when you click the 'Load' button on the main menu<br><br>";
	modular.querySelector("p").innerHTML += "<textarea>" + levelPrint + "</textarea><br><br>"
	modular.querySelector("p").innerHTML += "<a href='#' class='button'>Close</a>";
	modular.querySelector("a.button").onclick = function() { changeScreen("modular", "createPage"); }
	modular.style.display = "block";

}

function userLevelLoad() {
	// Populate the modular dialog box with instructions and an input box
	let modular = document.getElementById("modular");
	modular.querySelector("h1").innerHTML = "Load Level";
	modular.querySelector("p").innerHTML = "Paste your level code into the box below<br><br>";
	modular.querySelector("p").innerHTML += "<textarea></textarea><br><br>";
	modular.querySelector("p").innerHTML += "<a href='#' class='button' id='loadButton'>Load</a>";
	modular.querySelector("p").innerHTML += "<a href='#' class='button' id='cancelButton'>Cancel</a>";
	modular.querySelector("a#loadButton").onclick = function() { userLevelLoad_yes(); }
	// This closes the box if the user clicks "Cancel"
	modular.querySelector("a#cancelButton").onclick = function() { changeScreen("modular", "menu"); }
	modular.style.display = "block";


	// This function is loaded when the user clicks "Load"
	function userLevelLoad_yes() {
		// Grab the input text, trim whitespace, and convert it to an array
		let loadedLevel = modular.querySelector("textarea").value.trim().split(",");

		// Empty the board first, just in case
		emptyBoard(gamepieces);
		// Loop through the provided level array. For each time we come across a "1", just use the toggleLights function to turn the light on.
		for(let b=0; b < loadedLevel.length; b++){
			if(loadedLevel[b] == 1)
				toggleLight(b, gamepieces);
		}
		changeScreen("modular", "menu");
		changeScreen("menu", "main");
	}
}

document.getElementById("gameMode").onclick = function() {
	let buttonText = document.getElementById("gameMode");
	if(placemode == 0){
		buttonText.innerHTML = "Mode: single";
		placemode = 1;
	}
	else{
		buttonText.innerHTML = "Mode: grid";
		placemode = 0;
	}
}