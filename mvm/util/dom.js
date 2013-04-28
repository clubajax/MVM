define([
	'./log',
	'./registry'
], function( logger, registry ){
	
	
	var
		log = logger('DOM', 1),
		count = 0,
		
		getAtts = function( node ){
			var
				a,
				props = {},
				atts = node.attributes;
				
			for(var i=0; i<atts.length; i++){
				a = atts[i];
				props[a.localName] = a.value;
			}
			return props;
		},
		
		walkDom = function(parentNode, attrName, nodes){
			
			var node = parentNode.firstChild;
			
			nodes = nodes || [];
			while(node){
				if(node.nodeType === 1){
					//console.log(' >>> walk ', node.tagName, node.className, node.children.length);
					//console.log(node.outerHTML);
					if(node.getAttribute(attrName)){
						nodes.push(node);
					}
					
					if(node.childNodes.length){
						nodes = walkDom(node, attrName, nodes);
					}
				}
				node = node.nextSibling;
			}
			return nodes;
		};
	
	return {
		
		byId: function( id ){
			if( typeof id === 'string' ){
				return document.getElementById( id );
			}
			return id;
		},
		
		parse: function(template, nodeId, ViewModel){
			var
				vm,
				node = this.byId(nodeId);
				
			node.innerHTML = template;
			if(ViewModel && typeof ViewModel === 'function'){
				vm = new ViewModel( node.firstChild );
			}
			
			this.parseBindings( node, vm || ViewModel );
			
		},
		
		parseBindings: function( parentNode ){
			
			count++;
			parentNode = parentNode || document.body;
			
			var
				props,
				segs,
				Constructor,
				instance,
				attrName = 'data-bind',
				nodes = walkDom(parentNode, attrName),
				bindingList = [],
				currentBinding,
				dent = count+'  ';
			
			function addMouseEvent( node, binding, eventName, method ){
				node.addEventListener(eventName, function( event ){
					binding[ method ]( event );	
				}, false);
			}
			
			function addKeyEvent( node, binding, eventName, method ){
				node.addEventListener('keyup', function( event ){
					//log('KEYUP', event.keyCode, event.target);
					if( event.keyCode === eventName ){
						binding[ method ]( event );
					}
				}, false);
			}
			
			nodes.forEach(function(node){
				props = getAtts( node );
				
				// TODO: multiple props on same node

				if(props[attrName]){
					props[attrName].split(',').forEach(function( keyValue ){
						
						var key = keyValue.split(':')[0];
						var value = keyValue.split(':')[1];
						
						if( key === 'instance'){
							instance = registry.getInstance(value);
							//log('add instance', instance);
						}
						
						else if( key === 'binding'){
							//log(' found binding', value);
							currentBinding = registry.get(value);
							bindingList.push({
								binding:currentBinding,
								node:node,
								instance:instance
							});
							
							currentBinding.setProp(value, node);
						}
						
						else if( key === 'node'){
							currentBinding.setProp(value, node);
						}
						
						else if( key === 'click' ){
							//log('add click', currentBinding);
							addMouseEvent(node, currentBinding, key, value);
						}
						
						else if( key === 'enter' ){
							//log('add key', currentBinding);
							addKeyEvent(node, currentBinding, 13, value);
						}
					});
				}
			});
			
			bindingList.forEach(function(binding){
				binding.binding.init(binding.node, binding.instance)
			});
			
		
		}
	}
});