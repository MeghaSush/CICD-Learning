public class SkRecordTypeSelectionController {
@AuraEnabled
     public static List<opportunity> getopportynity() {

        return [SELECT Id, Name, Type FROM opportunity LIMIT 10];

    }
}