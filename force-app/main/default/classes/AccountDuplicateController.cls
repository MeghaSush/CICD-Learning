public with sharing class AccountDuplicateController {
    
    @AuraEnabled
    public static List<Account> findDuplicateAccounts(String accountName, String postalCode) {
        try {
            if (String.isBlank(accountName) && String.isBlank(postalCode)) {
                return new List<Account>();
            }
            
            String query = 'SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, Phone, Website FROM Account WHERE ';
            List<String> conditions = new List<String>();
            
            if (String.isNotBlank(accountName)) {
                conditions.add('Name = :accountName');
            }
            
            if (String.isNotBlank(postalCode)) {
                conditions.add('BillingPostalCode = :postalCode');
            }
            
            query += String.join(conditions, ' AND ');
            query += ' LIMIT 50';
            
            return Database.query(query);
            
        } catch (Exception e) {
            throw new AuraHandledException('Error finding duplicates: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static Id createAccount(String accountName, String billingStreet, String billingCity, 
                                   String billingState, String billingPostalCode, String billingCountry,
                                   String phone, String website) {
        try {
            Account newAccount = new Account(
                Name = accountName,
                BillingStreet = billingStreet,
                BillingCity = billingCity,
                BillingState = billingState,
                BillingPostalCode = billingPostalCode,
                BillingCountry = billingCountry,
                Phone = phone,
                Website = website
            );
            
            insert newAccount;
            return newAccount.Id;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error creating account: ' + e.getMessage());
        }
    }
}