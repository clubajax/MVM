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
			
			function addEvent( node, binding, eventName, method ){
				node.addEventListener(eventName, function( event ){
					binding[ method ]( event );	
				}, false);
			}
			
			nodes.forEach(function(node){
				props = getAtts( node );
				
				
				
				
				// TODO: multiple props on same node
				
				
				
				
				
				if(props[attrName]){
					
					if( /\:/.test( props[attrName] )){
						segs = props[attrName].split(':');
						
						
						if( segs[0] === 'instance'){
							instance = registry.getInstance(segs[1]);
							log('add instance', instance);
						}
						
						else if( segs[0] === 'binding'){
							log(' found binding', segs[1]);
							currentBinding = registry.get(segs[1]);
							bindingList.push({
								binding:currentBinding,
								node:node,
								instance:instance
							});
							
							currentBinding.setProp(segs[1], node);
						}
						
						else if( segs[0] === 'node'){
							currentBinding.setProp(segs[1], node);
						}
						
						else if( segs[0] === 'click' ){
							log('add click', currentBinding);
							addEvent(node, currentBinding, segs[0], segs[1]);
						}
					}
				}
			});
			
			bindingList.forEach(function(binding){
				binding.binding.init(binding.node, binding.instance)
			});
			
		
		}
	}
});