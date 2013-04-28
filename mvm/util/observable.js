define([
	
], function(){
	console.log('observable');
	
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

	return function( _item ){
			
		var
			value,
			subscribers = {},
			subid = 0,
			isArray = false;

		function observable( item ){
			if( item !== undefined ){
				value = item;
				isArray = Array.isArray(item);
				observable.publish( value );
			}
			return value;
		}
		
		observable.len = function(){
			return value.length;	
		}
		
		observable.sort = function( descending/*, key*/ ){
			if (isArray) {
				var sort = !!descending ? sortDec : sortAsc;
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
		
		
		observable.subscribe = function( callback ){
			var id = 'sub' + (subid++);
			subscribers[id] = callback;
			return {
				remove: function(){
					delete subscribers[id];
				}
			};
		};
		
		observable.publish = function(){
			for(var callback in subscribers){
				subscribers[callback]( value );
			}
		};
		
		observable( _item );
		return observable;
	
	};
});
