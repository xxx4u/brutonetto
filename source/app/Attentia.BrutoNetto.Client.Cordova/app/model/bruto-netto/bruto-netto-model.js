Application.Model.BrutoNetto = Application.Model.BrutoNetto || {};

Application.Model.BrutoNetto.PresentationRules = Application.ObjectBase.extend({
    brutoNettoModel: null,
    applyPresentationRules: function() {
        if (!this.brutoNettoModel) { return; }
    }
});

Application.Model.BrutoNetto.ParameterGroup = Application.ObjectBase.extend({
    Caption: null,
    IsOptional: false,
    IsSelected: true,
    Parameters: [],
    
    toDataTransferObject: function() {
        var result = {};
        Enumerable.From(this.Parameters)
            .ForEach (function(x) {
                result[x.ID] = x.toDataTransferObject();
            });

        return result;
    },
});

Application.Model.BrutoNetto.Parameter = Application.ObjectBase.extend({
    ID: null,
    Caption: null,
    Value: null,
    IsVisible: true,
    
    toDataTransferObject: function() {
        return this.Value;
    },
});

Application.Model.BrutoNetto.FixedParameter = Application.Model.BrutoNetto.Parameter.extend({
    TYPE: 'FIXED_PARAMETER',
    
    IsVisible: false
});

Application.Model.BrutoNetto.StringParameter = Application.Model.BrutoNetto.Parameter.extend({
    TYPE: 'STRING_PARAMETER'
});

Application.Model.BrutoNetto.IntegerParameter = Application.Model.BrutoNetto.Parameter.extend({
    TYPE: 'INTEGER_PARAMETER'
});

Application.Model.BrutoNetto.DecimalParameter = Application.Model.BrutoNetto.Parameter.extend({
    TYPE: 'DECIMAL_PARAMETER'
});

Application.Model.BrutoNetto.ToggleParameter = Application.Model.BrutoNetto.Parameter.extend({
    TYPE: 'TOGGLE_PARAMETER',
    
    Options: [],
    
    setValue: function(value) {
        this.Value = value.ID;
    }
});

Application.Model.BrutoNetto.SelectionParameter = Application.Model.BrutoNetto.Parameter.extend({
    TYPE: 'SELECTION_PARAMETER',
    
    Options: []
});

Application.Model.BrutoNetto.BrutoNettoModel = Application.ObjectBase.extend({    
    ParameterGroups: [],
    Calculation: {
        Bruto: null,
        Netto: null
    },
    
    toDataTransferObject: function() {
        var result = {};
        Enumerable.From(this.ParameterGroups)
            .ForEach (function(x) {
                
                if ((x.IsOptional && x.IsSelected) || !x.IsOptional) {
                    switch (x.ID) {
                        case 'ALGEMENE_INFORMATIE':
                        case 'GEZINSINFORMATIE':
                        case 'VERGOEDING_INHOUDING':
                            var group = x.toDataTransferObject();
                            result = angular.extend(result, group);
                            break;
                        
                        default:
                            result[x.ID] = x.toDataTransferObject();
                            break;
                    }
                }
            });
        
        return result;
    }
});