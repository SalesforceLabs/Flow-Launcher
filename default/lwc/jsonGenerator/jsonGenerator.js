import { LightningElement, track, api } from 'lwc';

export default class jsonGenerator extends LightningElement {
    @track name;
    @track dataType;
    @track value;
    @track rows = [];
    @api jsonOutput = '';
    _automaticOutputVariables;
    _builderContext;

    @api get builderContext() {
        return this._builderContext;
    }

    set builderContext(value) {
        this._builderContext = value;
    }

    @api get automaticOutputVariables () {
        return this._automaticOutputVariables;
    }

    set automaticOutputVariables(value) {
         console.log('setting automaticOutputVariables to ' + JSON.stringify(value));
        this._automaticOutputVariables = value;
    }

    dataTypeOptions = [
        { label: 'String', value: 'String' },
        { label: 'Number', value: 'Number' },
        { label: 'Boolean', value: 'Boolean' }
    ];

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleDataTypeChange(event) {
        this.dataType = event.target.value;
    }

    handleValueChange(event) {
        this.value = event.target.value;
    }

    addRow() {
        this.rows = [...this.rows, { 
            name: this.name, 
            type: this.dataType, 
            value: this.value 
        }];
        this.generateJsonOutput();
        this.clearInputFields();
    }

    generateJsonOutput() {
        this.jsonOutput = JSON.stringify(this.rows, null, 2); // Use 2 spaces for indentation
    }

    clearInputFields() {
        this.name = '';
        this.dataType = '';
        this.value = '';
    }

}