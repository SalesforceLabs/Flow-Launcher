@IsTest
private class FlowLauncherVersionInfoControllerTest {
    @IsTest
    static void testGetFlowVersionInfo() {
        String testFlowApiName = 'TestFlow';
        
        Test.startTest();
        FlowLauncherVersionInfoController.FlowVersionInfo result = 
            FlowLauncherVersionInfoController.getFlowVersionInfo(testFlowApiName);
        Test.stopTest();
        
        // Since we can't create FlowDefinitionView records in tests,
        // we'll verify the structure is correct
        System.assertNotEquals(null, result, 'Should return a result object');
        System.assertEquals(true, result.hasError, 'Should have error in test context');
    }
}