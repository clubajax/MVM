define([
	
], function(){
	
    function sortAsc(a, b){
		a = a.toLowerCase();
		b = b.toLowerCase();
		return a > b ? 1 : a < b ? -1 : 0;
    }

    function sortDec(a, b){
		a = a.toLowerCase();
		b = b.toLowerCase();
		return a > b ? -1 : a < b ? 1 : 0;
    }

	function observableFactory( _item ){
		
		// private properties
		var
			value,
			subscribers = {},
			subid = 0,
			isArray = false;

		// key method
		// a simple getter/setter pattern - if an argument is passed,
		// it sets - otherwise it gets (actually it always returns
		// the value)
		function observable( item ){
			if( item !== undefined ){
				value = item;
				isArray = Array.isArray(item);
				observable.publish( value );
			}
			return value;
		}
		
		// subscriber for listening to property changes
		observable.subscribe = function( callback ){
			var id = 'sub' + (subid++);
			subscribers[id] = callback;
			
			// subscribe returns a handle for which
			// remove() can be called to stop the listener
			return {
				remove: function(){
					delete subscribers[id];
				}
			};
		};
		
		// publish changes. Often done automatically,
		// but can be done manually, 
		observable.publish = function(){
			for(var callback in subscribers){
				subscribers[callback]( value );
			}
		};
		
		// for testing what thisis.
		observable.isObservable = true;
		
		
		//
		//	Array methods
		//	
		
		observable.len = function(){
			return value.length;	
		};
		
		
		observable.sort = function( direction /*, key*/ ){
			if (isArray) {
				var sort = direction === 'ascending' || !direction ? sortAsc : sortDec;
				value.sort(sort);
			}
			return value;
		};

		observable.get = function( index ){
			if (isArray) {
				return value[ index ];
			}
			return value;
		};

		observable.forEach = function( callback ){
			for (var i = 0; i < value.length; i++ ){
				callback( value[i], i );
			}
		};
		
		observable.push = function( item ){
			if( item ){
				value.push( item );
				observable.publish( value );
			}
		};
		
		observable.put = function( idx, val ){
			value[ idx ] = val;
			observable.publish( value );
		};
		
		observable.concat = function( list ){
			if( list ){
				value = value.concat( list );
				observable.publish( value );
			}
		};
		
		observable.splice = function( index, amount ){
			amount = amount === undefined ? 1 : amount;
			value.splice( index, amount );
			observable.publish( value );
		};
		
		
		
		// Initialize observable property
		observable( _item );
		return observable;
	
	};
	
	observableFactory.isObservable = function( item ){
		return item && typeof item === 'function' && !!item.isObservable;
	};
	
	return observableFactory;
});
