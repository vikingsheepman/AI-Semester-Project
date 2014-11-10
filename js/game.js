// <editor-fold desc="INTRO">
// Brian Maher
// Killian Smith
// CSCI 446 - Artificial Intelligence
// Semester Project - Polar Tic-Tac-Toe

// game.js
// This file holds the front-end game logic and sends and receives messages from the back-end 'game logic' server.
// </editor-fold>

// <editor-fold desc="GLOBALS">
// GLOBAL VARIABLES
var gameCanvas;                                     // The canvas the game will be contained within
var gameStage;                                      // The primary stage holding all of our game elements
var mainMenuContainer = new createjs.Container();   // The container for the main menu elements
var gameContainer = new createjs.Container();       // The container for the PvP game elements

// GLOBAL 'SETTINGS'
// 'main menu'
var mainMenuFontStyle = 'bold';
var mainMenuFontSize = '70px';
var mainMenuFontType = 'Impact';
var mainMenuFont = mainMenuFontStyle + ' ' + mainMenuFontSize + ' ' + mainMenuFontType;
var mainMenuFontColor = '#ffffff';

// 'pvp game'
var radius = 100;
var pointSize = 10;
var pointOffset = pointSize / 2;
var gameTextFontSize = '40px';
var gameTextFont = gameTextFontSize + ' ' + mainMenuFontType;
var gamePlayersTurnText;
var coordinateText;
var currentPlayer = 1;
var p1Color = '#7ec0ee';
var p2Color = '#ffa500';
// </editor-fold>

// <editor-fold desc="INITIALIZATION METHODS">
// init() - sets up the game gameStage and game elements. This gets called by the <body> onLoad() event
function init() {
    // get the gameCanvas from the HTML document
    gameCanvas = document.getElementById('gameCanvas');

    // initialize gameStage to manage all of the game elements
    gameStage = new createjs.Stage('gameCanvas');
    gameStage.enableMouseOver(10);

    // add a ticker to the gameStage object
    createjs.Ticker.on('tick', gameStage);

    // initialize the game music
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashPlugin]);
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", loadHandler);
    createjs.Sound.registerSound("static/sounds/CyberStreets.mp3", "bgMusic");

    // initialize the main menu for our game
    initMainMenu();

    // update the stage
    gameStage.update();
}

// initMainMenu() - sets up the mainMenuContainer element and attaches all of the main menu game elements to the
// container. This is called from the main init() function when the main menu is ready to be initialized
function initMainMenu() {
    // clear all previous elements
    gameContainer.removeAllChildren();
    gameStage.removeAllChildren();

    // <editor-fold desc="create and initialize the text buttons for the main menu buttons">
    // 'Constellations'
    var mainMenuTitle = new createjs.Text('Constellations', 'bold 70px titleFont', mainMenuFontColor);
    mainMenuTitle.x = centerElement(gameCanvas.width, mainMenuTitle.getBounds().width);
    mainMenuTitle.y = 50;
    // 'Player vs Player'
    var mainMenuPvPButton = new createjs.Text('Player vs Player', mainMenuFont, mainMenuFontColor);
    mainMenuPvPButton.x = centerElement(gameCanvas.width, mainMenuPvPButton.getBounds().width);
    mainMenuPvPButton.y = 200;
    var mainMenuPvPButtonHitArea = new createjs.Shape();
    mainMenuPvPButtonHitArea.graphics.beginFill('#000').drawRect(0, 0,
        mainMenuPvPButton.getMeasuredWidth(), mainMenuPvPButton.getMeasuredHeight());
    mainMenuPvPButton.hitArea = mainMenuPvPButtonHitArea;
    mainMenuPvPButton.on('mouseover', mainMenuButtonMouseHover);
    mainMenuPvPButton.on('mouseout', mainMenuButtonMouseHover);
    mainMenuPvPButton.on('click', initGame);
    // 'Player vs AI'
    var mainMenuPvAIButton = new createjs.Text('Player vs AI', mainMenuFont, mainMenuFontColor);
    mainMenuPvAIButton.x = centerElement(gameCanvas.width, mainMenuPvAIButton.getBounds().width);
    mainMenuPvAIButton.y = 350;
    var mainMenuPvAIButtonHitArea = new createjs.Shape();
    mainMenuPvAIButtonHitArea.graphics.beginFill('#000').drawRect(0, 0,
        mainMenuPvAIButton.getMeasuredWidth(), mainMenuPvAIButton.getMeasuredHeight());
    mainMenuPvAIButton.hitArea = mainMenuPvAIButtonHitArea;
    mainMenuPvAIButton.on('mouseover', mainMenuButtonMouseHover);
    mainMenuPvAIButton.on('mouseout', mainMenuButtonMouseHover);
    // 'About'
    var mainMenuAboutButton = new createjs.Text('About', mainMenuFont, mainMenuFontColor);
    mainMenuAboutButton.x = centerElement(gameCanvas.width, mainMenuAboutButton.getBounds().width);
    mainMenuAboutButton.y = 500;
    var mainMenuAboutButtonHitArea = new createjs.Shape();
    mainMenuAboutButtonHitArea.graphics.beginFill('#000').drawRect(0, 0,
        mainMenuAboutButton.getMeasuredWidth(), mainMenuAboutButton.getMeasuredHeight());
    mainMenuAboutButton.hitArea = mainMenuAboutButtonHitArea;
    mainMenuAboutButton.on('mouseover', mainMenuButtonMouseHover);
    mainMenuAboutButton.on('mouseout', mainMenuButtonMouseHover);
    // 'Help'
    var mainMenuHelpButton = new createjs.Text('Help', mainMenuFont, mainMenuFontColor);
    mainMenuHelpButton.x = centerElement(gameCanvas.width, mainMenuHelpButton.getBounds().width);
    mainMenuHelpButton.y = 650;
    var mainMenuHelpButtonHitArea = new createjs.Shape();
    mainMenuHelpButtonHitArea.graphics.beginFill('#000').drawRect(0, 0,
        mainMenuHelpButton.getMeasuredWidth(), mainMenuHelpButton.getMeasuredHeight());
    mainMenuHelpButton.hitArea = mainMenuHelpButtonHitArea;
    mainMenuHelpButton.on('mouseover', mainMenuButtonMouseHover);
    mainMenuHelpButton.on('mouseout', mainMenuButtonMouseHover);
    // </editor-fold>

    // add all elements of the main menu to the mainMenuContainer
    mainMenuContainer.addChild(
        mainMenuTitle,
        mainMenuPvPButton,
        mainMenuPvAIButton,
        mainMenuAboutButton,
        mainMenuHelpButton
    );

    // add the mainMenuContainer to the gameStage
    gameStage.addChild(mainMenuContainer);

    // update the stage
    gameStage.update();
}

// initGame() - sets up the gameContainer element and attaches all of the game elements to the container. This
// is called from initMainMenu() as a click event handler for the 'Player vs Player' button
function initGame() {
    // clear the mainMenuContainer from the gameStage
    mainMenuContainer.removeAllChildren();
    gameStage.removeAllChildren();

    // initialize the container to manage all of the elements to be displayed in the PvP game
    gameContainer = new createjs.Container();

    // initialize GUI elements
    // 'Exit'
    var gameExitButton = new createjs.Text('Exit', mainMenuFont, mainMenuFontColor);
    gameExitButton.x = gameCanvas.width - gameExitButton.getMeasuredWidth() - 10;
    gameExitButton.y = gameCanvas.height - gameExitButton.getMeasuredHeight() - 30;
    var gameExitButtonHitArea = new createjs.Shape();
    gameExitButtonHitArea.graphics.beginFill('#000').drawRect(0, 0,
        gameExitButton.getMeasuredWidth(), gameExitButton.getMeasuredHeight());
    gameExitButton.hitArea = gameExitButtonHitArea;
    gameExitButton.on('mouseover', mainMenuButtonMouseHover);
    gameExitButton.on('mouseout', mainMenuButtonMouseHover);
    gameExitButton.on('click', initMainMenu);
    // 'Player x's turn'
    gamePlayersTurnText = new createjs.Text('Player 1\'s turn', gameTextFont, mainMenuFontColor);
    gamePlayersTurnText.x = centerElement(gameCanvas.width, gamePlayersTurnText.getMeasuredWidth());
    // 'row = x, ring = y'
    coordinateText = new createjs.Text('', gameTextFont, mainMenuFontColor);
    coordinateText.y = gameCanvas.height - coordinateText.getMeasuredHeight() - 12;

    // store all of the points into an array
    var points = initPoints();

    // add all of the points to the gameContainer
    for (var point in points) {
        gameContainer.addChild(points[point]);
    }

    // add all the GUI elements to the gameContainer
    gameContainer.addChild(
        gameExitButton,
        gamePlayersTurnText,
        coordinateText
    );

    // add the gameContainer to the gameStage
    gameStage.addChild(gameContainer);

    // update the stage
    gameStage.update();
}
// </editor-fold>

// <editor-fold desc="HELPER METHODS">
// centerElement(container, element) - returns the x position for an element to be properly centered
// container - the element's container
// element - the element to be centered
function centerElement(containerWidth, elementWidth) {
    return (containerWidth / 2) - (elementWidth / 2);
}

// toRadians(degree) - calculates the radians given a degree angle
// degree - the angle
function toRadians(degree) {
    return degree * (Math.PI / 180);
}

// calculateCoordinates(ring, theta) - calculates the x and y elements using the Pythagorean Theorem
// ring - the ring 'factor' starting at 1 on the inner ring and going out to 4 on the outer ring
function calculateCoordinates(ring, theta) {
    return {
        x: ((ring * radius * Math.cos(toRadians(theta))) + (gameCanvas.width / 2)) - pointOffset,
        y: ((ring * radius * Math.sin(toRadians(theta))) + (gameCanvas.height / 2)) - pointOffset
    };
}

// initPoints() - generates the points for the game board
function initPoints() {
    // create an array to store the points
    var points = [];
    for (var ring = 1; ring <= 4; ring++) {
        for (var theta = 0; theta < 360; theta += 30) {
            // get the angle coordinates
            var coords = calculateCoordinates(ring, theta);
            // generate the point
            var point = new createjs.Shape();
            point.graphics.beginFill('#ffffff').drawCircle(coords.x, coords.y, pointSize);
            // add point coordinate info
            var row = theta / 30 + 1;
            point.name = row.toString() + ' ' + ring.toString() + ' ' + '0' + ' ' + coords.x + ' ' + coords.y;
            // add mouse over event to each point
            point.on('mouseover', gamePointMouseHover);
            point.on('mouseout', gamePointMouseHover);
            // add mouse click event to each point
            point.on('click', gamePointMouseClick);
            // add point to list
            points.push(point);
        }
    }
    return points;
}

// drawLines(target) - draws lines for visual aid between neighboring points shared by the same player
// target - element clicked
// array elements for these points begin at 0 and end at 47
function drawLines(target) {
    // get target data
    var data = target.name.split(' ');
    var row = data[0];
    var ring = data[1];

    // get target array element
    var element = gameContainer.children.indexOf(target);
    var checkElement;

    if(ring < 4) {
        // check up ring
        checkElement = element + 12;
        checkDraw(checkElement, data);

    }

    if(ring > 1) {
        // check down ring
        checkElement = element - 12;
        checkDraw(checkElement, data);
    }

    // check if in row 1
    if(row == 1) {
        // check up row
        checkElement = element + 1;
        checkDraw(checkElement, data);

        // check down row
        checkElement = element + 11;
        checkDraw(checkElement, data);

        if(ring < 4) {
            // check up row up ring
            checkElement = element + 13;
            checkDraw(checkElement, data);

            // check down row up ring
            checkElement = element + 23;
            checkDraw(checkElement, data);
        }

        if(ring > 1) {
            // check up row down ring
            checkElement = element - 11;
            checkDraw(checkElement, data);

            // check down row down ring
            checkElement = element - 1;
            checkDraw(checkElement, data);
        }
    }

    // check if in row 12
    else if(row == 12) {
        // check up row
        checkElement = element - 11;
        checkDraw(checkElement, data);

        // check down row
        checkElement = element - 1;
        checkDraw(checkElement, data);

        if(ring < 4) {
            // check up row up ring
            checkElement = element + 1;
            checkDraw(checkElement, data);

            // check down row up ring
            checkElement = element + 11;
            checkDraw(checkElement, data);
        }

        if(ring > 1) {
            // check up row down ring
            checkElement = element - 23;
            checkDraw(checkElement, data);

            // check down row down ring
            checkElement = element - 13;
            checkDraw(checkElement, data);
        }
    }

    // not in row 1 or row 12
    else {
        // check up row
        checkElement = element + 1;
        checkDraw(checkElement, data);

        // check down row
        checkElement = element - 1;
        checkDraw(checkElement, data);

        if(ring < 4) {
            // check up row up ring
            checkElement = element + 13;
            checkDraw(checkElement, data);

            // check down row up ring
            checkElement = element + 11;
            checkDraw(checkElement, data);
        }

        if(ring > 1) {
            // check up row down ring
            checkElement = element - 11;
            checkDraw(checkElement, data);

            // check down row down ring
            checkElement = element - 13;
            checkDraw(checkElement, data);
        }
    }
}

// drawLine(x0,y0,x1,y1) - draws a single line from x0,y0 to x1,y1 with the current player's color
function drawLine(x0, y0, x1, y1) {
    // set the color, invert the player (since currentPlayer gets switched
    var color = (currentPlayer == 1) ? p1Color : p2Color;

    // create a line and draw from x0,y0 to x1,y1
    var line = new createjs.Shape();
    line.graphics.setStrokeStyle(3);
    line.graphics.beginStroke(color);
    line.graphics.moveTo(x0, y0);
    line.graphics.lineTo(x1, y1);
    line.graphics.endStroke();
    gameContainer.addChild(line);
}

// checkDraw(element,data) - checks the element against the origin element and calls draw line
// element - the array element to check against
// data - the origin point data
function checkDraw(element, data) {
    var checkData = gameContainer.children[element].name.split(' ');
    if(checkData[2] == data[2]) {
        drawLine(data[3], data[4], checkData[3], checkData[4]);
    }
}
// </editor-fold>

// <editor-fold desc="EVENT LISTENERS">
function loadHandler(event) {
    // This is fired for each sound that is registered.
    var instance = createjs.Sound.play("bgMusic");  // play using id.  Could also use full source path or event.src.
    instance.addEventListener("complete", loadHandler);
    instance.volume = 0.3;
}

function mainMenuButtonMouseHover(event) {
    event.target.color = (event.type == 'mouseover') ? '#00ffff' : '#ffffff';
}

function gamePointMouseHover(event) {
    var res = event.target.name.split(' ');
    coordinateText.text = (event.type == 'mouseover') ? 'row = ' + res[0] + ', ring = ' + res[1] : '';
}

function gamePointMouseClick(event) {
    var data = event.target.name.split(' ');

    // not valid move
    if(data[2] != 0) {
        return;
    }

    // player 1 clicks
    if(currentPlayer == 1) {
        // clear the point
        event.target.graphics.clear();
        // redraw the point
        event.target.graphics.beginFill(p1Color).drawCircle(data[3], data[4], pointSize);

        // change point ownership
        event.target.name = data[0] + ' ' + data[1] + ' 1 ' + data[3] + ' ' + data[4];
    }
    // player 2 clicks
    else {
        // clear the point
        event.target.graphics.clear();
        // redraw the point
        event.target.graphics.beginFill(p2Color).drawCircle(data[3], data[4], pointSize);

        // change point ownership
        event.target.name = data[0] + ' ' + data[1] + ' 2 ' + data[3] + ' ' + data[4];
    }

    // check if lines need to be drawn
    drawLines(event.target);

    // change players
    currentPlayer = (currentPlayer == 1) ? 2 : 1;

    // reprint current player
    gamePlayersTurnText.text = 'Player ' + currentPlayer + '\'s turn';
}
// </editor-fold>