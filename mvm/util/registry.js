define([], function(){
	
	var
		i,
		viewModels = {},
		instances = {},
		
		registry = {
			
			set: function( vm ){
				viewModels[ vm.id ] = vm;	
			},
			
			get: function( id ){
				return viewModels[ id ];
			},
			
			getInstance: function( id ){
				
				if( this[id] === undefined ){ this[id] = -1; }
				this[id]++;
				
				var
					Constructor = this.get( id ),
					instanceId = id + '/' + this[id];
				
				instances[instanceId] = new Constructor( instanceId );
				return instances[instanceId];
			}
		};
	
	return registry;
	
});