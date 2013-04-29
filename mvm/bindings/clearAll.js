define([
	'../util/registry'
], function( registry ){
	
	
	registry.set({
		id:'clearAll',
		init: function( node, instance ){
			console.log('clearAll binding init', instance, node);
			
			node.addEventListener('click', function(){
				instance.items([]);
			}, false);
		},
		
		setProp: function(prop, value){
			console.log('set', prop, value);	
		}
	});
});