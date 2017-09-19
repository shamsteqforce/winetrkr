'use strict';

// Wines controller
angular.module('core').controller('AddReceiptController', ['$scope', 'Authentication','ReceiptService', '$uibModalInstance','FileUploader',  '$stateParams','$window','$http', 'Cellars', '$timeout','CustomWine', 'toaster','Country', 'Wine',
  function ($scope,Authentication, ReceiptService,$uibModalInstance,FileUploader,  $stateParams,$window,$http, Cellars, $timeout,CustomWine,toaster,Country, Wine) {
    $scope.authentication = Authentication;
     $scope.user = Authentication.user;
     $scope.fileAdded=false;
     $scope.visibleIn=true;
     $scope.visibleOut=false;
    $scope.receipt=ReceiptService.getReceipt();    
    $scope.wines=Wine.query();
    $scope.imageURL = $scope.user.profileImageURL;
  
    $scope.trans={  
      trans_id:"",
      wine_id:"",
      producer_name:"",
      wine_name:"",
      quantity:"",
      price:""
    };
     $scope.displayTransaction=[];    
    console.log($scope.receipt);

   $scope.receiptDisable=true;
    $scope.active = 0;
   //  alert(" receipt "+$scope.receiptDisable);

   $scope.close = function(){    
      $uibModalInstance.close();
    };

    $scope.closeRecpt=function(){

     $uibModalInstance.close();

    }
 $scope.receipt.updated_at = new Date();

    $scope.dateOptions = {
      //dateDisabled: disabled,
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

//    $scope.chooseFile = function() {
      
//    angular.element('#upload').trigger('click');




// };






$scope.zoomIn=function(){

  //$scope.zoomPlus.push('col-md-12');
  var myEl = angular.element( document.querySelector( '#recpimg' ) );
  
   myEl.removeClass('col-md-6');
     myEl.addClass('col-md-12');
     $scope.visibleIn=false;
      $scope.visibleOut=true;

}
$scope.zoomOut=function(){

  //$scope.zoomPlus.push('col-md-12');
  var myEl = angular.element( document.querySelector( '#recpimg' ) );
  
   myEl.removeClass('col-md-12');
     myEl.addClass('col-md-6');
     $scope.visibleIn=true;
      $scope.visibleOut=false;

}

/*
create receipt

*/
$scope.create=function(isValid){

   $scope.error = null;

    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'receiptForm');
      return false;
    }
     $scope.receiptDisable = false;
      $scope.active=1;
      $scope.isDisabled = true;
  

};




$scope.selectedProducer = function(){
 
  $scope.albumNameArray = [];
  angular.forEach($scope.displayTransaction, function(transaction){
    if (!!transaction.selected) $scope.albumNameArray.push(transaction.trans_id);
  })
  
  

  var rcpttags=$scope.receipt.tags;

  if(typeof rcpttags != "undefined"){
  var arrayTag = rcpttags.toString().split(',');
  console.log(arrayTag);
  $scope.receipt.tags=arrayTag;
  }
 // $scope.receipt.wine_id=arrayTag;
 if($scope.albumNameArray.length>0)
   $scope.receipt.transaction_id=$scope.albumNameArray; 
  
 
  CustomWine.postReceipt($scope.receipt).then(function(result){
       
        toaster.pop('success', 'Update', result.msg);
        $uibModalInstance.close();
        
        
      })


};


$scope.deleteReceipt=function(receipt){
    
 
  CustomWine.deleteReceipt(receipt).then(function(result){
       
        toaster.pop('success', 'Delete', result.msg);
         $uibModalInstance.close();       
        
      })

  };




/*find wine details*/
$scope.findWines = function () {
   
   
    CustomWine.getTransactionList().then(function(result){
       $scope.transactions =result;
         console.log($scope.transactions.length);
         if($scope.transactions.length>0){
 for(var i=0;i<$scope.wines.length;i++){
      var wine_id=$scope.wines[i].wine_id._id;
     
      for(var j=0;j<$scope.transactions.length;j++)
      {
         console.log($scope.transactions[j].transaction_type);
        
        if($scope.transactions[j].wine_id===wine_id && $scope.transactions[j].transaction_type === 'Cr')
        {
           $scope.trans={      
      trans_id:"",
      wine_id:"",
      producer_name:"",
      wine_name:"",
      quantity:"",
      price:""
    };
         // console.log("wine id "+wine_id +" and "+$scope.transactions[j].wine_id+" producer "+$scope.wines[i].wine_id.producer);
       $scope.trans.trans_id=$scope.transactions[j]._id;
       $scope.trans.wine_id=$scope.transactions[j].wine_id;
       $scope.trans.producer_name=$scope.wines[i].wine_id.producer;
       $scope.trans.wine_name=$scope.wines[i].wine_id.wine_name;
       $scope.trans.quantity=$scope.transactions[j].details[0].qty;
        $scope.trans.price=$scope.transactions[j].details[0].price_usd * $scope.trans.quantity;
       $scope.displayTransaction.push($scope.trans);
        }
      }
    }
  
  //  console.log($scope.displayTransaction);

         }
         
      })

    
  

   

      
    };



$scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'url': 'upload.php'
    },
    'parallelUploads': 1,
                            'autoProcessQueue': false,
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
      },
      'success': function (file, response) {
       // console.log(file, response);
      }
    }
  };
$scope.uploadFile = function() {
 
                        $scope.processDropzone();
                    };
  }
  ]).directive('dropzone-test', function () {
  return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
})
  
  .directive('dropzone', function() {
                return {
                    restrict: 'C',
                    link: function(scope, element, attrs) {
                  var dropzone;
                        var config = {
                            url: '/api/core/receipt',
                            maxFilesize: 100,
                            paramName: "newReceipt",
                            maxThumbnailFilesize: 10,
                            parallelUploads: 1,
                            autoProcessQueue: false
                        };

                        var eventHandlers = {
                            'addedfile': function(file) {
                                scope.file = file;
                                if (this.files[1]!=null) {
                                    this.removeFile(this.files[0]);
                                }
                                scope.$apply(function() {
                                    scope.fileAdded = true;                                 
                                   
                                });
                            },
                            'removedfile': function(file) {
                                scope.file = file;
                                if (this.files[1]!=null) {
                                    this.removeFile(this.files[0]);
                                }
                                scope.$apply(function() {
                                    scope.fileAdded = false;                                 
                                    
                                });
                            },

                            'success': function (file, response) {
                              scope.editReceipt(response);
                               scope.close();
                            }

                        };
                       // alert(" dozonefile "+scope.file.length);

                        dropzone = new Dropzone(element[0], config);

                        angular.forEach(eventHandlers, function(handler, event) {
                            dropzone.on(event, handler);
                        });

                        scope.processDropzone = function() {
                            dropzone.processQueue();
                            setTimeout(function(){                            
                              
                             
                            
                            },2000);
                        };

                        scope.resetDropzone = function() {
                            dropzone.removeAllFiles();
                        }
                      
                    }
                }
            });

//abhinav
