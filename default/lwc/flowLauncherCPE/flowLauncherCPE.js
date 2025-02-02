import { LightningElement, api, track } from 'lwc';

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
        
            this.dispatchFlowValueChangeEvent('flowToLaunch', event.currentTarget.selectedFlowApiName, 'String');
        
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

    get showButtonOptions() {
        if (this.inputValues.cb_hideButton.value === 'CB_FALSE') {
            return true;
        }
        return false;
    }
    }
