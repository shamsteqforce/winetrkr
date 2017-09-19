'use strict';

angular.module('core').controller('CellarController', ['$scope', 'Authentication','ReceiptService', '$uibModal','CustomWine','Cellars','toaster', '$stateParams','CustomCellars',
  function ($scope, Authentication,ReceiptService, $uibModal,CustomWine,Cellars,toaster, $stateParams, CustomCellars) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    // $scope.receipts=null;
     $scope.receipts=[];
     //$scope.assignReceipts=[];
     // $scope.unassignReceipts=[];
      $scope.allReceipt=true;
      $scope.assignRecept=false;
       $scope.unassignRecept=false;

 //       $scope.getInventoryQty = function () {
  
 //      CustomWine.getInventoryQty().then(function(result){
 //        $scope.stockQty = result[0];
 //        // console.log(result[0]);
 //      })
 //    };
 // $scope.getInventoryQty();
 

    $scope.addCellar = function(){
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'addCellar.html',
        controller: 'AddCellarController'
      });

      dialog.result.then(function () {
        $scope.getMyCellars();
      }, function () {
        $scope.getMyCellars();
      });
    };

 $scope.assignVisible=function(){
      var myEl = angular.element( document.querySelector( '#allRcv' ) );
      var myE2 = angular.element( document.querySelector( '#allassRcv' ) );
      var myE3 = angular.element( document.querySelector( '#allunRcv' ) );
      myE2.addClass('active')
       myEl.removeClass();
        myE3.removeClass();

     $scope.allReceipt=false;
      $scope.assignRecept=true;
       $scope.unassignRecept=false;

    }
    $scope.allVisible=function(){

      var myEl = angular.element( document.querySelector( '#allRcv' ) );
      var myE2 = angular.element( document.querySelector( '#allassRcv' ) );
      var myE3 = angular.element( document.querySelector( '#allunRcv' ) );
      myEl.addClass('active')
       myE2.removeClass();
        myE3.removeClass();
     $scope.allReceipt=true;
      $scope.assignRecept=false;
       $scope.unassignRecept=false;

    }
     $scope.unassignVisible=function(){

       var myEl = angular.element( document.querySelector( '#allRcv' ) );
      var myE2 = angular.element( document.querySelector( '#allassRcv' ) );
      var myE3 = angular.element( document.querySelector( '#allunRcv' ) );
      myE3.addClass('active')
       myEl.removeClass();
        myE2.removeClass();
    $scope.allReceipt=false;
      $scope.assignRecept=false;
       $scope.unassignRecept=true;
      
    }


    $scope.showDetails = function(cellarId){
     var dialog = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'viewCellarDetails.html',
      controller: 'CellarTableDetailsController',
      windowClass: 'row-win-details'
      // resolve: {
      //  cellar: function(){
      //   // console.log(Wine.get({cellarId: cellarId}));
      //   return Cellars.get({cellarId: cellarId});
      // }
    // }
  });

     dialog.result.then(function () {
      // $scope.findCellars();
    }, function () {
      // $scope.findCellars();
    });
   };
$scope.showReceipts = function(){
     CustomWine.getReceipt().then(function(result){
        $scope.receipts= result;
          console.log("receipts "+result);
         // $scope.imageURL=result[1].file_path;
        // console.log(result[0]);
        $scope.showAssignReceipts();
      })
     
  };
$scope.showReceipts();

$scope.showAssignReceipts = function(){
    var recptlength=$scope.receipts.length;
     $scope.unassignReceipts=[];
    $scope.assignReceipts=[];
   for(var i=0;i<recptlength;i++){

    console.log($scope.receipts[i].transaction_id.length)
    if($scope.receipts[i].transaction_id.length==0)
      {
       $scope.unassignReceipts.push($scope.receipts[i]);

      }else{
      $scope.assignReceipts.push($scope.receipts[i]);

      }
   }
    
     
  };

  //  $scope.findCellars = function () {
  //   $scope.cellars = Cellars.query();
  // };

   $scope.getMyCellars = function(){    
    var data={user_id:$scope.user._id};
     CustomCellars.getMyCellars(data).then(function(result){
        $scope.cellars= result;
        console.log('my Cellars'+JSON.stringify(result));

      })
     
  };



  $scope.findOneCellar = function () {
    $scope.cellar = Cellars.get({cellarId: $stateParams.cellarId});
  };




  $scope.addReceipt = function(){
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'addReceipt.html',
        controller: 'AddReceiptController',
        //abinav
        scope:$scope,
        
        //abhinav
      });

      dialog.result.then(function () {
        $scope.showReceipts();
      }, function () {
        $scope.showReceipts();
      });
    };


    $scope.editReceipt = function(receiptpath){
     
      var receipt={
        file_path:receiptpath
      };
      
      ReceiptService.addReceipt(receipt);
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editReceipt.html',
        controller: 'AddReceiptController',
        
      });

      dialog.result.then(function () {
       $scope.showReceipts();
      }, function () {
       $scope.showReceipts();
      });
    };
    $scope.viewReceipt = function(receipt){
      
      ReceiptService.addReceipt(receipt);
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editReceipt.html',
        controller: 'AddReceiptController',
        
      });

      dialog.result.then(function () {
        $scope.showReceipts();
      }, function () {
        $scope.showReceipts();
      });
    };





  $scope.deleteReceipt=function(receipt){
    
     
  CustomWine.deleteReceipt(receipt).then(function(result){
       
        toaster.pop('success', 'Delete', result.msg);
         $scope.showReceipts();
        
      })

  };




    $scope.showDetailsReceipt = function(cellarId){
     var dialog = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'viewReceiptDetails.html',
      controller: 'CellarTableDetailsController',
      windowClass: 'row-win-details'
      // resolve: {
      //  cellar: function(){
      //   // console.log(Wine.get({cellarId: cellarId}));
      //   return Cellars.get({cellarId: cellarId});
      // }
    // }
  });

     dialog.result.then(function () {
      // $scope.findCellars();
    }, function () {
      // $scope.findCellars();
    });
   };

}
]);
