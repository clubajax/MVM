define([
	'./util/observable'
], function(observable){
	console.log('ViewModel');
	
	function ViewModel(){
		this.items = observable(['apples', 'oranges', 'grapes']);
	}
	
	ViewModel.prototype = {
		
	};
});