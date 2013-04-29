define([
	'./util/dom',
	'text!./view.html',
	'./util/registry',
	'./ViewModel',
	'./bindings/items',
	'./bindings/sort',
	'./bindings/clearAll'
], function( dom, view, registry, ViewModel){
	
	registry.set( ViewModel );
	dom.parse(view, 'todoNode');
	
	
});