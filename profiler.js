var Profiler = function(){
	var self = this;

	var t0 = null;

	self.start = function(){
		t0 = new Date();
	};

	self.elapsed = function(){
		var now = new Date();
		return (now.getTime() - t0.getTime()) + ' msec';
	};
};