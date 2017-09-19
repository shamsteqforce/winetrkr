'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus','$uibModal', '$timeout', 'Country','CustomWine',
  function ($scope, $state, Authentication, Menus, $uibModal, $timeout, Country,CustomWine) {
  // Expose view variables
  $scope.$state = $state;
  $scope.authentication = Authentication;
  $scope.user = Authentication.user;
 var $window = $(window),
       $stickyEl = $('#header_wrap'),
       elTop = $stickyEl.offset().top;

   $window.scroll(function() {
        $stickyEl.toggleClass('sticky', $window.scrollTop() > elTop);
    });


  $scope.userSetting = function(){
    $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'userSetting.html',
      controller: 'SettingsController',
      scope: $scope,
      resolve: {
        countries: function(){
          return Country.query();
        }
      }
    });
  };

  $scope.userSubscription = function(){
    $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'userSubscription.html',
      controller: 'SubscriptionController',
      scope: $scope
    });
  };


 $scope.marketValue1="0";
  $scope.marketValue = function(){
   // alert('test');
    var data={user_id:$scope.user._id,user_currency:$scope.user.currency_code};
      CustomWine.getAverageWinePrice(data).then(function(result) {
        $scope.marketValue1 = result.price;
        console.log(result);        
        
      });

    };
$scope.marketValue();

var avg_market_price_chart=[49.9, 71.5, 106.4, 129.2, 144.0, 176.0];
var avg_bottles_chart=[2,3,4,5,6,7];
var months_chart=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var month_avgPrice = [];
var month_avgBottle = [];

var monthforChart=[];
var avgPriceforChart=[];
var avgBottleforChart=[];


 
   $scope.getAverageWinePriceMonthWise = function(){
    var data={user_id:$scope.user._id};
      CustomWine.getAverageWinePriceMonthWise(data).then(function(result) {
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var monthNum = parseInt(result[key]["_id"].substr(5, 7))-1;  
          var res=monthNames[monthNum];
          month_avgPrice.push({monthNum: monthNum,month: res, price: parseInt(result[key]["Average_Price"])});
          monthforChart.push(res);
          avgPriceforChart.push(parseInt(result[key]["Average_Price"]));
        }
      }


/*
      month_avgPrice.sort(function(a, b){
 return a.monthNum-b.monthNum
    });

        //avgPriceforChart.reverse();
        //monthforChart.reverse();
       
        console.log('result-->'+JSON.stringify(result));
        //console.log('result price month wise-->'+JSON.stringify(month_avgPrice));  
         /*
        
        console.log('result-->'+JSON.stringify(monthforChart)); 
        console.log('result-->'+JSON.stringify(avgPriceforChart));
*/
        //createMarketValueGraph();        
      });

    };

    $scope.getAverageWinePriceMonthWise();


    $scope.getAverageWineBottleMonthWise = function(){
    var data={user_id:$scope.user._id};
      CustomWine.getAverageWineBottleMonthWise(data).then(function(result) {
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var monthNum = parseInt(result[key]["_id"].substr(5, 7))-1;  
          var res=monthNames[monthNum];
          month_avgBottle.push({monthNum: monthNum,month: res, quantity: parseInt(result[key]["Average_Quantity"])});
          //monthforChart.push(res);
          avgBottleforChart.push(parseInt(result[key]["Average_Quantity"]));
        }
      }


    /*  month_avgBottle.sort(function(a, b){
 return a.monthNum-b.monthNum
    });

     month_avgPrice.forEach(function (item) {
         monthforChart.push(item["month"]);
         avgPriceforChart.push(item["price"]);
   
});

      month_avgBottle.forEach(function (item) {
         //monthforChart.push(item["month"]);
         avgBottleforChart.push(item["quantity"]);
   
});

*/

        //avgBottleforChart.reverse();
        //monthforChart.reverse();
        //console.log('result-->'+JSON.stringify(result));
        //console.log('result Bottle month wise-->'+JSON.stringify(month_avgBottle));  
        //console.log('result122-->'+JSON.stringify(monthforChart));  
        //console.log('result-->'+JSON.stringify(avgPriceforChart));
        //console.log('result-->'+JSON.stringify(avgBottleforChart));
        createMarketValueGraph();        
      });

    };

    $scope.getAverageWineBottleMonthWise();

    

   lookForMarketValue();

    function createMarketValueGraph()
    {
            Highcharts.chart('container', {
            chart: {
                        zoomType: 'xy',
                       backgroundColor:'#1c222e'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: [{
                        categories: monthforChart,
                        crosshair: true
                    }],
                    yAxis: [{ // Primary yAxis
                        gridLineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                        labels: {
                            format: '{value} bottles',
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        title: {
                            text: 'Wine Bottle',
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        }
                    }, { // Secondary yAxis
                        gridLineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                        title: {
                            text: 'Wine Market Value',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        labels: {
                            format: '$ {value}',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 100,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    series: [{
                        name: 'Wine Bottle',
                        type: 'spline',
                        //yAxis: 1,
                        data: avgBottleforChart,
                        tooltip: {
                            valueSuffix: 'bottles'
                        }

                    }, {
                        name: 'Wine Market Value',
                        type: 'areaspline',
                        //type: 'spline',
                         yAxis: 1,
                        data: avgPriceforChart,
                        tooltip: {
                            valueSuffix: '$'
                        }
                    }]


                    });


    }// End of createMarketValueGraph function


    // Load the fonts

 function lookForMarketValue()
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
            [0, '#4c798e'],
            [1, '#000']
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
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
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

$scope.getExpenditure = function () {
      CustomWine.getExpenditure().then(function(result){
        
        $scope.expenditure = result[0];
         
      })
    };
    $scope.getExpenditure();






  $scope.dropdown = function(){
    $(function(){
      $('.dropdown').hover(function() {
        $(this).addClass('open');
      },
      function() {
        $(this).removeClass('open');
      });
    });
  };

  $timeout(function(){
    $scope.dropdown();
  }, 500);

}
]);



