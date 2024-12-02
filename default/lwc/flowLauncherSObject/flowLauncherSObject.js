import { api, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    refreshTab
} from 'lightning/platformWorkspaceApi';
import LightningModal from 'lightning/modal';

export default class flowModal extends LightningModal {
    @api flowNameToInvoke;
    @api flowParams = [];
    @api flowFinishBehavior;

    /* SYSTEM INPUTS */
    @api availableActions = [];

    // isConsoleNavigateion doesn't work when LWC is run inside of a Screen Flow
    // @wire(IsConsoleNavigation) isConsoleNavigation;

    handleOpenModal(event) {
        if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
            // this.close('modal closed, flow status is ' + event.detail.status);
            this.close(event.detail.outputVariables);
            this.refreshTab();
        }
    }

    async refreshTab() {
        // Use try/catch instead of checking for isCOnsoleNavigation
        try{
            const { tabId } = await getFocusedTabInfo();
            await refreshTab(tabId, {
                includeAllSubtabs: true
            });
        } catch (e) {
            // Not running in Console App
        }

    }

}