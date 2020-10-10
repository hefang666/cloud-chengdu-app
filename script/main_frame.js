var vueInitData = {
    tenantName: "",
    allTenants: $api.getStorage('allTenants'),
    showTenantSelect: false,
    appView: $api.getStorage('isAppOrList') == undefined ? 'app' : $api.getStorage('isAppOrList'),
    appData: $api.getStorage('userLoginInformation') != undefined && $api.getStorage('userLoginInformation').appList != undefined ? $api.getStorage('userLoginInformation').appList : [],
    notices: [],
    isLoading: false,
    pieChartDom: null,
    taskCountSum: {
        waitNumber: 0,
        launchNumber: 0,
        handledNumber: 0
    },
    taskCountPie: [],
    // claimListData: [], //一键认领的数据
    userLoginInformation: $api.getStorage('userLoginInformation'), //存储组件化信息，应用列表信息，首页图表数据，zxf 2020-04-11
    claimContent: '认领列表', //任务认领显示问题
    showCbUpdateBtn: true, //是否显示抄表数据更新按钮 （有抄表管家应用才会显示）
    showClaimBtn: false, //是否显示一键认领
    showClearDataBtn: false, //是否显示清除数据按钮
    hasTaskListPower: false, //是否显示任务列表
    isShowClaimBox: false, //是否显示认领
    thirdPartyAccount: '', //第三方账号  zxf 20200729
    thirdPartyPassWord: '', //第三方账号  zxf 20200729
    isShowOperationBtnsBox: false, //是否显示首页更新数据按钮
    bannerImage:'../../image/main_frame/banner.png'
}

function fnInVue() {
    window.MainVue = new Vue({
        el: "#wrap",
        data: vueInitData,
        methods: {
            openTenantSelect: function() { //多租户时点击名字旁的箭头可切换租户
                this.showTenantSelect = !this.showTenantSelect;
                if (this.showTenantSelect) {
                    api.openFrame({
                        name: 'orgSelect_frame',
                        url: './orgSelect_frame.html',
                        rect: {
                            x: 0,
                            y: headerH,
                            w: 'auto',
                            h: 'auto'
                        },
                        pageParam: {
                            name: 'test'
                        },
                        bounces: false,
                        bgColor: 'rgba(0,0,0,0.38)',
                    });
                } else {
                    api.sendEvent({
                        name: 'closeOrgSelectFrm',
                    });
                }
            },
            getTenantInfo: function() { //获取租户名字
                var _this = this;
                fnGet('services/app/Home/GetLoginInfo', {}, false, function(ret, err) {
                    api.hideProgress();
                    if (ret && ret.success) {
                        _this.tenantName = ret.result.tenantInfo.tenantName;
                        $api.setStorage('getLoginInfo', ret.result);
                        if (ret.result.tenantInfo.tenantIdentifier != "" && ret.result.tenantInfo.tenantIdentifier == "cdzls") {
                            _this.isShowClaimBox = false; //是否显示一键认领
                            _this.showClearDataBtn = false; //是否显示清除数据按钮
                            _this.hasTaskListPower = false; //是否显示任务列表
                            _this.bannerImage = '../../image/main_frame/banner02.png';
                        } else {
                            _this.isShowClaimBox = true; //是否显示一键认领
                            _this.hasTaskListPower = true; //是否显示任务列表
                            _this.addNewScriptToHtml();
                        }
                    }
                });
            },
            openSearchApp: function() { //打开搜索应用界面
                api.openWin({
                    name: 'searchApp',
                    url: './searchApp.html',
                    pageParam: {
                        name: 'test'
                    }
                });
            },
            openScan: function() { //打开扫描二维码登录界面
                FNScanner.open({
                    rect: {
                        x: 0,
                        y: 0,
                        w: api.winWidth,
                        h: api.winHeight,
                    },
                    autorotation: true,
                    hintText: "支持扫码快速登录电脑版云平台",
                    font: {
                        lightText: {
                            size: 13,
                        }
                    }
                }, function(ret, err) {
                    if (ret.eventType == 'success') {
                        api.openWin({
                            name: 'sureLoginPC',
                            url: './sureLoginPC.html',
                            pageParam: {
                                name: 'test'
                            }
                        });
                        // alert(JSON.stringify(ret))
                    }
                });
            },
            changeView: function() { //应用列表切换显示（栅格/列表）
                if (this.appView == 'list') {
                    this.appView = 'app'
                } else {
                    this.appView = 'list'
                }
                $api.setStorage('isAppOrList', this.appView);
            },
            initChart: function() {
                this.pieChartDom = echarts.init(this.$refs.pieChart);
                this.setPieOption();
            },
            setPieOption: function() {
                var option = {
                    color: ["#2696FF", "#FFB515", "#05E058"],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                        position: 'inside'
                    },
                    series: [{
                        name: '我的任务',
                        type: 'pie',
                        radius: '80%',
                        center: ['50%', '50%'],
                        data: this.taskCountPie,
                        label: {
                            position: 'inside',
                            fontSize: 10,
                            formatter: function(e) {　　　　　
                                return e.percent + "%";　　
                            }
                        },
                        labelLine: {
                            length: 5,
                            length2: 5
                        }
                    }]
                };
                this.pieChartDom.setOption(option);
            },
            openMyTask: function(type) {
                api.openWin({
                    name: 'MyTask',
                    url: '../Task/MyTask.html',
                    bounces: api.systemType == 'ios' ? true : false,
                    pageParam: {
                        type: type
                    }
                });
            },
            openMyInitiate: function() {
                api.openWin({
                    name: 'MyInitiate',
                    url: '../Task/MyInitiate.html',
                    bounces: api.systemType == 'ios' ? true : false,
                });

            },
            openClaimTask: function() {
                api.openWin({
                    name: 'ClaimTask',
                    url: '../Task/ClaimTask.html',
                });
            },
            getAppList: function() { //获取应用列表
                var _this = this;
                fnGet('services/app/Home/GetHome', {}, false, function(ret, err) {
                    api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                            if (ret.result != null) {
                                // 获取gis地图的配置
                                _this.appData = ret.result.templateTitles;
                                // 19.12.12  保存应用列表到本地，用于无网络状态的时候，可以显示使用
                                var userLoginInformation = $api.getStorage('userLoginInformation');
                                userLoginInformation.appList = _this.appData;
                                _this.userLoginInformation.appList = _this.appData;
                                $api.setStorage('userLoginInformation', userLoginInformation);
                                // 调用模块版本更新方法(组件化)
                                CheckAppVsersionByTeantId();
                                // CheckAppVsersionByInfo();

                                _this.showCbUpdateBtn = false; //抄表更新按钮是否显示（有抄表管家才可以）

                                for (var i = 0; i < _this.appData.length; i++) {
                                    _this.appData[i]['hide'] = false;
                                    var app = _this.appData[i].applications;
                                    if (app == null) {
                                        app = [];
                                        _this.isShowOperationBtnsBox = false;
                                    }
                                    for (var j = 0; j < app.length; j++) {
                                        var Authorization = [];
                                        var data1 = {
                                            key: app[j].thirdPartyUserId
                                        }
                                        Authorization.push(data1);
                                        var data2 = {
                                            key: app[j].thirdPartyPassWord
                                        }
                                        Authorization.push(data2);
                                        // console.log(JSON.stringify(app[j]));
                                        if (app[j].coding == 'WaterStarOne-CRM-S8') {
                                            _this.isShowOperationBtnsBox = false;
                                            $api.setStorage('kfapipath', app[j].appServerApi + '/Api/');
                                              $api.setStorage('kfappServerApiIntranet', app[j].appServerApiIntranet + '/api/');
                                            $api.setStorage('kfUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('kfPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('kfHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-RIM-S8') {
                                            _this.isShowOperationBtnsBox = false;
                                            $api.setStorage('bzapipath', app[j].appServerApi + '/Api/');
                                              $api.setStorage('bzappServerApiIntranet', app[j].appServerApiIntranet + '/api/');
                                            $api.setStorage('bzUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('bzPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('bzHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-AM-S8') {
                                            _this.showClearDataBtn = true;
                                            _this.isShowOperationBtnsBox = true;

                                            $api.setStorage('jhapipath', app[j].appServerApi + '/api/');
                                            $api.setStorage('jhappServerApiIntranet', app[j].appServerApiIntranet + '/api/');
                                            $api.setStorage('jhUserName', app[j].thirdPartyUserName);
                                            $api.setStorage('jhUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('jhPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('jhHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-MRH-S8') {
                                            _this.showCbUpdateBtn = true;
                                            _this.isShowOperationBtnsBox = true;
                                            $api.setStorage('cbapipath', app[j].appServerApi);
                                            $api.setStorage('cbappServerApiIntranet', app[j].appServerApiIntranet);
                                            $api.setStorage('yptOperatorName', app[j].thirdPartyUserName);
                                            $api.setStorage('yptOperatorId', app[j].thirdPartyUserId);
                                            $api.setStorage('yptPassword', app[j].thirdPartyPassWord);
                                            $api.setStorage('cbHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-MMS-S8') {
                                            _this.showClearDataBtn = true;
                                            _this.isShowOperationBtnsBox = true;
                                            $api.setStorage('bwapipath', app[j].appServerApi);
                                            $api.setStorage('bwappServerApiIntranet', app[j].appServerApiIntranet);
                                            $api.setStorage('bwUserName', app[j].thirdPartyUserName);
                                            $api.setStorage('bwUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('bwPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('bwHeaders', JSON.stringify(Authorization));
                                            waterCreatTable();
                                        } else {
                                            _this.showClearDataBtn = false;
                                        }
                                        // if (app[j].productId == '10122') { //NewGis
                                        //     getAppMapSet();
                                        // }

                                    }
                                }
                                _this.thirdPartyAccount = $api.getStorage("jhUserName") != undefined && $api.getStorage("jhUserName") != '' ? $api.getStorage("jhUserName") : $api.getStorage("bwUserName") != undefined && $api.getStorage("bwUserName") != '' ? $api.getStorage("bwUserName") :
                                    $api.getStorage("yptOperatorName") != undefined && $api.getStorage("yptOperatorName") != '' ? $api.getStorage("yptOperatorName") : '';
                                _this.thirdPartyPassWord = $api.getStorage("jhPassWord") != undefined && $api.getStorage("jhPassWord") != '' ? $api.getStorage("jhPassWord") : $api.getStorage("bwPassWord") != undefined && $api.getStorage("bwPassWord") != '' ? $api.getStorage("bwPassWord") :
                                    $api.getStorage("yptPassword") != undefined && $api.getStorage("yptPassword") != '' ? $api.getStorage("yptPassword") : '';
                                $api.setStorage('thirdPartyAccount', _this.thirdPartyAccount);
                                $api.setStorage('thirdPartyPassWord', _this.thirdPartyPassWord);
                                var  getLoginInfo = $api.getStorage('getLoginInfo');
                                if (getLoginInfo.tenantInfo.tenantIdentifier != "" && getLoginInfo.tenantInfo.tenantIdentifier != "cdzls") {
                                    _this.GetUnconFirmedTaskCount(); //查询任务领用数量
                                    _this.GetTaskCount(); //获取任务数量统计，待处理，已处理等
                                    onCommentGetClassify(function(ret) {}); //获取我的任务中筛选数据
                                     //  检测一分钟后是否开启gps zxf 2020-04-12  成都自来水不需要这个
                                    oneMinuteCheckGPS(); //一分钟后判断是否开启了gps (成都自来水不需要此判断  20200820 11:02 zxf)
                                }
                            }
                        }
                    }
                });
            },
            hideAppList: function(i) { //点击箭头隐藏应用
                this.appData[i].hide = !this.appData[i].hide;
                this.appData = JSON.parse(JSON.stringify(this.appData));
            },
            alertClassify: function(app, index) { //弹出操作应用分类的弹窗
                api.openFrame({
                    name: 'classify_frame',
                    url: './classify_frame.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        classify: app,
                        index: index
                    },
                    bounces: false,
                    bgColor: 'rgba(0,0,0,0.6)',
                });
            },
            addApp: function(id) { //添加应用
                api.openWin({
                    name: 'addApp',
                    url: './addApp.html',
                    slidBackEnabled: false,
                    pageParam: {
                        id: id
                    }
                });
            },
            openApp: function(data) { //打开应用
                var that = this;
                if (data.openMobile) {
                    if ((data.iosPackage != "" && data.iosPackage != null) || (data.androidPackage != "" && data.androidPackage != null)) {
                        if (data.iosPackage != "" && data.iosPackage != null) {
                            if (api.systemType == 'ios') {
                                api.openApp({
                                    iosUrl: data.iosPackage,
                                    appParam: {},
                                }, function(ret, err) {

                                });
                            }
                        } else if (data.androidPackage != "" && data.androidPackage != null) {
                            //异步返回结果：
                            api.appInstalled({
                                appBundle: data.androidPackage
                            }, function(ret, err) {
                                if (ret.installed) {
                                    api.openApp({
                                        androidPkg: data.androidPackage,
                                        appParam: {},
                                    }, function(ret, err) {

                                    });

                                } else {
                                    //应用未安装
                                    api.toast({
                                        msg: '应用未安装',
                                        duration: 2000,
                                        location: 'top'
                                    });
                                }
                            });
                        }
                    } else if (data.mobileWebUrl != "" && data.mobileWebUrl != null) {
                        if (data.mobileWebUrl.indexOf('http') != -1) {
                            api.openWin({
                                name: 'OA',
                                url: './OA.html',
                                pageParam: {
                                    url: data.mobileWebUrl,
                                    productId: data.productId
                                }
                            });
                        } else {
                            var winName = data.mobileWebUrl;
                            var index = winName.lastIndexOf('/');
                            var index2 = winName.indexOf('.html');
                            if (index != -1 && index2 != -1) {
                                winName = winName.substring(index + 1, index2);
                            }
                            if (data.coding == 'WaterStarOne-CRM-S8') {
                                if (!data.thirdPartyUserId || !data.thirdPartyPassWord) {
                                    api.toast({
                                        msg: '请先关联客服系统账号！',
                                        duration: 2000,
                                        location: 'top'
                                    });
                                    return
                                }
                            } else if (data.coding == 'WaterStarOne-RIM-S8') {
                                if (!data.thirdPartyUserId || !data.thirdPartyPassWord) {
                                    api.toast({
                                        msg: '请先关联报装系统账号！',
                                        duration: 2000,
                                        location: 'top'
                                    });
                                    return
                                }
                            } else if (data.coding == 'WaterStarOne-AM-S8') {
                                // if (!data.thirdPartyUserId || !data.thirdPartyPassWord) {
                                //     api.toast({
                                //         msg: '请先关联稽核管理账号！',
                                //         duration: 2000,
                                //         location: 'top'
                                //     });
                                //     return
                                // }
                            }
                            checkZipDownloadSuccess(data, function(ret) {
                                if (ret == 1) {
                                    api.openWin({
                                        name: winName,
                                        url: data.mobileWebUrl,
                                        pageParam: {
                                            productId: data.productId
                                        }
                                    });
                                    return
                                }
                                if (ret) {
                                    setTimeout(function() {
                                        api.openWin({
                                            name: winName,
                                            url: data.mobileWebUrl,
                                            pageParam: {
                                                productId: data.productId
                                            }
                                        });
                                    }, 1000);
                                }
                            });

                        }
                    }
                }
            },
            getNotice: function() { //获取首页滚动播放的公告消息
                fnGet('services/app/Message/GetMessageList?MessageType=2&PageIndex=1&MaxResultCount=3', {}, false, function(ret, err) {
                    api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                            MainVue.notices = ret.result.items;
                        }
                    }
                })
            },
            openNoticeDetail: function(notice) { //单击公告进入公告详情
                api.openWin({
                    name: 'NoticeDetails',
                    url: '../message/NoticeDetails.html',
                    pageParam: notice
                });
            },
            onRefresh: function() {
                setTimeout(function() {
                    this.isLoading = false;
                }, 500);
            },
            GetUnconFirmedTaskCount: function() {
                var CurrentLocation = $api.getStorage('CurrentLocation');
                var _this = this;
                // 获取没有待领取的任务数量（用于判断是否显示一键领取）
                fnGet('services/app/WorkFlow/GetUnconFirmedTaskCount?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account=' + this.thirdPartyAccount + '&PassWord=' + this.thirdPartyPassWord + '', {}, false,
                    function(ret, err) {
                        api.hideProgress();
                        if (ret) {
                            if (ret.success) {
                                if (ret.result != 0) {
                                    _this.showClaimBtn = true;
                                    _this.claimContent = "您有新收到的任务!";
                                } else {
                                    _this.showClaimBtn = false;
                                    _this.claimContent = '认领列表';
                                }
                            }
                        }
                    });
            },
            GetTaskCount: function() {
                var CurrentLocation = $api.getStorage('CurrentLocation');
                var _this = this;
                fnGet('services/app/WorkFlow/GetTaskCount?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account=' + _this.thirdPartyAccount + '&PassWord=' + _this.thirdPartyPassWord + '', {}, false, function(ret, err) {
                    api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                            var result = ret.result;
                            _this.taskCountPie = [];
                            result.forEach(function(e) {
                                var obj = {
                                    value: e.count,
                                    name: e.statusFlagText
                                }
                                _this.taskCountPie.push(obj);
                                switch (true) {
                                    case e.statusFlag == 99:
                                        _this.taskCountSum.launchNumber = e.count;
                                        break;
                                    case e.statusFlag == 7:
                                        _this.taskCountSum.waitNumber = e.count;
                                        break;
                                    case e.statusFlag == 4:
                                        _this.taskCountSum.handledNumber = e.count;
                                        break;
                                }
                            });
                            var echartsObj = {
                                taskCountPie: _this.taskCountPie,
                                launchNumber: _this.taskCountSum.launchNumber,
                                waitNumber: _this.taskCountSum.waitNumber,
                                handledNumber: _this.taskCountSum.handledNumber,
                            }
                            _this.userLoginInformation.echartsObj = {};
                            _this.userLoginInformation.echartsObj = echartsObj;
                            _this.userLoginInformation.tenantName = _this.tenantName;
                            $api.setStorage('userLoginInformation', _this.userLoginInformation);
                            _this.initChart();
                        }
                    }
                });
            },
            isNetWork: function() { //判断当前是否有网络
                var _this = this;
                _this.tenantName = _this.userLoginInformation.tenantName != undefined ? _this.userLoginInformation.tenantName : '';
                if (api.connectionType == 'none' || api.connectionType == '2g') {
                    _this.taskClaimShow = false;
                    var userLoginInformation = $api.getStorage('userLoginInformation');
                    var eData = [{
                            value: 0,
                            name: "已发起"
                        }, {
                            value: 0,
                            name: "待处理"
                        }, {
                            value: 0,
                            name: "已处理"
                        }

                    ];
                    if (userLoginInformation != undefined) {
                        var echartsObj = userLoginInformation.echartsObj != undefined ? userLoginInformation.echartsObj : {};
                        _this.appData = userLoginInformation.appList != undefined ? userLoginInformation.appList : [];
                        _this.tenantName = _this.userLoginInformation.tenantName != undefined ? _this.userLoginInformation.tenantName : '';
                    }
                    var db = api.require("db");
                    var CurentUserName = $api.getStorage('loginData').userName;
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: ' SELECT * FROM myTaskSheet where userName ="' + CurentUserName + '" order by creationTime desc'
                    }, function(ret, err) {
                        if (ret.status) {
                            if (ret.data.length > 0) {
                                eData.forEach(function(e) {
                                    if (e.name == '待处理') {
                                        e.value = ret.data.length;
                                    }
                                });
                                _this.taskCountSum.launchNumber = 0;
                                _this.taskCountSum.handledNumber = 0;
                                _this.taskCountPie = eData;
                                _this.taskCountSum.waitNumber = ret.data.length;
                                _this.initChart();

                            } else {
                                _this.taskCountPie = eData;
                                _this.taskCountSum.handledNumber = 0;
                                _this.taskCountSum.waitNumber = 0;
                                _this.taskCountSum.waitNumber = ret.data.length;
                                _this.initChart();
                            }
                        }
                    });
                    _this.showClearDataBtn = true;
                } else {
                    _this.getAppList();
                    _this.getNotice();

                }

            },
            updateCbData: function() { //更新抄表数据
                var nowTime = moment(new Date()).format('YYYYMM');
                var CurentUserName = $api.getStorage('loginData').userName;
                var db = api.require("db");
                db.selectSql({
                    name: 'CBtest',
                    sql: 'SELECT * FROM MRM_DTR_BEAN where userName = "' + CurentUserName + '" and XZRQ = "' + nowTime + '"'
                }, function(ret, err) {
                    if (ret.status) {
                        if (ret.data.length > 0) {
                            dataQuery(false, function(ret) {
                                if (ret.status) {
                                    api.openFrame({
                                        name: 'delete_frame',
                                        url: '../delete_frame.html',
                                        rect: {
                                            x: 0,
                                            y: 0,
                                            w: 'auto',
                                            h: 'auto'
                                        },
                                        pageParam: {
                                            type: 'updateCbData'
                                        },
                                        bounces: false,
                                        bgColor: 'rgba(0,0,0,0.1)',
                                    });

                                } else {
                                    api.openWin({
                                        name: 'downLoadBasisData',
                                        url: 'fs://wgt/MeterReading/html/downLoadBasisData.html',
                                    });
                                }
                            });
                        } else {
                            api.openWin({
                                name: 'downLoadBasisData',
                                url: 'fs://wgt/MeterReading/html/downLoadBasisData.html',
                            });
                        }
                    } else {
                        api.openWin({
                            name: 'downLoadBasisData',
                            url: 'fs://wgt/MeterReading/html/downLoadBasisData.html',
                        });
                    }
                });
            },
            onClearLocalCompletedData: function() {
                api.openFrame({
                    name: 'delete_frame',
                    url: 'widget://html/delete_frame.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        type: 'ClearLocalCompletedData'
                    },
                    bounces: false,
                    bgColor: 'rgba(0,0,0,0.1)',
                });
            },
            addNewScriptToHtml: function() {
                addNewScript(function(ret) {
                    var hasAppList = ret;
                    addDynamicallyScript(hasAppList, function() {
                        if (hasAppList.meterManageNumber != 0) { //判断表务应用是否存在。存在则调用创建表
                            reviewTableNew(); //创建表务任务需要的表
                            createSelectData(); //表务下拉数据表
                            getSelectData(); //获取表务里面需要的下拉数据
                            bwauditCreatTable(); //创建停复水任务需要的表
                        }
                        if (hasAppList.auditNumber != 0) { //判断稽核应用是否存在。存在则调用创建表
                            auditSelectData(); //获取稽核里面需要的下拉数据
                            auditCreatTable(); //创建稽核任务需要的表
                        }
                    });
                });
            },
            fnCheckUpdate: function() {
                var mam = api.require('mam');
                mam.checkUpdate(function(ret, err) {
                    // console.log(JSON.stringify(ret))
                    // console.log(JSON.stringify(err))
                    if (ret.status) {
                        var result = ret.result;
                        if (result.update == true && result.closed == false) {
                            api.openFrame({
                                name: 'checkupdate_frm',
                                url: 'widget://html/mine/checkupdate_frm.html',
                                rect: {
                                    x: 0,
                                    y: 0,
                                    w: 'auto',
                                    h: 'auto'
                                },
                                pageParam: {
                                    version: result.version,
                                    updateTip: result.updateTip,
                                    source: result.source
                                },
                                bounces: false,
                                bgColor: 'rgba(0,0,0,0.4)',
                            });
                        }
                    }
                })
            }
        },
        mounted: function() {
            this.isNetWork();
            this.getTenantInfo();
            this.fnCheckUpdate();
        },
        computed: {
            appList: function() {
                var data = JSON.parse(JSON.stringify(this.appData));
                var url = apiUrl;
                for (var i = 0; i < data.length; i++) {
                    data[i]['rowsData'] = [];
                    if (data[i].applications != null) {
                        var appData = data[i].applications;
                        for (var j = 0; j < appData.length; j++) {
                            appData[j]['logoUrl'] = url + appData[j].productIcon;
                        }
                        var addData = {
                            isAdd: true
                        }
                        appData.push(addData);
                        if (appData.length % 4 == 0) {
                            rows = (appData.length + 1) / 4;
                        } else {
                            rows = parseInt(appData.length / 4) + 1;
                        }
                        for (var k = 0; k < rows; k++) {
                            var arr = [];
                            for (var m = 4 * k; m < 4 * (k + 1); m++) {
                                if (appData[m] != null) {
                                    arr.push(appData[m]);
                                }
                            }
                            data[i].rowsData.push(arr);
                        }
                    } else {
                        data[i].applications = [];
                        var appData = data[i].applications;
                        var addData = {
                            isAdd: true
                        }
                        appData.push(addData);
                        if (appData.length % 4 == 0) {
                            rows = (appData.length + 1) / 4;
                        } else {
                            rows = parseInt(appData.length / 4) + 1;
                        }
                        for (var k = 0; k < rows; k++) {
                            var arr = [];
                            for (var m = 4 * k; m < 4 * (k + 1); m++) {
                                if (appData[m] != null) {
                                    arr.push(appData[m]);
                                }
                            }
                            data[i].rowsData.push(arr);
                        }
                    }
                }
                return data
            }
        },

    })
}

function closeView() {
    FNScanner.closeView();
}
