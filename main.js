var init = [
{x:0,y:0}, 
{x:1,y:1}, 
{x:1,y:2}, 
{x:1,y:3}, 
{x:1,y:4}, 
{x:2,y:2}, 
{x:2,y:6}, 
{x:3,y:2}, 
{x:4,y:2}, 
{x:5,y:2}, 
{x:4,y:3}, 
{x:5,y:3}, 
{x:3,y:4}, 
{x:2,y:4}, 
{x:5,y:4}, 
{x:1,y:4}, 
{x:2,y:5}
];

var grid = {};
var size = 100;

var profiler = new Profiler();

var checkInitState = function(x, y) {
	for (var i = 0; i < init.length; i++) {
		var point = init[i];
		if(point.x === x && point.y === y) {
			return true;
		}
	};
	return false;
};

var generateKey = function(x, y){
	return x + '_' + y;
};

var paintGrid = function() {
	var container = $('#container');

	for (var y = 0; y < size; y++) {
		for (var x = 0; x < size; x++) {	
			var el = $('<div>');
			var cell = {
				x: x,
				y: y,
				el: el,
				state: checkInitState(x, y)
			};
			markCell(cell);
			grid[generateKey(x, y)] = cell;
			container.append(el);
		}
	};
};

// найти соседей текущей клетки с координатами x,y
var findNeighbours = function(x, y) {
	var neighboursCoordinates = [
		{x: x-1, y: y-1},
		{x: x, y: y-1},
		{x: x+1, y: y-1},
		{x: x-1, y: y},
		{x: x+1, y: y},
		{x: x-1, y: y+1},
		{x: x, y: y+1},
		{x: x+1, y: y+1},
	];
	var r = [];
	for (var i = 0; i < neighboursCoordinates.length; i++) {
		var nb = neighboursCoordinates[i];
		var cell = findCell(nb.x, nb.y);
		if(cell) r.push(cell);
	};
	return r;
};

// вычислить состояние клетки по найденным соседям
var checkStateByNeighbours = function(neighbours){
	var dead = 0;
	var alive = 0;
	for(var i = 0; i < neighbours.length; i++) {
		if(neighbours[i].state) {
			alive++;
		} else {
			dead++;
		}
	}

	if(alive === 3) {
		return true;
	} else if (alive > 3 || alive < 2) {
		return false;
	} else {
		return null;
	}
};

// ищет клетку по координатам в массиве grid
var findCell = function(x, y){
	return grid[generateKey(x, y)];
};

var markCell = function(cell){
	$(cell.el).css('backgroundColor', cell.state ? 'white' : 'black');
};

var setState = function(x, y, state) {
	var cell = findCell(x, y);
	cell.state = state;
	markCell(cell);
};

var processSingleCell = function(x, y) {
	var neighbours = findNeighbours(x, y);
	var state = checkStateByNeighbours(neighbours);
	if(state !== null) {
		setState(x, y, state);
		//console.log('Cell is ' + (state ? 'alive' : 'dead'));
	} //else {
		//console.log('Cell state the same');
	//}
};

var startGame = function(){
	profiler.start();

	for (var y = 0; y < size; y++) {
		for (var x = 0; x < size; x++) {			
			processSingleCell(x, y);			
		}
	};

	console.log('startGame() executed for ' + profiler.elapsed());
};

$(function() {
	paintGrid();
	startGame();
	setInterval(startGame, 100);
});