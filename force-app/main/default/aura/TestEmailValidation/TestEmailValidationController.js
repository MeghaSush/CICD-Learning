({
    
    
     doInit: function(component, event, helper){
    var currentURL =window.location.href;
         if(currentURL.includes('count=1')|| currentURL.includes('nJlY29yZElkIjoiMDAxNWowMDAwMWF2Vm91QUFF') ){
             console.log('Url Capture');
           component.set("v.url", currentURL);
         }
         },

  
 })