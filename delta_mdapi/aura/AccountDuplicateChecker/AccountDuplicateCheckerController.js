({
    checkDuplicates : function(component, event, helper) {
        var accountName = component.get("v.accountName");
        var postalCode = component.get("v.billingPostalCode");
        
        if (!accountName && !postalCode) {
            helper.showToast('Warning', 'Please enter Account Name or Postal Code to check for duplicates', 'warning');
            return;
        }
        
        var action = component.get("c.findDuplicateAccounts");
        action.setParams({
            accountName: accountName,
            postalCode: postalCode
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var duplicates = response.getReturnValue();
                component.set("v.duplicates", duplicates);
                component.set("v.showDuplicates", true);
                component.set("v.hasDuplicates", duplicates.length > 0);
                
                if (duplicates.length > 0) {
                    helper.showToast('Warning', 'Found ' + duplicates.length + ' potential duplicate(s)', 'warning');
                } else {
                    helper.showToast('Success', 'No duplicates found', 'success');
                }
            } else {
                var errors = response.getError();
                var message = 'Unknown error';
                if (errors && errors[0] && errors[0].message) {
                    message = errors[0].message;
                }
                helper.showToast('Error', message, 'error');
            }
        });
        
        $A.enqueueAction(action);
    },
    
    saveAccount : function(component, event, helper) {
        var accountName = component.get("v.accountName");
        
        if (!accountName) {
            helper.showToast('Error', 'Account Name is required', 'error');
            return;
        }
        
        var action = component.get("c.createAccount");
        action.setParams({
            accountName: accountName,
            billingStreet: component.get("v.billingStreet"),
            billingCity: component.get("v.billingCity"),
            billingState: component.get("v.billingState"),
            billingPostalCode: component.get("v.billingPostalCode"),
            billingCountry: component.get("v.billingCountry"),
            phone: component.get("v.phone"),
            website: component.get("v.website")
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var accountId = response.getReturnValue();
                helper.showToast('Success', 'Account created successfully', 'success');
                helper.navigateToRecord(accountId);
            } else {
                var errors = response.getError();
                var message = 'Unknown error';
                if (errors && errors[0] && errors[0].message) {
                    message = errors[0].message;
                }
                helper.showToast('Error', message, 'error');
            }
        });
        
        $A.enqueueAction(action);
    },
    
    viewAccount : function(component, event, helper) {
        var accountId = event.getSource().get("v.value");
        helper.navigateToRecord(accountId);
    },
    
    cancel : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToObjectHome");
        navEvt.setParams({
            "scope": "Account"
        });
        navEvt.fire();
    }
})