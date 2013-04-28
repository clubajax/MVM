define([
	'./util/registry'
], function( registry ){
	console.log('binding');
	
	var rxRemove = /remove/;
	
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
			this.node = node;
			this.instance = instance;
			this.instance.items.subscribe(this.render.bind(this));
			this.instance.items.publish();
			this.connectRemove();
		},
		render: function(){
			console.log('**RENDER**');
			var self = this;
			self.node.innerHTML = '';
			this.instance.items.forEach(function( item, i ){
				var node = self.rowTemplate.cloneNode(true);
				node.children[0].value = item;
				node.idx = i;
				self.node.appendChild(node);	
			});
		},
		
		connectRemove: function(){
			var self = this;
			this.node.addEventListener('click', function( event ){
				if( rxRemove.test( event.target.className )){
					console.log('REMOVE', event.target.parentNode.idx);
					self.instance.remove( event.target.parentNode.idx );
				}
			}, false);
		},
		
		
		setProp: function(prop, value){
			if(prop === 'rowTemplate'){
				this.rowTemplate = value.parentNode.removeChild(value);
			}else{
				this[prop] = value;	
			}
			
			//console.log('prop:', prop, this[prop]);
			
		}
	});
});