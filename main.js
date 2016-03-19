
var Cell = function(x, y, el){
	var self = this;

	self.x = x;
	self.y = y;
	self.el = el;
	self.state = null;

	self.setState = function(state) {
		self.state = state;
		self.el.css('backgroundColor', self.state ? 'white' : 'black');
	};
	self.setState(false);

	self.el.click(function(){
		self.setState(!self.state);
	})
};


var Game = function() {
	var self = this;

	const size = 100;
	var grid = {};

	var ui = {
		frame: $('.game .frame'),
		startBtn: $('.game .menu .start'),
		resetBtn: $('.game .menu .reset')
	};

	var interval = null;
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
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {	
				var el = $('<div>');
				var cell = new Cell(x, y, el);
				grid[generateKey(x, y)] = cell;
				ui.frame.append(el);
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

	var setState = function(x, y, state) {
		var cell = findCell(x, y);
		cell.setState(state);
	};

	var processSingleCell = function(x, y) {
		var neighbours = findNeighbours(x, y);
		var state = checkStateByNeighbours(neighbours);
		if(state !== null) {
			setState(x, y, state);
		}
	};

	var drawFrame = function() {
		profiler.start();

		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {			
				processSingleCell(x, y);			
			}
		};

		console.log('drawFrame() executed for ' + profiler.elapsed());
	};

	self.init = function() {
		paintGrid();
		ui.startBtn.click(self.start);
		ui.resetBtn.click(self.reset);
	};

	self.start = function() {
		drawFrame();
		interval = setInterval(drawFrame, 100);
	};

	self.reset = function(){
		clearInterval(interval);

		for(var key in grid) {
			var cell = grid[key];
			cell.setState(false);
		}
	};
};



$(function() {
	var game = new Game();
	game.init();
});
