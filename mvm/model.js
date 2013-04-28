define([
		
], function(){
	console.log('model');
	
	var model = {
		load: function( instanceId ){
			var object = localStorage.getItem( instanceId );
			return object ? JSON.parse( object ) : null;
		},
		save: function( instanceId, items ){
			localStorage.setItem( instanceId, JSON.stringify( items ));
		},
		remove: function( instanceId, itemId ){
			// TODO
		}
	};
	
	return model;
});