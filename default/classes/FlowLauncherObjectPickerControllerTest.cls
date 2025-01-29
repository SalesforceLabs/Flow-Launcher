@isTest
private class FlowLauncherObjectPickerControllerTest {

    private final static String TEST_OBJECT_TYPE_LEAD = 'Lead';
    private final static String TEST_OBJECT_PICKLIST_FIELD = 'LeadSource';

    @isTest
    public static void testGetPicklistValues() {
        List<FlowLauncherObjectPickerController.Member> memberList = FlowLauncherObjectPickerController.getPicklistValues(TEST_OBJECT_TYPE_LEAD, TEST_OBJECT_PICKLIST_FIELD);
        System.assertNotEquals(memberList, null);
    }

    @isTest
    public static void testGetObjects() {
        List<FlowLauncherObjectPickerController.Member> memberList = FlowLauncherObjectPickerController.getObjects(new List<String>{
                TEST_OBJECT_TYPE_LEAD
        });
        System.assertEquals(1, memberList.size());
        System.assertEquals(TEST_OBJECT_TYPE_LEAD, memberList[0].value);
        memberList = FlowLauncherObjectPickerController.getObjects(null);
        System.assertEquals(true, memberList.size() > 1);
    }
}