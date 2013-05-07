define([
	'../util/registry',
	'../util/log'
], function( registry, logger ){
	
	
	var
		log = logger('ITM', 1),
		rxRemove = /remove/;
	
	// TODO - add a factory function instead of a singleton object
	registry.set({
		id:'items',
		rowTemplate:null,
		addInput:null,
		listNode:null,
		
		init: function( node, instance ){
			log('items binding init', instance, node);
			this.mainNode = node;
			this.instance = instance;
			this.instance.items.subscribe(this.render.bind(this));
			this.instance.items.publish();
			this.attachEvents();
		},
		
		addItem: function(){
			if( this.addInput.value.length ){
				log('addItem', this.addInput.value);
				this.instance.items.push( this.addInput.value );
				this.addInput.value = '';
			}
		},
		
		render: function(){
			log('**RENDER**');
			var self = this;
			self.listNode.innerHTML = '';
			this.instance.items.forEach(function( item, i ){
				var node = self.rowTemplate.cloneNode(true);
				node.children[1].value = item;
				node.idx = i;
				self.listNode.appendChild(node);	
			});
		},
		
		attachEvents: function(){
			var idx, node, instance = this.instance;
			
			if( this.listNode.nodeName === 'FORM'){
				this.listNode.addEventListener('submit', function(e){
					// fires when enter key is pressed within an input
					if( document.activeElement.nodeName === 'INPUT'){
						instance.update( document.activeElement.parentNode.idx, document.activeElement.value );
					}
					e.preventDefault();
					return false;
				}, false);
			}
			
			this.listNode.addEventListener('click', function( event ){
				node = document.activeElement.nodeName === 'BODY' ? event.target : document.activeElement;
				if( rxRemove.test( node.className )){
					idx = node.parentNode.idx;
					if( idx !== undefined ){
						instance.remove( idx );
					}
				}
				return false;
			}, false);
		},
		
		
		setProp: function(prop, value){
			if(prop === 'rowTemplate'){
				this.rowTemplate = value.parentNode.removeChild(value);
			}else{
				this[prop] = value;	
			}			
		}
	});
});