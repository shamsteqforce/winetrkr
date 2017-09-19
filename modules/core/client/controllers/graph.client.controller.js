'use strict';

angular.module('core').controller('GraphController', ['$scope','roundProgressService', 'Authentication', '$uibModal', 'Wine', '$stateParams', 'Cellars', '$timeout', 'Country', 'CustomWine',
  function ($scope, roundProgressService,Authentication, $uibModal, Wine, $stateParams, Cellars, $timeout, Country, CustomWine) {
    // This provides Authentication context.

    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    // $scope.wines=Wine.query();
    $scope.wines=[];
    $scope.lastFourTransaction=[];
     $scope.regionBottles=[];
      $scope.doc_classes_colors = [
             "#428000",
             "#334d00",
             "#006666",
             "#00b3b3",
             "#607D8B",
             "#039BE5",
             "#009688",
             "#536DFE",
             "#AB47BC",
             "#E53935",
             "#3F51B5"
        ];

         $scope.getRandomColor = function () {
$scope.bgColor = $scope.doc_classes_colors[Math.floor(Math.random() * $scope.doc_classes_colors.length)];
    };
          
     $scope.getTopDistributorsData = function(){
    var data={user_id:$scope.user._id};
    var resultData1,resultData2;
    CustomWine.getTopDistributorsData(data).then(function(result1) {  
     CustomWine.getTotalDistributionPrice(data).then(function(result2) { 
      console.log('Top Distributors-->'+JSON.stringify(result1)+" "+result1.length); 
      console.log('Total Distribution Price-->'+result2[0].total+" "+result2.length); 

      var totalDistributionPrice=result2[0].total;
      if(result1.length==4)
      {
        var supplier1=result1[0]._id; var price1=result1[0].Price; var percent1=parseInt((price1*100)/totalDistributionPrice);
        var supplier2=result1[1]._id; var price2=result1[1].Price; var percent2=parseInt((price2*100)/totalDistributionPrice);
        var supplier3=result1[2]._id; var price3=result1[2].Price; var percent3=parseInt((price3*100)/totalDistributionPrice);
        var supplier4=result1[3]._id; var price4=result1[3].Price; var percent4=parseInt((price4*100)/totalDistributionPrice);
        drawProgressDistributors('Distributorgraph1','#ff8080',supplier1,percent1,price1);
        drawProgressDistributors('Distributorgraph2','#29c0d5',supplier2,percent2,price2);
        drawProgressDistributors('Distributorgraph3','#ff8080',supplier3,percent3,price3);
        drawProgressDistributors('Distributorgraph4','#55bca9',supplier4,percent4,price4);
      }
      else if(result1.length==3)
      {
        var supplier1=result1[0]._id; var price1=result1[0].Price; var percent1=parseInt((price1*100)/totalDistributionPrice);
        var supplier2=result1[1]._id; var price2=result1[1].Price; var percent2=parseInt((price2*100)/totalDistributionPrice);
        var supplier3=result1[2]._id; var price3=result1[2].Price; var percent3=parseInt((price3*100)/totalDistributionPrice);
        drawProgressDistributors('Distributorgraph1','#ff8080',supplier1,percent1,price1);
        drawProgressDistributors('Distributorgraph2','#29c0d5',supplier2,percent2,price2);
        drawProgressDistributors('Distributorgraph3','#ff8080',supplier3,percent3,price3);
      }
       else if(result1.length==2)
      {
        var supplier1=result1[0]._id; var price1=result1[0].Price; var percent1=parseInt((price1*100)/totalDistributionPrice);
        var supplier2=result1[1]._id; var price2=result1[1].Price; var percent2=parseInt((price2*100)/totalDistributionPrice);
        drawProgressDistributors('Distributorgraph1','#ff8080',supplier1,percent1,price1);
        drawProgressDistributors('Distributorgraph2','#29c0d5',supplier2,percent2,price2);
      }
       else if(result1.length==1)
      {
        var supplier1=result1[0]._id; var price1=result1[0].Price; var percent1=parseInt((price1*100)/totalDistributionPrice);
        drawProgressDistributors('Distributorgraph1','#ff8080',supplier1,percent1,price1);

      }

          
      });
    

      });

    };

    $scope.getTopDistributorsData();



    $scope.getTotalDistributionPrice = function(){
    var data={user_id:$scope.user._id};
    CustomWine.getTotalDistributionPrice(data).then(function(result) {
    
      console.log('Total Distributors Price-->'+JSON.stringify(result)+" "+result.length); 
      alert(result.length);
      return result;
    
      });

    };

    //$scope.getTotalDistributionPrice();
     
         function drawProgressDistributors(elemetId,lineColor,supplier,percentage,price)

         {
              var el = document.getElementById(elemetId); // get canvas
              var supplyAmount=parseInt(price);
              var options = {
                  percent:  el.getAttribute('data-percent') || percentage,
                  size: el.getAttribute('data-size') || 220,
                  lineWidth: el.getAttribute('data-line') || 3,
                  rotate: el.getAttribute('data-rotate') || 0,
                  lineColor: el.getAttribute('line-color') || lineColor
                  }
              var label = document.createElement('label');     
              var canvas = document.createElement('canvas');
              var span = document.createElement('span');
              span.textContent = '$'+supplyAmount;
              label.textContent=supplier;


                  
              if (typeof(G_vmlCanvasManager) !== 'undefined') {
                  G_vmlCanvasManager.initElement(canvas);
              }

              var ctx = canvas.getContext('2d');
              canvas.width = canvas.height = options.size;

              label.setAttribute("style", "color:"+lineColor+";margin-left:70px;");
              span.setAttribute("style", "color:"+lineColor+";");
             
              el.appendChild(span);
              el.appendChild(canvas);
              el.appendChild(label);


              ctx.translate(options.size / 2, options.size / 2); // change center
              ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

              //imd = ctx.getImageData(0, 0, 240, 240);
              var radius = (options.size - options.lineWidth) / 2;

              var drawCircle = function(color, lineWidth, percent) {
                  percent = Math.min(Math.max(0, percent || 1), 1);
                  ctx.beginPath();
                  ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
                  ctx.strokeStyle = color;
                  ctx.lineCap = 'round'; // butt, round or square
                  ctx.lineWidth = lineWidth
                  ctx.stroke();
              };

              drawCircle('#555555', options.lineWidth, 100 / 100);
              drawCircle(options.lineColor, options.lineWidth, options.percent / 100);
               }


               //drawProgressDistributors('Distributorgraph1','#ff8080','Supplier1');
              // drawProgressDistributors('Distributorgraph2','#29c0d5','Supplier2');
               //drawProgressDistributors('Distributorgraph3','#a9c851','Supplier3');
               //drawProgressDistributors('Distributorgraph4','#55bca9','Supplier4');


     $scope.findWinesByUser = function () {
    
    var data={user_id:$scope.user._id};
      CustomWine.getWinesByUser(data).then(function(result) {
        //console.log('Wine by User ID->'+JSON.stringify(result)+" "+result.length);
      $scope.wines = result;
      $scope.wine_name=result[0].wine_name;
      $scope.wine_id=result[0]._id;
      $scope.getVerticalGraphData();
      $scope.getLastTransaction();
      console.log($scope.wines);

      });

  };

    $scope.addWine = function(countries){
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'addWine.html',
        controller: 'WineAddController',
        resolve: {
         countries: function(){
          return countries;
        }
      }
    });

      dialog.result.then(function () {
        $scope.findWines();
      }, function () {
        $scope.findWines();
      });
    };

    $scope.myFilter = function (item) {
      // console.log(item.quantity);
    return item.quantity > 0; 
};

    $scope.getInventoryQty = function () {
      CustomWine.getInventoryQty().then(function(result){
        $scope.stockQty = result[0];
        // console.log(result[0]);
      })
    };
    $scope.getInventoryQty();


$scope.getLastTransaction=function(){
  var data={user_id:$scope.user._id};
  $scope.lastFourTransaction=[];
  
  var count=0;
  CustomWine.getLastTransactionData(data).then(function(result){
        $scope.lastTransaction = result;
        console.log("winees last transaction")    ; 
        console.log($scope.wines);
      for(var j=0;j<4;j++)
      {
        var wine_id=$scope.lastTransaction[j].wine_id;
      
         for(var i=0;i<$scope.wines.length;i++){
         
           
        if($scope.wines[i]._id===wine_id && count<=3)
        {
           console.log("wine1 "+$scope.wines[i].region+" wine2 "+wine_id)
          var tempTransaction={producer:'',quantity:'',price:'',date:'',region:''}
          tempTransaction.producer=$scope.wines[i].producer;
           tempTransaction.region=$scope.wines[i].region;
         tempTransaction.quantity=$scope.lastTransaction[j].details[0].qty;
          tempTransaction.price=$scope.lastTransaction[j].details[0].price_usd;
           tempTransaction.date=$scope.lastTransaction[j].updated_at;
         
          $scope.lastFourTransaction.push(tempTransaction);
          count++;
        }
    }
  }
    console.log($scope.lastFourTransaction);


      });
};



    $scope.getOpenexchangerates = function () {
      CustomWine.getOpenexchangerates().then(function(exchangerates){
        var rates = [];

        for (var key in exchangerates.rates) {
          if (exchangerates.rates.hasOwnProperty(key)) {
            rates.push({currency_code: key, conversion_rate: exchangerates.rates[key]});
          }
        }

        var doc = {
          base: exchangerates.base,
          rates: rates
        }

        CustomWine.postExpenditure(doc).then(function(result){
          // console.log(result);
        });
      })
    };

    // $scope.getOpenexchangerates();





    // $scope.getExpenditure = function () {
    //   CustomWine.getExpenditure().then(function(result){
    //     $scope.expenditure = result[0];
    //     // console.log(result[0])
    //   })
    // };
    // $scope.getExpenditure();

    // Find a list of Country
    $scope.findCountry = function () {
      $scope.countries = Country.query();
    };


    $timeout(function() {
      $scope.findCountry();
    }, 1000);
    

    $scope.showDetails = function(wine){
     var dialog = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'wideDetails.html',
      controller: 'WineTableDetailsController',
      windowClass: 'row-win-details',
      resolve: {
       wine: function(){
        return wine;
      }
    }
  });

     dialog.result.then(function () {
      $scope.findWines();
    }, function () {
      $scope.findWines();
    });
   };

   // Find a list of Cellers
   $scope.findCellars = function () {
    $scope.cellars = Cellars.query();
  };

  $scope.findCellars();



  $scope.findWines = function () {
    $scope.wines = Wine.query();
  };



  $scope.findWine = function () {
    $scope.wine = Wine.get({wineId: $stateParams.wineId});
  };

  // $scope.findWine();

var countryBottleData=[];

   $scope.getCountryGraphData = function(){
    var data={user_id:$scope.user._id};
      CustomWine.getCountryGraphData(data).then(function(result) {
      console.log('Country Data-->'+JSON.stringify(result));  
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var data=[];
           data.push(result[key]["country"],result[key]["WineQuantity"]);        
          countryBottleData.push(data);
          
        }
      }

 console.log('Country Data 2-->'+JSON.stringify(countryBottleData));
 creatCountryBottleGraph();
  
      });

    };

    $scope.getCountryGraphData();

    //Varietal Graph Data Controller
    var varietalBottleData=[];
   $scope.getVarietalGraphData = function(){
    var data={user_id:$scope.user._id};
      CustomWine.getVarietalGraphData(data).then(function(result) {
      console.log('Varietal Data-->'+JSON.stringify(result));  
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var data=[];
           data.push(result[key]["varietal"],result[key]["WineQuantity"]);        
          varietalBottleData.push(data);
          
        }
      }

 console.log('Varietal Data 2-->'+JSON.stringify(varietalBottleData));
 creatVarietalBottleGraph();
  
      });

    };

    $scope.getVarietalGraphData();


    //Vertical Graph Data Controller
    var verticalBottleData=[];
   $scope.getVerticalGraphData = function(){
    //var wine_id=$scope.wine_id;
    //alert(wine_id_pass);
    verticalBottleData=[];
    var data={user_id:$scope.user._id,wine_id:$scope.wine_id};
    console.log('Data'+JSON.stringify(data));
      CustomWine.getVerticalGraphData(data).then(function(result) {
      console.log('Vertical Data-->'+JSON.stringify(result)+" "+result.length);  
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var data=[];
           data.push(result[key]["vintage_year"],result[key]["WineQuantity"]);        
          verticalBottleData.push(data);
          
        }
      }

 //console.log('Vertical Data 2-->'+JSON.stringify(verticalBottleData));
 creatVerticalBottleGraph();
  
      });

    };

     $scope.getVintageYearData = function(){
    var data={user_id:$scope.user._id};
   // console.log('Data'+JSON.stringify(data));
    CustomWine.getVintagesGraphData(data).then(function(result) {
   // console.log('Vintages Data-->'+JSON.stringify(result)+" "+result.length);       
    createVintageGraph(result);  
      });

    };

      function createVintageGraph(result)
      {

      var svg = dimple.newSvg("#vintageGraph", 500, 350);    
      svg.append("rect")
      .attr("x", "8px")
      .attr("y", "8px")
      .attr("width", "100%")
      .attr("height", "100%")        
      .style("fill", "#1c222e");

     



      var myChart = new dimple.chart(svg, result);
      myChart.setBounds(20, 20, 400, 300)
      myChart.addMeasureAxis("p", "WineQuantity");
      var ring = myChart.addSeries(["vintage_year","WineQuantity"], dimple.plot.pie);
      ring.innerRadius = "95%";
      var myLegend=myChart.addLegend(400, 90, 90, 300, "left");
      myLegend.verticalPadding = 30;
      myLegend.horizontalPadding = 10;
      myLegend.fontSize = "18";
      myLegend.fillColor="#ffffff";

    

      myChart.defaultColors = [
          new dimple.color("#38b0d5", "#38b0d5", 1), // blue
          new dimple.color("#a9c851", "#a9c851", 1), // red
          new dimple.color("#59bcaa", "#59bcaa", 1), // purple
          new dimple.color("#e67e22", "#d35400", 1), // orange
          new dimple.color("#f1c40f", "#f39c12", 1), // yellow
          new dimple.color("#1abc9c", "#16a085", 1), // turquoise
          new dimple.color("#95a5a6", "#7f8c8d", 1),  // gray
          new dimple.color("#83c379", "#83c379", 1) // green
      ];


      myChart.draw();

      }

      
      $scope.getVintageYearData();

 
 $scope.getRegionGraphData = function(){
   //  $scope.regionBottles=[];
    var data={user_id:$scope.user._id};
      CustomWine.getRegionGraphData(data).then(function(result) {
      console.log("Region "+JSON.stringify(result));  
      for (var key in result) {
        
        if (result.hasOwnProperty(key)) {
        
          var regnBotledata={region:'',bottles:''};          
          
          
           regnBotledata.region=result[key]["region"];
           regnBotledata.bottles=result[key]["WineQuantity"];
           $scope.regionBottles.push(regnBotledata);

        
        
         
          
        }
      }
  
      });

    };

$scope.getRegionGraphData();


    function creatVerticalBottleGraph()
      {
        
            Highcharts.chart('verticalBottleGraph', {
            chart: {
            type: 'column',
            height:'400',
            backgroundColor:'#1c222e'
        },
        title: {
            text: ''
        },
        height:null,
        xAxis: {
            type: 'category',
            labels: {
                rotation: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Bottles'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Wine Bottles <b>{point.y:.0f}</b>'
        },
        series: [{
            name: 'Wine Bottles',
            data: verticalBottleData,
              color: {
            radialGradient: {x1: 0, x2: 1, y1: 0, y2: 1 },
          stops: [
             [0, '#394d00'],
             [1, '#334d00']
            
             ]
            },
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.0f}', // one decimal
                y: 30, // 10 pixels down from the top
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]


    });


    }// End of creatVerticalBottleGraph function





 function creatVarietalBottleGraph()
      {
            Highcharts.chart('varietalBottleGraph', {
            chart: {
            type: 'column',
            backgroundColor:'#1c222e'
        },
        title: {
            text: '',
           

        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'ProximaNovaA-Regular'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Bottles'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Wine Bottles <b>{point.y:.0f}</b>'
        },
        series: [{
            name: 'Wine Bottles',
            data: varietalBottleData,
            color: {
            radialGradient: {x1: 0, x2: 1, y1: 1, y2: 0 },
          stops: [
             [0, '#00394d'],
             [1, '#334d00']
            
             ]
            },
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.0f}', // one decimal
                y: 30, // 10 pixels down from the top
                style: {
                    fontSize: '11px',
                    fontFamily: 'ProximaNovaA-Regular'
                }
            }
        }]


                    });


    }// End of creatVarietalBottleGraph function


      function creatCountryBottleGraph()
      {
            Highcharts.chart('countryBottleGraph', {
            chart: {
            type: 'column',
           backgroundColor:'#1c222e',
           
        },
        title: {
            text: '',
            
        },
        
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'ProximaNovaA-Regular'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Bottles'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Wine Bottles <b>{point.y:.0f}</b>'
        },
        series: [{
            name: 'Wine Bottles',
            data: countryBottleData,
            color: {
            radialGradient: {x1: 0, x2: 1, y1: 1, y2: 0 },
          stops: [
             [0, '#00394d'],
             [1, '#334d00']
            
             ]
            },
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.0f}', // one decimal
                y: 30, // 10 pixels down from the top
                style: {
                    fontSize: '11px',
                    fontFamily: 'ProximaNovaA-Regular'
                }
            }
        }]


                    });


    }// End of createMarketValueGraph function


//=====producer graph

//  producer graph

var producerBottleData=[];
var producerNameData=[];


   $scope.getProducerGraphData = function(){
   //  $scope.regionBottles=[];
    var data={user_id:$scope.user._id};
      CustomWine.getProducerGraphData(data).then(function(result) {
      console.log(JSON.stringify(result));  
      for (var key in result) {
        
        if (result.hasOwnProperty(key)) {
          var data=[],datap=[];
         
           
           datap.push(result[key]["producer"]);  
           data.push(result[key]["WineQuantity"]);         
          

          producerBottleData.push(data);
          producerNameData.push(datap);
          
      
        
         
          
        }
      }
console.log("producer name")
 console.log(producerNameData);
 creatProducerBottleGraph(); 
  
      });

    };

    $scope.getProducerGraphData();

//  $scope.getRegionGraphData = function(){
//    //  $scope.regionBottles=[];
//     var data={user_id:$scope.user._id};
//       CustomWine.getRegionGraphData(data).then(function(result) {
//       console.log("Region "+JSON.stringify(result));  
//       for (var key in result) {
        
//         if (result.hasOwnProperty(key)) {
        
//           var regnBotledata={region:'',bottles:''};          
          
          
//            regnBotledata.region=result[key]["region"];
//            regnBotledata.bottles=result[key]["WineQuantity"];
//            $scope.regionBottles.push(regnBotledata);

        
        
         
          
//         }
//       }
  
//       });

//     };

// $scope.getRegionGraphData();

function creatProducerBottleGraph()
      {
            Highcharts.chart('producerBottleGraph', {
               chart: {           
            backgroundColor:'#1c222e'
        },
           
       title: {
            text: '',
          
          
        },        
        xAxis: {
           type: 'category',
            categories:producerNameData,
             
             labels: {
                rotation: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'ProximaNovaA-Regular'
                }
            }
            
        },
        yAxis: {
           
                lineColor: '#121e11',
           
            title: {
                text: 'Bottles'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#ffffff'
            }]
        },
        tooltip: {
            
             pointFormat: 'Bottles <b>{point.y:.0f}</b>'
        },
        legend: {
          enabled:false
        },
        series: [{
            name: 'Top producer',
            data: producerBottleData,
            zones: [{
   value: 0,
   color: '#f7a35c'
}, {
   value: 40,
   color: '#29a330'
}, {
   color: '#F2C20D'
}]

           }]



                    });


    }


    $scope.max1=100;
    $scope.current1=50;












lookForCountryGraphs();



function lookForCountryGraphs()
{
  Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Unica+One',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#1c222e'],
            [1, '#1c222e']
         ]
      },
      style: {
         fontFamily: "'Verdana', sans-serif"
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '16px'
      }
   },
   
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
}

}
])
.directive('fixedHeader', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                tableHeight: '@'
            },
            link: function ($scope, $elem, $attrs, $ctrl) {
                function isVisible(el) {
                    var style = window.getComputedStyle(el);
                    return (style.display != 'none' && el.offsetWidth !=0 );
                }

                function isTableReady() {
                    return isVisible(elem.querySelector("tbody")) && elem.querySelector('tbody tr:first-child') != null;
                }

                var elem = $elem[0];
                // wait for content to load into table and to have at least one row, tdElems could be empty at the time of execution if td are created asynchronously (eg ng-repeat with promise)
                var unbindWatch = $scope.$watch(isTableReady,
                    function (newValue, oldValue) {
                        if (newValue === true) {
                            // reset display styles so column widths are correct when measured below
                            angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '')

                            // wrap in $timeout to give table a chance to finish rendering
                            $timeout(function () {
                                // set widths of columns
                                angular.forEach(elem.querySelectorAll('tr:first-child th'), function (thElem, i) {

                                    var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                                    var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');


                                    var columnWidth = tdElems ? tdElems.offsetWidth : thElem.offsetWidth;
                                    if(tdElems) {
                                        tdElems.style.width = columnWidth + 'px';
                                    }
                                    if(thElem) {
                                        thElem.style.width = columnWidth + 'px';
                                    }
                                    if (tfElems) {
                                        tfElems.style.width = columnWidth + 'px';
                                    }
                                });

                                // set css styles on thead and tbody
                                angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block')

                                angular.element(elem.querySelectorAll('tbody')).css({
                                    'display': 'block',
                                    'height': $scope.tableHeight || '280px',
                                    'overflow': 'auto'
                                });


                                // reduce width of last column by width of scrollbar
                                var tbody = elem.querySelector('tbody');
                                var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;
                                if (scrollBarWidth > 0) {
                                    // for some reason trimming the width by 2px lines everything up better
                                    scrollBarWidth -= 2;
                                    var lastColumn = elem.querySelector('tbody tr:first-child td:last-child');
                                    lastColumn.style.width = (lastColumn.offsetWidth - scrollBarWidth) + 'px';
                                }
                            });

                            //we only need to watch once
                            unbindWatch();
                        }
                    });
            }
        };
    }])
.filter('setDecimal', function ($filter) {
  return function (input, places) {
    if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
      };
    });
