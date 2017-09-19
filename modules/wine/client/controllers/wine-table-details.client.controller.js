'use strict';

// Wines controller
angular.module('wines').controller('WineTableDetailsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Wine', '$timeout', 'Country', '$uibModalInstance', 'wine', '$uibModal','Cellars', 'toaster', 'CustomWine','CustomCellars',
  function ($scope, $state, $stateParams, $location, Authentication, Wine, $timeout, Country, $uibModalInstance, wine, $uibModal,Cellars, toaster, CustomWine,CustomCellars) {
    $scope.authentication = Authentication;
     $scope.user = Authentication.user;
    $scope.editTesting = false;
    $scope.$state = $state;
    $scope.wine =wine;
    var tempscore=$scope.wine.score;
    $scope.avgData=[];
    $scope.saverating=false;
    $scope.avgCommunity=0;
    $scope.editableWine = angular.copy($scope.wine);
   console.log(JSON.stringify(wine))
   //console.log('Preloaded values for wine'+$scope.wine.wine_id.tasting_notes.clarity);


    $scope.close = function(){
      
      var winescore=$scope.wine.score;
      if(typeof winescore != "undefined")
      {        
      if(tempscore!=$scope.wine.score)
      {
      $scope.saveScore();
      }
     }


      $uibModalInstance.close();
      
    };

    $scope.editTestingNotes = function(){
      if($scope.editTesting){
        $scope.editTesting = false;
      }else{
        $scope.editTesting = true;
      }
    }

 $scope.saveScore=function(){

      
         var wine = $scope.wine;
    //alert("set score is"+wine.score);
     // console.log(wine);

      CustomWine.postWineScoreUpdate(wine).then(function(result) {
       // $scope.wine = result;
       $scope.saverating=true;
       console.log(result)
        $scope.getAvgScoredata();
       
       
      });
    }

    $scope.getAvgScoredata=function(){
     var avgs=0;        
          CustomWine.getAvgCommunity(wine).then(function(result) {
        $scope.positions = result;
         $scope.avgData=$scope.positions;        
      //  console.log("get result"+$scope.avgData.length);
        for(var i=0;i<$scope.avgData.length;i++){
           avgs=avgs+$scope.avgData[i].score ;
        }
       if($scope.avgData[0].score>0)
          {
            $scope.avgCommunity=avgs/$scope.avgData.length;
            if($scope.saverating)
            {
              $scope.updateCommunityRating();
            }

           
          }else{
           $scope.avgCommunity=0;
            
            }
      });

      }
      $scope.getAvgScoredata();


//update community rating
 $scope.updateCommunityRating = function () {

      
      console.log($scope.wine)
      $scope.editableWine.wine_id.ratings =$scope.avgCommunity.toString();     
      console.log($scope.editableWine);
      CustomWine.postWineRatingUpdate($scope.editableWine).then(function(result) {
        $scope.wine = result; 
        $scope.saverating=false;      
        toaster.pop('success', 'Score', 'Update successful');
       
      });
    };








    $scope.getPositionbyId = function(){
        alert("wine id 1 "+$scope.wine._id);
      CustomWine.getPositionbyId($scope.wine._id).then(function(result) {
        $scope.positions = result;
        console.log(result);
      })
    }

     $scope.getPositionScorebyId = function(){
       var wine = $scope.wine;
    //alert("set score is"+wine.score);
      console.log(wine);
      CustomWine.getPositionScorebyId(wine).then(function(result) {
        $scope.positions = result;
        $scope.wine.score=$scope.positions.score;
        console.log(result);
      })
    }

     $scope.getPositionScorebyId();
    $scope.getPositionbyId = function(){
      CustomWine.getPositionbyId($scope.wine._id).then(function(result) {
        $scope.positions = result;
        console.log(result);
      })
    }

    // $scope.getPositionbyId();





    $scope.updateTestingNode = function (isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'testingDetail');
        return false;
      }



      var wine = $scope.wine;

      //console.log('updating values'+wine);
      $scope.editableWine.tasting_notes = angular.copy($scope.editableWine.wine_id.tasting_notes);
      CustomWine.postWineUpdate($scope.editableWine).then(function(result) {
        $scope.wine.wine_id = result;
        console.log(result);
        toaster.pop('success', 'Tasting', 'Update successful');
        $scope.editTestingNotes();
      });
    };


 /*appearance*/
    $scope.clarities = ["Clear","Hazy","Bright","Dull","Faulty"];
    $scope.intensities = ["Pale","Medium","Deep"];
    $scope.colours = ["Amber","Brown","Garnett","Gold","Lemon","Lemon Green","Onion Skin","Orange,Pink","Purple,Ruby","Salmon","Tawny"];
    $scope.viscosities = ["Low","Medium","High"];
    $scope.others=["Bubbles","Deposits","Leg/Tears","Petillance"];
    /*Nose*/

    $scope.conditions = ["Clean","Unclean","Faulty"];
    $scope.noseIntensities = ["Light","Medium(-)","Medium","Medium(+)","Pronounced"];
    $scope.aromas=["Acacia","Apricot","Asparagus","Banana","Beans","Black Cherry","Black Olive","Black Pepper","Blackberry","Blackcurrant","Blackcurrent Leaf","Blossom","Blueberry","Bramble","Cabbage","Chamomile","Cinnamon","Cloves","Cranberry","Custard Apple","Elderflower","Eucalyptus","Fennel","Geranium","Ginger","Gooseberry","Grape","Grapefruit","Grass","Green Apple","Green Bell Pepper","Green Olive","Honeysuckle","Iris","Juniper","Lavender","Leafiness","Lemon","Lemon Peel","Lime","Liquorice","Lychee","Mango","Medicinal","Melon","Mint","Nectarine","Neroli","Nutmeg","Orange Peel","Passion Fruit","Peach","Pear","Peas","Pineapple","Plum","Potato","Pyrazine","Quince","Raspberry","Red Apple","Red Cheery","Redcurrant","Rose","Strawberry","Tomato","Vanilla","Violet","White Pepper"];
    $scope.simplicities=["Simple","Neutral","Indistinct"];
    $scope.autolytics=["Biscuit","Bread","Brioche","Lees","Pastry","Toast","Yeast"];
    $scope.dairieoaks=["Acrid","Butter","Butterscotch","Cedar","Charred Wood","Cheese","Cream","Resinous","Smoke","Toast","Vanilla","Yoghurt"];
    $scope.oaks=["Acrid","Butterscotch","Cedar","Charred Wood","Resinous","Smoke","Toast","Vanilla"];
    $scope.kernels=["Almond","Chocolate","Coconut","Coffee","Hazlenut","Marzipan","Walnut"];
    $scope.animals=["Farmyard","Leather","Meaty"];
    $scope.maturities=["Cedar","Cereal","Forest Floor","Game","Hay","Honey","Mushroom","Savoury","Tobacco","Vegetal","Wet Leaves"];
    $scope.minerals=["Earth","Kerosene","Petrol","Rubber","Smoke","Steely","Stoney","Tar","Wet Wool"];

   /*Palate*/
   $scope.sweetnesses=["Dry","off Dry","Medium Dry","Medium Sweet","Sweet","Luscious"];
   $scope.acidities=["Low","Medium(-)","Medium","Medium(+)","High"];
   $scope.tannins = ["Low","Medium(-)","Medium","Medium(+)","High"];
   $scope.natures=["Ripe Soft","Unripe Green","Coarse","Fine Grained"];
   $scope.alcohols = ["Low","Medium(-)","Medium","Medium(+)","High"];
   $scope.bodys = ["Light","Medium(-)","Medium","Medium(+)","Full"];
$scope.flavour_intensities = ["Light","Medium(-)","Medium","Medium(+)","Pronounced"];
$scope.florals=["Acacia","Blossom","Chamomile","Elderflower","Geranium","Honeysuckle","Iris","Neroli","Rose","Violet"];
$scope.fruits=["Green Apple","Red Apple","Gooseberry","Pear","Custard Apple","Quince","Grape","Apricot","Nectarine","Peach","Grapefruit","Lemon","Lime","Orange Peel","Lemon Peel","Banana","Lychee","Mango","Melon","Passion Fruit","Pineapple","Redcurrant","Cranberry","Raspberry","Strawberry","Red Cheery","Plum","Blackcurrant","Blackberry","Bramble","Blueberry","Black Cherry"];
$scope.underripness=["Grass","Green Bell Pepper","Leafiness","Potato","Tomato","White Pepper"];
$scope.herbacevegal=["Grass","Asparagus","Blackcurrent Leaf","Pyrazine","Cabbage","Peas","Beans","Black Olive","Green Olive","Eucalyptus","Mint","Medicinal","Lavender","Fennel"];
$scope.spices=["Black Pepper","Cinnamon","Cloves","Ginger","Juniper","Liquorice","Nutmeg","Vanilla","White Pepper"];
 $scope.finishs = ["Short","Medium(-)","Medium","Medium(+)","Long"];
 /*FAULTS*/
 $scope.anisoless=["Mustiness","Tca","Wet Cardboard"];
 $scope.brettanomyces=["Animal","Farmyard","Leather","Meaty","Sticky Plaster","Vinyl"];
 $scope.oxidations=["Aldehydes","Caramel","Sherry Aromas","Staleness","Toffee"];
 $scope.volatileacidities=["Nail Remover","Solvents","Vinegar"];
 $scope.reductions=["Blocked Drains","Cabbage","Eggs","Garlic","Mercaptans","Onion","Rubber","Sweat"];
 $scope.faultOthers=["Beetroot","Mould","Rot"];
  $scope.developments = ["Youthful","Developing","Fully_developed","Tired","Past_due"];
   

   $scope.drinkingWindows=[
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
    $scope.qualities =["Faulty","Poor","Acceptable","Good","Very Good","Outstanding"];
    $scope.ageabilities =["Not Ageable","Young","Drink Now","Old"];

    $scope.showMapView = function(wine){

      console.log(11);
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'mapView.html',
        controller: 'MapController',
        windowClass: 'map-details',
        scope: $scope,
        resolve: {
          wineDetails: function(){
            return wine;
          }
        }
      });
    };

    $scope.addBottle = function(wineId){
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'addBottle.html',
        controller: 'AddBottleController',
        windowClass: 'add-bottle',
        scope: $scope,
        resolve: {
          wineId: function(){
            return wineId;
          }
        }
      });
    };

    $scope.removeBottle = function(wine){
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'removeBottle.html',
        controller: 'RemoveBottleController',
        windowClass: 'add-bottle',
        scope: $scope,
        resolve: {
          wine: function(){
            return wine;
          }
        }
      });
    };

    $scope.confirmDelete=function(){
        var ans = prompt("Please enter DELETE to confirm");
        //alert(ans.toUpperCase());

        if (ans.toUpperCase() == "DELETE") {
            return true;
        }
        return false;
    };

    $scope.deleteBottle = function(wine){
    var check=$scope.confirmDelete();

    if(check)
    {
      var data = {
        wine_id: $scope.wine.wine_id._id
      }

      CustomWine.deleteWineTransaction(data).then(function(result) {
        console.log(result);
        toaster.pop('success', 'Remove', result);
        $uibModalInstance.close();
      });
     } 

   

    };




    $scope.bottleSize=[
    '187.5ML',
    '200ML',
    '375ML (HALFBOTTLE)',
    '750ML (BOTTLE)',
    '1.5L (MAGNUM)',
    '2.25L (MARIEJEANNE)',
    '3L (DOUBLEMAGNUM OR JEROBOAM)',
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
    'BS (BASENECK)',
    'TS (TOPSHOULDER)',
    'VHS (VERYHIGHSHOULDER)',
    'HS (HIGHSHOULDER)',
    'HTMS (HIGHTOMIDSHOULDER)',
    'MS (MIDSHOULDER)',
    'LS (LOWSHOULDER)',
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
    'CHAMPAGNE',
    'PORT',
    'RED',
    'ROSE',
    'SPARKLING',
    'SWEET',
    'WHITE',
    'OTHER'
    ];

    $scope.deliveryStatus = [
    'EN PRIMEUR',
    'DELIVERED',
    'ON ROUTE',
    'ON HOLD'
    ]

    $scope.findCellars = function () {
     // $scope.cellars = Cellars.query();
     var data={user_id:$scope.user._id};
     CustomCellars.getMyCellars(data).then(function(result){
        $scope.cellars= result;
        //console.log('my Cellars'+JSON.stringify(result));

      })


    };
    $scope.findCellars();


    $scope.currentYear = new Date().getFullYear();

    $scope.vintageYears = function(){
      var currentYear = new Date().getFullYear();
      var years = [];
      for (var i = 1800; i <= currentYear; i++){
        years.unshift(i);
      }
      return years;
    }


  }
  ]);
