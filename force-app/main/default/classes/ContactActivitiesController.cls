public with sharing class ContactActivitiesController {
    
    @AuraEnabled(cacheable=true)
    public static List<ActivityWrapper> getContactActivities(Id contactId) {
        List<ActivityWrapper> activities = new List<ActivityWrapper>();
        
        if (contactId == null) {
            return activities;
        }
        
        // Query Tasks
        List<Task> tasks = [
            SELECT Id, Subject, ActivityDate, Status, Priority, Description,
                   CreatedDate, LastModifiedDate, Owner.Name
            FROM Task
            WHERE WhoId = :contactId
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
            LIMIT 100
        ];
        
        for (Task task : tasks) {
            activities.add(new ActivityWrapper(task));
        }
        
        // Query Events
        List<Event> events = [
            SELECT Id, Subject, ActivityDate, StartDateTime, EndDateTime,
                   Location, Description, CreatedDate, LastModifiedDate, Owner.Name
            FROM Event
            WHERE WhoId = :contactId
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
            LIMIT 100
        ];
        
        for (Event event : events) {
            activities.add(new ActivityWrapper(event));
        }
        
        // Sort by date descending
        activities.sort();
        
        return activities;
    }
    
    // Wrapper class to handle both Tasks and Events
    public class ActivityWrapper implements Comparable {
        @AuraEnabled public String id { get; set; }
        @AuraEnabled public String subject { get; set; }
        @AuraEnabled public String type { get; set; }
        @AuraEnabled public Date activityDate { get; set; }
        @AuraEnabled public String status { get; set; }
        @AuraEnabled public String priority { get; set; }
        @AuraEnabled public String description { get; set; }
        @AuraEnabled public String ownerName { get; set; }
        @AuraEnabled public String location { get; set; }
        @AuraEnabled public DateTime startDateTime { get; set; }
        @AuraEnabled public DateTime endDateTime { get; set; }
        @AuraEnabled public DateTime createdDate { get; set; }
        
        public ActivityWrapper(Task task) {
            this.id = task.Id;
            this.subject = task.Subject;
            this.type = 'Task';
            this.activityDate = task.ActivityDate;
            this.status = task.Status;
            this.priority = task.Priority;
            this.description = task.Description;
            this.ownerName = task.Owner.Name;
            this.createdDate = task.CreatedDate;
        }
        
        public ActivityWrapper(Event event) {
            this.id = event.Id;
            this.subject = event.Subject;
            this.type = 'Event';
            this.activityDate = event.ActivityDate;
            this.location = event.Location;
            this.description = event.Description;
            this.ownerName = event.Owner.Name;
            this.startDateTime = event.StartDateTime;
            this.endDateTime = event.EndDateTime;
            this.createdDate = event.CreatedDate;
        }
        
        // Implement Comparable interface for sorting
        public Integer compareTo(Object compareTo) {
            ActivityWrapper compareToActivity = (ActivityWrapper) compareTo;
            
            // Sort by activity date descending, then by created date descending
            if (this.activityDate == null && compareToActivity.activityDate == null) {
                return compareToActivity.createdDate > this.createdDate ? 1 : -1;
            } else if (this.activityDate == null) {
                return 1;
            } else if (compareToActivity.activityDate == null) {
                return -1;
            } else if (this.activityDate < compareToActivity.activityDate) {
                return 1;
            } else if (this.activityDate > compareToActivity.activityDate) {
                return -1;
            } else {
                return compareToActivity.createdDate > this.createdDate ? 1 : -1;
            }
        }
    }
}