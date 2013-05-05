define('../model', function(){
	console.log('test model injection');
	
	var data = {
		'sortDirection':'ascending',
		'items':['cats', 'dogs', 'birds', 'rats']
	}
	
	function getPropName( id, name ){
		return id + '/' + name;
	}
	
	var model = {
		load: function( instanceId, propertyName ){
			return data[propertyName]
		},
		save: function( instanceId, propertyName, value ){
			data[propertyName] = value;
		}
	};
	
	return model;
});


require(['qu', '../ViewModel'], function(qu, ViewModel){
	
	qu.add('ViewModel Suite', [
		{
			'exists': function(t){
				var vm = new ViewModel('testId');
				t.t(!!vm, '!!vm');
				t.t(vm.id === 'testId', 'vm.id = testId');
			},
			'initial observables': function(t){	
				var vm = new ViewModel('testId');	
				t.t(vm.sortDirection() === 'ascending', 'vm.sortDirection() = ascending');
				t.t(vm.items.len() === 4, 'vm.items.len() = 4');
				t.t(vm.items.get(0) === 'birds', 'vm.items.get(0) = birds (sorted)');
			},
			'push item': function(t){	
				var vm = new ViewModel('testId');	
				vm.items.push('aardvark');
				t.t(vm.items.get(0) === 'aardvark', 'vm.items.get(0) = aardvark (sorted)');
			},
			'item persisted': function(t){	
				var vm = new ViewModel('testId');	
				t.t(vm.items.get(0) === 'aardvark', 'vm.items.get(0) = aardvark (persisted)');
			},
			'remove item': function(t){	
				var vm = new ViewModel('testId');	
				vm.remove(0);
				t.t(vm.items.get(0) === 'birds', 'vm.items.get(0) = birds (again)');
			},
			'sort descending': function(t){	
				var vm = new ViewModel('testId');	
				vm.sortDirection('descending');
				vm.items.sort();
				vm.items.publish();
				t.t(vm.items.get(0) === 'rats', 'vm.items.get(0) = rats (descending)');
			},
			'test persist sort direction': function(t){	
				var vm = new ViewModel('testId');	
				t.t(vm.items.get(0) === 'rats', 'vm.items.get(0) = rats (persisted)');
			},
			'update item': function(t){	
				var vm = new ViewModel('testId');
				vm.update(0, 'zebra');
				t.t(vm.items.get(0) === 'zebra', 'vm.items.get(0) = zebra');
			}
		}
	]);
	
	qu.run();
	
});