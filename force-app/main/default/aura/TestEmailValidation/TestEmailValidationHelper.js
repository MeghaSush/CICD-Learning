({
	setIsRelatedList : function() {
		 var currentURL =window.location.href;
         if(currentURL.includes('navigationLocation=RELATED_LIST')|| currentURL.includes('uid=170961630335754721') ){
             console.log(currentURL);
           component.set("v.isrelatedList", true);
         }else{
             component.set("v.isrelatedList", false);
         }
	}
})