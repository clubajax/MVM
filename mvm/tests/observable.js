define(['qu', '../util/observable'], function(qu, observable){
	
	qu.add('Observable Suite', [
		{
			'test setter': function(t){
				var a = observable(1);
				t.t(a() === 1, 'a() = 1');
				t.t(a() !== 2, 'a() != 2');
				a(2);
				t.t(a() === 2, 'a() = 2');
				t.t(a() !== 1, 'a() != 1');	
			}
		},{
			'test pubsub': function(t){
				var a = observable(1);
				var h = a.subscribe(function(v){
					t.t(v === 1, 'v = 1');
				});
				a.publish();
				h.remove();
				a.subscribe(function(v){
					t.t(v === 2, 'v = 2');
				});
				t.t(a() === 1, 'a() = 1');
				a(2);
			}
		},{
			'test array': function(t){
				var a = observable([]);
				a.push(1);
				a.push(2);
				
				t.t(a.get(0) === 1, 'a.get(0) = 1');
				t.t(a.get(1) === 2, 'a.get(1) = 2');
				
				a.forEach(function(v){
					t.t(v === 1 || v === 2, 'v = 1 || 2');
				});
				
				t.t(a.len() === 2, 'a.len() = 2');
				
				a.splice(1);
				
				t.t(a.len() === 1, 'a.len() = 1');
			}
		}
	]);

	qu.run();
});
