define([
	
], function(){
	console.log('observable');
	
    function sortAsc(a, b){
        return a > b ? 1 : a < b ? -1 : 0;
    }

    function sortDec(a, b){
        return a > b ? -1 : a < b ? 1 : 0;
    }

	return function( _item ){
			
		var
			value,
            subscribers = [],
			isArray = false;

		function observable( item ){
			if( item !== undefined ){
				value = item;
				isArray = Array.isArray(item);
				observable.publish( value );
			}
			return value;
		}
		
        observable.sort = function( descending/*, key*/ ){
            if (isArray) {
                var sort = !!descending ? sortDec : sortAsc;
                value.sort(sort);
                observable.publish( value );
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
			value.push( item );
            observable.publish( value );
		};
		
		observable.slice = function( index, amount ){
			amount = amount === undefined ? 1 : amount;
			value.slice( index, amount );
            observable.publish( value );
		};
		
		
		observable.subscribe = function( callback ){
			subscribers.push( callback );
		};
		
		observable.publish = function(){
			subscribers.forEach(function( sub ){
				sub( value );
			});
		};
		
		observable( _item );
		return observable;
	
	};
});
