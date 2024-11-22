import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class flowModal extends LightningModal {
    @api flowNameToInvoke;
    @api flowParams = [];
    @api flowFinishBehavior;



    handleOpenModal(event) {
        if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
            this.close('modal closed, flow status is ' + event.detail.status);
        }
    }



}