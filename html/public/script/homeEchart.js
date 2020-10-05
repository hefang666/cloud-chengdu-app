var EchartMain;
// 做完优化代码
function EchartOption1() {
    // echart
    // 1、各代收费用
    var datas;
    fnGet('services/Report/BusinessSystem/GetChargeForGenerationSumAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#EchartMain').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                EchartMain = echarts.init(document.getElementById('EchartMain'));
                var colors = ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'];
                var option1 = {
                    color: colors,
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)",
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: '43%',
                        y: '15px',
                        itemGap: 3,
                        itemWidth: 10, // 图例图形宽度
                        itemHeight: 10,
                        data: ['支付宝', 'ATM代收', '微信', '银联'],
                        formatter: function(name) {
                            if (name == '支付宝') {
                                return '支付宝:￥' + datas[1].amount;
                            } else if (name == 'ATM代收') {
                                return 'ATM代收:￥' + datas[2].amount;
                            } else if (name == '微信') {
                                return '微信:￥' + datas[0].amount;
                            } else if (name == '银联') {
                                return '银联:￥' + datas[3].amount;
                            }
                        },
                        textStyle: {
                            'color': '#999', // 图例文字颜色
                            'fontsize': 20
                        }
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['28%', '48%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: datas[1].amount,
                            name: '支付宝'
                        }, {
                            value: datas[2].amount,
                            name: 'ATM代收'
                        }, {
                            value: datas[0].amount,
                            name: '微信'
                        }, , {
                            value: datas[3].amount,
                            name: '银联'
                        }, ]
                    }]
                };
                EchartMain.setOption(option1);
                var autoHeight = 1.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                EchartMain.getDom().style.height = autoHeight + "px";
                EchartMain.resize();

            } else {
                $('#EchartMain').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }


        }
    });
}

function EchartYCollback() {
    // 1、本月回收率
    var datas;
    fnGet('services/Report/BusinessSystem/GetRecoveryRateAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#EchartCallBack').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result.businessSituations;
                var recoveryRate = ret.result.recoveryRate;
                var EchartCallBack = echarts.init(document.getElementById('EchartCallBack'));
                option = {
                    color: ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'],
                    title: {
                        text: recoveryRate + '%',
                        x: '20%',
                        y: '30%',
                        textStyle: {
                            fontWeight: 'normal',
                            color: '#4F79E8',
                            fontSize: '12'
                        }
                    },
                    tooltip: {
                        trigger: 'item',

                        textStyle: {
                            fontSize: 12
                        },
                        formatter: '{b} : {c} ({d}%)'

                    },
                    // color: ['rgba(240,240,240, 1)'],
                    legend: {
                        orient: 'vertical',
                        x: '41%',
                        y: '12px',
                        // show: true,
                        itemGap: 12,
                        itemWidth: 0, // 图例图形宽度
                        itemHeight: 0,
                        data: ['已收金额', '欠收金额', '应收金额'],
                        formatter: function(name) {
                            if (name == '已收金额') {
                                return '已收金额:￥' + datas.amountReceived;
                            } else if (name == '欠收金额') {
                                return '欠收金额:￥' + datas.arrearage;
                            } else if (name == '应收金额') {
                                return '应收金额:￥' + datas.amountReceivable;
                            }
                        },
                        textStyle: {
                            'color': '#999', // 图例文字颜色
                            'fontsize': 20
                        }
                    },

                    series: [{
                        type: 'pie',
                        clockWise: true,
                        radius: ['50%', '70%'],
                        center: ['25%', '40%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        hoverAnimation: false,
                        data: [{
                            value: datas.amountReceived,
                            name: '已收金额',
                            // itemStyle: {
                            //     normal: {
                            //         color: { // 完成的圆环的颜色
                            //             colorStops: [{
                            //                 offset: 0,
                            //                 color: '#1293f5' // 0% 处的颜色
                            //             }, {
                            //                 offset: 1,
                            //                 color: '#1293f5' // 100% 处的颜色
                            //             }]
                            //         },
                            //         label: {
                            //             show: false
                            //         },
                            //         labelLine: {
                            //             show: false
                            //         }
                            //     }
                            // }
                        }, {

                            name: '欠收金额',
                            value: datas.arrearage,

                        }, {
                            name: '应收金额',
                            value: 0,

                        }, ]
                    }]
                }
                EchartCallBack.setOption(option);
                var autoHeight = 1.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                EchartCallBack.getDom().style.height = autoHeight + "px";
                EchartCallBack.resize();
            } else {
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });
                $('#EchartCallBack').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });


}
// 柱状图
function EchartOption2() {
    var datas;
    fnGet('services/Report/BusinessSystem/GetBusinessSituationAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#EchartOption2').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var EchartOption2 = echarts.init(document.getElementById('EchartOption2'));
                var colorList = ['#4f79e8', '#fac113', '#31cab3'];
                var option = {
                    color: colorList,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    legend: {
                        orient: 'vertical',
                        x: 0,
                        y: "75%",
                        left: '5%',
                        itemWidth: 10,
                        itemHeight: 10,
                        data: ['已收金额', '欠收金额', '应收金额'],
                        formatter: function(name) {
                            if (name == '已收金额') {
                                return '已收金额:￥' + datas.amountReceived;
                            } else if (name == '欠收金额') {
                                return '欠收金额:￥' + datas.arrearage;
                            } else if (name == '应收金额') {
                                return '应收金额:￥' + datas.amountReceivable;
                            }
                        },
                        textStyle: { //图例文字的样式
                            'color': '#999', // 图例文字颜色
                            'fontsize': 20
                        }
                    },
                    grid: {
                        top: '3%',
                        left: '5%',
                        right: '10%',
                        bottom: '3%',
                        height: '70%',
                        width: '80%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                      data: ['已收金额', '欠收金额', '应收金额'],
                        axisTick: {
                            show: false
                        },
                        splitLine:{
                          show:false
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        type: 'bar',
                        barWidth: '40%',
                        data: [datas.amountReceived, datas.arrearage, datas.amountReceivable],
                        itemStyle: {
          normal: {
              color: function(params) {
                  // build a color map as your need.
                  var colorList = ['#4f79e8', '#fac113', '#31cab3'];
                  return colorList[params.dataIndex]
              },
          }
      }
                    },
                    {
           name:'已收金额',
           type:'bar',
           stack: '',
           data:datas.amountReceived,

       },
       {
                  name:'欠收金额',
                  type:'bar',
                  stack: '',
                  data:datas.arrearage,
              }, {
            name:'应收金额',
            type:'bar',
            stack: '',
            data:datas.amountReceivable,
        },
                  ]
                };
                EchartOption2.setOption(option);
                var autoHeight = 5.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                EchartOption2.getDom().style.height = autoHeight + "px";
                EchartOption2.resize();
            } else {
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });
                $('#EchartOption2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');

            }
        }
    });

}

function EchartOption3() {
    // 近半年盈利
    var datas;
    fnGet('services/Report/BusinessSystem/GetHalfYearAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#EchartOptionThree').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result.halfYearData;
                var maxAmount = ret.result.maxAmount;
                var months = [];
                var arrearage = []; //欠费金额
                var amountReceivable = []; //应收金额
                var amountReceived = []; //实收金额
                var arrearageSum = 0; //欠费金额总和
                var amountReceivableSum = 0; //应收金额总和
                var amountReceivedSum = 0; //实收金额总和
                for (var i = 0; i < datas.length; i++) {
                    // var m = datas[i].month.substing(0,4)+'-'+datas[i].month.substing(5,2);
                    var m = datas[i].month;
                    months.push(m);
                    arrearage.push(datas[i].monthValue.arrearage);
                    amountReceivable.push(datas[i].monthValue.amountReceivable);
                    amountReceived.push(datas[i].monthValue.amountReceived);
                    arrearageSum += datas[i].monthValue.arrearage;
                    amountReceivableSum += datas[i].monthValue.amountReceivable;
                    amountReceivedSum += datas[i].monthValue.arrearage+datas[i].monthValue.amountReceivable;

                }
                arrearageSum = arrearageSum.toFixed(2);
                amountReceivableSum = amountReceivableSum.toFixed(2);
                amountReceivedSum = amountReceivedSum.toFixed(2);
                var EchartOption3 = echarts.init(document.getElementById('EchartOptionThree'));
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: '{a0}:{c0}</br>{a1}:{c1}</br>{a2}:{c2}',
                    },
                    legend: [{
                            orient: 'vertical',
                            x: 0,
                            y: "320px",
                            left: '5%',
                            itemWidth: 10,
                            itemHeight: 10,
                            data: ['已收金额', '欠收金额', '应收金额'],
                            formatter: function(name) {
                                if (name == '已收金额') {
                                    return '已收金额:￥' + arrearageSum;
                                } else if (name == '欠收金额') {
                                    return '欠收金额:￥' + amountReceivableSum;
                                } else if (name == '应收金额') {
                                    return '应收金额:￥' + amountReceivedSum;
                                }
                            },
                            textStyle: { //图例文字的样式
                                fontSize: 14,
                                color: '#999'
                            }
                        },
                        // {
                        //     orient: 'horizontal',
                        //     x: 0,
                        //     top: 0,
                        //     left: '20%',
                        //     bottom: '5%',
                        //     itemWidth: 10,
                        //     itemHeight: 2,
                        //     data: ['已收金额', '欠收金额', '应收金额'],
                        //     textStyle: { //图例文字的样式
                        //         fontSize: 14
                        //     }
                        // },
                    ],
                    grid: {
                        top: '15%',
                        left: '1%',
                        right: '5%',
                        bottom: '5%',
                        height: '60%',
                        width: '86%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 330,
                            show: true,
                            splitNumber: 0,
                            color: "#666",
                            // padding: [3, 2, 0, 0],
                            textStyle: {
                                //fontFamily: "微软雅黑",
                                fontSize: 12,
                            },

                        },
                        data: months
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        name: '(元)',
                        min: 0,
                        max: maxAmount,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        // 坐标标度颜色
                        splitLine: {
                            lineStyle: {
                                color: '#e6e6e6',
                                width: 1
                            }
                        }
                    }, ],
                    series: [{
                            name: '已收金额',
                            type: 'bar',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    color: '#4f79e8'
                                }
                            },
                            data: amountReceived,
                        }, {
                            name: '欠收金额',
                            type: 'bar',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    color: '#fac113'
                                }
                            },
                            data: arrearage,
                        }, {
                            name: '应收金额',
                            type: 'bar',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    color: '#31cab3'
                                }
                            },
                            data: amountReceivable,
                        },
                        // {
                        //     name: '已收金额',
                        //     type: 'line',
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#4f79e8'
                        //         }
                        //     },
                        //     data: amountReceived,
                        //
                        // }, {
                        //     name: '欠收金额',
                        //     type: 'line',
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#fac113'
                        //         }
                        //     },
                        //     data: arrearage,
                        //
                        // }, {
                        //     name: '应收金额',
                        //     type: 'line',
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#31cab3'
                        //         }
                        //     },
                        //     data: amountReceivable,
                        //
                        // }
                    ]
                };
                EchartOption3.setOption(option);
                var autoHeight = 7 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                EchartOption3.getDom().style.height = autoHeight + "px";
                EchartOption3.resize();
            } else {
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });
                $('#EchartOptionThree').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });

}

// 客服系统
function CustomerServiceOne() {
    // 1、本月服务满意度
    var datas;
    fnGet('services/Report/BusinessSystem/GetChargeForGenerationSumAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#CustomerService1').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var CustomerService1 = echarts.init(document.getElementById('CustomerService1'));
                var colors = ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'];
                var option = {
                    color: colors,
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: '43%',
                        y: '20px',
                        itemGap: 3,
                        itemWidth: 10, // 图例图形宽度
                        itemHeight: 6,
                        data: ['基本满意', '满意', '不满意'],
                        formatter: function() {

                        },
                        textStyle: {
                            'color': '#999', // 图例文字颜色
                            'fontsize': 20
                        }
                    },
                    series: [{
                        type: 'pie',
                        radius: ['60%', '80%'],
                        center: ['28%', '48%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: 35698,
                            name: '基本满意'
                        }, {
                            value: 35698,
                            name: '满意'
                        }, {
                            value: 35698,
                            name: '不满意'
                        }, ]
                    }]
                };

                CustomerService1.setOption(option);
                var autoHeight = 1.5 * 150 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                CustomerService1.getDom().style.height = autoHeight + "px";
                CustomerService1.resize();
            } else {
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });
                $('#CustomerService1').siblings('.noData').removeClass('aui-hide').addClass('aui-show');

            }
        }
    });

}

function CustomerServiceTwo() {
    // 本月客户反映情况
    var Groups, total;
    fnGet('services/Report/CustomerSystem/GetThisMonthCustomerServiceAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#CustomerService2').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                var CustomerService2 = echarts.init(document.getElementById('CustomerService2'));
                var nameArry = [],
                    dataArray = [];
                var lengendDatas = [];
                var result = ret.result.thisMonthGroup;
                lengendDatas.push(ret.result.total.reflectName);
                nameArry.push(ret.result.total.reflectName);
                dataArray.push({
                    name: ret.result.total.reflectName,
                    value: ret.result.total.reflectCount
                });
                for (var i = 0; i < result.length; i++) {
                    var value = {
                        name: result[i].reflectName,
                        value: result[i].reflectCount
                    };
                    dataArray.push(value);
                    lengendDatas.push(result[i].reflectName);
                    nameArry.push(result[i].reflectName);
                }

                var option = {
                    color: '#2BB0FD',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        }
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     x: '0',
                    //     // y: '20%',
                    //     // top:'40%',
                    //     // itemGap: 3,
                    //     // itemWidth: 10, // 图例图形宽度
                    //     // itemHeight: 6,
                    //     data: lengendDatas,
                    //     formatter: function(name) {
                    //         for (var i = 0; i < dataArray.length; i++) {
                    //             if (name == dataArray[i].name) {
                    //                 return name + ':' + dataArray[i].value + '个';
                    //             }
                    //         }
                    //     },
                    //     textStyle: {
                    //         'color': '#999', // 图例文字颜色
                    //         'fontsize': 20
                    //     }
                    // },
                    grid: {
                        left: '3%',
                        right: '16%',
                        bottom: '10%',
                        top: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        name: '(个)',
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },

                        axisLabel: {
                            color: '#666',
                        }
                    },
                    yAxis: {
                        type: 'category',
                        axisTick: {
                            show: false,
                        },

                        axisLabel: {
                            color: '#666',
                        },
                        data: nameArry,
                        axisLabel: {
                            formatter: function(value) {
                                if (value.length > 4) {
                                    return value.substring(0, 4) + "...";
                                } else {
                                    return value;
                                }
                            },
                        }

                    },
                    series: [{
                            type: 'bar',
                            barWidth: '20%',
                            data: dataArray
                        }

                    ]
                };
                CustomerService2.setOption(option);
                var autoHeight = lengendDatas.length * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                CustomerService2.getDom().style.height = autoHeight + "px";
                CustomerService2.resize();
            } else {
                $('#CustomerService2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });
}

function CustomerServiceThree() {
    // 本月受理回复及时率
    fnGet('services/Report/CustomerSystem/GetThisMonthAcceptAndReplyAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#CustomerService3').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var CustomerService3 = echarts.init(document.getElementById('CustomerService3'));
                var colors = ['#4f79e8', '#ffd257'];
                var option = {
                    color: colors,
                    tooltip: {
                        trigger: 'item',

                        textStyle: {
                            fontSize: 12
                        },
                        formatter: '{b} : {c} ({d}%)'

                    },
                    legend: {
                        orient: 'vertical',
                        x: '50%',
                        y: '30px',
                        itemGap: 3,
                        itemWidth: 10, // 图例图形宽度
                        itemHeight: 10,
                        data: ['受理及时率', '回复及时率'],
                        formatter: function(name) {
                            if (name == '受理及时率') {
                                return '受理及时率:' + datas.acceptRate + '%';
                            } else {
                                return '回复及时率:' + datas.replyRate + '%';
                            }
                        },
                        textStyle: {
                            'color': '#999', // 图例文字颜色
                            'fontsize': 20
                        }
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['28%', '45%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },

                        data: [{
                            value: datas.acceptRate,
                            name: '受理及时率'
                        }, {
                            value: datas.replyRate,
                            name: '回复及时率'
                        }, ]
                    }]
                };

                CustomerService3.setOption(option);
                var autoHeight = 1.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                CustomerService3.getDom().style.height = autoHeight + "px";
                CustomerService3.resize();
            } else {
                $('#CustomerService3').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });

}

function CustomerServiceFour() {
    // 近半年及时回复率
    var datas;
    fnGet('services/Report/CustomerSystem/GetHalfAYearAcceptAndReplyAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#Customer').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                // var maxAmount=ret.result.maxAmount;
                var months = [];
                var acceptRate = []; //受理率
                var replyRate = []; //回复率
                var acceptRateSum = 0; //受理率总和
                var replyRateSum = 0; //回复率总和
                for (var i = 0; i < datas.length; i++) {
                    var m = datas[i].month;
                    months.push(m);
                    acceptRate.push(datas[i].acceptRate);
                    replyRate.push(datas[i].replyRate);
                    acceptRateSum += datas[i].acceptRate;
                    replyRateSum += datas[i].replyRate;
                }
                var CustomerService4 = echarts.init(document.getElementById('Customer'));
                var colors = ['#4f79e8', '#ff6060'];
                var option = {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: "{a0}:{c0}%</br>{a1}:{c1}%",
                    },
                    legend: [{
                            icon: 'bar',
                            orient: 'vertical',
                            x: 0,
                            y: "315px",
                            left: '5%',
                            itemWidth: 10,
                            itemHeight: 10,
                            data: ['受理及时率', '回复及时率'],
                            formatter: function(name) {
                                if (name == '受理及时率') {
                                    return '受理及时率:' + acceptRateSum + '%';
                                } else {
                                    return '回复及时率:' + replyRateSum + '%';
                                }
                            },
                            textStyle: { //图例文字的样式
                                'fontSize': 12,
                                'color': "#999"
                            }
                        }, {
                            orient: 'horizontal',
                            x: 0,
                            top: '1%',
                            left: '37%',
                            bottom: '5%',
                            itemWidth: 10,
                            itemHeight: 2,
                            data: ['受理及时率', '回复及时率'],
                            textStyle: { //图例文字的样式
                                'fontSize': 12,
                                'color': "#999"
                            }
                        },


                    ],
                    grid: {
                        top: '10%',
                        left: '1%',
                        right: '1%',
                        bottom: '5%',
                        height: '65%',
                        width: '88%',
                        containLabel: true
                    },
                    xAxis: [{
                            type: 'category',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 330,
                                show: true,
                                splitNumber: 0,
                                color: "#666",
                                padding: [10, 0, 0, 0],
                                textStyle: {
                                    //fontFamily: "微软雅黑",
                                    fontSize: 12,
                                },

                            },
                            // axisPointer: {
                            //     label: {
                            //         formatter: function(params) {
                            //             return '及时率  ' + params.value +
                            //                 (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            //         }
                            //     }
                            // },
                            data: months
                        },

                    ],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        min: 0,
                        max: 100,
                        // 坐标标度颜色
                        splitLine: {
                            lineStyle: {
                                color: '#e6e6e6',
                                width: 1
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }],
                    series: [{
                        name: '受理及时率',
                        type: 'line',
                        smooth: true,
                        data: acceptRate
                    }, {
                        name: '回复及时率',
                        type: 'line',
                        smooth: true,
                        data: replyRate
                    }, ]
                };
                CustomerService4.setOption(option);
                var autoHeight = 6.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                CustomerService4.getDom().style.height = autoHeight + "px";
                CustomerService4.resize();
            } else {
                $('#Customer').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });

}

// 抄表平台
function MeterReadingOne() {
    // 1、本月小组抄表完成量
    var datas;
    fnGet('services/Report/MeterReading/GetMeterReadingRegionalGroupingAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#MeterReadingOne').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var seriesData = [];
                var dataName = [];
                var rateData = [];
                for (var i = 0; i < datas.length; i++) {
                    seriesData.push({
                        name: datas[i].regionalName,
                        value: datas[i].alreadyCopy
                    });
                    dataName.push(datas[i].regionalName);
                    rateData.push(datas[i].rateStr);
                }
                var MeterReadingOne = echarts.init(document.getElementById('MeterReadingOne'));
                var colors = ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'];
                var option = {
                    // color: colors,
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: '38%',
                        y: '10px',
                        itemGap: 3,
                        itemWidth: 10, // 图例图形宽度
                        itemHeight: 10,
                        formatter: function(name) {
                            for (var i = 0; i < seriesData.length; i++) {
                                if (name === seriesData[i].name) {
                                    var penrent = rateData[i];
                                    return name + ':' + penrent + '%';
                                }
                            }
                        },
                        data: dataName,
                        textStyle: {
                            'color': '#999', // 图例文字颜色
                            'fontsize': 20
                        }
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['20%', '48%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },

                        data: seriesData
                    }]
                };

                MeterReadingOne.setOption(option);
                var autoHeight = 1.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                MeterReadingOne.getDom().style.height = autoHeight + "px";
                MeterReadingOne.resize();

            } else {
                $('#MeterReadingOne').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });

}

function MeterReadingTwo() {
    // 本月完成量
    var datas;
    fnGet('services/Report/MeterReading/GetThisMonthMeterReadingAboutPersonalAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#MeterReadingTwo').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var lDatas = [datas.shouldCopy, datas.notCopy, datas.alreadyCopy];
                //  var lengedData = ;
                var MeterReadingTwo = echarts.init(document.getElementById('MeterReadingTwo'));
                var colorList = ['#4f79e8', '#21d575', '#ffd257'];
                var option = {
                    color: colorList,
                    legend: {
                        orient: 'vertical',
                        x: 0,
                        y: "225px",
                        left: '5%',
                        itemWidth: 12,
                        itemHeight: 12,
                        data: ['应抄户数', '未抄户数', '已抄户数'],
                        formatter: function(name) {
                            if (name == '应抄户数') {
                                return '应抄户数:' + datas.shouldCopy + '户';
                            } else if (name == '未抄户数') {
                                return '未抄户数:' + datas.notCopy + '户';
                            } else if (name == '已抄户数') {
                                return '已抄户数:' + datas.alreadyCopy + '户';
                            }

                        },
                        textStyle: { //图例文字的样式
                            fontSize: 12,
                            color: '#999'
                        }
                    },
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{c}户"
                    },
                    grid: {
                        top: '3%',
                        left: '5%',
                        right: '10%',
                        bottom: '3%',
                        height: '70%',
                        width: '80%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        show: true,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 0,
                            show: true,
                            splitNumber: 0,
                            color: "#666",
                            textStyle: {
                                //fontFamily: "微软雅黑",
                                fontSize: 14,
                            },

                        },
                        data: ['应抄户数', '未抄户数', '已抄户数'],
                    }],
                    yAxis: [{
                            type: 'value',
                            name: '(户)',
                            show: true,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            min: 0,
                            max: datas.shouldCopy,
                            // 坐标标度颜色
                            splitLine: {
                                lineStyle: {
                                    color: '#e6e6e6',
                                    width: 1
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 0,
                                show: true,
                                splitNumber: 30,
                                color: "#666",
                                textStyle: {
                                    //fontFamily: "微软雅黑",
                                    fontSize: 14,
                                }
                            },

                        },

                    ],
                    series: [{
                        name: '',
                        type: 'bar',
                        barWidth: 30, //柱图宽度
                        data: lDatas,
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = ['#4f79e8', '#21d575', '#ffd257'];
                                    return colorList[params.dataIndex]
                                },
                                label: {
                                    show: false,
                                    position: 'top',
                                    formatter: '{c}户'
                                }
                            }
                        },
                    }, {
                        name: '应抄户数',
                        type: 'bar',
                        data: datas.shouldCopy
                    }, {
                        name: '未抄户数',
                        type: 'bar',
                        data: datas.notCopy
                    }, {
                        name: '已抄户数',
                        type: 'bar',
                        data: datas.alreadyCopy
                    }]
                };
                MeterReadingTwo.setOption(option);
                var autoHeight = 5.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                MeterReadingTwo.getDom().style.height = autoHeight + "px";
                MeterReadingTwo.resize();
            } else {
                $('#MeterReadingTwo').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });
}

function MeterReadingThree() {
    // 1、抄表完成率
    var datas;
    fnGet('services/Report/MeterReading/GetThisMonthMeterReadingCompletionRateAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#MeterReadingThree').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var MeterReadingThree = echarts.init(document.getElementById('MeterReadingThree'));
                var option = {
                    title: {
                        text: datas.alreadyRateStr + '%',
                        x: 'center',
                        y: 'center',
                        textStyle: {
                            fontWeight: 'normal',
                            color: '#4F79E8',
                            fontSize: '14'
                        }
                    },
                    color: ['rgba(240,240,240, 1)'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c}",
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: [{
                        name: 'Line 1',
                        type: 'pie',
                        clockWise: true,
                        radius: ['60%', '80%'],
                        center: ['50%', '48%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        hoverAnimation: false,
                        data: [{
                            value: datas.alreadyRate,
                            name: '已抄表数:' + datas.thisMonthMeterReading.alreadyCopy + '户',
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#1293f5' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#1293f5' // 100% 处的颜色
                                        }]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        }, {
                            name: '未抄表数:' + datas.thisMonthMeterReading.notCopy + '户',
                            value: datas.notCopyRate,

                        }, {
                            name: '总抄表数:' + datas.thisMonthMeterReading.shouldCopy + '户',
                            value: 0,

                        }, ]
                    }]
                }
                MeterReadingThree.setOption(option);
                var autoHeight = 1.5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                MeterReadingThree.getDom().style.height = autoHeight + "px";
                MeterReadingThree.resize();
            } else {
                $('#MeterReadingThree').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });

}

function MeterReadingFour() {
    // 近半年营收情况趋势
    var datas;
    fnGet('services/Report/MeterReading/GetHalfAYearCompletionRateAsync', {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                $('#MeterReadingFour').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                datas = ret.result;
                var months = [];
                var seriesData = [];
                var finsh = 0;
                var num = 0;
                for (var i = datas.length - 1; i >= 0; i--) {
                    months.push(datas[i].thisMonthMeterReading.month);
                    finsh += datas[i].alreadyRate;
                    seriesData.push(datas[i].alreadyRate);
                    num++;
                }
                finsh = (finsh / num).toFixed(2);
                var MeterReadingFour = echarts.init(document.getElementById('MeterReadingFour'));
                var colors = ['#4f79e8'];
                var option = {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    legend: [{
                            icon: 'bar',
                            orient: 'vertical',
                            x: 0,
                            y: "290px",
                            left: '5%',
                            itemWidth: 10,
                            itemHeight: 10,
                            data: ['抄表完成率'],
                            formatter: function(name) {
                                return '抄表完成率:' + finsh + '%';
                            },
                            textStyle: { //图例文字的样式
                                fontSize: 12,
                                color: '#999'
                            }
                        }, {
                            orient: 'horizontal',
                            x: 0,
                            top: '1%',
                            left: '63%',
                            bottom: '5%',
                            itemWidth: 10,
                            itemHeight: 2,
                            data: ['抄表完成率'],
                            textStyle: { //图例文字的样式
                                fontSize: 12,
                                color: '#999'
                            }
                        },


                    ],
                    grid: {
                        top: '12%',
                        left: '2%',
                        right: '3%',
                        bottom: '3%',
                        height: '70%',
                        width: '86%',
                        containLabel: true
                    },
                    xAxis: [{
                            type: 'category',
                            axisLabel: {
                                interval: 0,
                                rotate: 330,
                                show: true,
                                splitNumber: 0,
                                color: "#666",
                                padding: [5, 0, 0, 0],
                                textStyle: {
                                    //fontFamily: "微软雅黑",
                                    fontSize: 12,
                                },

                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            data: months
                        },

                    ],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        // 坐标标度颜色
                        min: 0,
                        max: 100,
                        splitLine: {
                            lineStyle: {
                                color: '#e6e6e6',
                                width: 1
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }],
                    series: [{
                            name: '抄表完成率',
                            type: 'line',
                            smooth: true,
                            data: seriesData
                        }, {
                            name: '抄表完成率',
                            type: 'line',
                        },

                    ]
                };
                MeterReadingFour.setOption(option);
                var autoHeight = 6 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                MeterReadingFour.getDom().style.height = autoHeight + "px";
                MeterReadingFour.resize();
            } else {
                $('#MeterReadingFour').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                // api.toast({
                //     msg: '没有数据',
                //     duration: 2000,
                //     location: 'bottom'
                // });

            }
        }
    });

}

// SCADA
var report = ['Report4', 'Report2', 'Report1', 'Report3'];
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
// 本月第一天
var firstdate = year + '-' + month + '-01'
var month_first = new Date(firstdate).Format("yyyy-MM-dd");
// 本月最后一天
var day = new Date(year, month, 0);
var lastdate = year + '-' + month + '-' + day.getDate();
var month_last = new Date(lastdate).Format("yyyy-MM-dd");
month_first = '2018-11-01';
month_last = '2018-11-30';
// Report2

function ScadaOne() {
    // 本月抄表完成情况
    var datas;
    var colorList = ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'];
    fnGet('services/Report/Scada/GetSCada?Code=' + report[1] + '&BeginTime=' + month_first + '&EndTime=' + month_last + '&Interval=1&TimeType=5', {}, false, function(ret, err) {
        if (ret) {
            if (ret.result.Success && ret.result.Data.Attributes != null) {
                $('#ScadaOne').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                var dataResult = ret.result.Data.Attributes;
                var series = [{
                    name: '',
                    type: 'bar',
                    barWidth: 30, //柱图宽度
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = ['#4f79e8', '#ffd257'];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{c}m'
                            }
                        }
                    }
                }, ];
                var seriesData2 = [];
                var xData2 = [];
                var backgroundData2 = [];
                for (var i = 0, len = dataResult.length; i < len; i++) {
                    xData2.push(dataResult[i].Name);
                    dataResult[i].Data.length == 0 ? seriesData2.push(0) : seriesData2.push(dataResult[i].Data[0].Value);
                }
                var max = Math.max.apply(null, seriesData2); //获取数组中最大值
                for (var i = 0, len = dataResult.length; i < len; i++) {
                    backgroundData2.push(max);
                }
                series.push({
                    name: xData2[0],
                    type: 'bar',
                    barWidth: '30',
                    data: seriesData2,
                }, {
                    name: xData2[1],
                    type: "bar",
                    barWidth: '30',
                    silent: true,
                    data: backgroundData2,
                });
                var ScadaOne = echarts.init(document.getElementById('ScadaOne'));
                var colorList = ['#4f79e8', '#ffd257'];
                var option = {
                    color: colorList,
                    legend: {
                        orient: 'vertical',
                        x: 0,
                        y: "220px",
                        left: '5%',
                        itemWidth: 10,
                        itemHeight: 10,
                        data: xData2,
                        // formatter:function(name){
                        //   for(var i=0;i<dataResult.length;i++){
                        //
                        //   }
                        // }
                        textStyle: { //图例文字的样式
                            fontSize: 12,
                            color: '#999'
                        }
                    },
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{c}m"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                        }
                    },
                    grid: {
                        top: '3%',
                        left: '5%',
                        right: '10%',
                        bottom: '3%',
                        height: '70%',
                        width: '80%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        show: true,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 0,
                            show: true,
                            splitNumber: 0,
                            color: "#666",
                            textStyle: {
                                //fontFamily: "微软雅黑",
                                fontSize: 14,
                            },

                        },
                        data: ['取水量', '供水量'],
                    }],
                    yAxis: [{
                            type: 'value',
                            show: true,
                            name: '',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            max: max,
                            splitLine: { //分割线
                                show: true,
                                // color:"#fff",
                                lineStyle: {
                                    color: '#e6e6e6',
                                    width: 1
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 0,
                                show: true,
                                splitNumber: 30,
                                color: "#666",
                                textStyle: {
                                    //fontFamily: "微软雅黑",
                                    fontSize: 14,
                                }
                            },

                        },

                    ],
                    series: series
                };
                ScadaOne.setOption(option);
                var autoHeight = 3 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                ScadaOne.getDom().style.height = autoHeight + "px";
                ScadaOne.resize();
            } else {
                $('#ScadaOne').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });

    fnGet('services/Report/Scada/GetSCada?Code=' + report[2] + '&BeginTime=' + month_first + '&EndTime=' + month_last + '&Interval=1&TimeType=5', {}, false, function(ret, err) {
        if (ret) {
            if (ret.result.Success && ret.result.Data.Attributes != null) {
                $('#ScadaThree').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                var ScadaThree = echarts.init(document.getElementById('ScadaThree'));

                var dataResult = ret.result.Data.Attributes;
                var seriseData3 = [];
                var dataName3 = [];
                var rateData3 = [];
                var sum = 0;
                if (dataResult.length != 0) {
                    for (var i = 0, len = dataResult.length; i < len; i++) {
                        seriseData3.push({
                            name: dataResult[i].Name,
                            value: dataResult[i].Data.length == 0 ? 0 : dataResult[i].Data[0].Value
                        });
                        dataName3.push(dataResult[i].Name);
                        sum += dataResult[i].Data.length == 0 ? 0 : dataResult[i].Data[0].Value;
                        // rateData3.push(dataResult[i].ratio);
                    }
                    if (sum === 0) {
                        // $('#ScadaThree').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                    } else {
                        // $('#scadanodata3').hide();
                        // $('#scadaecharts3').show();
                        for (var i = 0, len = dataResult.length; i < len; i++) {
                            var rate = (dataResult[i].Data[0].Value / sum).toFixed(2);
                            rateData3.push(rate);
                        }
                    }

                    var option = {
                        color: colorList,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            icon: 'none',
                            x: 0,
                            bottom: '3%',
                            formatter: function(name) {
                                for (var i = 0; i < seriseData3.length; i++) {
                                    if (name === seriseData3[i].name) {
                                        var percent = rateData3[i];
                                        if (percent == undefined) {
                                            percent = 0;
                                            return name + ':' + percent + '%';
                                        } else {
                                            return name + ':' + percent + '%';
                                        }
                                    }
                                }
                            },
                            data: dataName3
                        },

                        calculable: true,
                        series: [{
                            name: '本月耗能',
                            type: 'pie',
                            radius: [20, 95],
                            center: ['50%', '40%'],
                            roseType: 'radius',
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: seriseData3
                        }, ]
                    };

                    ScadaThree.setOption(option);
                    var autoHeight = dataName3.length * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                    ScadaThree.getDom().style.height = autoHeight + "px";
                    ScadaThree.resize();

                }

            } else {
                $('#ScadaThree').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });

    fnGet('services/Report/Scada/GetSCada?Code=' + report[3] + '&BeginTime=' + month_first + '&EndTime=' + month_last + '&Interval=1&TimeType=5', {}, false, function(ret, err) {
        if (ret) {
            if (ret.result.Success && ret.result.Data.Attributes != null) {
                $('#ScadaFour').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                var ScadaFour = echarts.init(document.getElementById('ScadaFour'));
                var dataResult = ret.result.Data.Attributes;
                var seriseData4 = [];
                var dataName4 = [];
                var rateData4 = [];
                var sum = 0;
                if (dataResult.length != 0) {
                    for (var i = 0, len = dataResult.length; i < len; i++) {
                        seriseData4.push({
                            name: dataResult[i].Name,
                            value: dataResult[i].Data.length == 0 ? 0 : dataResult[i].Data[0].Value
                        });
                        dataName4.push(dataResult[i].Name);
                        sum += dataResult[i].Data.length == 0 ? 0 : dataResult[i].Data[0].Value;
                        // rateData3.push(dataResult[i].ratio);
                    }
                    if (sum === 0) {} else {
                        for (var i = 0, len = dataResult.length; i < len; i++) {
                            var rate = (dataResult[i].Data[0].Value / sum).toFixed(2);
                            rateData4.push(rate);
                        }

                    }
                    var option = {
                        color: colorList,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            icon: 'none',
                            orient: 'horizontal',
                            x: 0,
                            bottom: '5%',
                            formatter: function(name) {
                                for (var i = 0, len = seriseData4.length; i < len; i++) {
                                    if (name === seriseData4[i].name) {
                                        var percent = rateData4[i];
                                        if (percent == undefined) {
                                            percent = 0;
                                            return name + ':' + percent + '%';
                                        } else {
                                            return name + ':' + percent + '%';
                                        }

                                    }
                                }
                            },
                            data: dataName4
                        },
                        series: [{
                            name: '水质合格率',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '40%'],
                            data: seriseData4,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                    ScadaFour.setOption(option);
                    var autoHeight = dataName4.length * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                    ScadaFour.getDom().style.height = autoHeight + "px";
                    ScadaFour.resize();

                }
            } else {
                $('#ScadaFour').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });
}

// Report4
function ScadaTwo() {
    // 近半年压力趋势
    // 本月抄表完成情况
    var datas;
    var date1 = new Date();
    date1.setMonth(date1.getMonth() - 5); //for循环出6个月的时间
    var year1 = date1.getFullYear();
    var month1 = date1.getMonth() + 1;
    var month1date = year1 + '-' + month1 + '-01'
    var BeginTime = new Date(month1date).Format('yyyy-MM-dd');
    var EndTime = month_last;
    var Data1 = new Date();
    var Year1 = Data1.getFullYear();
    var xData = [];
    for (var index = 0; index < 6; index++) {
        Data1.setMonth(Data1.getMonth() - 1);
        var month1 = Data1.getMonth() + 1;
        var month1date = Year1 + '-' + month1;
        var yearDate = new Date(month1date).Format('yyyy-MM')
        xData.push(yearDate);
    }
    BeginTime = '2018-05-01';
    EndTime = '2018-10-31';
    fnGet('services/Report/Scada/GetSCada?Code=' + report[0] + '&BeginTime=' + BeginTime + '&EndTime=' + EndTime + '&Interval=1&TimeType=5', {}, false, function(ret, err) {
        if (ret) {
            if (ret.result.Success && ret.result.Data.Attributes != null) {
                $('#ScadaTwo').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                var dataResult = ret.result.Data.Attributes;
                var seriesDatas = [];
                var dataName = [];
                var series = [];
                for (var i = 0; i < dataResult.length; i++) {
                    var name = dataResult[i].Name;
                    dataName.push(name);
                    var times = [];
                    var values = [];
                    var seriesData = [];
                    for (var j = 0, len = dataResult[i].Data.length; j < len; j++) {
                        var ele = dataResult[i].Data[j];
                        var time = new Date(ele.Time).format('yyyy-MM');
                        times.push(time);
                        values.push(ele.Value);
                    }
                    for (var v = 0; v < 6; v++) {
                        for (var k = 0; k < times.length; k++) {
                            var value = null;
                            if (xData[v] == times[k]) {
                                value = values[k];
                                break;
                            } else {
                                value = 0;
                            }
                        }
                        seriesData.push(value);
                    }
                    seriesDatas.push(seriesData);
                }

                for (var i = 0, len = dataResult.length; i < len; i++) {
                    var serie = {
                        name: dataName[i],
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: 1,
                        lineStyle: {
                            width: 1
                        },
                        data: seriesDatas[i]
                    };
                    series.push(serie);
                }

                var ScadaTwo = echarts.init(document.getElementById('ScadaTwo'));
                var colors = ['#4f79e8', '#ff6b6b', '#1bd476'];
                var option = {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    legend: {
                        icon: 'bar',
                        orient: 'horizontal',
                        x: 0,
                        top: '1%',
                        left: '33%',
                        itemWidth: 10,
                        itemHeight: 2,
                        data: dataName,
                        textStyle: { //图例文字的样式
                            fontSize: 12,
                            color: '#999'
                        }
                    },
                    grid: {
                        top: '12%',
                        left: '2%',
                        right: '3%',
                        bottom: '5%',
                        height: '70%',
                        width: '85%',
                        containLabel: true
                    },
                    xAxis: [{
                            type: 'category',
                            show: true,

                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 330,
                                splitNumber: 0,
                                color: "#666",
                                padding: [5, 0, 0, 0],
                                textStyle: {
                                    //fontFamily: "微软雅黑",
                                    fontSize: 12,
                                },

                            },
                            axisPointer: {
                                label: {
                                    // formatter: function (params) {
                                    //     return '完成率' + params.value
                                    //         + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                    // }
                                }
                            },
                            data: xData
                        },

                    ],
                    yAxis: [{
                        type: 'value',
                        min: null,
                        max: null,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        show: true,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }],
                    series: series
                };
                ScadaTwo.setOption(option);
                var autoHeight = 4 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                ScadaTwo.getDom().style.height = autoHeight + "px";
                ScadaTwo.resize();
            } else {
                $('#ScadaTwo').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });

}

// DMA
function DMAOne() {
    var DMAOne = echarts.init(document.getElementById('DMAOne'));
    var option = {
        title: [{
                text: '80%',
                x: '20%',
                y: '30%',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#4F79E8',
                    fontSize: '14'
                }
            }, {
                text: '20%',
                x: '65%',
                y: '30%',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#4F79E8',
                    fontSize: '14'
                }
            }

        ],
        color: ['rgba(240,240,240, 1)'],
        legend: [{
            orient: 'vertical',
            x: '13%',
            y: '100px',
            // show: true,
            itemGap: 12,
            itemWidth: 0, // 图例图形宽度
            itemHeight: 0,
            data: ['漏损率'],
            textStyle: {
                color: '#999',
                fontSize: 16
            }
        }, {
            orient: 'vertical',
            x: '57%',
            y: '100px',
            // show: true,
            itemGap: 12,
            itemWidth: 0, // 图例图形宽度
            itemHeight: 0,
            data: ['产销差率'],
            textStyle: {
                color: '#999',
                fontSize: 16
            }
        }],
        series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['50%', '70%'],
            center: ['25%', '40%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            hoverAnimation: false,
            data: [{
                value: 80,
                name: '漏损率',
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#1293f5' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#1293f5' // 100% 处的颜色
                            }]
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                name: '占比',
                value: 20,

            }]
        }, {
            name: 'Line2',
            type: 'pie',
            clockWise: true,
            radius: ['50%', '70%'],
            center: ['70%', '40%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            hoverAnimation: false,
            data: [{
                value: 20,
                name: '产销差率',
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#1293f5' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#1293f5' // 100% 处的颜色
                            }]
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                name: '占比',
                value: 20,

            }]
        }]
    }
    DMAOne.setOption(option);
}

function DMATwo() {
    var DMATwo = echarts.init(document.getElementById('DMATwo'));
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: [{

            orient: 'vertical',
            x: 0,
            y: "320px",
            left: '5%',
            itemWidth: 12,
            itemHeight: 12,
            data: ['漏损量', '产销差量'],
            textStyle: { //图例文字的样式
                fontSize: 12,
                color: '#999'
            }
        }, {
            icon: 'bar',
            orient: 'horizontal',
            x: 0,
            top: '1%',
            left: '53%',
            itemWidth: 10,
            itemHeight: 2,
            data: ['漏损率', '产销差率'],
            textStyle: { //图例文字的样式
                fontSize: 12,
                color: '#999'
            }
        }, ],
        grid: {
            top: '15%',
            left: '1%',
            right: '1%',
            bottom: '5%',
            height: '60%',
            width: '90%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                rotate: 330,
                show: true,
                splitNumber: 0,
                color: "#666",
                padding: [5, 0, 0, 0],
                textStyle: {
                    //fontFamily: "微软雅黑",
                    fontSize: 12,
                },

            },
            data: ['2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06']
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#e6e6e6',
                    width: 1
                }
            },
            name: '产销差量（元）',
            min: 0,
            max: 4500,
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            name: '产销差率（%）',
            min: 0,
            max: 100,
            position: 'right',
            axisLabel: {
                formatter: '{value}',
            }
        }],
        series: [

            {
                name: '漏损量',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: '#4f79e8'
                    }
                },
                data: [2990, 2900, 3133, 3433, 3233, 3333],
            }, {
                name: '产销差量',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: '#fac113'
                    }
                },
                data: [800, 833, 933, 1003, 933, 1083],
            }, {
                name: '漏损率',
                type: 'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#4f79e8'
                    }
                },
                data: [10.8, 28.7, 39.8, 5.2, 67.9, 32.5],

            }, {
                name: '产销差率',
                type: 'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#fac113'
                    }
                },
                data: [12.8, 28.7, 50.8, 29.2, 55.9, 32.5],

            }
        ]
    };
    DMATwo.setOption(option);
}


// 相应式
// 需要在mounted（）方法里面初始化echarts实例之后调用
// window.onresize = function() {
//   EchartMain.resize();
// };
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
