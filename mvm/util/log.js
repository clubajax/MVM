define([], function(){
	
	var hash = document.location.search+"#"+document.location.hash;
	return function(name, enabled){
		var r = new RegExp(name);
		// could also test dojoConfig here...
		if(!r.test(hash) && (enabled === false || enabled === 0)) { return function(){}; }
		return function(){
			var args = Array.prototype.slice.call(arguments);
			if(name) { args.unshift(" ["+name+"] "); }
			// prints to console. Could obviously be sent to the server, written
			// to a log fle, etc.
			console.log.apply(console, args);
		};
	};
	
});
