'use strict';

Application.Controllers.controller('bruto.netto.controller', ['$scope', '$constant', '$translate', '$dataService', function($scope, $constant, $translate, $dataService){
    var self = this;
    
    $scope.brutoNettoModel = new Application.Model.BrutoNetto.BrutoNettoModel();
    
    $scope.calculate = function() {
        var dto = $scope.brutoNettoModel.toDataTransferObject();
        
        var parameters = angular.toJson(dto); 
        
        $dataService.calculateBrutoNetto({ onBehalfOf: $constant.ON_BEHALF_OF_USER }, { parameters: parameters })
            .then(function(data) {
                var result = angular.fromJson(data.Result);
                $scope.brutoNettoModel.Calculation = angular.extend({}, { Bruto: Number(result.Bruto).toFixed(2), Netto: Number(result.Netto).toFixed(2) });
                $scope.$state.transitionTo('brutonetto.calculation', $scope.$stateParams);
            }, function(error) {
                console.log(error);
            });
    };
    
    $scope.renderDone = function() {
        $scope.$emit('event:application:resize-requested');
    };
    
    $scope.keypressed = function(event, parameter) {
    }
    
    
    
    self.parameters = {
      // "brutoNaarNetto" of "nettoNaarBruto"
      berekeningswijze: "brutoNaarNetto", //"<string>",

      // "A" of "B"
      statuut: "B", //"<string>",

      // "samenwonendFeitelijk", "ongehuwd", "gehuwd", "weduw", "gescheidenWettelijk", "gescheidenFeitelijk", 
      // "samenwonendWettelijk", "samenwonendOverleden", "samenwonendWettelijkEinde", "samenwonendFeitelijkEinde"
      burgerlijkeStaat: "gehuwd", //"<string>",
                                          
      urenPerWeek: {
            q: 40,//<int>,
            s: 40//<int>
      },

      maandloonOfUurloon: 2500.00, //<decimal>,
      beroepsinkomenPartner: 2500.00, //<decimal>,
      valideKinderen: 1, //<int>,

      // "vlaams" of "waals"
      gewest: "vlaams", //"<string>",           

      isMindervalide: false,//<boolean>,
      isPartnerMindervalide: false,//<boolean>,
      mindervalideKinderen: 0, //<int>,
      valideAnderen65JaarOfJonger: 0, //<int>,
      mindervalideAnderen65JaarOfJonger: 0, //<int>,
      valideAnderenOuderDan65Jaar: 0, //<int>,
      mindervalideAnderenOuderDan65Jaar: 0, //<int>,
      werkdagenPerWeek: 5.0, //<decimal>,

      // optioneel
      transportVergoeding: {
            // "openbaarVervoer", "fiets" of "eigenWagen"
            transportWijze: "eigenWagen", //"<string>",
            aantalKilometer: 0.0, //<decimal>
      },

      // optioneel
      groepsverzekering: {
            werknemersBijdrage: 0.0, //<decimal>
      },

      // optioneel
      firmawagen: {
            werknemersBijdrage: 0.0, //<decimal>,
            aantalKilometerWoonWerkEnkel: 0, //<int>,
            uitstootCo2: 0.0, //<decimal>,
            catalogusWaarde: 0.0, //<decimal>,

            // formaat: YYYY-MM-DD
            datumEersteInschrijving: "2013-01-01", //"<date>",

            // "benzine" of "diesel"
            brandstofType: "diesel", //"<string>"
      },

      // optioneel
      maaltijdcheques: {
            bedrag: 7.0, // <decimal>
      },

      andereNettoInhoudingen: 0.0,//<decimal>,
      kostenEigenAanWerkgever: 200.0, //<decimal>,
}

}]);