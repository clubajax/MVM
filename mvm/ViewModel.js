define([
	'./util/observable',
	'./model'
], function( observable, model ){
	console.log('ViewModel');
	
	function ViewModel( id ){
		this.id = id;
		this.load();
	}
	
	ViewModel.prototype = {
		load: function( ){
			this.sortDirection = observable( model.load( this.id, 'sortDirection' ) || 'ascending');	
			this.sortDirection.subscribe(function(){
				this.save( 'sortDirection', this.sortDirection() );
			}.bind(this));
			
			this.items = observable( [] );
			// by being an early subscriber, the list will sort before
			// the change is picked up by the binding
			this.items.subscribe(this.onAddItem.bind(this));
			this.items.concat( model.load( this.id, 'items' ));
			window.vm = this;
		},
		update: function( idx, value ){
			this.items.put( idx, value );
		},
		remove: function( idx ){
			this.items.splice( idx );
		},
		onAddItem: function(){
			this.items.sort(this.sortDirection());
			this.save( 'items', this.items() );
		},
		save: function( propName, value ){
			model.save( this.id, propName, value );
		}
	};
	
	ViewModel.id = 'mvm/ViewModel'
	
	return ViewModel;
});