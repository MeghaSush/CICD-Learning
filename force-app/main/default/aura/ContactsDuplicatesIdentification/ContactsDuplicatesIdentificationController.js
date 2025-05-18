({
    doInit: function(component, event, helper){
       var URLContext = window.location.href;
        console.log("URLContext", URLContext);
         var StartIndex = URLContext.lastIndexOf('.') +1 ;
        console.log("StartIndex", StartIndex);
        var trimmedURL =URLContext.substring(StartIndex);
        var EndIndex =trimmedURL.indexOf('&');
         console.log("EndIndex", EndIndex);
       if(EndIndex != -1){
            trimmedURL =trimmedURL.substring(0,EndIndex);
        }
        var encodedURLContext =trimmedURL;
        console.log("encodedURLContext", encodedURLContext);
        var action = component.get("c.AccountId");
      console.log("action", action);
        action.setParams({
            "encodedURLContext" : encodedURLContext
        });
        action.setCallback(this,function(response){
            var state =response.getState();
          if(state==="SUCCESS"){
                var DecodedUrl =  response.getReturnValue();
                component.set("v.DecodedUrl", DecodedUrl);
                var decodedValues =component.get("v.DecodedUrl");
              console.log("decodedValues", decodedValues);
                var rec = JSON.parse(decodedValues);
               console.log("rec", rec);
                var recId = rec.attributes.recordId;
              console.log("recId", recId);
               var IsTrue ='false';
              console.log("IsTrue before If Condition", IsTrue );
                if(recId !='' && recId !='undefined' && recId != null ){
                    IsTrue =true;
                  console.log("IsTrue", IsTrue);  
                    component.set("v.IsTrue", true);
                }
                //component.set("v.IsTrue", true);
                //Passing recId to Second Action 
                var AccrecId = recId;
               component.set("v.AccrecId", AccrecId);
                var action2=component.get("c.AccountDetails");
                action2.setParams({
                    "AccrecId": AccrecId
                });
                action2.setCallback(this,function(response2){
                    var state2= response2.getState();
                    if(state2 ==="SUCCESS"){
                        var Acclist =response2.getReturnValue();
                        component.set("v.Acclist", Acclist);
                       var AccAdrss =Acclist[0].BillingAddress;
                       var AccAdrssCountry =Acclist[0].BillingAddress.country;
                       component.set("v.AccAdrssCountry", AccAdrssCountry);
                        var AccAdrssState =Acclist[0].BillingAddress.state;
                        component.set("v.AccAdrssState", AccAdrssState);
                        var AccAdrssStreet =Acclist[0].BillingAddress.street;
                       component.set("v.AccAdrssStreet", AccAdrssStreet);
                        var AccAdrssPostalCode =Acclist[0].BillingAddress.postalCode;
                        component.set("v.AccAdrssPostalCode", AccAdrssPostalCode);
                        var AccAdrssCity=Acclist[0].BillingAddress.city;
                        component.set("v.AccAdrssCity", AccAdrssCity);
                        var AccAdrssStateCode =Acclist[0].BillingAddress.stateCode;
                        component.set("v.AccAdrssStateCode", AccAdrssStateCode);
                        var AccAdrssCountryCode =Acclist[0].BillingAddress.countryCode;
                        component.set("v.AccAdrssCountryCode", AccAdrssCountryCode);
                       var AccPhone =Acclist[0].Phone;
                       component.set("v.AccPhone", AccPhone);
                    }
                });
                $A.enqueueAction(action2);
            }
        });
        $A.enqueueAction(action);
    },
    
    PageChange: function(component, event, helper){
        component.set("v.Email", null);
        component.set("v.isModalOpen",false);
    },
    
    openModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        component.set("v.isModalOpen", true);
    },
    
    
    handleClose: function(component, event, helper) {
        console.log("After clicking Cancel button:" +event.getSource().get("v.Cancel"));
        //alert('After clicking Cancel button');
        component.set("v.isModalOpen",false);
        component.set("v.Email", null);
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope" : "Contact"
            
        });
        homeEvent.fire();
        
    },
    handleClick: function(component, event, helper) {
        var inputField = component.get("v.Email");
        if( !inputField || ! inputField.trim()){
            alert("Please enter a Email Before Clicking on Next");
            return;
        } else{
            var emailField = component.find("txtEmail");
            var emailFieldValue = emailField.get("v.value");
            // Store Regular Expression
            var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
           if(!$A.util.isEmpty(emailFieldValue)){   
                if(emailFieldValue.match(regExpEmailformat)){
                    emailField.set("v.errors", [{message: null}]);
                    $A.util.removeClass(emailField, 'slds-has-error');
                    
                    // Create multiple Server Actions
                    var action1 = component.get("c.getContacts");
                    var action2 = component.get("c.getleads");
                    // Parameters for Actions 
                    action1.setParams({
                        "Email" : component.get("v.Email")
                    });
                    action2.setParams({
                        "LdEmail" : component.get("v.Email")
                    });
                    //Set Callback Functions for each Actions
                    action1.setCallback(this, function(response1){
                        var state1 =response1.getState();
                       action2.setCallback(this, function(response2){
                            var state2 =response2.getState();
                           // if( state1 === "SUCCESS" && state2 ==="SUCCESS" || state1 === "SUCCESS" || state2 ==="SUCCESS" ){
                            if( state1 === "SUCCESS" || state2 ==="SUCCESS"){
                                // if((response1.getReturnValue() !='' && response2.getReturnValue() !='') || response1.getReturnValue() !='' || response1.getReturnValue() !=''){
                                if((response1.getReturnValue() !='' || response2.getReturnValue() !='') || response1.getReturnValue() !='' || response1.getReturnValue() !=''){
                                    component.set("v.isModalOpen",true);
                                    component.set("v.contactList", response1.getReturnValue());
                                    component.set("v.leadList", response2.getReturnValue());   
                                }
                                else if((response1.getReturnValue()=='' || response2.getReturnValue() =='') || response1.getReturnValue() =='' || response2.getReturnValue()=='') {
                                    //else if((response1.getReturnValue()=='' && response2.getReturnValue() =='') || response1.getReturnValue() =='' || response2.getReturnValue()=='') {
                                    component.set("v.isModalOpen",false);
                                    //  component.set("v.Email", Email);
                                    
                                    //  window.location.href='/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0'   
                                    var IsTrue =component.get("v.IsTrue");
                                     if(IsTrue){                                      
                                        var EmailFieldValue = component.find("txtEmail");
                                        var EmaillightningFieldValue = EmailFieldValue.get("v.value");
                                        var encodedEmail =encodeURIComponent(EmaillightningFieldValue);
                                        var AccId =component.get("v.AccrecId");
                                        var encodedAccId =encodeURIComponent(AccId);
                                        var AccAddress =component.get("v.AccAdrssCountry");
                                        var AccAddress =(typeof AccAddress !== 'undefined')? AccAddress : "";
                                         //SR 808516 : RMN
                                         //var AccAddress = AccAddress.replace(/,/g, ' ');
                                         console.log("Street after replacing Comma with Space", AccAddress);
                                       var encodedAccCountry =encodeURIComponent(AccAddress);
                                        var AccAddress1 =component.get("v.AccAdrssState");
                                         var AccAddress1 =(typeof AccAddress1 !== 'undefined')? AccAddress1 : "";
                                        var encodedAdrssState =encodeURIComponent(AccAddress1);
                                       var AccAddress2 =component.get("v.AccAdrssStreet");
                                         var AccAddress2 =(typeof AccAddress2 !== 'undefined')? AccAddress2 : "";
                                         var AccAddress2 = AccAddress2.replace(/,/g, ' ');
                                         console.log("Street after replacing Comma with Space", AccAddress2);
                                        var encodedAddressStreet =encodeURIComponent(AccAddress2);
                                        var AccAddress3 =component.get("v.AccAdrssPostalCode");
                                        var AccAddress3 =(typeof AccAddress3 !== 'undefined')? AccAddress3 : "";
                                        var encodedPostalCode =encodeURIComponent(AccAddress3);
                                        var AccAddress4 =component.get("v.AccAdrssCity");
                                        var AccAddress4 =(typeof AccAddress4 !== 'undefined')? AccAddress4 : "";
                                        var AccAddress4 = AccAddress4.replace(/,/g, ' ');
                                       var encodedAddressCity =encodeURIComponent(AccAddress4);
                                        var AccAddress5 =component.get("v.AccAdrssStateCode");
                                        var AccAddress5 =(typeof AccAddress5 !== 'undefined')? AccAddress5 : "";
                                       var encodedAddressStateCode=encodeURIComponent(AccAddress5);
                                       var AccAddress6 =component.get("v.AccAdrssCountryCode");
                                        var AccAddress6 =(typeof AccAddress6 !== 'undefined')? AccAddress6 : "";
                                        var encodedAdrssCountryCode =encodeURIComponent(AccAddress6);
                                         var AcctsPhone = component.get("v.AccPhone");
                                        var AcctsPhone =(typeof AcctsPhone !== 'undefined')? AcctsPhone : "";
                                        var encodedAccPhone=encodeURIComponent(AcctsPhone);
                                        if(encodedAdrssState == null || encodedAdrssState =='' && (encodedAdrssCountryCode !='AU' || encodedAdrssCountryCode != 'IE' ||encodedAdrssCountryCode != 'US' ||encodedAdrssCountryCode != 'CA')){
                                             console.log("encodedAdrssState", encodedAdrssState);
                                              console.log("encodedAdrssCountryCode", encodedAdrssCountryCode);
                                              //SR 00808516 : RMN : start
                                              //window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCountry=" + encodedAccCountry + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                                              window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                             				  //SR 00808516 : RMN : end
                                            
                                         } else if(encodedAdrssState != null || encodedAdrssState !='' && (encodedAdrssCountryCode !='AU' || encodedAdrssCountryCode != 'IE' ||encodedAdrssCountryCode != 'US' ||encodedAdrssCountryCode != 'CA') ){
                                              //SR 00808516 : RMN : start
                                              //window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCountry=" + encodedAccCountry + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                                              window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                                              //SR 00808516 : RMN : end
                                             
                                         } else{
                                              //SR 00808516 : RMN : start
                                              //window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingCountry=" + encodedAccCountry + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode; 
                                              window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode;
                                         	  //SR 00808516 : RMN : end
                                         }
                                     }else{
                                        var EmailFieldValue = component.find("txtEmail");
                                        var EmaillightningFieldValue = EmailFieldValue.get("v.value");
                                       window.location.href='/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=Email=' +
                                            encodeURIComponent(EmaillightningFieldValue);
                                    }
                                };
                            }else if(state1 ==="INCOMPLETE" && state2 === "INCOMPLETE" ||state1 === "INCOMPLETE" || state2 ==="INCOMPLETE"){
                                var homeEvent = $A.get("e.force:navigateToList");
                                homeEvent.setParams({
                                    "scope": "Contact"
                                    
                                });
                                homeEvent.fire();
                            }
                        });
                        
                        $A.enqueueAction(action2);
                    });
                    $A.enqueueAction(action1);
                    
                    
                }else {
                    $A.util.addClass(emailField, 'slds-has-error');
                    emailField.set("v.errors", [{message: "Please Enter a Valid Email Address"}]);               
                }
            }  
        }		
    },
    
    getDetails: function(component, event, helper){
        var conId = event.target.dataset.contactid;
        var sObectEvent = $A.get("e.force:navigateToSObject");
        sObectEvent.setParams({
            "recordId": conId,
            "slideDevName": "detail"
        });
        sObectEvent.fire();
    },
    getDetailsforLeads: function(component, event, helper){
        var ldId = event.target.dataset.leadid;
        var sObectEvent = $A.get("e.force:navigateToSObject");
        sObectEvent.setParams({
            "recordId": ldId,
            "slideDevName": "detail"
        });
        sObectEvent.fire();
    },
    
    handleContinuetoCreatePage: function(component, event, helper) {
      component.set("v.isModalOpen",false);
                                    //  component.set("v.Email", Email);
                                    
                                    //  window.location.href='/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0'   
                                    var IsTrue =component.get("v.IsTrue");
                                     if(IsTrue){                                      
                                        var EmailFieldValue = component.find("txtEmail");
                                        var EmaillightningFieldValue = EmailFieldValue.get("v.value");
                                        var encodedEmail =encodeURIComponent(EmaillightningFieldValue);
                                        var AccId =component.get("v.AccrecId");
                                        var encodedAccId =encodeURIComponent(AccId);
                                         var AccAddress =component.get("v.AccAdrssCountry");
                                        var AccAddress =(typeof AccAddress !== 'undefined')? AccAddress : "";
                                         //SR 808516 : RMN
                                         //var AccAddress = AccAddress.replace(/,/g, ' ');  
                                         console.log("Street after replacing Comma with Space", AccAddress);
                                       var encodedAccCountry =encodeURIComponent(AccAddress);
                                        var AccAddress1 =component.get("v.AccAdrssState");
                                         var AccAddress1 =(typeof AccAddress1 !== 'undefined')? AccAddress1 : "";
                                        var encodedAdrssState =encodeURIComponent(AccAddress1);
                                       var AccAddress2 =component.get("v.AccAdrssStreet");
                                         var AccAddress2 =(typeof AccAddress2 !== 'undefined')? AccAddress2 : "";
                                         var AccAddress2 = AccAddress2.replace(/,/g, ' ');
                                         console.log("Street after replacing Comma with Space", AccAddress2);
                                        var encodedAddressStreet =encodeURIComponent(AccAddress2);
                                        var AccAddress3 =component.get("v.AccAdrssPostalCode");
                                        var AccAddress3 =(typeof AccAddress3 !== 'undefined')? AccAddress3 : "";
                                        var encodedPostalCode =encodeURIComponent(AccAddress3);
                                       var AccAddress4 =component.get("v.AccAdrssCity");
                                        var AccAddress4 =(typeof AccAddress4 !== 'undefined')? AccAddress4 : "";
                                       var AccAddress4 = AccAddress4.replace(/,/g, ' ');
                                       var encodedAddressCity =encodeURIComponent(AccAddress4);
                                       var AccAddress5 =component.get("v.AccAdrssStateCode");
                                        var AccAddress5 =(typeof AccAddress5 !== 'undefined')? AccAddress5 : "";
                                       var encodedAddressStateCode=encodeURIComponent(AccAddress5);
                                        var AccAddress6 =component.get("v.AccAdrssCountryCode");
                                        var AccAddress6 =(typeof AccAddress6 !== 'undefined')? AccAddress6 : "";
                                        var encodedAdrssCountryCode =encodeURIComponent(AccAddress6);
                                       var AcctsPhone = component.get("v.AccPhone");
                                        var AcctsPhone =(typeof AcctsPhone !== 'undefined')? AcctsPhone : "";
                                        var encodedAccPhone=encodeURIComponent(AcctsPhone);
                                          if(encodedAdrssState == null || encodedAdrssState =='' && (encodedAdrssCountryCode !='AU' || encodedAdrssCountryCode != 'IE' ||encodedAdrssCountryCode != 'US' ||encodedAdrssCountryCode != 'CA')){
                                             console.log("encodedAdrssState", encodedAdrssState);
                                              console.log("encodedAdrssCountryCode", encodedAdrssCountryCode);
                                              //SR 00808516 : RMN : start
                                              //window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCountry=" + encodedAccCountry + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                                              window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                             				  //SR 00808516 : RMN : end
                                              
                                         } else if(encodedAdrssState != null || encodedAdrssState !='' && (encodedAdrssCountryCode !='AU' || encodedAdrssCountryCode != 'IE' ||encodedAdrssCountryCode != 'US' ||encodedAdrssCountryCode != 'CA') ){
                                             //SR 00808516 : RMN : start
                                             //window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCountry=" + encodedAccCountry + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                                             window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingState=" +encodedAdrssState + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode +",MailingStateCode="+encodedAddressStateCode;
                                             //SR 00808516 : RMN : end
                                             
                                         } else{
                                             //SR 00808516 : RMN : start
                                             //window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingCountry=" + encodedAccCountry + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode; 
                                             window.location.href="/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=AccountId="+encodedAccId +",Phone=" + encodedAccPhone + ",Email=" + encodedEmail + ",MailingStreet=" + encodedAddressStreet  + ",MailingCity=" + encodedAddressCity + ",MailingPostalCode=" +encodedPostalCode +",MailingCountryCode=" +encodedAdrssCountryCode;
                                         	 //SR 00808516 : RMN : end
                                         }
                                     }else{
                                        var EmailFieldValue = component.find("txtEmail");
                                        var EmaillightningFieldValue = EmailFieldValue.get("v.value");
                                       window.location.href='/lightning/o/contact/new?nooverride=0&useRecordTypeCheck=0&defaultFieldValues=Email=' +
                                            encodeURIComponent(EmaillightningFieldValue);
                                 }
    },
})