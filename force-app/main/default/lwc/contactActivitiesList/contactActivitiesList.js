import { LightningElement, api, wire } from 'lwc';
import getContactActivities from '@salesforce/apex/ContactActivitiesController.getContactActivities';
import { NavigationMixin } from 'lightning/navigation';

export default class ContactActivitiesList extends NavigationMixin(LightningElement) {
    @api recordId; // Contact record ID from the page
    activities = [];
    error;
    isLoading = true;

    @wire(getContactActivities, { contactId: '$recordId' })
    wiredActivities({ error, data }) {
        this.isLoading = false;
        if (data) {
            // Format dates for display
            this.activities = data.map(activity => {
                return {
                    ...activity,
                    formattedDate: this.formatDate(activity.activityDate)
                };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.activities = [];
        }
    }

    get hasActivities() {
        return this.activities && this.activities.length > 0;
    }

    get noActivities() {
        return !this.isLoading && (!this.activities || this.activities.length === 0);
    }

    // Navigate to activity record
    handleActivityClick(event) {
        const activityId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: activityId,
                actionName: 'view'
            }
        });
    }

    // Format date for display
    formatDate(dateValue) {
        if (!dateValue) return 'No Date';
        const date = new Date(dateValue);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Get icon based on activity type
    getActivityIcon(type) {
        return type === 'Task' ? 'standard:task' : 'standard:event';
    }

    // Get variant class for activity type
    getActivityVariant(type) {
        return type === 'Task' ? 'slds-theme_warning' : 'slds-theme_info';
    }
}