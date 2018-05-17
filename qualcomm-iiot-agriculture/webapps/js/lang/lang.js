var langSet = [{
        "en1": [

            "Frost conditions detected",
            "Edge gateway runs local processing functions and triggers immediate action.",
            "Fans activated."

        ],
        "en2": [

            "Drought conditions detected.",
            "Edge gateway runs local processing functions and triggers immediate action.",
            "Irrigation activated.",
            "High moisture conditions detected.",
            "Edge gateway runs local processing functions and triggers immediate action.",
            "Irrigation suspended."

        ],
        "en3": [
            "High UV conditions detected.",
            "Edge gateway runs local processing functions to record growth conditions and creates trend analytics.",
            "Data analysis transmitted to cloud in scheduled reporting period."
        ],
        "en4": [{
            "current": "Partly Cloudy",
            "humidity": "Humidity",
            "wind": "Wind NE",
            "windIn": "mph",
            "pressure": "Pressure",
            "pressureIn": "in Hg"
        }]

    },
    {
        "mnd1": [
            "检测到霜冻",
            "边缘网关运行本地处理功能及触发操作。",
            "风扇已激活。"
        ],
        "mnd2": [
            "检测到旱情。",
            "边缘网关运行本地处理功能及触发操作。",
            "灌溉已激活。",
            "检测到水分过高。",
            "边缘网关运行本地处理功能及触发操作。",
            "灌溉已暂停。"
        ],
        "mnd3": [
            "检测到紫外线过高。",
            "边缘网关运行本地处理功能来记录数据增长并创建趋势分析。",
            "数据分析已在预定报告时段传送至云端。"
        ],
        "mnd4": [{
            "current": "局部阴天",
            "humidity": "湿度",
            "wind": "风速",
            "windIn": "mph",
            "pressure": "压力",
            "pressureIn": "英寸汞柱"
        }]

    },
    {
        "por1": [

            "Condições de gelo detectadas",
            "O edge gateway executa as funções de processamento local e desencadeia ação imediata.",
            "Ventiladores ativados."

        ],
        "por2": [

            "Condições de seca detectadas.",
            "O edge gateway executa as funções de processamento local e desencadeia ação imediata.",
            "Irrigação ativada.",
            "Condições de alta umidade detectadas.",
            "O edge gateway executa as funções de processamento local e desencadeia ação imediata.",
            "Irrigação suspensa."

        ],
        "por3": [
            "Condições de UV elevado detectadas.",
            "O edge gateway executa as funções de processamento local para registrar condições de cultivo e cria análises de tendências.",
            "Análise de dados transmitida para a nuvem no período de relatório programado."
        ],
        "por4": [{
            "current": "",
            "humidity": "umidade",
            "wind": "vento",
            "windIn": "mph",
            "pressure": "pressão",
            "pressureIn": "em Hg"
        }]

    }
];
var langChart = [{
        "en": [{
                "heading": "Temperature",
                "yAxis": "Temperature (C)",
                "xAxis": "Time"
            },
            {
                "heading": "Moisture",
                "yAxis": "Moisture level",
                "xAxis": "Time"
            },
            {
                "heading": "Light",
                "yAxis": "UV index",
                "xAxis": "Time"
            },
            {
                "heading": "Data Savings",
                "name": [{
                        "item": "Sent to Cloud"
                    },
                    {
                        "item": "Processed Locally"
                    }
                ]
            },
            {
                "heading": "Compute Time Savings",
                "yAxis": "Processing Time (Milliseconds)",
                "name": [{
                        "item": "Sent to Cloud"
                    },
                    {
                        "item": "Processed Locally"
                    }
                ]
            },
            {
                "heading": "Water Savings"
            }
        ]
    },
    {

        "mnd": [{
                "heading": "温度 ",
                "yAxis": "温度 C（摄氏度）",
                "xAxis": "时间"
            },
            {
                "heading": "水分，",
                "yAxis": "水分含量",
                "xAxis": "时间"
            },
            {
                "heading": "光照",
                "yAxis": "紫外线指数",
                "xAxis": "时间"
            },
            {
                "heading": "数据保存",
                "name": [{
                        "item": "发送至云"
                    },
                    {
                        "item": "本地处理"
                    }
                ]

            },
            {
                "heading": " 利用边缘网关节省计算时间",
                "yAxis": "处理时间 (毫秒)",
                "name": [{
                        "item": "发送至云"
                    },
                    {
                        "item": "本地处理"
                    }
                ]
            },
            {
                "heading": "水节约"
            }

        ]
    },
    {
        "por": [{
                "heading": "Temperatura",
                "yAxis": "Temperatura C (Celsius)",
                "xAxis": "Hora"
            },
            {
                "heading": "Umidade",
                "yAxis": "Nível de umidade",
                "xAxis": "Hora"
            },
            {
                "heading": "Luz",
                "yAxis": "Índice UV",
                "xAxis": "Hora"
            },
            {
                "heading": "   Economia de dados",
                "name": [{
                        "item": "Enviado para a nuvem"
                    },
                    {
                        "item": "Processado localmente"
                    }
                ]
            },
            {
                "heading": "Economia de tempo de computação",
                "yAxis": "Tempo de processamento (Milhegundos)",
                "name": [{
                        "item": "Enviado para a nuvem"
                    },
                    {
                        "item": "Processado localmente"
                    }
                ]
            },
            {
                "heading": "Economia de água"
            }
        ]
    },
];
//var weatherLang =


var purpleInfoLang, blueInfolang, yellowInfolang, areaChart1Lang, areaChart2Lang, areaChart3Lang, peiChartLang, barChartLang, processChartLang;
//lang = 'en';
// if (lang == 'en') {
//     purpleInfoLang = langSet[0].en1;
//     blueInfolang = langSet[0].en2;
//     yellowInfolang = langSet[0].en3;
//     areaChart1Lang = langChart[0].en[0];
//     areaChart2Lang = langChart[0].en[1];
//     areaChart3Lang = langChart[0].en[2];
//     peiChartLang = langChart[0].en[3];
//     barChartLang = langChart[0].en[4];
//     processChartLang = langChart[0].en[5];
//     weatherInfo = langSet[0].en4[0];

// }
// if (lang == 'mnd') {
//     purpleInfoLang = langSet[1].mnd1;
//     blueInfolang = langSet[1].mnd2;
//     yellowInfolang = langSet[1].mnd3;
//     areaChart1Lang = langChart[1].mnd[0];
//     areaChart2Lang = langChart[1].mnd[1];
//     areaChart3Lang = langChart[1].mnd[2];
//     peiChartLang = langChart[1].mnd[3];
//     barChartLang = langChart[1].mnd[4];
//     processChartLang = langChart[1].mnd[5];
//     weatherInfo = langSet[1].mnd4[0];
// }