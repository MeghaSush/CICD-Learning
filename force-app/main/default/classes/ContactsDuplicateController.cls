/*
Type Name: ContactsDuplicatesController
Author: M Meghasree
 Created Date        : 19th Febraury 2024
    Functionality       : Company Employee New button override to Identify Duplicate Records Across Company Employees and Leads with Exact email match.
 Service Request		: 00678748 : COMPANY EMPLOYEE: Notify if the contact being created is already available.     
Functionality : This Controller Class has been Written to fetch Contacts and Leads which has same Email Address as Entered in  ContactsDuplicatesIdentification Component Lightening Input Field. and Fetch Account Details when ever we are Creating Contact from 
Company Page under Company Employee Related list. We have so method to Decode base64 url.

Change History : 
SL No.  |   Date    |   ModifiedBy      |   SR No.      |   Modified Reason 

*/








public with sharing class ContactsDuplicateController {
    
    @AuraEnabled
    public static List<Contact> getContacts(String Email){
        system.debug('Email>>>>'+ Email); 
        List<Contact> contactList = new List <Contact>();
       // contactList = [SELECT Id, FirstName, LastName,Name, Email, Phone, RecordType.Name, Account.Name, Owner.Name,MailingAddress,Contact_Primary_Address__c,Days_Since_Last_Activity__c,Last_Quality_Activity__c FROM Contact WHERE Email =: Email];
       contactList = [SELECT Id, FirstName, LastName,Name, Email, Phone FROM Contact WHERE Email =: Email];
 if(contactList.size()>0){
            system.debug('contactList>>>>'+ contactList);  
        }
        return contactList;
    }
    
    @AuraEnabled
    public static List<Lead> getleads(String LdEmail){
        system.debug('LdEmail>>>>'+ LdEmail); 
        List<Lead> leadList = new List <Lead>();
       //leadList = [SELECT Id, FirstName, LastName, Name, Email, Phone, Status, RecordType.Name, Company, Owner.Name,IsConverted,Address,City, Street, Country,State,PostalCode FROM Lead WHERE Email =: LdEmail AND IsConverted = FALSE];
      leadList = [SELECT Id, FirstName, LastName, Name, Email, Phone, Status FROM Lead WHERE Email =: LdEmail];
        if(leadList.size()>0){
            system.debug('leadList>>>>'+ leadList);  
        }
        return leadList;  
    }
    
    @AuraEnabled
    public static  String AccountId(String encodedURLContext){
   //  final  String EncodedUrl = 'eyJ0eXBlIjoic3RhbmRhcmRfX3JlY29yZFJlbGF0aW9uc2hpcFBhZ2UiLCJhdHRyaWJ1dGVzIjp7InJlY29yZElkIjoiMDAxMjMwMDAwMG1UcHJUQUFTIiwib2JqZWN0QXBpTmFtZSI6IkFjY291bnQiLCJyZWxhdGlvbnNoaXBBcGlOYW1lIjoiQ29udGFjdHMiLCJhY3Rpb25OYW1lIjoidmlldyIsInJlY29yZFR5cGVJZCI6IjAxMlUwMDAwMDAwTXJTa0lBSyJ9LCJzdGF0ZSI6e319';
      final String EncodedUrl = encodedURLContext;
      Blob decodedBlob =EncodingUtil.base64Decode(EncodedUrl);
    String DecodedUrl =decodedBlob.toString();
     // String URLContext =EncodingUtil.urlDecode(encodedURLContext, 'UTF-8');
      System.debug('DecodedUrl: ' + DecodedUrl);
          return DecodedUrl;
  
    }
     @AuraEnabled
        public static List<Account> AccountDetails(String AccrecId){
        system.debug('AccrecId>>>>'+ AccrecId); 
        List<Account> Acclist = new List <Account>();
       // Acclist = [SELECT Id, Name, Phone, RecordType.Name, Owner.Name,BillingAddress FROM Account WHERE Id =: AccrecId];
       Acclist = [SELECT Id, Name, Phone, BillingAddress FROM Account WHERE Id =: AccrecId];
        if(Acclist.size()>0){
            system.debug('Acclist>>>>'+ Acclist);  
        }
        return Acclist;
        }
}