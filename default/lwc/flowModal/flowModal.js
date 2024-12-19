/*
* LWC Used by flowLauncher & flowLauncherSObject
*
*   Based on Josh Dayment's AppExchange Salesforce Labs Flow Launcher
*
*   Component includes the following LWCs
*       flowLauncher - Flow Screen Component
*       flowLauncher_SObject - Flow Screen Component with support for additional record and record collection outputs 
*       flowModal - sub component for the Flow Launcher LWCs
*
*   Eric Smith - RafterOne - 12/2/24
* 
*/

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
    @api isDisableClose = false;

    /* SYSTEM INPUTS */
    @api availableActions = [];

    // isConsoleNavigateion doesn't work when LWC is run inside of a Screen Flow
    // @wire(IsConsoleNavigation) isConsoleNavigation;

    handleOpenModal(event) {
        this.disableClose = this.isDisableClose;    // Don't allow the user to close out of the flow modal with ESC or the X button
        if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
            // this.close('modal closed, flow status is ' + event.detail.status);
            this.disableClose = false;
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