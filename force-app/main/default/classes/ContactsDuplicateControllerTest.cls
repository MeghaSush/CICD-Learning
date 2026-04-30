@isTest(SeeAllData=false)
private class ContactsDuplicateControllerTest {
    @isTest static void testGetContacts() {
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', Email = 'test@email.com', AccountId = acc.Id, Phone = '1234567890');
        insert con;
        Test.startTest();
        List<Contact> contacts = ContactsDuplicateController.getContacts('test@email.com');
        Test.stopTest();
        System.assertEquals(1, contacts.size(), 'Should return one contact');
        System.assertEquals('test@email.com', contacts[0].Email);
    }

    @isTest static void testGetLeads() {
        Lead ld = new Lead(FirstName = 'Test', LastName = 'Lead', Company = 'TestCo', Email = 'lead@email.com', Status = 'Open - Not Contacted', Phone = '9876543210');
        insert ld;
        Test.startTest();
        List<Lead> leads = ContactsDuplicateController.getleads('lead@email.com');
        Test.stopTest();
        System.assertEquals(1, leads.size(), 'Should return one lead');
        System.assertEquals('lead@email.com', leads[0].Email);
    }

    @isTest static void testAccountIdAndAccountDetails() {
        Account acc = new Account(Name = 'Test Account 2', Phone = '1112223333');
        insert acc;
        String encoded = EncodingUtil.base64Encode(Blob.valueOf(acc.Id));
        Test.startTest();
        String decoded = ContactsDuplicateController.AccountId(encoded);
        List<Account> accList = ContactsDuplicateController.AccountDetails(acc.Id);
        Test.stopTest();
        System.assertEquals(acc.Id, decoded, 'Decoded account id should match');
        System.assertEquals(1, accList.size(), 'Should return one account');
        System.assertEquals(acc.Id, accList[0].Id);
        System.assertEquals(acc.Name, accList[0].Name);
    }
}
