public with sharing class FlowLauncherObjectPickerController {
    @AuraEnabled(cacheable=true)
    public static List<Member> getObjects(List<String> availableObjectTypes) {
        List<Member> result = new List<Member>();
        Map<String, SObjectType> allTypes = Schema.getGlobalDescribe();

        Boolean isDisplayAll = false;
        try {
            if (availableObjectTypes[0]?.toLowerCase() == 'all') {
                availableObjectTypes.clear();
                isDisplayAll = true;

            }
        } catch (Exception e) {   

        }

        if (availableObjectTypes == null || availableObjectTypes.size() == 0) {
            availableObjectTypes = new List<String>(allTypes.keySet());
        }

        for (String objType : availableObjectTypes) {
            Schema.DescribeSObjectResult describeObject = allTypes.get(objType).getDescribe();
            String objectType = describeObject.getName();
            String objectLabel = describeObject.getLabel();
            Boolean isCustom = describeObject.isCustom();
            if (isCustom || allowedStandardObjects.containsKey(objectType) || isDisplayAll) {
                if (objectLabel.substring(0,2) != '__') {
                    result.add(new Member(objectType, objectLabel));
                }
            }

        }
        result.sort(); 
        
        return result;

    }
    @AuraEnabled(cacheable=true)
    public static List<Member> getPicklistValues(String objectApiName, String fieldName) {

        List<Member> options = new List<Member>();
        Schema.DescribeSObjectResult describeObject = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
        Map<String, Schema.SObjectField> fieldMap = describeObject.fields.getMap();
        List<Schema.PicklistEntry> values = fieldMap.get(fieldName).getDescribe().getPickListValues();

        for (Schema.PicklistEntry a : values) {
            options.add(new Member(a.getValue(), a.getLabel(), a.isActive(), a.isDefaultValue()));
        }
        
        options.sort();

        return options;
    }

    @JsonAccess(serializable='always' deserializable='always')
    public class Member implements Comparable {

        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;
        @AuraEnabled
        public Boolean isActive;
        @AuraEnabled
        public Boolean isDefaultValue;

    
        public Member(String value, String label) {
            this.label = label;
            this.value = value;
        }

        public Member(String value, String label, Boolean isActive, Boolean isDefaultValue) {
            this.value = value;
            this.label = label;         
            this.isActive = isActive;
            this.isDefaultValue = isDefaultValue;
        }

        public Integer compareTo(Object compareTo) {

            Member curMember = (Member) compareTo;

            if (label == curMember.label) {
                return 0;
            }
            if (label > curMember.label) {
                return 1;
            }
            return -1;

        }

    }

    private static Map<String, String> allowedStandardObjects = new Map<String, String>{
            'Account' => 'Account',
            'AccountPartner' => 'Account Partner',
            'Asset' => 'Asset',
            'AssetRelationship' => 'Asset Relationship',
            'AssignedResource' => 'Assigned Resource',
            'Campaign' => 'Campaign',
            'CampaignMember' => 'Campaign Member',
            'Case' => 'Case',
            'Contact' => 'Contact',
            'ContactRequest' => 'Contact Request',
            'ContentDocument' => 'File',
            'ContentVersion' => 'File',
            'ContentWorkspace' => 'Library',
            'Contract' => 'Contract',
            'ContractContactRole' => 'Contract Contact Role',
            'Image' => 'Image',
            'Individual' => 'Individual',
            'Lead' => 'Lead',
            'MaintenanceAsset' => 'Maintenance Asset',
            'MaintenancePlan' => 'Maintenance Plan',
            'Note' => 'Note',
            'OperatingHours' => 'Operating Hours',
            'Opportunity' => 'Opportunity',
            'OpportunityLineItem' => 'Opportunity Product',
            'OpportunityPartner' => 'Opportunity Partner',
            'Order' => 'Order',
            'OrderItem' => 'Order Product',
            'Partner' => 'Partner',
            'Pricebook2' => 'Price Book',
            'PricebookEntry' => 'Price Book Entry',
            'Product2' => 'Product',
            'RecordType' => 'Record Type',
            'ResourceAbsence' => 'Resource Absence',
            'ResourcePreference' => 'Resource Preference',
            'ReturnOrder' => 'Return Order',
            'ReturnOrderLineItem' => 'Return Order Line Item',
            'ServiceAppointment' => 'Service Appointment',
            'ServiceCrew' => 'Service Crew',
            'ServiceCrewMember' => 'Service Crew Member',
            'ServiceResource' => 'Service Resource',
            'ServiceResourceCapacity' => 'Resource Capacity',
            'ServiceResourceSkill' => 'Service Resource Skill',
            'ServiceTerritory' => 'Service Territory',
            'ServiceTerritoryLocation' => 'Service Territory Location',
            'ServiceTerritoryMember' => 'Service Territory Member',
            'Shift' => 'Shift',
            'Shipment' => 'Shipment',
            'SkillRequirement' => 'Skill Requirement',
            'TimeSheet' => 'Time Sheet',
            'TimeSheetEntry' => 'Time Sheet Entry',
            'TimeSlot' => 'Time Slot',
            'User' => 'User',
            'WorkOrder' => 'Work Order',
            'WorkOrderLineItem' => 'Work Order Line Item',
            'WorkType' => 'Work Type',
            'Quote' => 'Quote',
            'QuoteLineItem' => 'Quote Line Item',
            'FlowOrchestrationInstance' => 'Flow Orchestration Instance',
            'FlowOrchestrationStageInstance' => 'Flow Orchestration Stage Instance',
            'FlowOrchestrationStepInstance' => 'Flow Orchestration Step Instance'
    };

}