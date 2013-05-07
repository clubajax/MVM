define([
	'../util/registry'
], function( registry ){
	
	
	registry.set({
		id:'sort',
		init: function( node, instance ){
			console.log('sort binding init', instance, node);
			
			this.instance = instance;
			this.button = node;
			var self = this;
			this.button.addEventListener('click', function( event ){
				self.onClick( event );
			}, false);
		},
		
		onClick: function(){
			
			this.instance.sortDirection(
				this.instance.sortDirection() === 'ascending' ? 'descending' : 'ascending');
			
			this.instance.items.sort();
			this.instance.items.publish();
			var sd = this.instance.sortDirection();
			this.button.innerHTML = 'sort ' + sd;
		},
		
		setProp: function(prop, value){
			
		}
	});
});