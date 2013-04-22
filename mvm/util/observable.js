define([
	
], function(){
	console.log('observable');
	
	return function( _item ){
			
		var
			value
			isArray = false; 
		var observable = function( item ){
			if( item ){
				value = item;
				isArray = Array.isArray(item);
				
				publish( value );
			}
			return value;
		};
		
		observable.forEach = function( callback ){
			for (var i = 0; i < value.length; i++ ){
				callback( value[i] );
			}
		}
		
		observable.push = function( item ){
			value.push( item );
		}
		
		observable.slice = function( index, amount ){
			amount = amount === undefined ? 1 : amount;
			value.slice( index, amount );
		}
		
		
		var subscribers = [];
		observable.subscribe = function( callback ){
			subscribers.push( callback );
		};
		
		var publish = function(){
			subscribers.forEach(function( sub ){
				sub( value );
			});
		};
		
		observable( _item );
		return observable;
	
	}	
});