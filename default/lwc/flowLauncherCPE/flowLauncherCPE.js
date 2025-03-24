import { LightningElement, api, track, wire } from 'lwc';
import getFlowVariables from '@salesforce/apex/FlowLauncherVariableController.getFlowVariables';
import getFlowVersionInfo from '@salesforce/apex/FlowLauncherVersionInfoController.getFlowVersionInfo';

const DATA_TYPE = {
    STRING: 'String',
    BOOLEAN: 'Boolean',
    NUMBER: 'Number',
    INTEGER: 'Integer'
};

const FLOW_EVENT_TYPE = {
    DELETE: 'configuration_editor_input_value_deleted',
    CHANGE: 'configuration_editor_input_value_changed'
}

const defaults = {
    inputAttributePrefix: 'select_',
};

export default class flowLauncherCPE extends LightningElement {
    @api automaticOutputVariables;
    typeValue;
    _builderContext = {};
    _values = [];
    _flowVariables = [];
    _typeMappings = [];
    rendered;

    @track inputValues = {
        buttonLabel: { value: null, valueDataType: null, isCollection: false, label: 'Button Label' },
        showFlowInModal: { value: null, valueDataType: null, isCollection: false, label: 'Show Flow in Modal?' },
        cb_showFlowInModal: { value: null, valueDataType: null, isCollection: false, label:''},
        flowToLaunch: { value: null, valueDataType: null, isCollection: false, label: 'Flow to Launch' },
        flowInputVariableName: { value: null, valueDataType: null, isCollection: false, label: 'Flow Input Variable Name' },
        flowInputValue: { value: null, valueDataType: null, isCollection: false, label: 'Flow Input Value' },
        flowInputVariablesJSON: {value: null, valueDataType: null, isCollection: false, label: 'Flow Input Variable JSON String'},
        buttonVariant: { value: null, valueDataType: null, isCollection: false, label: 'Button Variant' },
        stretchButton: { value: null, valueDataType: null, isCollection: false, label: 'Stretch Button' },
        cb_stretchButton: { value: null, valueDataType: null, isCollection: false, label:''},
        iconPosition: { value: null, valueDataType: null, isCollection: false, label: 'Icon Position' },
        iconName: { value: null, valueDataType: null, isCollection: false, label: 'Icon Name' },
        buttonPadding: { value: null, valueDataType: null, isCollection: false, label: 'Button Padding'  }, 
        isDisableClose: { value:null, valueDataType: null, isCollection: false, label: 'Disable Close' },
        cb_isDisableClose: { value:null, valueDataType: null, isCollection: false, label:''},
        hideButton: { value:null, valueDataType: null, isCollection: false, label: 'Hide Button (Make Reactive)' },
        cb_hideButton: {value:null, valueDataType: null, isCollection: false, label:''},
        modalSize: { value:null, valueDataType: null, isCollection: false, label: 'Modal Size' },
    
        
    };

    @api 
    get selectedFlowApiName() {
        return this._selectedFlowApiName;
    }
    set selectedFlowApiName(value) {
        this._selectedFlowApiName = value;
    }
    _selectedFlowApiName;

    @api 
    get flowVersionViewId() {
        return this._flowVersionViewId;
    }
    set flowVersionViewId(value) {
        this._flowVersionViewId = value;
    }
    _flowVersionViewId;

    error;
    activeVersionId;
    latestVersionId;

    @track isModalOpen = false;

    openJsonGeneratorModal() {
        this.isModalOpen = true;
    }

    closeJsonGeneratorModal() {
        this.isModalOpen = false;
    }

    @wire(getFlowVersionInfo, { flowApiName: '$selectedFlowApiName' })
    wiredFlowVersionInfo({ error, data }) {
        if (data) {
            if (data.hasError) {
                this.error = { body: { message: data.errorMessage }};
                this.activeVersionId = undefined;
                this.latestVersionId = undefined;
            } else {
                this.activeVersionId = data.activeVersionId;
                this.latestVersionId = data.latestVersionId;
                this.error = undefined;
            }
        } else if (error) {
            this.error = error;
            this.activeVersionId = undefined;
            this.latestVersionId = undefined;
        }
        this.flowVersionViewId = (!this.activeVersionId) ? this.latestVersionId : this.activeVersionId; // Use Latest Flow Version unless there is an Active Version then use that instead
        this.processFlowInputVariables(this._flowVersionViewId);
    }

    get hasError() {
        return this.error != null;
    }

    flowInputVariables;
    inputVariableOptions;

    get isNoFlowAPIName() {
        return this._selectedFlowApiName == null || this._selectedFlowApiName == '' || this._selectedFlowApiName == undefined;
    }

    get inputVariablePlaceholder() {
        return (this.inputVariableOptions?.length == 0) ? 'The selected flow has no variables available for input' : 'Select Flow Input Variable';
    }

    @api get builderContext() {
        return this._builderContext;
    }

    set builderContext(value) {
        this._builderContext = value;
    }

    @api get inputVariables() {
        return this._values;
    }

    set inputVariables(value) {
        this._values = value;
        this.initializeValues();
    }

    @api get genericTypeMappings() {
        return this._genericTypeMappings;
    }
    set genericTypeMappings(value) {
        this._typeMappings = value;
        this.initializeTypeMappings();
    } 
    
    get buttonVariants() {
        return [
            { label: 'Base', value: 'base' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Brand', value: 'brand' },
            { label: 'Success', value: 'success' },
            { label: 'Brand-Outline', value:'brand-outline' },
            { label: 'Destructive', value: 'destructive' },
            { label: 'Inverse', value: 'inverse' },
            { label: 'Destructive-Text', value: 'destructive-text' },
        ];
    }

    get iconPositions() {
        return [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'Right' },
        ];
    }

    get paddingOptions() {
        return [
            { label: 'slds-p-around_none', value: 'slds-p-around_none' },
            { label: 'slds-p-around_xxx-small', value: 'slds-p-around_xxx-small' },
            { label: 'slds-p-around_xx-small', value: 'slds-p-around_xx-small' },
            { label: 'slds-p-around_small', value: 'slds-p-around_small' },
            { label: 'slds-p-around_medium', value: 'slds-p-around_medium' },
            { label: 'slds-p-around_large', value: 'slds-p-around_large' },
            { label: 'slds-p-around_x-large', value:'slds_p-around_x-large' },
            { label: 'slds-p-around_xx-large', value: 'slds-p-around_xx-large' },
        ];
    }

    get modalSizes() {
        return [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Full', value: 'full' },
        ];
    }

    get isNotShowFlowInModal() {
        return (this._isNotShowFlowInModal == undefined) ? !this.inputValues.showFlowInModal.value : this._isNotShowFlowInModal;
    }
    set isNotShowFlowInModal(value) {
        this._isNotShowFlowInModal = value;
    }
    _isNotShowFlowInModal;

    disableCloseHelp = 'Select if you want to disable the ability for the user to escape or click the X to close the flow modal.  This will require the user to complete the flow in order to return.';

    get sampleButtonClass() {
        return 'slds-box slds-box_x-small slds-m-top_xx-small';
    }

    get buttonPaddingClass() {
        return this.inputValues.buttonPadding.value;
    }

    get isStretchButton() {
        return this.inputValues.cb_stretchButton.value == 'CB_TRUE';
    }

    /* LIFECYCLE HOOKS */

    renderedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            for (let flowCombobox of this.template.querySelectorAll('c-flow_launcher-combobox')) {
                flowCombobox.builderContext = this.builderContext;
                flowCombobox.automaticOutputVariables = this.automaticOutputVariables;
            }
        }
                
    }

    /* ACTION FUNCTIONS */
    initializeValues(value) {
        if (this._values && this._values.length) {
            this._values.forEach(curInputParam => {
                if (curInputParam.name && this.inputValues[curInputParam.name]) {                    
                    if (this.inputValues[curInputParam.name].serialized) {
                        this.inputValues[curInputParam.name].value = JSON.parse(curInputParam.value);
                    } else {
                        this.inputValues[curInputParam.name].value = curInputParam.value;
                    }
                    this.inputValues[curInputParam.name].valueDataType = curInputParam.valueDataType;
                    if (curInputParam.name == 'flowToLaunch' && curInputParam.value && curInputParam.value != null) {
                        this.selectedFlowApiName = curInputParam.value;
                    }
                }
            });
        }
    }

    initializeTypeMappings() {
        this._typeMappings.forEach((typeMapping) => {
            
            if (typeMapping.name && typeMapping.value) {
                this.typeValue = typeMapping.value;
            }
        });
    }

    processFlowInputVariables(flowVersionId) {
        getFlowVariables({flowVersionViewId: flowVersionId})
        .then((flowVariables) => {
            this.flowInputVariables = flowVariables;
            this.inputVariableOptions = [];
            this.flowInputVariables.forEach(flowInputVariable => {
                this.inputVariableOptions.push({
                    label: flowInputVariable.apiName,
                    value: flowInputVariable.apiName,
                    description: this.processDescription(flowInputVariable.dataType, flowInputVariable.description, flowInputVariable.isCollection, flowInputVariable.objectType)
                });
            });
        })
        .catch(error => {
            //console.log("flowLauncherCPE ~ processFlowInputVariables ~ error:", error);
            this.flowInputVariables = undefined;
        });
    }

    processDescription(dataType, description, isCollection, objectType) {
        let type = (dataType == 'sObject') ? `${objectType} Object` : dataType;
        let isCol = (isCollection) ? ' Collection' : '';
        let desc = (description && description != null) ? ` : ${description}` : '';
        return `${type}${isCol}${desc}`;
    }

    /* EVENT HANDLERS */

    handleFlowComboboxValueChange(event) {
        if (event.target && event.detail) {
            this.dispatchFlowValueChangeEvent(event.target.name, event.detail.newValue, event.detail.newValueDataType);
        };
    }

    handleCheckboxChange(event) {
        if (event.target && event.detail) {
            let changedAttribute = event.target.name.replace(
                defaults.inputAttributePrefix,
                ''
            );
            this.dispatchFlowValueChangeEvent(
                changedAttribute,
                event.detail.newValue,
                event.detail.newValueDataType
            );
            this.dispatchFlowValueChangeEvent(
                'cb_' + changedAttribute,
                event.detail.newStringValue,
                'String'
            );
            if (changedAttribute == 'showFlowInModal') {
                this.isNotShowFlowInModal = !event.detail.newValue;
            }
        }
        
    }

    dispatchFlowValueChangeEvent(id, newValue, newValueDataType) {
        //console.log('in dispatchFlowValueChangeEvent: ' + id, newValue, newValueDataType);
        if (this.inputValues[id] && this.inputValues[id].serialized) {
            newValue = JSON.stringify(newValue);
        }
        const valueChangedEvent = new CustomEvent(FLOW_EVENT_TYPE.CHANGE, {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                name: id,
                newValue: newValue ? newValue : null,
                newValueDataType: newValueDataType
            }
        });
        this.dispatchEvent(valueChangedEvent);
    }

    handleFlowSelect(event) {
        this.selectedFlowApiName = event.currentTarget.selectedFlowApiName;
        this.dispatchFlowValueChangeEvent('flowToLaunch', this._selectedFlowApiName, 'String');
    }

    handleVariantChange(event) {
        this.dispatchFlowValueChangeEvent('buttonVariant', event.detail.value, 'String');
    }

    handleIconPositionChange(event) {
        this.dispatchFlowValueChangeEvent('iconPosition', event.detail.value, 'String');
    }

    handlePaddingChange(event) {
        this.dispatchFlowValueChangeEvent('buttonPadding', event.detail.value, 'String');
    }
    
    handleModalSizeChange(event) {
        this.dispatchFlowValueChangeEvent('modalSize', event.detail.value, 'String');
    }

    handleInputVariableChange(event) {
        this.dispatchFlowValueChangeEvent('flowInputVariableName', event.detail.value, 'String');
    }

    get showButtonOptions() {
        if (this.inputValues.cb_hideButton.value == null || this.inputValues.cb_hideButton.value === 'CB_FALSE') {
            return true;
        }
        return false;
    }
}
