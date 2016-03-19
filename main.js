
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

	self.toggleState = function(){
		self.setState(!self.state);
	};

	self.el.click(function(){
		self.toggleState();
	})
};


var Game = function() {
	var self = this;

	var size = 100;
	const maxSize = 100;

	var fps = 10;
	const maxFps = 20;

	var grid = {};

	var ui = {
		frame: $('.game .frame'),
		startBtn: $('.game .menu .start'),
		resetBtn: $('.game .menu .reset'),
		sizeInput: $('.game .menu input[name=size]'),
		fpsInput: $('.game .menu input[name=fps]'),
		disableInputs: function(disabled){
			this.sizeInput.attr('disabled', disabled);
			this.fpsInput.attr('disabled', disabled);
		}
	};

	var interval = null;
	var isDragMode = false;

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

	var clearGrid = function(){
		ui.frame.empty();
		grid = {};
	};

	var paintGrid = function() {
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {	
				var el = $('<div>').attr({'data-x': x, 'data-y': y});
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

		//console.log('drawFrame() executed for ' + profiler.elapsed());
	};

	self.init = function() {
		paintGrid();

		ui.startBtn.click(function(){
			ui.disableInputs(true);
			self.start();
		});

		ui.resetBtn.click(function(){
			ui.disableInputs(false);
			self.reset();
		});

		ui.frame.mousedown(function(){
			isDragMode = true;

		}).mouseup(function(){
			isDragMode = false;

		}).mousemove(function(e){
			if(!isDragMode) return;

			var el = $(e.target);
			var cell = findCell(el.attr('data-x'), el.attr('data-y'));
			if(cell) cell.toggleState();
		});

		ui.sizeInput.keyup(function(){
			var newSize = parseInt(ui.sizeInput.val());
			if(newSize > maxSize) newSize = maxSize;
			if(newSize !== size) {
				changeSize(newSize);
			}		
		});
	};

	var changeSize = function(newSize){
		size = newSize;
		var sizePx = (size * 10) + 'px';
		clearGrid();
		ui.frame.css({width: sizePx, height: sizePx})
		paintGrid();
	};

	self.start = function() {
		if(self.isStarted()) return;

		fps = parseInt(ui.fpsInput.val());
		if(fps > maxFps) fps = maxFps;

		drawFrame();
		interval = setInterval(drawFrame, Math.round(1000 / fps));
	};

	self.reset = function(){
		clearInterval(interval);
		interval = null;

		for(var key in grid) {
			var cell = grid[key];
			cell.setState(false);
		}
	};

	self.isStarted = function(){
		return interval !== null;
	};
};



$(function() {
	var game = new Game();
	game.init();
});
