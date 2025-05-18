({
    doInit :function(component, event, helper) {
      //  component.set("v.Message", "Button1 Initialised");
        //component.set("v.Text", "Button2 Initialised");
    },
    
	handleClick : function(component, event, helper) {
		// component.set("v.Message","ButtonClicked");
		var button = event.getSource();
        var message = button.get("v.label");
        if(message == "Click"){
            component.set("v.Message", message);
        }else{
            component.set("v.Message", message);
        }
        
      	},
    
    TextClick : function(component, event, helper) {
       // component.set("v.Text","Navigate to Home");
        component.set("v.Text",event.getSource().get("v.label"));
     
    },
    ValidateEmail : function(component, event, helper) {  
        var emailField = component.find("txtEmail");
        var emailFieldValue = emailField.get("v.value");
        // Store Regular Expression
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
        // check if Email field in not blank,
        // and if Email field value is valid then set error message to null, and remove error CSS class.
        // ELSE if Email field value is invalid then add Error Style Css Class, and set the error Message.          
        if(!$A.util.isEmpty(emailFieldValue)){   
            if(emailFieldValue.match(regExpEmailformat)){
                emailField.set("v.errors", [{message: null}]);
                $A.util.removeClass(emailField, 'slds-has-error');                
            }else{
                $A.util.addClass(emailField, 'slds-has-error');
                emailField.set("v.errors", [{message: "Please Enter a Valid Email Address"}]);               
            }
        } 
    },
}) 
// component.set("v.Message",event.getSource().get("v.label"));