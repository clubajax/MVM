define([
	'./util/registry'
], function( registry ){
	console.log('binding');
	
	registry.set({
		id:'items',
		rowTemplate:null,
		addInput:null,
		
		addItem: function(){
			console.log('addItem', this.addInput.value);
			this.instance.items.push( this.addInput.value );
		},
		
		init: function( node, instance ){
			console.log('bind init', instance, node);
			this.instance = instance;
			//console.log('PROPS');
			for(var nm in this){
				//console.log(nm, this[nm]);
			}
		},
		setProp: function(prop, value){
			this[prop] = value;
			
		}
	});
});