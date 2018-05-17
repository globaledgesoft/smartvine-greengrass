var myModule = angular.module("greengrassApp",[]);
myModule.controller("greengrassController",function($scope,$timeout){
$scope.imagesToLoad = ['Asset 1','Asset 2','Asset 3','Asset 4','Asset 5','Asset 6','Asset 7', 'Asset 8','Asset 9'];
      $scope.colorsToLoad = ['#ffffff','#642f6c','#00b3b3','#ffb84d','#dbb8e0','#b3ecff','#ffd699'];
      $scope.viewToLoad = ['main','info'];
      $scope.opacityToLoad = ['0.5','0.7','1'];
      $scope.backgroundImageToLoad = ['frost-light','frost-medium','rain-light','rain-medium'];
      $scope.purpleImageInfoToLoad = ['Frost conditions detected.','Edge gateway using AWS Greengrass  runs local Lambda functions and  triggers immediate action.','Fans activated.']
      $scope.blueImageInfoToLoad = ['Drought conditions detected.','Edge gateway using AWS Greengrass  runs local Lambda functions and  triggers immediate action.','Irrigation activated.',
    'High moisture conditions detected.','Edge gateway using AWS Greengrass  runs local Lambda functions and  triggers immediate action.','Irrigation suspended.']
     $scope.yellowImageInfoToLoad = ['High UV conditions detected.','Edge gateway using AWS Greengrass runs local Lambda functions to record growth conditions and creates trend analytics.','Data analysis transmitted to cloud  in scheduled reporting period.']
    $scope.loadThings = function(view, bgColor, opacity,ImageUrl,ImageInfo,BackImage){
    //check the view
        if (view=='main') {
          $scope.container = true;
          $scope.infoScreen = false;
          //$scope.loadChart();
          $('body ').css('background-color','#ffffff');
        }else{
          // console.log(bgColor);
          
          $scope.container = false;
          $scope.infoScreen = true;
          $('body').css('background-color',bgColor);
          // $('body').css('background-image',BackImage);
          $scope.loadInfoScreen(ImageUrl,ImageInfo,BackImage);
           console.log(BackImage);
        // console.log(ImageUrl);
        }
    //add the color to the body
        $('body').css('background-color',bgColor);        
        //add the opacity to the body
        $('body').css('opacity',opacity);
       // $('body').css('background-image',BackImage);

  }
    $scope.loadAnimation = function(className){
    /*$('body').removeClass().addClass(className + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
          });*/
          //$("body div").fadeOut();
          $("body").fadeIn();
          //$("body div").animate({background-color:#642f6c});
          //$("body div").animate({background: "#642f6c"});
          
        }
        $scope.loadInfoScreen = function(url,info,backimage){
          $scope.currentImageUrl = url;
          $scope.currentImageInfo = info;
          $scope.currentBackImage = backimage;
         
        }

function createHighChart(chartId,chartTitle,yAxisParameterName,graphColor,graphData) {
        // body...
        Highcharts.chart(chartId, {
        chart: {
                        type: 'area',
                        height: 300,
                     width: 300,
                     backgroundColor: "rgba(255, 255, 255, 0)"
        },
        credits :{
                  enabled : false
              },

        xAxis:  {
                 text: 'time',
                
                       time: [0,1,2,3,4,5,6,7,8,10],
                       lineColor:'transparent'
                     },
        title : {
                         text : chartTitle,
                         default : null,
                         color: graphColor
                         },

            yAxis : {
                       title: {
                    text: yAxisParameterName

                            },

                           gridLineWidth: 0,
                               minorGridLineWidth: 0,
                        lineWidth: 1,
                        lineColor: 'transparent'
                      },

        plotOptions: {
            series: {

                    color: graphColor  
                
            }
        },
        tooltip: {
            backgroundColor: {
                linearGradient: [0, 0, 0, 60],
                stops: [
                    [0, '#FFFFFF'],
                    [1, '#E0E0E0']
                ]
            },
            borderWidth: 1,
            borderColor: '#AAA'
        },

        series : [
                       {
                          name: 'Time',
                          marker: {
                             symbol: 'round'
                          },
                          data: graphData,

                       }
                       
                    ]   
    });
        }
      //var moistureChartXAxisData = [0,1,2,3,4,5,6,7,8,10];
        var moistureChartData = [ 0,1.5,2,1,3,3.5,5,4,6,9,0];
        var tempChartData = [0,1,1.5,5,3,6,4.5,5,4.5,3,0];
        var lightChartData = [ 0,1.5,2,3,4,4.5,4.5,3,2,1,0];
          createHighChart('moisture_chart','Moisture','Moisture level','#00cccc',moistureChartData);
        createHighChart('temp_chart','Temperature','Temperature level(c)','#cc00ff',tempChartData);
        createHighChart('light_chart','Light','UV Index','#c6a23d',lightChartData);

    //pei chart//
  Highcharts.setOptions({
     colors: [ '#cc00ff','#00cccc']
    });
     $(document).ready(function() {
            var chart = {
             height: 280,
             width: 280,
            backgroundColor: "rgba(255, 255, 255, 0)",
               plotBackgroundColor: null,
               plotBorderWidth: 0,
               plotShadow: false
            };
         var legend = {
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 0
    };
              var title =  {
        text: 'Data Savings',
    };       
            var tooltip = {
               pointFormat: '{}: <b>{point.percentage:.1f}%</b>',
               color: 'red'

   
            };
            var plotOptions = {
               pie: {
                  allowPointSelect: true,
                cursor: 'pointer',
                  dataLabels: {
                     enabled: false,
                     distance: -50,
                     
                     style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                     }
                  },
                   showInLegend: true,
                  startAngle: -180,
                  endAngle: 180,
                  center: ['25%', '50%']
               }
            };
            var colors ={
                defaults: undefined
            };
            var series = [{
               type: 'pie',
     
               innerSize: '50%',
               data: [
                  /*['',   90],
                  ['', 180],*/
                  
                  {
                     name: 'Sent to Cloud',
                     y: 0.7,
                     dataLabels: {
                        enabled: false
                     }
                  },
                  {
                     name: 'Processed Locally',
                     y: 0.3,
                     dataLabels: {
                        enabled: false
                     }
                  },
                 
               ]
            }];
            var credits = {
               enabled : false

            };    
      
            var json = {};
            json.legend = legend;
            json.colors = colors;   
             json.chart = chart;
             json.title = title;     
             json.credits = credits;
            json.tooltip = tooltip;  
            json.series = series;
            json.plotOptions = plotOptions;
            $('#pei_chart').highcharts(json);  
         });

//stack chart//
function bar_chart(argument){
  Highcharts.chart('processing',{
      chart: {
            type: 'bar',
             height: 260,
                 width: 260,
                 backgroundColor: "rgba(255, 255, 255, 0)"
        },
        title: {
            text: 'Edge Computing'
        },
        
        xAxis: {
            categories: ['Sent to cloud', 'ProcessedLocally'],
            title: {
                text: null
            },
            labels: {
                x : 25,
                y : -25,
                align: 'left'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Processing Time(Hours)'

                

            },
            labels: {
                overflow: 'justify'
            }
        },
       
        plotOptions: {
          series: {
              pointWidth:10//width of the column bars irrespective of the chart size
          },
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
         
            data: [{y: 5,color: '#cc00ff'},{y: 10,color: '#00cccc'}]
        }]

  });
}
bar_chart();

//wether report//


function progress(argument) {
      Highcharts.chart('progress_wether', {
         chart :{
                   
             height: 160,
             width: 250,
              backgroundColor: "rgba(255, 255, 255, 0)",
             
               plotBackgroundColor: null,
               plotBorderWidth: 0,
               plotShadow: false
 
      
               },
               title: {
                        text: 'Water Savings',
                       },   
      tooltip : {
               pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
             plotOptions : {
               pie: {
                  dataLabels: {
                     enabled: true,
                     distance: -50,
                     
                
                  },
                  startAngle: -180,
                  endAngle: 180,
                  center: ['25%', '50%']
               }
            },
            series :[{
               type: 'pie',
     
               innerSize: '87%',
               data: [
                  ['',   95],
                  ['', 176.5]
               ]
            }],
             credits : {
               enabled : false

            },

},                                       
    function(chart) { // on complete
        var textX = chart.plotLeft + (chart.series[0].center[0]);
        var textY = chart.plotTop  + (chart.series[0].center[1]);

        var span = '<span id="pieChartInfoText" style="position:absolute; text-align:center;">';
        span += '<span style="font-size: 18px">65%</span><br>';
        
        span += '</span>';

        $(".addText").append(span);
        span = $('#pieChartInfoText');
        span.css('left', textX + (span.width() * -1));
       
    });
   };   
  progress();

 $scope.loadChart(currentLangDataChart);
 $scope.loadAnimation('fadeIn');
        $scope.loadThings($scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
         // $scope.loadThings('main', '#642f6c', '0.7');
        $timeout($scope.loadAnimation,1000,true,'fadeIn');
        $timeout($scope.loadThings,1000,true,$scope.viewToLoad[0], $scope.colorsToLoad[4], $scope.opacityToLoad[1]);
        $timeout($scope.loadAnimation,2000,true,'fadeIn');
        $timeout($scope.loadThings,2000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[0],'','','images/'+ $scope.backgroundImageToLoad[0]+'.png');        
        $timeout($scope.loadAnimation,3000,true,'fadeIn');
        $timeout($scope.loadThings,3000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[0]+'.png','','images/'+ $scope.backgroundImageToLoad[1]+'.png');
        $timeout($scope.loadAnimation,4000,true,'fadeIn');
        $timeout($scope.loadThings,4000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[0]+'.png',$scope.purpleImageInfoToLoad[0],'images/'+ $scope.backgroundImageToLoad[1]+'.png');
        $timeout($scope.loadAnimation,5000,true,'fadeIn');
        $timeout($scope.loadThings,5000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[1]+'.png','','images/'+ $scope.backgroundImageToLoad[1]+'.png');
        $timeout($scope.loadAnimation,6000,true,'fadeIn');
        $timeout($scope.loadThings,6000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[1]+'.png',$scope.purpleImageInfoToLoad[1],'images/'+ $scope.backgroundImageToLoad[1]+'.png');
        $timeout($scope.loadAnimation,7000,true,'fadeIn');
        $timeout($scope.loadThings,7000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[2]+'.png','','images/'+ $scope.backgroundImageToLoad[0]+'.png');
        $timeout($scope.loadAnimation,8000,true,'fadeIn');
        $timeout($scope.loadThings,8000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[2]+'.png',$scope.purpleImageInfoToLoad[2],'images/'+ $scope.backgroundImageToLoad[0]+'.png');
        $timeout($scope.loadAnimation,9000,true,'fadeIn');
        $timeout($scope.loadThings,9000,true,$scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,10000,true,'fadeIn');
        $timeout($scope.loadThings,10000,true,$scope.viewToLoad[0], $scope.colorsToLoad[4], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,11000,true,'fadeIn');
        $timeout($scope.loadThings,11000,true,$scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,12000,true,'fadeIn');
        $timeout($scope.loadThings,12000,true,$scope.viewToLoad[0], $scope.colorsToLoad[5], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,13000,true,'fadeIn');
        $timeout($scope.loadThings,13000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,14000,true,'fadeIn');
        $timeout($scope.loadThings,14000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[3]+'.png','');
        $timeout($scope.loadAnimation,15000,true,'fadeIn');
        $timeout($scope.loadThings,15000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[3]+'.png',$scope.blueImageInfoToLoad[0]);
        $timeout($scope.loadAnimation,16000,true,'fadeIn');
        $timeout($scope.loadThings,16000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[4]+'.png','');
        $timeout($scope.loadAnimation,17000,true,'fadeIn');
        $timeout($scope.loadThings,17000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[4]+'.png',$scope.blueImageInfoToLoad[1]);
        $timeout($scope.loadAnimation,18000,true,'fadeIn');
        $timeout($scope.loadThings,18000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[5]+'.png','');
        $timeout($scope.loadAnimation,19000,true,'fadeIn');
        $timeout($scope.loadThings,19000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[5]+'.png',$scope.blueImageInfoToLoad[2]);
        $timeout($scope.loadAnimation,20000,true,'fadeIn');
        $timeout($scope.loadThings,20000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,21000,true,'fadeIn');
        $timeout($scope.loadThings,21000,true,$scope.viewToLoad[0], $scope.colorsToLoad[5], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation,22000,true,'fadeIn');
        $timeout($scope.loadThings,22000,true,$scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,23000,true,'fadeIn');
        $timeout($scope.loadThings,23000,true,$scope.viewToLoad[0], $scope.colorsToLoad[5], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation,24000,true,'fadeIn');
        $timeout($scope.loadThings,24000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,25000,true,'fadeIn');
        $timeout($scope.loadThings,25000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[5]+'.png','','images/'+ $scope.backgroundImageToLoad[2]+'.png');
        $timeout($scope.loadAnimation,26000,true,'fadeIn');
        $timeout($scope.loadThings,26000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[5]+'.png',$scope.blueImageInfoToLoad[3],'images/'+ $scope.backgroundImageToLoad[3]+'.png');
        $timeout($scope.loadAnimation,27000,true,'fadeIn');
        $timeout($scope.loadThings,27000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[4]+'.png','','images/'+ $scope.backgroundImageToLoad[3]+'.png');
        $timeout($scope.loadAnimation,28000,true,'fadeIn');
        $timeout($scope.loadThings,28000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[4]+'.png',$scope.blueImageInfoToLoad[4],'images/'+ $scope.backgroundImageToLoad[3]+'.png');
        $timeout($scope.loadAnimation,29000,true,'fadeIn');
        $timeout($scope.loadThings,29000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[5]+'.png','','images/'+ $scope.backgroundImageToLoad[3]+'.png');
        $timeout($scope.loadAnimation,30000,true,'fadeIn');
        $timeout($scope.loadThings,30000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[5]+'.png',$scope.blueImageInfoToLoad[5],'images/'+ $scope.backgroundImageToLoad[2]+'.png');
        $timeout($scope.loadAnimation,31000,true,'fadeIn');
        $timeout($scope.loadThings,31000,true,$scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,3200,true,'fadeIn');
        $timeout($scope.loadThings,32000,true,$scope.viewToLoad[0], $scope.colorsToLoad[5], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation,33000,true,'fadeIn');
        $timeout($scope.loadThings,33000,true,$scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation,34000,true,'fadeIn');
        $timeout($scope.loadThings,34000,true,$scope.viewToLoad[0], $scope.colorsToLoad[6], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation,35000,true,'fadeIn');
        $timeout($scope.loadThings,35000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation,36000,true,'fadeIn');
        $timeout($scope.loadThings,36000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[6]+'.png','');
        $timeout($scope.loadAnimation,37000,true,'fadeIn');
        $timeout($scope.loadThings,37000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[6]+'.png',$scope.yellowImageInfoToLoad[0]);
        $timeout($scope.loadAnimation,38000,true,'fadeIn');
        $timeout($scope.loadThings,38000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[7]+'.png','');
        $timeout($scope.loadAnimation,39000,true,'fadeIn');
        $timeout($scope.loadThings,39000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[7]+'.png',$scope.yellowImageInfoToLoad[1]);
        $timeout($scope.loadAnimation,40000,true,'fadeIn');
        $timeout($scope.loadThings,40000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[8]+'.png','');
        $timeout($scope.loadAnimation,41000,true,'fadeIn');
        $timeout($scope.loadThings,41000,true,$scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2],'images/'+$scope.imagesToLoad[8]+'.png',$scope.yellowImageInfoToLoad[2]);
        $timeout($scope.loadAnimation,42000,true,'fadeIn');
        $timeout($scope.loadThings,42000,true,$scope.viewToLoad[0], $scope.colorsToLoad[6], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation,43000,true,'fadeIn');
        $timeout($scope.loadThings,43000,true,$scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
      
    });