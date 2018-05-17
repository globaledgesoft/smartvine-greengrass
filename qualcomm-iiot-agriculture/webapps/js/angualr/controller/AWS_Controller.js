var myModule = angular.module("greengrassApp", []);
var urlLocation = window.location.href;
urlLocation = urlLocation.split("/");
var socketUrlAddress = urlLocation[0] + "//" + urlLocation[2];
myModule.controller("greengrassController", function($scope, $timeout, getDetails) {
    $scope.imagesToLoad = ['Asset 1', 'Asset 2', 'Asset 3', 'Asset 4', 'Asset 5', 'Asset 6', 'Asset 7', 'Asset 8', 'Asset 9'];
    $scope.colorsToLoad = ['#ffffff', '#3253dc', '#7ba0ff', '#6fb59f', '#7ba0ff', '#b3ecff', '#ffd699', '#a2baf9', '#c9d3ef', '#81eabe'];
    $scope.viewToLoad = ['main', 'info'];
    $scope.opacityToLoad = ['0.5', '0.7', '1'];
    $scope.backgroundImageToLoad = ['frost-light', 'frost-medium', 'rain-light', 'rain-medium'];
    $scope.availLangs = [{ 'name': 'English', 'val': 'en', 'label': 'Select Language' }, { 'name': '中文', 'val': 'mnd', 'label': '选择语言' }, { 'name': 'Português', 'val': 'por', 'label': 'Selecione o idioma ' }];
    $scope.currentLang = $scope.availLangs[0];
    $scope.langOpt = true;
    /*['Drought conditions detected.','Edge gateway using AWS Greengrass  runs local Lambda functions and  triggers immediate action.','Irrigation activated.',
        'High moisture conditions detected.','Edge gateway using AWS Greengrass  runs local Lambda functions and  triggers immediate action.','Irrigation suspended.']*/
    /* ['High UV conditions detected.','Edge gateway using AWS Greengrass runs local Lambda functions to record growth conditions and creates trend analytics.','Data analysis transmitted to cloud  in scheduled reporting period.']*/
    $scope.loadThings = function(view, bgColor, opacity, ImageUrl, ImageInfo, BackImage) {
        //check the view
        if (view == 'main') {
            $scope.container = true;
            $scope.infoScreen = false;
            //$scope.loadChart();
            $('body ').css('background-color', '#ffffff');
        } else {
            // console.log(bgColor);

            $scope.container = false;
            $scope.infoScreen = true;
            $('body').css('background-color', bgColor);
            // $('body').css('background-image',BackImage);
            $scope.loadInfoScreen(ImageUrl, ImageInfo, BackImage);
            console.log(BackImage);
            // console.log(ImageUrl);
        }
        //add the color to the body
        $('body').css('background-color', bgColor);
        //add the opacity to the body
        $('body').css('opacity', opacity);
        // $('body').css('background-image',BackImage);

    };
    var socket = io.connect(socketUrlAddress, function(data) {
        console.log("connection created");
    });
    $scope.loadAnimation = function(className) {
        /*$('body').removeClass().addClass(className + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass();
              });*/
        //$("body div").fadeOut();
        $("body").fadeIn();
        //$("body div").animate({background-color:#642f6c});
        //$("body div").animate({background: "#642f6c"});

    };
    $scope.loadInfoScreen = function(url, info, backimage) {
        $scope.currentImageUrl = url;
        $scope.currentImageInfo = info;
        $scope.currentBackImage = '';

    };

    function createHighChart(chartId, graphColor, yGraphData, xGraphData, areaChartLang) {
        console.log(areaChartLang);
        console.log(xGraphData);
        // body...
        Highcharts.chart(chartId, {
            chart: {
                type: 'area',
                height: 300,
                width: 300,
                backgroundColor: "rgba(255, 255, 255, 0)"
            },
            credits: {
                enabled: false
            },
            title: {
                text: areaChartLang.heading,
                /* chartTitle*/
                default: null,
                color: graphColor
            },

            xAxis: {
                categories: yGraphData,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                lineWidth: 0,
                tickInterval: 5
            },
            yAxis: {
                title: {
                    enabled: true,
                    text: '<strong>' + areaChartLang.yAxis + '</strong>'
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                lineWidth: 0
            },

            plotOptions: {
                series: {
                    stacking: 'normal',
                    color: graphColor
                }
            },

            series: [{
                name: areaChartLang.xAxis,
                data: xGraphData
            }]
        });
    }



    //pei chart//

    function createPieChart(peiChartLang) {
        // console.log("heading"+peiChartLang.heading);
        var chart = {
            height: 280,
            width: 300,
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


        var title = {
            text: peiChartLang.heading
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
        var colors = {
            defaults: undefined
        };
        var series = [{
            type: 'pie',

            innerSize: '50%',
            data: [
                /*['',   90],
                ['', 180],*/

                {
                    name: peiChartLang.name[0].item,
                    y: 0.04,
                    dataLabels: {
                        enabled: false
                    }
                },
                {
                    name: peiChartLang.name[1].item,
                    y: 0.96,
                    dataLabels: {
                        enabled: false
                    }
                },

            ]
        }];
        var credits = {
            enabled: false

        };
        Highcharts.setOptions({
            colors: ['#6fb59f', '#3253dc']
        });
        var json = {};
        json.legend = legend;
        json.colors = colors;
        json.chart = chart;
        json.title = title;
        json.credits = credits;
        json.tooltip = tooltip;
        json.series = series;
        json.plotOptions = plotOptions;
        $('#pie_chart').highcharts(json);
    };



    //stack chart//
    function bar_chart(barChartLang) {
        // console.log('name ' + barChartLang.item[0]);
        Highcharts.chart('processing', {
            chart: {
                type: 'bar',
                height: 280,
                width: 260,
                backgroundColor: "rgba(255, 255, 255, 0)"
            },
            title: {
                text: barChartLang.heading /*'Edge Computing'*/
            },

            xAxis: {
                categories: [barChartLang.name[0].item, barChartLang.name[1].item],
                // title: {
                //     text: null
                // },
                labels: {
                    x: 25,
                    y: -25,
                    align: 'left'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: barChartLang.yAxis /*'Processing Time(Hours)'*/


                },
                labels: {
                    overflow: 'justify'
                }
            },

            plotOptions: {
                series: {
                    pointWidth: 10 //width of the column bars irrespective of the chart size
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

                data: [{ y: 966, color: '#6fb59f' }, { y: 150, color: '#3253dc' }]
            }]

        });
    }


    //wether report//


    function progress(processChartLang) {
        Highcharts.chart('progress_weather', {
                chart: {

                    height: 160,
                    width: 250,
                    backgroundColor: "rgba(255, 255, 255, 0)",

                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false


                },
                title: {
                    text: processChartLang.heading
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
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
                series: [{
                    type: 'pie',
                    colors: ['#e6f2ee', '#6fb59f'],
                    innerSize: '87%',
                    data: [
                        ['', 95],
                        ['', 176.5]
                    ]
                }],
                credits: {
                    enabled: false

                },

            },

            function(chart) { // on complete
                var textX = chart.plotLeft + (chart.series[0].center[0]);
                var textY = chart.plotTop + (chart.series[0].center[1]);

                var span = '<span id="pieChartInfoText">';
                span += '<span style="font-size: 18px">65%</span><br>';

                span += '</span>';
                console.log(span);
                $("#progress_weather").append(span);
                span = $('#pieChartInfoText');
                //span.css('left', textX + (span.width() * -1));

            });
    };
    $scope.hideLangDiv = function() {
        $scope.langOpt = false;
    };
    $scope.showLangDiv = function() {
        $scope.langOpt = true;
    };

    // $scope.loadChart(currentLangDataChart);
    $scope.loadAnimation('fadeIn');
    $scope.loadThings($scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
    $scope.loadPieLegend = function() {
        // please note, 
        // that IE11 now returns undefined again for window.chrome
        // and new Opera 30 outputs true for window.chrome
        // and new IE Edge outputs to true now for window.chrome
        // and if not iOS Chrome check
        // so use the below updated condition
        var isChromium = window.chrome,
            winNav = window.navigator,
            vendorName = winNav.vendor,
            isOpera = winNav.userAgent.indexOf("OPR") > -1,
            isIEedge = winNav.userAgent.indexOf("Edge") > -1,
            isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome) {
            //console.log('is Google Chrome on IOS');
            //alert('is Google Chrome on IOS');
        } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
            console.log('is Google Chrome');
            //alert('is Google Chrome');
            $('#pie_chart div svg .highcharts-legend g g .highcharts-color-0').attr('transform', 'translate(-10,17)');
            $('#pie_chart div svg .highcharts-legend g g .highcharts-color-1').attr('transform', 'translate(90,17)');
        } else {
            //console.log('not Google Chrome');
            //alert('not Google Chrome');
            $('#pie_chart div svg .highcharts-legend g g .highcharts-color-0').attr('transform', 'translate(-80,17)');
            $('#pie_chart div svg .highcharts-legend g g .highcharts-color-1').attr('transform', 'translate(40,17)');
        }

    };
    $scope.loadCenterAlignedLabels = function() {
        $('#temp_chart div svg > text , #moisture_chart div svg > text , #light_chart div svg > text').attr('x', '175');
        $('#progress_weather div svg g.highcharts-series-group g.highcharts-tracker').attr('transform', 'translate(55,47) scale(1 1)');
    };
    $scope.loadEdgeLegend = function() {
        $('#processing div svg .highcharts-yaxis text').attr('y', '270');
        $('#pie_chart div svg text.highcharts-title').attr('x', '145');
    };
    $scope.loadEdgeLegendForPor = function() {
        //$('#processing div svg .highcharts-yaxis text').attr('y', '270');
        $('#pie_chart div svg text.highcharts-title').attr('x', '180');
        $('#pie_chart div svg .highcharts-legend g g .highcharts-color-0').attr('transform', 'translate(-70,17)');
        $('#pie_chart div svg .highcharts-legend g g .highcharts-color-1').attr('transform', 'translate(70,17)');
    };
    $scope.changeLang = function() {
        $scope.langLabel = $scope.currentLang.label;
        console.log($scope.currentLang);
        if ($scope.currentLang.val == 'en') {
            purpleInfoLang = langSet[0].en1;
            blueInfolang = langSet[0].en2;
            yellowInfolang = langSet[0].en3;
            areaChart1Lang = langChart[0].en[0];
            areaChart2Lang = langChart[0].en[1];
            areaChart3Lang = langChart[0].en[2];
            peiChartLang = langChart[0].en[3];
            barChartLang = langChart[0].en[4];
            processChartLang = langChart[0].en[5];
            weatherInfo = langSet[0].en4[0];
            $timeout($scope.loadPieLegend, 500, true);
            $timeout($scope.loadEdgeLegend, 2000, true);

        }
        if ($scope.currentLang.val == 'mnd') {
            purpleInfoLang = langSet[1].mnd1;
            blueInfolang = langSet[1].mnd2;
            yellowInfolang = langSet[1].mnd3;
            areaChart1Lang = langChart[1].mnd[0];
            areaChart2Lang = langChart[1].mnd[1];
            areaChart3Lang = langChart[1].mnd[2];
            peiChartLang = langChart[1].mnd[3];
            barChartLang = langChart[1].mnd[4];
            processChartLang = langChart[1].mnd[5];
            weatherInfo = langSet[1].mnd4[0];
            $timeout($scope.loadEdgeLegend, 2000, true);
        }
        if ($scope.currentLang.val == 'por') {
            purpleInfoLang = langSet[2].por1;
            blueInfolang = langSet[2].por2;
            yellowInfolang = langSet[2].por3;
            areaChart1Lang = langChart[2].por[0];
            areaChart2Lang = langChart[2].por[1];
            areaChart3Lang = langChart[2].por[2];
            peiChartLang = langChart[2].por[3];
            barChartLang = langChart[2].por[4];
            processChartLang = langChart[2].por[5];
            weatherInfo = langSet[2].por4[0];
            $timeout($scope.loadPieLegend, 500, true);
            $timeout($scope.loadEdgeLegendForPor, 500, true);
        }
        $scope.purpleImageInfoToLoad = purpleInfoLang;
        $scope.blueImageInfoToLoad = blueInfolang;
        $scope.weather = weatherInfo;
        $scope.yellowImageInfoToLoad = yellowInfolang;
        console.log($scope.blueImageInfoToLoad);
        $scope.loadLiveGraph();
        createPieChart(peiChartLang);
        bar_chart(barChartLang);
        progress(processChartLang);
        $timeout($scope.loadCenterAlignedLabels, 200, true);
    };

    $scope.loadLiveGraph = function(langObj) {
        getDetails.getTempGraph().then(function onSuccess(data) {
            if (data.code == 200) {
                console.log(data);
                var y_axis_array = [];
                for (var i = 0; i < data.data.y_axis.length; i++) {
                    //console.log(new Date(parseInt(data.data.y_axis[i])).getHours());
                    y_axis_array.push(new Date(parseInt(data.data.y_axis[i])).getHours() + ':' + new Date(parseInt(data.data.y_axis[i])).getMinutes());
                }
                // var temp_y = [];
                // var temp_x = [];
                // for (var m = 0; m < 15; m++) {
                //     temp_y.push(y_axis_array[m]);
                //     temp_x.push(data.data.x_axis[m]);
                // }
                console.log(y_axis_array);
                // data.data.y_axis = temp_y;
                // data.data.x_axis = temp_x;
                data.data.y_axis = y_axis_array;
                createHighChart('temp_chart', '#3253dc', data.data.y_axis, data.data.x_axis, areaChart1Lang);
                //$scope.loadChart(langObj, data.data);
            }
            if (data.code != 200) {
                console.log(data.message);
            }

        }).catch(function onError(response) {
            if (response.status == 401) {
                console.log('not Authorized');
            }
        });
        getDetails.getMoistureGraph().then(function onSuccess(data) {
            if (data.code == 200) {
                console.log(data);
                var y_axis_array = [];
                for (var i = 0; i < data.data.y_axis.length; i++) {
                    //console.log(new Date(parseInt(data.data.y_axis[i])).getHours());
                    y_axis_array.push(new Date(parseInt(data.data.y_axis[i])).getHours());
                }
                console.log(y_axis_array);
                data.data.y_axis = y_axis_array;
                createHighChart('moisture_chart', '#6fb59f', data.data.y_axis, data.data.x_axis, areaChart2Lang);
                //$scope.loadChart(langObj, data.data);
            }
            if (data.code != 200) {
                console.log(data.message);
            }

        }).catch(function onError(response) {
            if (response.status == 401) {
                console.log('not Authorized');
            }
        });
        getDetails.getLightGraph().then(function onSuccess(data) {
            if (data.code == 200) {
                console.log(data);
                var y_axis_array = [];
                for (var i = 0; i < data.data.y_axis.length; i++) {
                    //console.log(new Date(parseInt(data.data.y_axis[i])).getHours());
                    y_axis_array.push(new Date(parseInt(data.data.y_axis[i])).getHours());
                }
                console.log(y_axis_array);
                data.data.y_axis = y_axis_array;
                createHighChart('light_chart', '#8497e8', data.data.y_axis, data.data.x_axis, areaChart3Lang);
                //$scope.loadChart(langObj, data.data);
            }
            if (data.code != 200) {
                console.log(data.message);
            }

        }).catch(function onError(response) {
            if (response.status == 401) {
                console.log('not Authorized');
            }
        });
    };
    var screenDurationForInfo = 3000;
    $scope.loadTempEvent = function() {
        $timeout($scope.hideLangDiv, 1 * screenDurationForInfo, true);
        $timeout($scope.showLangDiv, 22 * 1000, true);
        $timeout($scope.loadAnimation, 1 * screenDurationForInfo, true, 'fadeIn');
        $timeout($scope.loadThings, 1 * screenDurationForInfo, true, $scope.viewToLoad[0], $scope.colorsToLoad[7], $scope.opacityToLoad[1]);
        $timeout($scope.loadAnimation, 5 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 5 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[0], '', '', '');
        //$timeout($scope.loadAnimation, 3 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 3 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[0] + '.png', '', 'images/' + $scope.backgroundImageToLoad[1] + '.png');
        $timeout($scope.loadAnimation, 7 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 7 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[0] + '.png', $scope.purpleImageInfoToLoad[0], '');
        //$timeout($scope.loadAnimation, 5 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 5 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[1] + '.png', '', 'images/' + $scope.backgroundImageToLoad[1] + '.png');
        $timeout($scope.loadAnimation, 10 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 10 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[1] + '.png', $scope.purpleImageInfoToLoad[1], '');
        //$timeout($scope.loadAnimation, 7 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 7 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[2] + '.png', '', 'images/' + $scope.backgroundImageToLoad[0] + '.png');
        $timeout($scope.loadAnimation, 15 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 15 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[2] + '.png', $scope.purpleImageInfoToLoad[2], '');
        $timeout($scope.loadAnimation, 18 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 18 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[1], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 20 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 20 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[7], $scope.opacityToLoad[1]);
        $timeout($scope.loadAnimation, 22 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 22 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
    };
    $scope.loadDroughtEvent = function() {
        $timeout($scope.hideLangDiv, 1 * screenDurationForInfo, true);
        $timeout($scope.showLangDiv, 22 * 1000, true);
        $timeout($scope.loadAnimation, 1 * screenDurationForInfo, true, 'fadeIn');
        $timeout($scope.loadThings, 1 * screenDurationForInfo, true, $scope.viewToLoad[0], $scope.colorsToLoad[8], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 5 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 5 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        //$timeout($scope.loadAnimation, 3 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 3 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[3] + '.png', '');
        $timeout($scope.loadAnimation, 7 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 7 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[3] + '.png', $scope.blueImageInfoToLoad[0]);
        //$timeout($scope.loadAnimation, 5 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 5 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[4] + '.png', '');
        $timeout($scope.loadAnimation, 10 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 10 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[4] + '.png', $scope.blueImageInfoToLoad[1]);
        //$timeout($scope.loadAnimation, 7 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 7 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[5] + '.png', '');
        $timeout($scope.loadAnimation, 15 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 15 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[5] + '.png', $scope.blueImageInfoToLoad[2]);
        $timeout($scope.loadAnimation, 18 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 18 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 20 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 20 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[8], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation, 22 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 22 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
    };
    $scope.loadMoistEvent = function() {
        $timeout($scope.hideLangDiv, 1 * screenDurationForInfo, true);
        $timeout($scope.showLangDiv, 22 * 1000, true);
        $timeout($scope.loadAnimation, 1 * screenDurationForInfo, true, 'fadeIn');
        $timeout($scope.loadThings, 1 * screenDurationForInfo, true, $scope.viewToLoad[0], $scope.colorsToLoad[8], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 5 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 5 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        //$timeout($scope.loadAnimation, 3 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 3 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[5] + '.png', '', 'images/' + $scope.backgroundImageToLoad[2] + '.png');
        $timeout($scope.loadAnimation, 7 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 7 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[5] + '.png', $scope.blueImageInfoToLoad[3], '');
        //$timeout($scope.loadAnimation, 5 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 5 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[4] + '.png', '', 'images/' + $scope.backgroundImageToLoad[3] + '.png');
        $timeout($scope.loadAnimation, 10 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 10 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[4] + '.png', $scope.blueImageInfoToLoad[4], ' ');
        //$timeout($scope.loadAnimation, 7 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 7 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[3] + '.png', '', 'images/' + $scope.backgroundImageToLoad[3] + '.png');
        $timeout($scope.loadAnimation, 15 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 15 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[3] + '.png', $scope.blueImageInfoToLoad[5], ' ');
        $timeout($scope.loadAnimation, 18 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 18 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[2], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 20 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 20 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[8], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 22 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 22 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
    };
    $scope.loadLightEvent = function() {
        $timeout($scope.hideLangDiv, 1 * screenDurationForInfo, true);
        $timeout($scope.showLangDiv, 24 * 1000, true);
        $timeout($scope.loadAnimation, 1 * screenDurationForInfo, true, 'fadeIn');
        $timeout($scope.loadThings, 1 * screenDurationForInfo, true, $scope.viewToLoad[0], $scope.colorsToLoad[9], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 5 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 5 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[0]);
        //$timeout($scope.loadAnimation, 3 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 3 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[6] + '.png', '');
        $timeout($scope.loadAnimation, 7 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 7 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[6] + '.png', $scope.yellowImageInfoToLoad[0]);
        //$timeout($scope.loadAnimation, 5 * screenDurationForInf7 * screenDurationForInfoo, true, 'fadeIn');
        //$timeout($scope.loadThings, 5 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[7] + '.png', '');
        $timeout($scope.loadAnimation, 10 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 10 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[7] + '.png', $scope.yellowImageInfoToLoad[1]);
        //$timeout($scope.loadAnimation, 7 * screenDurationForInfo, true, 'fadeIn');
        //$timeout($scope.loadThings, 7 * screenDurationForInfo, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[8] + '.png', '');
        $timeout($scope.loadAnimation, 15 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 15 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[2], 'images/' + $scope.imagesToLoad[8] + '.png', $scope.yellowImageInfoToLoad[2]);
        $timeout($scope.loadAnimation, 20 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 20 * 1000, true, $scope.viewToLoad[1], $scope.colorsToLoad[3], $scope.opacityToLoad[0]);
        $timeout($scope.loadAnimation, 22 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 22 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[9], $scope.opacityToLoad[2]);
        $timeout($scope.loadAnimation, 24 * 1000, true, 'fadeIn');
        $timeout($scope.loadThings, 24 * 1000, true, $scope.viewToLoad[0], $scope.colorsToLoad[0], $scope.opacityToLoad[2]);
    };
    $scope.getCurrentWeatherInfo = function() {
        getDetails.getWeatherInfo().then(function onSuccess(data) {
            console.log(data);
            if (data.status) {
                console.log(data);
                $scope.we = data;
            }
            if (!data.status) {
                console.log(data.status);
                $scope.we = {};
                $scope.we.condition = $scope.we.humidity = $scope.we.windSpeed = $scope.we.pressure = ' - ';
            }

        }).catch(function onError(response) {
            if (response.status == 401) {
                console.log('not Authorized');
            }
        });
    };
    $scope.getCurrentWeatherInfo();
    $scope.changeLang({ 'val': 'en' });
    //$scope.loadMoistEvent();
    $scope.updateScreenTransitionState = function() {
        getDetails.updateScreenTransitionState().then(function onSuccess(data) {
            if (data.code == 200) {
                console.log(data);
            }
            if (data.code != 200) {
                console.log(data.message);
            }

        }).catch(function onError(response) {
            if (response.status == 401) {
                console.log('not Authorized');
            }
        });
    };
    $scope.updateScreenTransitionState();
    socket.on('iiot-agri-transition-screen', function(result, err) {
        console.log(result);
        if (result.event == 'agri-temp-event') {
            $scope.currentImageUrl = 'images/Asset 1.png';
            $scope.loadTempEvent();
        }
        if (result.event == 'agri-drought-event') {
            $scope.currentImageUrl = 'images/Asset 4.png';
            $scope.loadDroughtEvent();
        }
        if (result.event == 'agri-moist-event') {
            $scope.currentImageUrl = 'images/Asset 6.png';
            $scope.loadMoistEvent();
        }
        if (result.event == 'agri-light-event') {
            $scope.currentImageUrl = 'images/Asset 7.png';
            $scope.loadLightEvent();
        }
        $timeout($scope.updateScreenTransitionState, 24 * 1000, true);
    });
    $timeout($scope.loadPieLegend, 500, true);
});