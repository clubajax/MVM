define([
	'./util/dom',
	'text!./view.html',
	'./util/registry',
	'./binding'
], function( dom, view){
	
	console.log('MAIN');
	dom.parse(view, 'todoNode');
	
});