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
			this.items.subscribe(this.onAddItem.bind(this));
			this.items.add( model.load( this.id ));
			console.log(' loaded! ', this.items());
		},
		onAddItem: function(){
			this.items.sort();
			this.save();
		},
		save: function(){
			console.log('save', this.items());
			model.save( this.id, this.items() );
		}
	};
	
	ViewModel.id = 'mvm/ViewModel'
	
	return ViewModel;
});