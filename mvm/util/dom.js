define([], function(){
	return {
		byId: function( id ){
			if( typeof id === 'string' ){
				return document.getElementById( id );
			}
			return id;
		}
	}
});