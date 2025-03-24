@IsTest
private class FlowLauncherVariableControllerTest {
    @IsTest
    static void testGetFlowVariables() {
        // Create test data
        // Note: Since FlowVersionView and FlowVariableView are special objects,
        // we'll need to handle this differently in a real implementation
        // This test demonstrates the structure but won't actually insert records
        
        Id flowVersionViewId = '301000000000000'; // Mock ID

        String filters = '{"ProcessType":["Flow","AutolaunchedFlow"]}';
        List<FlowDefinitionView> fdvs = FlowPickerController.getFlowNamesApex(filters);
        if (fdvs.size()>0) {
            flowVersionViewId = fdvs[0].LatestVersionId;
        }
        
        // Test the method
        Test.startTest();
        try {
            List<FlowLauncherVariableController.FlowVariableInfo> variables = 
                FlowLauncherVariableController.getFlowVariables(flowVersionViewId);
            
            // Verify the method runs without throwing exceptions
            System.assertNotEquals(null, variables, 'Should return a list, even if empty');
            System.debug('variables: '+variables);
            
        } catch(Exception e) {
            // Verify that any exception is an AuraHandledException
            System.assert(e instanceof AuraHandledException, 
                         'Should throw AuraHandledException for client-safe error messages');
        }
        Test.stopTest();
    }
}