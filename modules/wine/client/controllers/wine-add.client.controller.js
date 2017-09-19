'use strict';

// Wines controller
angular.module('wines').controller('WineAddController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Wine', '$timeout', 'countries', '$uibModal', '$uibModalInstance', 'Cellars', 'toaster', 'CustomWine','CustomCellars',
  function ($scope, $state, $stateParams, $location, Authentication, Wine, $timeout, countries, $uibModal, $uibModalInstance, Cellars, toaster, CustomWine,CustomCellars) {
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

//alert('test'+$scope.user.currency_code);
    $scope.countries = countries;
    $scope.country_codes= ["AUD","BRL","CAD","CHF","CNY","DKK","EUR","GBP","HKD","HUF","IDR","ILS","INR","ISK","JPY","MXN","MYR","NOK","NZD","PLN","RUB","SEK","SGD","TWD","USD","ZAR"];
    
    $scope.countryState = [];

    // Expose view variables
    $scope.wineId;
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.isDisabled = false;
    $scope.currentYear = new Date().getFullYear();
    $scope.grapeVariety=[];
    $scope.sourceSupplier=[];
    $scope.producerList=[];
   // $scope.producerSelected = {};
    $scope.ProducerSelectedName;
    $scope.wineNameList=[];
    $scope.wineNameSelected = {};
    $scope.producer;
    $scope.wine_name;
    $scope.uniqueWine={};

    $scope.bottleDetails = true;
    $scope.active = 0;

/*
    function GetFormattedDate() {
    var todayTime = new Date();
    var month = format(todayTime .getMonth() + 1);
    var day = format(todayTime .getDate());
    var year = format(todayTime .getFullYear());
    return month + "/" + day + "/" + year;
}
*/
 
    $scope.purchase_date= new Date();


    //$scope.purchase_date = new Date();
    //$scope.purchase_date= $filter('date')(new Date(), "dd-MM-yyyy");
    $scope.dateOptions = {
      // dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(1800, 1, 1),
      startingDay: 1
    };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
    mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }



  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.vintageYears = function(){
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = 1800; i <= currentYear; i++){
      years.unshift(i);
    }
    return years;
  }

    // Find a list of Cellers
    $scope.findCellars = function () {
       var data={user_id:$scope.user._id};
        CustomCellars.getMyCellars(data).then(function(result){
        $scope.cellars= result;
        
      })
     // $scope.cellars = Cellars.query();
      // console.log($scope.cellars[0]);
      // $scope.cellar_id = $scope.cellars[0].cellar_name;
    };

    $scope.findCellars();

    $scope.addCellar = function(){
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'addCellar.html',
        controller: 'AddCellarController'
      });

      dialog.result.then(function (doc) {
        $scope.findCellars();
        if(doc)
          $scope.cellar_id = doc._id
      // console.log(doc);

    }, function () {
        // $scope.findCellars();
      // console.log('closing');

    });
    };


    $scope.sourceSupplierChanged = function(str) {
      // console.log(str);
      $scope.source_supplier = str;
    }

    $scope.producerChanged = function(str) {
      //console.log(str);
      $scope.producer = str;
      $scope.checkUniqueWine();
      //$scope.getProducerLocation($scope.producerSelected);
    }

  $scope.producerSelected = function(selected) {
    console.log("producer selected"+selected.title);
   
      $scope.getProducerLocation(selected.title);
      $scope.ProducerSelectedName=selected.title;
     

   
    }

    $scope.wineChanged = function(str) {
      // console.log(str);
      $scope.wine_name = str;
      $scope.checkUniqueWine();
    }

    $scope.countryChange = function(){
      //alert('test'+this.country);

      for(var i = 0; i < $scope.countries.length; i++){
        if($scope.countries[i].title == this.country){
          $scope.countryState = $scope.countries[i].state;
          // $scope.checkUniqueWine();
        }
      }
       

      var data = {
        bottleSize : this.bottle_size,
        vintageYears : this.vintage_year,
        country : this.country,
         producer: ($scope.ProducerSelectedName) ? $scope.ProducerSelectedName : $scope.producer,
       // producer : (this.producerSelected && this.producerSelected.title) ? this.producerSelected.title : $scope.producer,
        wineName : (this.wineNameSelected && this.wineNameSelected.title) ? this.wineNameSelected.title : $scope.wine_name
      }
      // console.log(data);




      if(!data.producer){
        return;
      }else if(!data.wineName){
        return;
      }else if(!data.vintageYears){
        return;
      }else if(!data.bottleSize){
        return;
      }else if(!data.country){
       return;
     }

     $scope.searchWine(JSON.stringify(data));
   }


     // Find a list of Sub Category
     $scope.searchWine = function(data){
      // console.log(data);
      CustomWine.searchWine(data).then(function(result) {
        $scope.uniqueWine = result;
        // console.log(result);
        

        if($scope.uniqueWine){
          $scope.newObject.splice(0,1);
          for(var i = 0; i < $scope.uniqueWine.grape_varietal.length; i++){
            $scope.newObject.push({
              name: $scope.uniqueWine.grape_varietal[i].name, 
              value: $scope.uniqueWine.grape_varietal[i].value
            });
          }
        }
      });
    }


    $scope.getGrapeVariety = function(){
      CustomWine.getGrapeVariety().then(function(result) {
        for(var i = 0; i < result.length; i++){
          $scope.grapeVariety.push({title: result[i]})
        }
      });
    }
    $scope.getGrapeVariety();

    $scope.getSourceSupplier = function(){
      CustomWine.getSourceSupplier().then(function(result) {

        for(var i = 0; i < result.length; i++){
          $scope.sourceSupplier.push({title: result[i]})
        }

        $scope.sourceSupplierSelected = {title:result[0]};
      });

    }
    $scope.getSourceSupplier();


    $scope.getProducerlist = function(){
      CustomWine.getProducerlist().then(function(result) {
        // console.log('rdpspfds-->'+result);
        for(var i = 0; i < result.length; i++){
          $scope.producerList.push({producer: result[i]})
        }
      });

    }
    $scope.getProducerlist();
   // console.log($scope.producerList);




    $scope.getWinelist = function(){
      CustomWine.getWinelist().then(function(result) {
        for(var i = 0; i < result.length; i++){
          $scope.wineNameList.push({wine_name: result[i]})
        }
      });

    }
    $scope.getWinelist();


    // $scope.getFxRates = function(){
    //   CustomWine.getFxRates().then(function(result) {
    //     $scope.fxRate = result.rates;
    //     // console.log(result.rates);

    //   });
    // }

    // $scope.getFxRates();



    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.newObject = [{name:'', value: ''}];
    $scope.addNewRow = function(){
      $scope.newObject.push({name:'', value: ''});
    }



    $scope.removeRow = function(index) {
      // console.log(index);

      for (var i in $scope.newObject) {
        if (i == index) {
          $scope.newObject.splice(i, 1);
        }
      }
    }



    if($scope.wineData)
      $scope.wineData.fill_level = $scope.fillLevelData[0];



    $scope.checkUniqueWine = function(){
      var data = {
        bottleSize : this.bottle_size,
        vintageYears : this.vintage_year,
        country : this.country,
         producer: ($scope.ProducerSelectedName) ? $scope.ProducerSelectedName : $scope.producer,
       // producer : (this.producerSelected && this.producerSelected.title) ? this.producerSelected.title : $scope.producer,
        wineName : (this.wineNameSelected && this.wineNameSelected.title) ? this.wineNameSelected.title : $scope.wine_name
      }
      // console.log(data);

      if(!data.producer){
        return;
      }else if(!data.wineName){
        return;
      }else if(!data.vintageYears){
        return;
      }else if(!data.bottleSize){
        return;
      }else if(!data.country){
       return;
     }

     $scope.searchWine(JSON.stringify(data));
   }

   


   $scope.create = function (isValid) {
    $scope.error = null;

    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'wineForm');
      return false;
    }

    var wine = new Wine({
      //producer: (this.producerSelected && this.producerSelected.title) ? this.producerSelected.title : $scope.producer,
      producer: ($scope.ProducerSelectedName) ? $scope.ProducerSelectedName : $scope.producer,
      wine_name: (this.wineNameSelected && this.wineNameSelected.title) ? this.wineNameSelected.title : $scope.wine_name,
      vintage_year: this.vintage_year,
      bottle_size: this.bottle_size,
      country_code: this.country,
      region: this.uniqueWine.region,
      sub_region: this.uniqueWine.sub_region,
      state: this.uniqueWine.state,
      classification: this.uniqueWine.classification,
      wine_varietal: this.uniqueWine.wine_varietal,

      //drinking_window: this.uniqueWine.drinking_window

    });

    wine.$save(function (response) {
      $scope.wineId = response._id;
      toaster.pop('success', 'Add Wine', response.msg);
      $scope.bottleDetails = false;
      $scope.active=1;
      $scope.isDisabled = true;
    }, function (errorResponse) {
      toaster.pop('warning', 'Add Wine', errorResponse.data.message);
    });
  };


  $scope.currencyExchange = function(countries, currency_code){
    var rate;
    $.each(countries, function(index, doc){
      if(currency_code==doc.currency_code)
        rate = doc.euro_conv_rate;
    });
    return rate;
  }


   // Find producer location by producer name

   
     $scope.getProducerLocation = function(data){
       
      //producer= (this.producer && this.producer.title) ? this.producer.title : $scope.producer;
     // console.log(producer);
      var data={"producer":data};
      CustomWine.getProducerLocation(data).then(function(result) {
        $scope.uniqueProducerLocation = result;
        console.log($scope.uniqueProducerLocation);
        

        if($scope.uniqueProducerLocation){
        
         $scope.country=result[0].country_code;         
         $scope.uniqueWine.state=result[0].state;         
         $scope.uniqueWine.region=result[0].region;
         $scope.uniqueWine.sub_region=result[0].sub_region;
         $scope.countryChange();
         
        }
        
      });
    }

// $scope.getProducerLocation();


    

   

    // Update existing category
    $scope.postTransaction = function (isValid, countries) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'wineBottleForm');
        return false;
      }

      var delivery_status = [];
      var cost_per_bottle = parseFloat(this.cost_per_bottle);
      // var currencyExchange = parseFloat($scope.currencyExchange(countries, this.currency_code));

      delivery_status.push({date: new Date() , status: this.delivery_status});

      var data = {
        wine_id: $scope.wineId,
        fill_level : this.fill_level,
        level_condition : this.level_condition,
        cork_condition : this.cork_condition,
        cellar_id : this.cellar_id,
        purchase_date : this.purchase_date,
        source_supplier:  (this.sourceSupplierSelected) ? this.sourceSupplierSelected.title : $scope.source_supplier,
        quantity: this.qty,
        details: [{qty: this.qty, price: cost_per_bottle, currency:this.currency_code, price_usd: 0}],
        book_value_usd: 0,
        delivery_status: delivery_status,
        user_currency_code:$scope.user.currency_code
      }

      CustomWine.postTransaction(data).then(function(result) {
        console.log(result);
        toaster.pop('success', 'Update', result);
        $uibModalInstance.close();
      });
    };



    $scope.drinkingWindow=[
    "Unknown",
    "Drink Now",
    "Less than 2 Years",
    "2 - 5 Years",
    "5 - 7 tears",
    "7 - 10 years",
    "10 - 15 Years",
    "15 - 20 Years",
    "20 - 25 Years",
    "25+ Years",
    ];

    $scope.bottleSize=[
    '187.5ML',
    '200ML',
    '375ML (HALF BOTTLE)',
    '750ML (BOTTLE)',
    '1.5L (MAGNUM)',
    '2.25L (MARIE JEANNE)',
    '3L (DOUBLE MAGNUM OR JEROBOAM)',
    '4.5L (JEROBOAM OR REHOBOAM)',
    '5L (JEROBOAM)',
    '6L (IMPERIAL OR METHUSELAH)',
    '9L (SALMANAZER)',
    '12L (BELTHAZAR)',
    '15L (NEBUCHADNEZZAR)',
    '18L (MELCHOIR)',
    'OTHER'
    ];

    $scope.classificationData = [
    'FIRST GROWTH',
    'SECOND GROWTH',
    'THIRD GROWTH',
    'FOURTH GROWTH',
    'FIFTH GROWTH',
    'SECOND WINE',
    'GRAND CRU',
    'PREMIER CRU',
    '1ER CRU',
    'NOT CLASSIFIED'
    ];

    $scope.fillLevelData = [
    'LIKE NEW',
    'BS (BASE NECK)',
    'TS (TOP SHOULDER)',
    'VHS (VERY HIGH SHOULDER)',
    'HS (HIGH SHOULDER)',
    'HTMS (HIGH TO MID SHOULDER)',
    'MS (MID SHOULDER)',
    'LS (LOW SHOULDER)',
    ];

    $scope.labelConditionDate = [
    'LIKE NEW',
    'BSL (BIN SOILED LABEL)',
    'FL (FADED LABEL)',
    'GSL (GLUE STAINED LABEL)',
    'LL (LOOSE LABEL)',
    'NL (NICKED LABEL)',
    'SCL (SCUFFED LABEL)',
    'TAL (TATTERED LABEL)',
    'TL (TORN LABEL)',
    'TSL (TISSUE STAINED LABEL)',
    'WASL (WATER STAINED LABEL)',
    'WISL (WINE STAINED LABEL)',
    'WL (WRITING ON LABEL)',
    'WRL (WRINKLED LABEL)'

    ];

    $scope.corkConditionData = [
    'LIKE NEW',
    'CC (CORRODED CORK)',
    'CRC (CRACKED CAPSULE)',
    'CUC (CUT CAPSULE)',
    'NC (NICKED CAPSULE)',
    'NOC (NO CAPSULE)',
    'OXC (OXIDIZED CAPSULE)',
    'TC (TORN CAPSULE)',
    'SDC (SLIGHTLY DEPRESSED CORK)',
    'SPC (SLIGHTLY PROTRUDING CORK)',
    'SOS (SIGNS OF SEEPAGE)'
    ];



    $scope.wineVarietal = [
    'Albariño',
    'Aligoté',
    'Amarone',
    'Arneis',
    'Asti Spumante',
    'Auslese',
    'Banylus',
    'Barbaresco',
    'Bardolino',
    'Barolo',
    'Beaujolais',
    'Blanc de Blancs',
    'Blanc de Noirs',
    'Blush',
    'Boal or Bual',
    'Bordeaux Blend',
    'Brunello',
    'Cabernet Franc',
    'Cabernet Sauvignon',
    'Cabernet Blend',
    'Carignan',
    'Carmenere',
    'Cava',
    'Champagne',
    'Charbono',
    'Chardonnay',
    'Châteauneuf-du-Pape',
    'Chenin Blanc',
    'Chianti',
    'Chianti Classico',
    'Claret',
    'Colombard (French Colombard)',
    'Constantia',
    'Cortese',
    'Dolcetto',
    'Eiswein',
    'Frascati',
    'Fumé Blanc',
    'Gamay',
    'Gamay Beaujolais',
    'Gattinara',
    'Gewürztraminer',
    'Grappa',
    'Grenache',
    'GSM (Grenache, Syrah, Mourvedre)',
    'Kir',
    'Lambrusco',
    'Liebfraumilch',
    'Madeira',
    'Malbec',
    'Marc',
    'Marsala',
    'Marsanne',
    'Mead',
    'Meritage',
    'Merlot',
    'Montepulciano',
    'Moscato',
    'Mourvedre',
    'Müller-Thurgau',
    'Muscat',
    'Nebbiolo',
    'Petit Verdot',
    'Petite Sirah',
    'Pinot Blanc',
    'Pinot Grigio or Pinot Gris',
    'Pinot Meunier',
    'Pinot Noir',
    'Pinotage',
    'Port',
    'Rielsing',
    'Retsina',
    'Rosé',
    'Roussanne',
    'Sangiovese',
    'Sauterns',
    'Sauvignon Blanc',
    'Sémillon',
    'Sherry',
    'Soave',
    'Syrah',
    'Tempranillo',
    'Tokay',
    'Traminer',
    'Trebbiano',
    'Ugni Blanc',
    'Valpolicella',
    'Verdicchio',
    'Viognier',
    'Zinfandel',
    ];

    $scope.deliveryStatus = [
    'EN PRIMEUR',
    'DELIVERED',
    'ON ROUTE',
    'ON HOLD'
    ]




  }
  ])
.directive('numbersOnly', function(){
 return {
   require: 'ngModel',
   link: function(scope, element, attrs, modelCtrl) {
     modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
             var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }         

          return transformedInput;         
        });
   }
 };
})
.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});
