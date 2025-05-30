import {LightningElement, api, track, wire} from 'lwc';
import getFlowNamesApex from '@salesforce/apex/FlowPickerController.getFlowNamesApex';
import {FlowAttributeChangeEvent} from 'lightning/flowSupport';

export default class flowPicker extends LightningElement {
    @api label;
    @api value;
    @api selectedFlowApiName;
    @api showActiveFlowsOnly = false;
    @api searchString;
    @api required;
    @api showWhichFlowTypes = 'Flow,AutolaunchedFlow';
    @api placeholder = '- Select a Flow -';
    @api componentWidth = '12';
    @track flowDefinitions;

    @wire(getFlowNamesApex, {filtersString: '$filters'})
    _getFlowNamesApex({error, data}) {
        if (error) {
            //console.log(error.body.message);
        } else if (data) {
            this.flowDefinitions = data;
        }
    }

    // Set the width of the component as a # out of 12
    // 12 = 100% width, 6 = 50% width, 3 = 25%width, etc
    get comboboxWidth() {
        return 'slds-size_' + this.componentWidth + '-of-12 slds-form-element';
    }

    get filters() {
        let filters = new Object();

        if (this.showWhichFlowTypes) {
            filters['ProcessType'] = this.splitValues(this.showWhichFlowTypes);
        }
        if (this.showActiveFlowsOnly) {
            filters['!ActiveVersionId'] = ['null'];
        }
        // Add filter for Search String
        if (this.searchString) {
            // filters['Label'] = ["\'%"+this.searchString+"%\'"];
            filters['Label'] = ['%'+this.searchString+'%'];         // v1.6
        }
        return JSON.stringify(filters);
    }

    get options() {
        if (this.flowDefinitions) {
            return this.flowDefinitions.map(curFD => {
                return {
                    value: curFD.ApiName,
                    label: curFD.Label,
                    id: curFD.ActiveVersionId
                }
            });
        } else {
            return [];
        }
    }

    handleChange(event) {
        this.selectedFlowApiName = event.detail.value;
        const attributeChangeEvent = new FlowAttributeChangeEvent('selectedFlowApiName', this.selectedFlowApiName);
        this.dispatchEvent(attributeChangeEvent);
        let selectedFlow = this.options.find(option => this.selectedFlowApiName === option.value);
        let activeFlowId = this.options.find(option => this.selectedFlowApiName === option.id);
        console.log("🚀 ~ flowPicker ~ handleChange ~ activeFlowId:", activeFlowId);
        this.dispatchEvent(new CustomEvent('flowselect', { detail: { ...selectedFlow} }));
        // this.dispatchEvent(new CustomEvent('flowselect', { detail: { apiName: {...selectedFlow}, activeId: {...activeFlowId} } }));
        this.value = this.selectedFlowApiName;
    }

    // This is added to make the selected Flow API Name available to a calling Aura component
    @api
    flowApiName() {
        return this.selectedFlowApiName;
    }

    @api
    validate() {
        if (this.required && !this.selectedFlowApiName) {
            return {
                isValid: false,
                errorMessage: 'Complete this field.'
            };
        } else {
            return {isValid: true};
        }
    }

    splitValues(originalString) {
        if (originalString) {
            return originalString.replace(/ /g, '').split(',');
        } else {
            return [];
        }
    };

}
