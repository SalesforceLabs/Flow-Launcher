global with sharing class FlowLauncherVariableController {
    @AuraEnabled(cacheable=true)
    public static List<FlowVariableInfo> getFlowVariables(Id flowVersionViewId) {
        List<FlowVariableInfo> variables = new List<FlowVariableInfo>();
        
        try {
            // Query FlowVariableView records related to the given FlowVersionView
            List<FlowVariableView> flowVars = [
                SELECT ApiName, DataType, Description, IsCollection, ObjectType
                FROM FlowVariableView
                WHERE FlowVersionViewId = :flowVersionViewId
                AND IsInput = true
                ORDER BY ApiName ASC
            ];
            
            // Convert to wrapper objects
            for(FlowVariableView var : flowVars) {
                variables.add(new FlowVariableInfo(var.ApiName, var.DataType, var.Description, var.IsCollection, var.ObjectType));
            }
        } catch(Exception e) {
            System.debug('Error fetching flow variables: ' + e.getMessage());
            throw new AuraHandledException('Error fetching flow variables: ' + e.getMessage());
        }
        
        return variables;
    }
    
    // Wrapper class to hold variable information
    global class FlowVariableInfo {
        @AuraEnabled public String apiName { get; set; }
        @AuraEnabled public String dataType { get; set; }
        @AuraEnabled public String description { get; set; }
        @AuraEnabled public Boolean isCollection { get; set; }
        @AuraEnabled public String objectType { get; set; }
        
        public FlowVariableInfo(String apiName, String dataType, String description, Boolean isCollection, String objectType) {
            this.apiName = apiName;
            this.dataType = dataType;
            this.description = description;
            this.isCollection = isCollection;
            this.objectType = objectType;
        }
    }
}