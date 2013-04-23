define(["module", "../unit/main", '../util/observable'], function(module, unit, observable){

    console.log('UNIT', unit);
    "use strict";

	unit.add(module, [
		{
			test: function test_matching_logs(t){
				var a = observable(1);
                //eval(t.test("a() === 1"));

                t.info("a() === 2");
				eval(t.TEST("5 < 2"));
				eval(t.ASSERT("3 < 1"));
			},
			logs: [
				{meta: {name: "info"}, text: "a() === 1"},
				{meta: {name: "test"}, condition: "5 < 2"},
				{meta: {name: "assert"}, condition: "3 < 1"},
				{meta: {name: "error"}, text: "ASSERT: 3 < 1"}
			]
		}
	]);

	unit.run();
});
