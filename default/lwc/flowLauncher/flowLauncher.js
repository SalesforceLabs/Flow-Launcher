import { LightningElement, api } from 'lwc';
import flowModal from 'c/flowModal';



export default class FlowLauncher extends LightningElement {

    @api buttonLabel;
    @api showFlowInModal;
    @api flowToLaunch;
    @api flowParams = [];
    @api flowFinishBehavior;
    @api flowInputValue;
    @api flowInputVariableName;
    @api iconName;
    @api buttonVariant;
    @api iconPosition;
    @api stretchButton;
    @api buttonPadding = 'slds-p-around_small';

    showFlow = false;


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
        //console.log(result);
        


    }

    get flowParams() {
       if(this.flowInputValue) {return [
            {
                name: this.flowInputVariableName,
                type: 'String',
                value: this.flowInputValue || ''
            },
        ]};
    }

}