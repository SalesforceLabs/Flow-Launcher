/*
* LWC for Screen Flows to launch a flow from a screen.
*
*   Based on Josh Dayment's AppExchange Salesforce Labs Flow Launcher
*   Supports both inline and modal with console tab refresh on closure
*   Supports declaring multiple input attributes
*   Supports passing output attributes back to the calling flow
*   Supports firing reactively on changes to the flow input variables when hiding the button
*   Supports passing a single record to the flow
*   Supports passing a collection of records to the flow
*   Supports disabling the close icon and the ability to exit the modal with the ESC key
*
*   Component includes the following LWCs
*       flowLauncher - Flow Screen Component
*       flowLauncher_SObject - Flow Screen Component with support for additional record and record collection outputs 
*       flowModal - sub component for the Flow Launcher LWCs
*
*   Eric Smith - RafterOne - 12/18/24
*
*   01/06/25 - Eric Smith  
*   Added modalSize attribute (small, medium, large(default), full)
* 
*/

import { LightningElement, api, track } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import flowModal from 'c/flowModal';

export default class FlowLauncher extends LightningElement {

    @api buttonLabel;
    @api showFlowInModal;
    @api flowToLaunch;
    @api flowParams = [];
    @api flowFinishBehavior;
    @api flowInputValue = '';
    @api flowInputVariableName;
    @api flowInputVariablesJSON = '';
    @api iconName;
    @api buttonVariant;
    @api iconPosition;
    @api stretchButton;
    @api buttonPadding = 'slds-p-around_small';
    @api isDisableClose = false;
    @api hideButton = false;
    @api modalSize = 'large';
    @api INPUT_Record;
    @api INPUT_Collection;

    showFlow = false;
    _sessionId;

    get launchModalSize() {
        switch(this.modalSize.toLowerCase) {
            case small:
                return 'small';
            case medium:
                return 'medium';
            case full:
                return 'full';
            default:
                return 'large';
        }
    }

    get recordType() {
        return 'SObject';
    }

    get recordCollectionType() {
        return 'SObject[]';
    }

    // Track prior value(s) for reactive attributes
    @track oldReactiveValue; 

    // Get the Reactive Attribute Value
    get reactiveValue() { 
        // * Return reactive attributes as a string to be used in tracking
        const rv = 
            (this.flowInputValue) ? this.flowInputValue : '' + 
            (this.flowInputVariablesJSON) ? this.flowInputVariablesJSON : '' + 
            (this.INPUT_Record) ? JSON.stringify(this.INPUT_Record) : '' + 
            (this.INPUT_Collection) ? JSON.stringify(this.INPUT_Collection) : '';
        return rv;
    }

    // On rendering, check for a value or change in value of reactive attribute(s) and execute the handler
    renderedCallback() {
        // Set the session ID using a random value
        this._sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        if (this.reactiveValue && this.reactiveValue != this.oldReactiveValue && this.hideButton) {
            this.handleButtonClick();
        }
    }

    /* Flow Outputs */
    @api OUTPUT_String;
    @api OUTPUT_Integer;
    @api OUTPUT_Record = {};
    @api OUTPUT_Collection = [];

    handleButtonClick() {
        if (this.showFlowInModal) {
            this.handleOpenModal();
        } else {
            this.handleOpenFlow();
        }

        // Save the current value(s) of the reactive attribute(s)
        this.oldReactiveValue = this.reactiveValue;
    }

    handleOpenFlow() {
        this.showFlow = true;
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
            this.showFlow = false;
            this.handleFlowOutputs(event.detail.outputVariables);
        }
    }

    async handleOpenModal() {
        const result = await flowModal.open({

            description: 'This is a flow launched from a button click',
            flowNameToInvoke: this.flowToLaunch,
            flowParams: this.flowParams,
            sessionId: this._sessionId,
            label: 'New Label',
            size: this.launchModalSize,            
            isDisableClose: this.isDisableClose,

        });
        this.handleFlowOutputs(result);
        //console.log(result);
    }

    /* Handle Flow Outputs */
    handleFlowOutputs(outputVariables) {      
            for (let i = 0; i < outputVariables?.length; i++) {
                const outputVar = outputVariables[i];
                switch (outputVar.name) {
                    case "OUTPUT_String":
                        this.OUTPUT_String = outputVar.value;
                        this.dispatchEvent(new FlowAttributeChangeEvent('OUTPUT_String', this.OUTPUT_String));
                        break;
                    case "OUTPUT_Integer":
                        this.OUTPUT_Integer = outputVar.value;
                        this.dispatchEvent(new FlowAttributeChangeEvent('OUTPUT_Integer', this.OUTPUT_Integer));
                        break;
                    case "OUTPUT_Record":
                        this.OUTPUT_Record = {...outputVar.value};
                        this.dispatchEvent(new FlowAttributeChangeEvent('OUTPUT_Record', this.OUTPUT_Record));
                        break;   
                    case "OUTPUT_Collection":
                        this.OUTPUT_Collection = [...outputVar.value];
                        this.dispatchEvent(new FlowAttributeChangeEvent('OUTPUT_Collection', this.OUTPUT_Collection));
                }
            }
    }

    // @api
    get flowParams() {
        let params = [];
        if(this.flowInputVariablesJSON) {
            params = JSON.parse(this.flowInputVariablesJSON);
        } else if(this.flowInputValue) {
            params = [
                {
                    name: this.flowInputVariableName,
                    type: 'String',
                    value: this.flowInputValue || ''
                },
            ];
        } else if (this.INPUT_Record) {
            params = [
                {
                    name: this.flowInputVariableName,
                    type: this.recordType,
                    value: this.INPUT_Record || {}
                },
            ];
        } else if (this.INPUT_Collection) {
            params = [
                {
                    name: this.flowInputVariableName,
                    type: this.recordCollectionType,
                    value: this.INPUT_Collection || [{}]
                },
            ];
        }
        // params.push({
        //     name: 'sessionId',
        //     type: 'String',
        //     value: this._sessionId
        // });
        return params;
    }

}
