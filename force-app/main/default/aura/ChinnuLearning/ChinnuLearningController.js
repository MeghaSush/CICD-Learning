({
	doinit : function(component, event, helper) {
      // component.set("v.Var1","Chinnu Learning From Component Controller")
       var data = {'name':'Test name',
                  'email' :'megha@test.com'};
        
        component.set("v.jsobject", data);
      component.set("v.UserData",
                     {'mystring1' : 'StringValue',
                      'myInteger1': 2000
                     })
        
	}
})