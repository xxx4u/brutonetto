'use strict';

Application.Controllers.controller('bruto.netto.controller', ['$scope', '$constant', '$translate', '$dataService', function($scope, $constant, $translate, $dataService) {
    var self = this;
    
    $scope.brutoNettoModel = new Application.Model.BrutoNetto.BrutoNettoModel({
        ParameterGroups: [
            new Application.Model.BrutoNetto.ParameterGroup({
                ID: 'ALGEMENE_INFORMATIE',
                Caption: 'APPLICATION.PART.BRUTONETTO.ALGEMENE_INFORMATIE.CAPTION',
                Parameters: [
                    new Application.Model.BrutoNetto.ToggleParameter({
                        ID: 'BEREKENINGSWIJZE',
                        Caption: 'APPLICATION.PART.BRUTONETTO.BEREKENINGSWIJZE.CAPTION',
                        Value: 'BRUTONAARNETTO',
                        Options: [
                            { ID:'BRUTONAARNETTO', Caption: 'APPLICATION.PART.BRUTONETTO.BEREKENINGSWIJZE.BRUTO_NAAR_NETTO' },
                            { ID:'NETTONAARBRUTO', Caption: 'APPLICATION.PART.BRUTONETTO.BEREKENINGSWIJZE.NETTO_NAAR_BRUTO' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.ToggleParameter({
                        ID: 'GEWEST',
                        Caption: 'APPLICATION.PART.BRUTONETTO.GEWEST.CAPTION',
                        Value: 'VLAAMS',
                        Options: [
                            { ID:'VLAAMS', Caption: 'APPLICATION.PART.BRUTONETTO.GEWEST.VLAAMS' },
                            { ID:'WAALS', Caption: 'APPLICATION.PART.BRUTONETTO.GEWEST.WAALS' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.ToggleParameter({
                        ID: 'STATUUT',
                        Caption: 'APPLICATION.PART.BRUTONETTO.STATUUT.CAPTION',
                        Value: 'A',
                        Options: [
                            { ID:'A', Caption: 'APPLICATION.PART.BRUTONETTO.STATUUT.ARBEIDER' },
                            { ID:'B', Caption: 'APPLICATION.PART.BRUTONETTO.STATUUT.BEDIENDE' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.ToggleParameter({
                        ID: 'MAANDLOONOFUURLOONTYPE',
                        Caption: 'APPLICATION.PART.BRUTONETTO.MAAND_OF_UURLOON_TYPE.CAPTION',
                        Value: 'UURLOON',
                        Options: [
                            { ID:'UURLOON', Caption: 'APPLICATION.PART.BRUTONETTO.MAAND_OF_UURLOON_TYPE.UURLOON' },
                            { ID:'MAANDLOON', Caption: 'APPLICATION.PART.BRUTONETTO.MAAND_OF_UURLOON_TYPE.MAANDLOON' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.DecimalParameter({
                        ID: 'MAANDLOONOFUURLOON',
                        Caption: 'APPLICATION.PART.BRUTONETTO.MAAND_OF_UURLOON.CAPTION',
                        Value: '0.00'
                    }),
                    
                    new Application.Model.BrutoNetto.FixedParameter({
                        ID: 'WERKDAGENPERWEEK',
                        Caption: 'APPLICATION.PART.BRUTONETTO.WERKDAGEN_PER_WEEK.CAPTION',
                        Value: '5'
                    }),
                    
                    new Application.Model.BrutoNetto.FixedParameter({
                        ID: 'URENPERWEEK',
                        Caption: 'APPLICATION.PART.BRUTONETTO.UREN_PER_WEEK.CAPTION',
                        Value: { q: 40, s: 40 }
                    })
                ]
            }),
                    
            new Application.Model.BrutoNetto.ParameterGroup({
                ID: 'GEZINSINFORMATIE',
                Caption: 'APPLICATION.PART.BRUTONETTO.GEZINSINFORMATIE.CAPTION',
                Parameters: [
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'BURGERLIJKESTAAT',
                        Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.CAPTION',
                        Value: 'ONGEHUWD',
                        Options: [
                            { ID:'SAMENWONENDFEITELIJK', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.SAMENWONEND_FEITELIJK' },
                            { ID:'SAMENWONENDOVERLEDEN', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.SAMENWONEND_OVERLEDEN' },
                            { ID:'SAMENWONENDWETTELIJKEINDE', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.SAMENWONEND_WETTELIJK_EINDE' },
                            { ID:'SAMENWONENDFEITELIJKEINDE', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.SAMENWONEND_FEITELIJK_EINDE' },
                            { ID:'ONGEHUWD', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.ONGEHUWD' },
                            { ID:'GEHUWD', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.GEHUWD' },
                            { ID:'WEDUWNAAR', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.WEDUWNAAR' },
                            { ID:'GESCHEIDENWETTELIJK', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.GESCHEIDEN_WETTELIJK' },
                            { ID:'GESCHEIDENFEITELIJK', Caption: 'APPLICATION.PART.BRUTONETTO.BURGERLIJKE_STAAT.GESCHEIDEN_FEITELIJK' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.ToggleParameter({
                        ID: 'ISMINDERVALIDE',
                        Caption: 'APPLICATION.PART.BRUTONETTO.IS_MINDERVALIDE.CAPTION',
                        Value: 'FALSE',
                        Options: [
                            { ID:'TRUE', Caption: 'APPLICATION.PART.BRUTONETTO.IS_MINDERVALIDE.TRUE' },
                            { ID:'FALSE', Caption: 'APPLICATION.PART.BRUTONETTO.IS_MINDERVALIDE.FALSE' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'BEROEPSINKOMENPARTNER',
                        Caption: 'APPLICATION.PART.BRUTONETTO.BEROEPS_INKOMEN_PARTNER.CAPTION',
                        Value: 'GEENBEROEPSINKOMEN',
                        Options: [
                            { ID:'GEENBEROEPSINKOMEN', Caption: 'APPLICATION.PART.BRUTONETTO.BEROEPS_INKOMEN_PARTNER.GEEN_BEROEPSINKOMEN' },
                            { ID:'BEROEPSINKOMENBOVENLAGEGRENS', Caption: 'APPLICATION.PART.BRUTONETTO.BEROEPS_INKOMEN_PARTNER.BEROEPSINKOMEN_BOVEN_LAGE_GRENS' },
                            { ID:'NIETPENSIOENINKOMENBOVENLAGEGRENS', Caption: 'APPLICATION.PART.BRUTONETTO.BEROEPS_INKOMEN_PARTNER.NIET_PENSIOENINKOMEN_BOVEN_LAGE_GRENS' },
                            { ID:'ENKELPENSIOENONDERLAGEGRENS', Caption: 'APPLICATION.PART.BRUTONETTO.BEROEPS_INKOMEN_PARTNER.ENKEL_PENSIOEN_ONDER_LAGE_GRENS' },
                            { ID:'ENKELPENSIOENONDERZEERLAGEGRENS', Caption: 'APPLICATION.PART.BRUTONETTO.BEROEPS_INKOMEN_PARTNER.ENKEL_PENSIOEN_ONDER_ZEER_LAGE_GRENS' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.ToggleParameter({
                        ID: 'ISPARTNERMINDERVALIDE',
                        Caption: 'APPLICATION.PART.BRUTONETTO.IS_PARTNER_MINDERVALIDE.CAPTION',
                        Value: 'FALSE',
                        Options: [
                            { ID:'TRUE', Caption: 'APPLICATION.PART.BRUTONETTO.IS_PARTNER_MINDERVALIDE.TRUE' },
                            { ID:'FALSE', Caption: 'APPLICATION.PART.BRUTONETTO.IS_PARTNER_MINDERVALIDE.FALSE' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'VALIDEKINDEREN',
                        Caption: 'APPLICATION.PART.BRUTONETTO.VALIDE_KINDEREN.CAPTION',
                        Value: '0',
                        Options: [
                            { ID:'0', Caption: 'APPLICATION.0' },
                            { ID:'1', Caption: 'APPLICATION.1' },
                            { ID:'2', Caption: 'APPLICATION.2' },
                            { ID:'3', Caption: 'APPLICATION.3' },
                            { ID:'4', Caption: 'APPLICATION.4' },
                            { ID:'5', Caption: 'APPLICATION.5' },
                            { ID:'6', Caption: 'APPLICATION.6' },
                            { ID:'7', Caption: 'APPLICATION.7' },
                            { ID:'8', Caption: 'APPLICATION.8' },
                            { ID:'9', Caption: 'APPLICATION.9' },
                            { ID:'10', Caption: 'APPLICATION.10' },
                            { ID:'11', Caption: 'APPLICATION.11' },
                            { ID:'12', Caption: 'APPLICATION.12' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'MINDERVALIDEKINDEREN',
                        Caption: 'APPLICATION.PART.BRUTONETTO.MINDERVALIDE_KINDEREN.CAPTION',
                        Value: '0',
                        Options: [
                            { ID:'0', Caption: 'APPLICATION.0' },
                            { ID:'1', Caption: 'APPLICATION.1' },
                            { ID:'2', Caption: 'APPLICATION.2' },
                            { ID:'3', Caption: 'APPLICATION.3' },
                            { ID:'4', Caption: 'APPLICATION.4' },
                            { ID:'5', Caption: 'APPLICATION.5' },
                            { ID:'6', Caption: 'APPLICATION.6' },
                            { ID:'7', Caption: 'APPLICATION.7' },
                            { ID:'8', Caption: 'APPLICATION.8' },
                            { ID:'9', Caption: 'APPLICATION.9' },
                            { ID:'10', Caption: 'APPLICATION.10' },
                            { ID:'11', Caption: 'APPLICATION.11' },
                            { ID:'12', Caption: 'APPLICATION.12' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'VALIDEANDEREN65JAAROFJONGER',
                        Caption: 'APPLICATION.PART.BRUTONETTO.VALIDE_ANDEREN_65_JAAR_OF_JONGER.CAPTION',
                        Value: '0',
                        Options: [
                            { ID:'0', Caption: 'APPLICATION.0' },
                            { ID:'1', Caption: 'APPLICATION.1' },
                            { ID:'2', Caption: 'APPLICATION.2' },
                            { ID:'3', Caption: 'APPLICATION.3' },
                            { ID:'4', Caption: 'APPLICATION.4' },
                            { ID:'5', Caption: 'APPLICATION.5' },
                            { ID:'6', Caption: 'APPLICATION.6' },
                            { ID:'7', Caption: 'APPLICATION.7' },
                            { ID:'8', Caption: 'APPLICATION.8' },
                            { ID:'9', Caption: 'APPLICATION.9' },
                            { ID:'10', Caption: 'APPLICATION.10' },
                            { ID:'11', Caption: 'APPLICATION.11' },
                            { ID:'12', Caption: 'APPLICATION.12' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'MINDERVALIDEANDEREN65JAAROFJONGER',
                        Caption: 'APPLICATION.PART.BRUTONETTO.MINDERVALIDE_ANDEREN_65_JAAR_OF_JONGER.CAPTION',
                        Value: '0',
                        Options: [
                            { ID:'0', Caption: 'APPLICATION.0' },
                            { ID:'1', Caption: 'APPLICATION.1' },
                            { ID:'2', Caption: 'APPLICATION.2' },
                            { ID:'3', Caption: 'APPLICATION.3' },
                            { ID:'4', Caption: 'APPLICATION.4' },
                            { ID:'5', Caption: 'APPLICATION.5' },
                            { ID:'6', Caption: 'APPLICATION.6' },
                            { ID:'7', Caption: 'APPLICATION.7' },
                            { ID:'8', Caption: 'APPLICATION.8' },
                            { ID:'9', Caption: 'APPLICATION.9' },
                            { ID:'10', Caption: 'APPLICATION.10' },
                            { ID:'11', Caption: 'APPLICATION.11' },
                            { ID:'12', Caption: 'APPLICATION.12' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'VALIDEANDERENOUDERDAN65JAAR',
                        Caption: 'APPLICATION.PART.BRUTONETTO.VALIDE_ANDEREN_OUDER_DAN_65_JAAR.CAPTION',
                        Value: '0',
                        Options: [
                            { ID:'0', Caption: 'APPLICATION.0' },
                            { ID:'1', Caption: 'APPLICATION.1' },
                            { ID:'2', Caption: 'APPLICATION.2' },
                            { ID:'3', Caption: 'APPLICATION.3' },
                            { ID:'4', Caption: 'APPLICATION.4' },
                            { ID:'5', Caption: 'APPLICATION.5' },
                            { ID:'6', Caption: 'APPLICATION.6' },
                            { ID:'7', Caption: 'APPLICATION.7' },
                            { ID:'8', Caption: 'APPLICATION.8' },
                            { ID:'9', Caption: 'APPLICATION.9' },
                            { ID:'10', Caption: 'APPLICATION.10' },
                            { ID:'11', Caption: 'APPLICATION.11' },
                            { ID:'12', Caption: 'APPLICATION.12' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'MINDERVALIDEANDERENOUDERDAN65JAAR',
                        Caption: 'APPLICATION.PART.BRUTONETTO.MINDERVALIDE_ANDEREN_OUDER_DAN_65_JAAR.CAPTION',
                        Value: '0',
                        Options: [
                            { ID:'0', Caption: 'APPLICATION.0' },
                            { ID:'1', Caption: 'APPLICATION.1' },
                            { ID:'2', Caption: 'APPLICATION.2' },
                            { ID:'3', Caption: 'APPLICATION.3' },
                            { ID:'4', Caption: 'APPLICATION.4' },
                            { ID:'5', Caption: 'APPLICATION.5' },
                            { ID:'6', Caption: 'APPLICATION.6' },
                            { ID:'7', Caption: 'APPLICATION.7' },
                            { ID:'8', Caption: 'APPLICATION.8' },
                            { ID:'9', Caption: 'APPLICATION.9' },
                            { ID:'10', Caption: 'APPLICATION.10' },
                            { ID:'11', Caption: 'APPLICATION.11' },
                            { ID:'12', Caption: 'APPLICATION.12' }
                        ]
                    })
                ]
            }),
                    
            new Application.Model.BrutoNetto.ParameterGroup({
                ID: 'VERGOEDING_INHOUDING',
                Caption: 'APPLICATION.PART.BRUTONETTO.VERGOEDING_INHOUDING.CAPTION',
                IsOptional: false,
                IsSelected: true,
                Parameters: [
                    new Application.Model.BrutoNetto.DecimalParameter({
                        ID: 'KOSTENEIGENAANWERKGEVER',
                        Caption: 'APPLICATION.PART.BRUTONETTO.KOSTEN_EIGEN_AANWERKGEVER.CAPTION',
                        Value: '0.00'
                    }),
                    
                    new Application.Model.BrutoNetto.DecimalParameter({
                        ID: 'ANDERENETTOINHOUDINGEN',
                        Caption: 'APPLICATION.PART.BRUTONETTO.ANDERE_NETTO_INHOUDINGEN.CAPTION',
                        Value: '0.00'
                    })
                ]
            }),
                    
            new Application.Model.BrutoNetto.ParameterGroup({
                ID: 'TRANSPORTVERGOEDING',
                Caption: 'APPLICATION.PART.BRUTONETTO.TRANSPORTVERGOEDING.CAPTION',
                IsOptional: true,
                IsSelected: false,
                Parameters: [
                    new Application.Model.BrutoNetto.SelectionParameter({
                        ID: 'TRANSPORTWIJZE',
                        Caption: 'APPLICATION.PART.BRUTONETTO.TRANSPORTWIJZE.CAPTION',
                        Value: 'OPENBAARVERVOER',
                        Options: [
                            { ID:'OPENBAARVERVOER', Caption: 'APPLICATION.PART.BRUTONETTO.TRANSPORTWIJZE.OPENBAAR_VERVOER' },
                            { ID:'FIETS', Caption: 'APPLICATION.PART.BRUTONETTO.TRANSPORTWIJZE.FIETS' },
                            { ID:'EIGENWAGEN', Caption: 'APPLICATION.PART.BRUTONETTO.TRANSPORTWIJZE.EIGEN_WAGEN' }
                        ]
                    }),
                    
                    new Application.Model.BrutoNetto.DecimalParameter({
                        ID: 'BEDRAG',
                        Caption: 'APPLICATION.PART.BRUTONETTO.BEDRAG.CAPTION',
                        Value: '0.00'
                    })
                ]
            })
        ]
    });
    
    $scope.view = { mode: 'quick' };
    
    $scope.renderDone = function() {
        $scope.$emit('event:application:resize-requested');
    };
}]);