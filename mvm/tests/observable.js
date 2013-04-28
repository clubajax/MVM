define(["module", "../unit/main", '../util/observable'], function(module, unit, observable){
	
    "use strict";

	unit.add(module, [
		{
			test: function test_setter(t){
				var a = observable(1);
				eval(t.TEST("a() === 1"));
				eval(t.TEST("a() !== 2"));
				a(2);
				eval(t.TEST("a() === 2"));
				eval(t.TEST("a() !== 1"));	
			}
		},{
			test: function test_pubsub(t){
				var a = observable(1);
				var h = a.subscribe(function(v){
					eval(t.TEST("v === 1"));
				});
				a.publish();
				h.remove();
				a.subscribe(function(v){
					eval(t.TEST("v === 2"));
				});
				eval(t.TEST("a() === 1"));
				a(2);
			}
		},{
			test: function test_array(t){
				var a = observable([]);
				a.push(1);
				a.push(2);
				
				eval(t.TEST("a.get(0) === 1"));
				eval(t.TEST("a.get(1) === 2"));
				
				a.forEach(function(v){
					eval(t.TEST("v === 1 || v === 2"));
				});
				
				eval(t.TEST("a.len() === 2"));
				
				a.splice(1);
				
				eval(t.TEST("a.len() === 1"));
			}
		}
	]);

	unit.run();
});
