@isTest
private class FlowPickerControllerTest {

    @isTest
    public static void testFlowPickerController() {

        Test.startTest();
            String filters = '{"ProcessType":["Flow","AutolaunchedFlow"]}';
            FlowPickerController.getFlowNamesApex(filters);
        Test.stopTest();
        
    }
}