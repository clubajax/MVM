define([
		
], function(){
	console.log('model');
	
	function getPropName( id, name ){
		return id + '/' + name;
	}
	
	var model = {
		load: function( instanceId, propertyName ){
			var object = localStorage.getItem( getPropName(instanceId, propertyName) );
			return object ? JSON.parse( object ) : null;
		},
		save: function( instanceId, propertyName, value ){
			localStorage.setItem( getPropName(instanceId, propertyName), JSON.stringify( value ));
		}
	};
	
	return model;
});