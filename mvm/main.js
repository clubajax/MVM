define([
	'./util/dom',
	'text!./view.html',
	'./util/registry',
	'./ViewModel',
	'./bindings/main'
], function( dom, view, registry, ViewModel){
	
	registry.set( ViewModel );
	dom.addTemplate(view, 'todoNode');
	
	
});