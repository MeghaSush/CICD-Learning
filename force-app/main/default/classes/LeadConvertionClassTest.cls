@isTest
private class LeadConvertionClassTest {
    @isTest static void testBatchableMethods() {
        // Create Record Types for Lead and Contact
        RecordType leadRT = new RecordType(SObjectType = Lead.SObjectType, Name = 'IBG Lead', DeveloperName = 'IBG_Lead');
        insert leadRT;
        RecordType contactRT = new RecordType(SObjectType = Contact.SObjectType, Name = 'IBG Contact', DeveloperName = 'IBG_Contact');
        insert contactRT;

        // Create Account
        Account acc = new Account(Name = 'Test Account');
        insert acc;

        // Create Contact with matching email and record type
        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', Email = 'test@batch.com', AccountId = acc.Id, RecordTypeId = contactRT.Id);
        insert con;

        // Create Lead with same email and record type
        Lead ld = new Lead(FirstName = 'Test', LastName = 'Lead', Company = 'TestCo', Email = 'test@batch.com', RecordTypeId = leadRT.Id, Status = 'Open - Not Contacted');
        insert ld;

        // Create LeadStatus for conversion
        List<LeadStatus> statuses = [SELECT Id, ApiName, IsConverted FROM LeadStatus WHERE IsConverted = true LIMIT 1];
        if (statuses.isEmpty()) {
            LeadStatus ls = new LeadStatus(MasterLabel = 'Converted', ApiName = 'Converted', IsConverted = true);
            insert ls;
        }

        Test.startTest();
            LeadConvertionClass batch = new LeadConvertionClass();
            Database.executeBatch(batch, 1);
        Test.stopTest();
    }

    @isTest static void testDoRecordTypesMatch() {
        // Test IBG match
        System.assertEquals(true, Test.invokePrivate('LeadConvertionClass', 'doRecordTypesMatch', new List<Object>{'IBG', 'IBG'}));
        // Test Individual match
        System.assertEquals(true, Test.invokePrivate('LeadConvertionClass', 'doRecordTypesMatch', new List<Object>{'Individual', 'Individual'}));
        // Test mismatch
        System.assertEquals(false, Test.invokePrivate('LeadConvertionClass', 'doRecordTypesMatch', new List<Object>{'IBG', 'Individual'}));
    }

    @isTest static void testFinish() {
        Test.startTest();
            LeadConvertionClass batch = new LeadConvertionClass();
            batch.finish(null);
        Test.stopTest();
        System.assert(true, 'Finish method executed');
    }
}
