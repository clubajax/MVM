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
			this.items = observable( [] );
			// by being an early subscriber, the list will sort before
			// the change is picked up by the binding
			this.items.subscribe(this.onAddItem.bind(this));
			this.items.concat( model.load( this.id ));
		},
		update: function( idx, value ){
			this.items.put( idx, value );
		},
		remove: function( idx ){
			this.items.splice( idx );
		},
		onAddItem: function(){
			this.items.sort();
			this.save();
		},
		save: function(){
			console.log('save', this.items() );
			model.save( this.id, this.items() );
		}
	};
	
	ViewModel.id = 'mvm/ViewModel'
	
	return ViewModel;
});