public class LeadConvertionClass  implements Database.Batchable<SObject>{
 //Query all leads that are not converted and has email address populated
    public Database.QueryLocator start(Database.BatchableContext bc){
 String query ='SELECT Id, Email,RecordType.Name From Lead WHERE IsConverted = False AND Email !=null';
    return Database.getQueryLocator(query);
    }
    public void execute(Database.BatchableContext bc, List<Lead>scope){
     /*   //Collect All Lead Emails and Lead RecordTypes
        Set<String> leadEmails =new Set<String>();
        //Map to Store Email and RecordTypes
        Map<String, String> leadEmailToRecordType = new Map<String, String>();
        
        for(Lead lead : scope){
            leadEmails.add(lead.Email);
          //  leadEmailToRecordType.put(lead.Email, lead.RecordType.Name);
        }
        //Query Contacts using collected Lead Emails
    //    List<Contact> contacts =[SELECT Id, Email, RecordType.Name, AccountId FROM Contact WHERE Email IN :leadEmails AND (RecordType.Name LIKE '%IBG%' OR RecordType.Name LIKE '%Individual%')];
     List<Contact> contacts =[SELECT Id, Email, RecordType.Name, AccountId FROM Contact WHERE Email IN :leadEmails];
        System.debug('Contact Records: ' +contacts);
        //Create a map to handle Multiple Contacts
       Map<String, List<Contact>> emailToContactMap =new Map<String, List<Contact>>();
        for(Contact contact : contacts){
            if(!emailToContactMap.containsKey(contact.Email)){
                emailToContactMap.put(contact.Email, new List<Contact>());
            }
            emailToContactMap.get(contact.Email).add(contact);
        }
        //Prepare for Lead Conversion
        List<Database.LeadConvert> leadConvertList =new List<Database.LeadConvert>();
        LeadStatus convertStatus = [SELECT Id, ApiName FROM LeadStatus WHERE IsConverted=true];
        for(Lead lead : scope){
            //find matching contact based on email
            List<Contact> matchingContacts = emailToContactMap.get(lead.Email);
            if(matchingContacts != null && !matchingContacts.isEmpty()){
                //filter contacts with matching record type 
                List<Contact> matchingRecordTypeContacts = new List<Contact>();
                for(Contact contact : matchingContacts){
                    if(doRecordTypesMatch(lead.RecordType.Name, contact.RecordType.Name)){
                        matchingRecordTypeContacts.add(contact);
                    }
               }
                
                //skip conversion if multiple contacts with same recordtype are found
                if(matchingRecordTypeContacts.size() ==1){
                    Contact matchingContact =matchingRecordTypeContacts[0];
                    //prepare for lead conversion
                    Database.LeadConvert leadConvert = new Database.LeadConvert();
                    leadConvert.setLeadId(lead.Id);
                    leadConvert.setDonotCreateOpportunity(true);
                    leadConvert.setContactId(matchingContact.Id);
                    leadConvert.setAccountId(matchingContact.AccountId);
                     leadConvert.setConvertedStatus(convertStatus.ApiName);
                    leadConvertList.add(leadConvert);
                }else{
                        System.debug('Multiple Contacts with Same recordtyep are found : ' + lead.id+', skipping Conversion');
                        
                    }
                }
            }
            if (!leadConvertList.isEmpty()){
                //Execute the Lead Conversion
                List<Database.LeadConvertResult> results = Database.convertLead(leadConvertList);
                for(Database.LeadConvertResult result : results){
                    if(!result.isSuccess()){
                        System.debug('Lead Conversion is Failed: ' + result.getErrors()[0].getMessage());
                    }
                }
            }*/
        }
    
   public void finish(Database.BatchableContext bc){
 // System.debug('Lead converted successfully: '+ result.size());
  }
        private static Boolean doRecordTypesMatch(String leadRecordType, String contactRecordType){
          Boolean leadMatchesIBG = leadRecordType.contains('IBG');
       Boolean contactMatchesIBG =contactRecordType.contains('IBG');
       Boolean leadMatchesIndividual = leadRecordType.contains('Individual');
       Boolean  contactMatchesIndividual =contactRecordType.contains('Individual');
       
       //If both lead and Contact contains Same Record Type Keyword, return true 
      return (leadMatchesIBG && contactMatchesIBG ||leadMatchesIndividual && contactMatchesIndividual );
        }
        
}