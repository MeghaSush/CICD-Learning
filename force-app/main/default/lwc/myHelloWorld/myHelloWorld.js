import { LightningElement, api } from 'lwc';

export default class MyHelloWorld extends LightningElement {
    /**
     * The current record Id when the component is placed on a Lightning Record Page.
     * Provided by the Lightning App Builder runtime.
     */
    @api recordId;
}