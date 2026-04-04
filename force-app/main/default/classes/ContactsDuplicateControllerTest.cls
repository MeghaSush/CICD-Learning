@isTest(SeeAllData=false)
private class ContactsDuplicateControllerTest {
    @isTest static void testGetContacts() {
        // Create account & contact
        Account acct = new Account(Name = 'Test Account', Phone = '1234567890');
        insert acct;

        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', Email = 'contact@testexample.com', AccountId = acct.Id);
        insert con;

        Test.startTest();
            List<Contact> results = ContactsDuplicateController.getContacts('contact@testexample.com');
        Test.stopTest();

        System.assertNotEquals(null, results, 'Result list should not be null');
        System.assertEquals(1, results.size(), 'Should return one contact');
        System.assertEquals(con.Email, results[0].Email, 'Emails should match');
        System.assertEquals(con.LastName, results[0].LastName, 'Last names should match');
    }

    @isTest static void testGetLeads() {
        // Create lead
        Lead ld = new Lead(FirstName = 'Lead', LastName = 'One', Company = 'TestCo', Email = 'lead@testexample.com', Status = 'Open - Not Contacted');
        insert ld;

        Test.startTest();
            List<Lead> results = ContactsDuplicateController.getleads('lead@testexample.com');
        Test.stopTest();

        System.assertNotEquals(null, results, 'Result list should not be null');
        System.assertEquals(1, results.size(), 'Should return one lead');
        System.assertEquals(ld.Email, results[0].Email, 'Lead emails should match');
        System.assertEquals(ld.Company, results[0].Company, 'Lead company should match');
    }

    @isTest static void testAccountIdAndDetails() {
        // Create account
        Account acct = new Account(Name = 'Decode Account', Phone = '9876543210');
        insert acct;

        // Encode the Account Id string using base64 as the controller expects
        String original = acct.Id;
        String encoded = EncodingUtil.base64Encode(Blob.valueOf(original));

        Test.startTest();
            String decoded = ContactsDuplicateController.AccountId(encoded);
            List<Account> acctResults = ContactsDuplicateController.AccountDetails(acct.Id);
        Test.stopTest();

        System.assertEquals(original, decoded, 'Decoded string should match original account id');
        System.assertNotEquals(null, acctResults);
        System.assertEquals(1, acctResults.size(), 'Should return one account');
        System.assertEquals(acct.Id, acctResults[0].Id, 'Account Id should match');
        System.assertEquals(acct.Name, acctResults[0].Name, 'Account Name should match');
    }
}
