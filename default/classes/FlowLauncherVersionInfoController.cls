public with sharing class FlowLauncherVersionInfoController {
    @AuraEnabled(cacheable=true)
    public static FlowVersionInfo getFlowVersionInfo(String flowApiName) {
        FlowVersionInfo versionInfo = new FlowVersionInfo();
        
        try {
            FlowDefinitionView flowDef = [
                SELECT ActiveVersionId, LatestVersionId 
                FROM FlowDefinitionView 
                WHERE ApiName = :flowApiName 
                LIMIT 1
            ];
            
            versionInfo.activeVersionId = flowDef.ActiveVersionId;
            versionInfo.latestVersionId = flowDef.LatestVersionId;
            versionInfo.hasError = false;
            versionInfo.errorMessage = '';
            
        } catch (Exception e) {
            versionInfo.hasError = true;
            versionInfo.errorMessage = e.getMessage();
            versionInfo.activeVersionId = null;
            versionInfo.latestVersionId = null;
        }
        
        return versionInfo;
    }
    
    public class FlowVersionInfo {
        @AuraEnabled public String activeVersionId;
        @AuraEnabled public String latestVersionId;
        @AuraEnabled public Boolean hasError;
        @AuraEnabled public String errorMessage;
    }
}