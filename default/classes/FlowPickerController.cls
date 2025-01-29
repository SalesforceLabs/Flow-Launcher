public with sharing class FlowPickerController {
    @AuraEnabled(cacheable=true)
    public static List<FlowDefinitionView> getFlowNamesApex(String filtersString) {
        //System.debug('filtersString is: ' + filtersString);
        String queryString = 'SELECT Id, ApiName, Label FROM FlowDefinitionView ';

        if (filtersString != null) {
            Map<String, List<String>> filters = (Map<String, List<String>>) JSON.deserialize(filtersString, Map<String, List<String>>.class);
            //System.debug('filters is: ' + filters);
            if (!filters.isEmpty()) {
                queryString += ' WHERE ';
                Boolean isFirst = true;
                for (String fieldName : filters.keySet()) {
                    List<String> values = filters.get(fieldName);
                    String negativeClause = fieldName.contains('!') ? (values.size() > 1 ? 'NOT ' : '!') : '';
                    String operator = fieldName.contains('Label') ? 'LIKE ' : (values.size() == 1 ? '= ' : 'IN ');  // Updated to Handle Search String
                    String value = values.size() == 1 ?  '\'' + values[0] + '\'' : '(\'' + String.join(values, '\',\'') + '\')';
                    queryString += (!isFirst ? ' AND ' : ' ') + fieldName.replace('!', '') + ' ' + negativeClause + operator + value;
                    isFirst = false;
                }
            }
        }
        // Sort the results by the FLow Label
        queryString += ' ORDER BY Label ASC';
        //System.debug('query string is: ' + queryString);
        return (List<FlowDefinitionView>) Database.query(queryString);
    }
}