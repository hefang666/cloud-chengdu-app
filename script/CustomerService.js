  // 客户中心Echart图
  function tab1(data) {
      var url = 'services/Report/CustomerCenter/GetApplyToInstallTotal';
      if (data != "") {
          url = url + '?date=' + data + '';
      } else {
          var data = moment().format('YYYY-MM-DD');
          url = url + '?date=' + data + '';
      }
      fnGet(url, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {
                  $('#tab1Echart').removeClass('aui-hide').addClass('aui-show');
                  $('#tab1Echart').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  var datas = ret.result.chrtList;
                  var nameList = datas.nameList;
                  var dataList = datas.dataList;
                  var param = {};
                  param.datas = nameList;
                  param.tab = 'tab1';
                  param.date = data;
                  var nameList1 = ['新装','归档'];
                  param = JSON.stringify(param);
                  $('#tab1mMore').attr('param', param);
                  // 背景
                  var backgroundMax;
                  if (Math.max(datas.dataList[0]) > Math.max(datas.dataList[1])) {
                      backgroundMax = Math.max(datas.dataList[0]);
                  } else {
                      backgroundMax = Math.max(datas.dataList[1]);
                  }
                  var series = [];
                  for (var i = 0; i < dataList.length; i++) {
                      var n = i + 1;
                      var datasList = {
                          name: nameList1[i],
                          type: 'bar',
                          barWidth: '10%',
                          data: [{
                              name: '新装',
                              value: dataList[i][i]
                          }, {
                              name: '归档',
                              value: dataList[i][i]
                          }]
                      };
                      series.push(datasList);
                  }
                  var Echarts = echarts.init(document.getElementById('tab1Echart'));
                  var option = {
                      color: ['#3eb4fc', '#e392ed'],
                      tooltip: {
                          trigger: 'axis',
                          axisPointer: { // 坐标轴指示器，坐标轴触发有效
                              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                          },
                          formatter:'{a0}: {c0}<br />{a1}: {c1}'
                      },
                      legend: {
                          orient: 'horizontal',
                          icon: 'circle',
                          x: '10%',
                          y: '0',
                          bottom: '15%',
                          itemGap: 3,
                          itemWidth: 10, // 图例图形宽度
                          itemHeight: 10,
                          textStyle: {
                              color: '#262626',
                              fontSize: 14
                          },
                          data: ['新装', '归档'],
                          // formatter:function(name){
                          //     for(var i=0;i< datas.nameList.length;i++){
                          //       if(datas.nameList[i] == name){
                          //         return name;
                          //       }
                          //     }
                          //   }
                      },
                      grid: {
                          left: '10%',
                          right: '4%',
                          bottom: '10%',
                          top: '20%',
                          containLabel: true
                      },
                      xAxis: [{
                          type: 'category',
                          axisTick: {
                              show: false
                          },
                          axisLine: {
                              show: false
                          },
                          data: datas.nameList
                      }],
                      yAxis: [{
                          name: '(个)',
                          type: 'value',

                          axisTick: {
                              show: false
                          },
                          axisLine: {
                              show: false
                          },
                      }],
                      series: series
                          // 背景柱子
                          // {
                          //     name: "",
                          //     type: "bar",
                          //     barWidth: '10%',
                          //     xAxisIndex: 0,
                          //     barGap: "-100%",
                          //     data: backgroundMax,
                          //     itemStyle: {
                          //         normal: {
                          //             barBorderRadius: [5, 5, 0, 0],
                          //             color: "#f5f5f5"
                          //         }
                          //     },
                          //     zlevel: -1
                          // },

                  };
                  Echarts.setOption(option, true);
                  var autoHeight = 5 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  Echarts.getDom().style.height = autoHeight + "px";
                  Echarts.resize();

              } else {
                $('#tab1Echart').removeClass('aui-show').addClass('aui-hide');
                  $('#tab1Echart').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
              }
          }
      });
  }

  function tab2(data) {
      var Echarts = echarts.init(document.getElementById('tab2Echart'));
      var url = 'services/Report/CustomerCenter/GetOrders';
      if (data != "") {
          url = url + '?date=' + data + '';
      } else {
          var data = moment().format('YYYY-MM-DD');
          url = url + '?date=' + data + '';
      }
      fnGet(url, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {
                  $('#tab2Echart').removeClass('aui-hide').addClass('aui-show');
                  $('#tab2Echart').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  var pieChartList = ret.result.pieChartList;
                  var dataList = ret.result.dataList;
                  if(dataList.length!=0){

                    var seriesDatas = [];
                    var legendDatas = [];
                    var Tdatas = {
                        list: dataList
                    };
                    $('#tab2TableDemo').html('');
                    var tableHtml = template('tab2TableList', Tdatas);
                    $('#tab2TableDemo').append(tableHtml);
                    var param = {};
                    param.date = data;
                    param = JSON.stringify(param);
                    $('#tab2mMore').attr('param', param);
                  }
                  for (var i = 0; i < pieChartList.length; i++) {
                      seriesDatas.push({
                          value: pieChartList[i].value,
                          name: pieChartList[i].name
                      });
                      legendDatas.push(pieChartList[i].name);
                  }

                  var option = {
                      color: ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'],
                      tooltip: {
                          trigger: 'item',
                          formatter: "{a} <br/>{b}: {c} ({d}%)"
                      },
                      legend: {
                          orient: 'horizontal',
                          icon: 'circle',
                          x: '10%',
                          y: '80%',
                          bottom: '25%',
                          data: legendDatas
                      },
                      series: [{
                          name: '访问来源',
                          type: 'pie',
                          radius: ['40%', '60%'],
                          center: ['50%', '40%'],
                          avoidLabelOverlap: false,
                          label: {
                              normal: {
                                  show: false,
                                  position: 'center'
                              },
                              emphasis: {
                                  show: true,
                                  textStyle: {
                                      fontSize: '15',
                                      fontWeight: 'bold'
                                  }
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: true
                              }
                          },
                          data: seriesDatas
                      }]
                  };
                  Echarts.setOption(option, true);
                  var autoHeight = 1.5 * 150 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  Echarts.getDom().style.height = autoHeight + "px";
                  Echarts.resize();

              } else {
                var Tdatas = {
                    list:[]
                };
                $('#tab2TableDemo').html('');
                var tableHtml = template('tab2TableList', Tdatas);
                $('#tab2TableDemo').append(tableHtml);
                  $('#tab2Echart').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                  $('#tab2Echart').removeClass('aui-show').addClass('aui-hide');
                  Echarts.clear();
              }
          }
      });
  }

  function tab3(data) {
      var url = 'services/Report/CustomerCenter/GetStaffCall';
      if (data != "") {
          url = url + '?date=' + data + '';
      } else {
          var data = moment().format('YYYY-MM-DD');
          url = url + '?date=' + data + '';
      }

      fnGet(url, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {
                  $('#tab3Echart').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  $('#tab3EchartC').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  var nameList1 = ret.result.nameList;
                  var series1 = {
                      type: 'bar',
                      barWidth: '10%',
                      data: ret.result.dataList
                  }
                  var seriesDatas1 = [];
                  seriesDatas1.push(series1);
                  var pieChartList = ret.result.pieChartList;
                  var dataList = ret.result.dataList;
                  var seriesDatas = [];
                  var legendDatas = [];
                  for (var i = 0; i < pieChartList.length; i++) {
                      seriesDatas.push({
                          value: pieChartList[i].value,
                          name: pieChartList[i].name
                      });
                      legendDatas.push(pieChartList[i].name);
                  }
                  var param = {};
                  param.datas = nameList1;
                  param.tab = 'tab3';
                  param.date = data;
                  param = JSON.stringify(param);
                  $('#tab3mMore').attr('param', param);
                  var Echarts = echarts.init(document.getElementById('tab3Echart'));
                  var EchartsC = echarts.init(document.getElementById('tab3EchartC'));
                  var colors = ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'];
                  //  椭圆
                  var option = {
                      color: colors,
                      tooltip: {
                          trigger: 'item',
                          formatter: "{a} <br/>{b}: {c} ({d}%)"
                      },
                      legend: {
                          orient: 'horizontal',
                          icon: 'circle',
                          x: '10%',
                          y: '80%',
                          bottom: '25%',
                          data: legendDatas
                      },
                      series: [{
                          type: 'pie',
                          radius: ['50%', '70%'],
                          center: ['50%', '45%'],
                          avoidLabelOverlap: false,
                          label: {
                              normal: {
                                  show: false,
                                  position: 'center'
                              },
                              emphasis: {
                                  show: true,
                                  textStyle: {
                                      fontSize: '15',
                                      fontWeight: 'bold'
                                  }
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: true
                              }
                          },
                          data: seriesDatas
                      }]
                  };
                  // 圆柱
                  var option1 = {
                      color: colors,
                      tooltip: {
                          trigger: 'axis',
                          axisPointer: { // 坐标轴指示器，坐标轴触发有效
                              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                          }
                      },
                      grid: {
                          left: '3%',
                          right: '13%',
                          bottom: '3%',
                          top: '10%',
                          containLabel: true
                      },
                      xAxis: {
                          name: '(个)',
                          type: 'value',

                      },
                      yAxis: {
                          type: 'category',
                          data: nameList1,
                          formatter: function(value) {
                                    if (value.length > 5) {
                                        return value.substring(0, 5) + "...";
                                    } else {
                                        return value;
                                    }
                                }


                      },
                      series: seriesDatas1
                  };


                  Echarts.setOption(option1, true);
                  var autoHeight = nameList1.length * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  Echarts.getDom().style.height = autoHeight + "px";
                  Echarts.resize();
                  EchartsC.setOption(option, true);
                  var autoHeight = 4 * 30 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  EchartsC.getDom().style.height = autoHeight + "px";
                  EchartsC.resize();

              } else {
                  $('#tab2Echart').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
              }
          }
      });
  }

  function tab4(data) {
      var url = 'services/Report/CustomerCenter/GetStaffCharges';
      if (data != "") {
          url = url + '?date=' + data + '';
      } else {
          var data = moment().format('YYYY-MM-DD');
          url = url + '?date=' + data + '';
      }
      fnGet(url, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {
                   $('#tab4Echart').removeClass('aui-hide').addClass('aui-show');
                  $('#tab4Echart').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  var nameList = ret.result.nameList;
                  var series = {
                      type: 'bar',
                      barWidth: '20%',
                      data: ret.result.dataList
                  };
                  var seriesDatas = [];
                  seriesDatas.push(series);
                  var Tdatas = {
                      list: ret.result.tableList
                  };
                  $('#tab4TableDemo').html('');
                  var tableHtml = template('tab4TableList', Tdatas);
                  $('#tab4TableDemo').append(tableHtml);
                  var Echarts = echarts.init(document.getElementById('tab4Echart'));
                  var option = {
                      color: ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'],
                      tooltip: {
                          trigger: 'axis',
                          axisPointer: { // 坐标轴指示器，坐标轴触发有效
                              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                          }
                      },
                      tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                              type: 'shadow'
                          }
                      },

                      grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          top: '10%',
                          containLabel: true
                      },
                      xAxis: {
                          type: 'value',
                          axisLabel: {
                              rotate: 40
                          },
                      },
                      yAxis: {
                          name: '(万元)',
                          type: 'category',
                          data: nameList,
                          formatter: function(value) {
                                    if (value.length > 5) {
                                        return value.substring(0, 5) + "...";
                                    } else {
                                        return value;
                                    }
                                }
                      },
                      series: seriesDatas

                  };
                  Echarts.setOption(option, true);
                  var autoHeight = nameList.length+1 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  Echarts.getDom().style.height = autoHeight + "px";
                  Echarts.resize();

              } else {
                var Tdatas = {
                    list: []
                };
                $('#tab4TableDemo').html('');
                var tableHtml = template('tab4TableList', Tdatas);
                $('#tab4TableDemo').append(tableHtml);
                 $('#tab4Echart').removeClass('aui-show').addClass('aui-hide');
                  $('#tab4Echart').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
              }
          }
      });
  }


  // 档案统计Echart图
  var colors = ['#2BB0FD', '#10E1C4', '#7FD709', '#FDEF4D', '#FDC963', '#FFA75D', '#FD7A72', '#FE4747', '#FF61D2', '#B962FE', '#5B5AE9', '#2A8AFB'];

  function Filetab2() {
      var url1 = 'services/Report/Archive/GetWatermeterTypeStatistics?typeId=1';
      var url2 = 'services/Report/Archive/GetWatermeterTypeStatistics?typeId=2';
      fnGet(url1, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {
                  $('#tab2Echart1').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  var Echarts = echarts.init(document.getElementById('tab2Echart1'));
                  var result = ret.result;
                  var legendDatas = [];
                  var seriesDatas = [];
                  for (var i = 0; i < result.length; i++) {
                      legendDatas.push(result[i].name);
                      var series = {
                          name: result[i].name,
                          value: result[i].value
                      };
                      seriesDatas.push(series);
                  }
                  //  椭圆
                  var option = {
                      color: colors,
                      tooltip: {
                          trigger: 'item',
                          formatter: "{b}: {c} ({d}%)"
                      },
                      legend: {
                          orient: 'horizontal',
                          icon: 'circle',
                          x: '10%',
                          y: '80%',
                          bottom: '25%',
                          data: legendDatas
                      },
                      series: [{
                          name: '当月新增',
                          type: 'pie',
                          radius: ['40%', '60%'],
                          center: ['50%', '40%'],
                          avoidLabelOverlap: false,
                          label: {
                              normal: {
                                  show: false,
                                  position: 'center'
                              },
                              emphasis: {
                                  show: true,
                                  textStyle: {
                                      fontSize: '15',
                                      fontWeight: 'bold'
                                  }
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: true
                              }
                          },
                          data: seriesDatas
                      }]
                  };
                  Echarts.setOption(option, true);
                  var autoHeight = 3 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  Echarts.getDom().style.height = autoHeight + "px";
                  Echarts.resize();
              } else {
                  $('#tab2Echart1').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
              }
          }
      });

      fnGet(url2, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {
                  $('#tab2Echart2').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                  var Echarts = echarts.init(document.getElementById('tab2Echart2'));
                  var result = ret.result;
                  var legendDatas = [];
                  var seriesDatas = [];
                  for (var i = 0; i < result.length; i++) {
                      legendDatas.push(result[i].name);
                      var series = {
                          name: result[i].name,
                          value: result[i].value
                      };
                      seriesDatas.push(series);
                  }
                  //  椭圆
                  var option = {
                      color: colors,
                      tooltip: {
                          trigger: 'item',
                          formatter: "{b}: {c} ({d}%)"
                      },
                      legend: {
                          orient: 'horizontal',
                          icon: 'circle',
                          x: '10%',
                          y: '80%',
                          bottom: '25%',
                          data: legendDatas
                      },
                      series: [{
                        name: '累计用户',
                          type: 'pie',
                          radius: ['40%', '60%'],
                          center: ['50%', '40%'],
                          avoidLabelOverlap: false,
                          label: {
                              normal: {
                                  show: false,
                                  position: 'center'
                              },
                              emphasis: {
                                  show: true,
                                  textStyle: {
                                      fontSize: '15',
                                      fontWeight: 'bold'
                                  }
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: true
                              }
                          },
                          data: seriesDatas
                      }]
                  };
                  Echarts.setOption(option, true);
                  var autoHeight =3 * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
                  Echarts.getDom().style.height = autoHeight + "px";
                  Echarts.resize();
              } else {
                  $('#tab2Echart2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
              }
          }
      });
  }

  function Filetab3() {
    var data = moment().format('YYYY-MM');
    var url = 'services/Report/Finance/GetWaterNatureStatistics?date='+data+'&typeId=4';
    fnGet(url, {}, false, function(ret, err) {
        if (ret) {
            if (ret.success && ret.result != null) {
                // 累计
                var nameArry =ret.result.nameArry;
                var dataArray =ret.result.dataArray;
                // 当月
                var nameMonthArray =ret.result.nameMonthArray;
                var dataMonthArray =ret.result.dataMonthArray;
                if (nameMonthArray.length == 0) {
                    $('#tab3Echart1').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                } else {
                    $('#tab3Echart1').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                }
                if (nameArry.length== 0) {
                    $('#tab3Echart2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                } else {
                    $('#tab3Echart2').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                }
                // 当月
                if (nameMonthArray.length != 0) {
                    var Echarts1 = echarts.init(document.getElementById('tab3Echart1'));
                    var color = '#0c9ff4';
                    var param = {
                      datas:nameMonthArray,
                      type:'nameMonthArray',
                      date:data
                    };
                    param = JSON.stringify(param);
                    $('#tab3mMore1').attr('param',param);
                    GetWaterNatureStatistics(nameMonthArray,dataMonthArray,color,Echarts1);
                }
                // 累计
                if (nameArry.length != 0) {
                    var Echarts2 = echarts.init(document.getElementById('tab3Echart2'));
                    var color = '#fdc866';
                    var param = {
                      datas:nameArry,
                      type:'nameArry',
                      date:data
                    };
                    param = JSON.stringify(param);
                    $('#tab3mMore2').attr('param',param);
                    GetWaterNatureStatistics(nameArry,dataArray,color,Echarts2);
                }
            } else {
                $('#tab3Echart1').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                $('#tab3Echart2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
            }
        }
    });
  }

  function Filetab4() {
      var url = 'services/Report/Archive/GetWaterCaliberStatistics';
      fnGet(url, {}, false, function(ret, err) {
          if (ret) {
              if (ret.success && ret.result != null) {

                  var Echarts = echarts.init(document.getElementById('tab2Echart1'));
                  var result = ret.result;
                  var tab1Datas, tab2Datas;
                  // 当月
                  if (result[0] == null) {
                      $('#tab4Echart1').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                      tab1Datas = null;
                  } else {
                      $('#tab4Echart1').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                      tab1Datas = result[0];
                  }
                  // 累计
                  if (result[1] == null) {
                      $('#tab4Echart2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                      tab2Datas = null;
                  } else {
                      $('#tab4Echart2').siblings('.noData').removeClass('aui-show').addClass('aui-hide');
                      tab2Datas = result[1];
                  }
                  if (tab1Datas != null) {
                      var Echarts1 = echarts.init(document.getElementById('tab4Echart1'));
                      var nameList = tab1Datas.nameList;
                      var seriesDatas = tab1Datas.dataList;
                      var color = '#0c9ff4';
                      GetEcharts(nameList,seriesDatas,color,Echarts1,1);
                  }
                  if (tab2Datas != null) {
                      var Echarts2 = echarts.init(document.getElementById('tab4Echart2'));
                      var nameList = tab2Datas.nameList;
                      var seriesDatas = tab2Datas.dataList;
                      var color = '#fdc866';
                      GetEcharts(nameList,seriesDatas,color,Echarts2,2);
                  }
              } else {
                  $('#tab4Echart1').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
                  $('#tab4Echart2').siblings('.noData').removeClass('aui-hide').addClass('aui-show');
              }
          }
      });
  }
  function GetEcharts(nameList,seriesDatas,color,Echarts1,type){
    var Echarts = Echarts1;
    var top;
    var name;
    if(type==1){
      top = '30%';
      name = '当月新增用户';

    } else {
        top = '15%';
        name = '累计用户';
    }
    var option = {
        color:color,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter: '{b}毫米<br/>'+name+': {c}个'
        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top: top,
            containLabel: true
        },
        xAxis: {
            name:'(个)',
            type: 'value',
            axisTick: {
                show: false,
            },
            splitLine: {
            show:false,
          },
          axisLabel:{
         color:'#666'
          }
        },
            yAxis: {
            name:'(毫米)',
            type: 'category',
            axisTick: {
                show: false,
            },
            data: nameList,
            axisLabel:{
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
                barWidth:'20%',
                data: seriesDatas
            }

        ]
    };
    Echarts.setOption(option, true);
    var autoHeight = nameList.length * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
    Echarts.getDom().style.height = autoHeight + "px";
    Echarts.resize();
  }

 function GetWaterNatureStatistics(nameArry,dataArray,color,Echarts){
   var option = {
       color:color,
       tooltip: {
           trigger: 'axis',
           axisPointer: {
               type: 'line'
           }
       },
       grid: {
           left: '3%',
           right: '15%',
           bottom: '3%',
           top: '15%',
           containLabel: true
       },
       xAxis: {
           name:'(个)',
           type: 'value',
           axisTick: {
               show: false,
           },
           splitLine: {
           show:false,
         },
         axisLabel:{
         color:'#666',
         rotate :'40'
         }
       },
           yAxis: {
           type: 'category',
           axisTick: {
               show: false,
           },
           data: nameArry,
           axisLabel:{
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
               barWidth:'20%',
               data: dataArray
           }

       ]
   };
   Echarts.setOption(option, true);
   var autoHeight = nameArry.length * 50 + 50; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
   Echarts.getDom().style.height = autoHeight + "px";
   Echarts.resize();

 }
