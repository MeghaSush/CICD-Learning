import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import findDuplicateAccounts from '@salesforce/apex/AccountDuplicateController.findDuplicateAccounts';
import createAccount from '@salesforce/apex/AccountDuplicateController.createAccount';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Billing Street', fieldName: 'BillingStreet', type: 'text' },
    { label: 'Billing City', fieldName: 'BillingCity', type: 'text' },
    { label: 'Billing State', fieldName: 'BillingState', type: 'text' },
    { label: 'Billing Postal Code', fieldName: 'BillingPostalCode', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'View', name: 'view' }
            ]
        }
    }
];

export default class AccountDuplicateChecker extends NavigationMixin(LightningElement) {
    @track accountName = '';
    @track billingStreet = '';
    @track billingCity = '';
    @track billingState = '';
    @track billingPostalCode = '';
    @track billingCountry = '';
    @track phone = '';
    @track website = '';
    
    @track duplicates = [];
    @track showDuplicates = false;
    @track isLoading = false;
    @track isSaving = false;
    
    columns = COLUMNS;

    get hasDuplicates() {
        return this.duplicates && this.duplicates.length > 0;
    }

    handleAccountNameChange(event) {
        this.accountName = event.target.value;
    }

    handlePostalCodeChange(event) {
        this.billingPostalCode = event.target.value;
    }

    handleFieldChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    handleCheckDuplicates() {
        if (!this.accountName && !this.billingPostalCode) {
            this.showToast('Warning', 'Please enter Account Name or Postal Code to check for duplicates', 'warning');
            return;
        }

        this.isLoading = true;
        this.showDuplicates = false;

        findDuplicateAccounts({
            accountName: this.accountName,
            postalCode: this.billingPostalCode
        })
            .then(result => {
                this.duplicates = result;
                this.showDuplicates = true;
                this.isLoading = false;
                
                if (this.hasDuplicates) {
                    this.showToast('Warning', `Found ${result.length} potential duplicate(s)`, 'warning');
                } else {
                    this.showToast('Success', 'No duplicates found', 'success');
                }
            })
            .catch(error => {
                this.isLoading = false;
                this.showToast('Error', error.body?.message || 'Error checking duplicates', 'error');
            });
    }

    handleSave() {
        if (!this.accountName) {
            this.showToast('Error', 'Account Name is required', 'error');
            return;
        }

        this.isSaving = true;

        createAccount({
            accountName: this.accountName,
            billingStreet: this.billingStreet,
            billingCity: this.billingCity,
            billingState: this.billingState,
            billingPostalCode: this.billingPostalCode,
            billingCountry: this.billingCountry,
            phone: this.phone,
            website: this.website
        })
            .then(accountId => {
                this.showToast('Success', 'Account created successfully', 'success');
                this.isSaving = false;
                
                // Navigate to the new account record
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: accountId,
                        objectApiName: 'Account',
                        actionName: 'view'
                    }
                });
            })
            .catch(error => {
                this.isSaving = false;
                this.showToast('Error', error.body?.message || 'Error creating account', 'error');
            });
    }

    handleCancel() {
        // Navigate to Account list view
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view') {
            // Navigate to the existing account record
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Id,
                    objectApiName: 'Account',
                    actionName: 'view'
                }
            });
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}