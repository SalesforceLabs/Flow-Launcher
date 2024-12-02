import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import flowModal from 'c/flowModal';

export default class FlowLauncher extends LightningElement {

    @api buttonLabel;
    @api showFlowInModal;
    @api flowToLaunch;
    @api flowParams = [];
    @api flowFinishBehavior;
    @api flowInputValue;
    @api flowInputVariableName;
    @api flowInputVariablesJSON;
    @api iconName;
    @api buttonVariant;
    @api iconPosition;
    @api stretchButton;
    @api buttonPadding = 'slds-p-around_small';

    showFlow = false;

    /* Flow Outputs */
    @api OUTPUT_String;
    @api OUTPUT_Integer;

    handleButtonClick() {
        if (this.showFlowInModal) {
            this.handleOpenModal();
        } else {
            this.handleOpenFlow();
        }
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
            label: 'New Label',
            size: 'large',            

        });
        this.handleFlowOutputs(result);
        //console.log(result);
    }

    /* Handle Flow Outputs */
    handleFlowOutputs(outputVariables) {      
            for (let i = 0; i < outputVariables.length; i++) {
                const outputVar = outputVariables[i];
                switch (outputVar.name) {
                    case "OUTPUT_String":
                        this.OUTPUT_String = outputVar.value;
                        this.dispatchEvent(new FlowAttributeChangeEvent('OUTPUT_String', this.OUTPUT_String));
                        break;
                    case "OUTPUT_Integer":
                        this.OUTPUT_Integer = outputVar.value;
                        this.dispatchEvent(new FlowAttributeChangeEvent('OUTPUT_Integer', this.OUTPUT_Integer));
                }
            }
    }

    get flowParams() {
        if(this.flowInputVariablesJSON) {
            return JSON.parse(this.flowInputVariablesJSON);
        } else {
            if(this.flowInputValue) {return [
                {
                    name: this.flowInputVariableName,
                    type: 'String',
                    value: this.flowInputValue || ''
                },
            ]};
        }
    }

}