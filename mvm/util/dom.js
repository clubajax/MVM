define([
	'./log',
	'./observable',
	'./registry'
], function( logger, observable, registry ){
	
	
	var
		log = logger('DOM', 1),
		count = 0;
		
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
		
	function getAtts( node ){
		var
			a,
			attrs = {},
			atts = node.attributes;
			
		for(var i=0; i<atts.length; i++){
			a = atts[i];
			attrs[a.localName] = a.value;
		}
		return attrs;
	}
		
	function walkDom(parentNode, attrName, nodes){
		
		var node = parentNode.firstChild;
		
		if(!nodes){
			nodes = [parentNode];
		}
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
	}

	
	
	return {
		
		byId: function( id ){
			if( typeof id === 'string' ){
				return document.getElementById( id );
			}
			return id;
		},
		
		parse: function(template, nodeId){
			var
				vm,
				node = this.byId(nodeId);
				
			node.innerHTML = template;
			
			this.parseBindings( node );
			
		},
		
		parseBindings: function( parentNode, optionalBinding, optionalInstance ){
			
			count++;
			parentNode = this.byId( parentNode ) || document.body;
			
			var
				props,
				segs,
				Constructor,
				instance = optionalInstance || null,
				attrName = 'data-bind',
				nodes = walkDom(parentNode, attrName),
				bindingList = [],
				currentBinding,
				dent = count+'  ';
			
			if( optionalBinding ){
				bindingList.push({
					binding: optionalBinding,
					node:parentNode,
					observables:[]
				});
				currentBinding = optionalBinding;
			}
			
			nodes.forEach(function(node){
				attrs = getAtts( node );

				if(attrs[attrName]){
					attrs[attrName].split(',').forEach(function( keyValue ){
						
						var
							key = keyValue.split(':')[0],
							value = keyValue.split(':')[1];
						
						switch( key ){
							
							case 'instance':
								// EX:
								// 		data-bind='instance:mvm/ViewModel
								// 		
								// An AMD id Class is converted into an instance 
								// By current convention, this should be first in the DOM tree
								instance = registry.getInstance(value);	
								break;
							
							case 'binding':
								// EX:
								// 		data-bind='binding:itemBinding'
								// 		
								// 	A registered binding object for DOM mngmt
								currentBinding = registry.get(value);
								bindingList.push({
									binding:currentBinding,
									node:node,
									instance:instance
								});
								
								// add the current node to the binding
								currentBinding.setProp(value, node);	
								break;
							
							case 'node':
								// EX:
								// 		data-bind='node:myDomNode'
								// 		
								// add the current node to the binding, which will be
								// referenced as "this.myDomNode"
								currentBinding.setProp(value, node);	
								break;
							
							case 'click':
								// EX:
								// 		data-bind='click:myClickHandler'
								// 		
								// 	Attach a click event to the current node and bind to
								// 	a method in the binding
								addMouseEvent(node, currentBinding, key, value);
								break;
							
							case 'enter':
								// EX:
								// 		data-bind='enter:myKeyHandler'
								// 		
								// 	Attach a keyup event to the current node and if the
								// 	ENTER key is pressed, bind the method in the binding
								addKeyEvent(node, currentBinding, 13, value);
								break;
							
							case 'text':
								// EX:
								// 		data-bind='text:myTextObservable'
								//
								// Subscribe to a binding's observable and use the value
								// as the innerHTML of the current node
								bindingList[bindingList.length - 1].observables.push({
									type:'text',
									value:value,
									fn: function( val, node ){
										node.innerHTML = val;
									}
								});
								break;
						}
					});
				}
			});
			
			// loop through found bindings
			bindingList.forEach(function(binding){
				// if the binding has an init method, invoke it
				if(binding.binding.init){
					binding.binding.init(binding.node, binding.instance);
				}
				// if we found some observables, we can subscribe to them now that
				// the binding has been initialized
				binding.observables.forEach(function( ob ){
					var fn = binding.binding[ob.value];
					if( observable.isObservable( fn ) ){
						fn.subscribe(function( val ){
							ob.fn(val, binding.node);
						});
						fn.publish();
					};
				});
			});
		}
	}
});