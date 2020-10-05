// 认领吃成功后，更新云平台我的任务的表的相应数据
function updateMyTaskSheets(item) {
    item.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    if (item.url != "" && item.url != null && item.url != 'string') {
        var urlAarry = item.url.split('|');
        var detailUrl = urlAarry[1].substring(2, urlAarry[1].length);
        item.handleUrl = urlAarry[0].substring(2, urlAarry[0].length);
        item.detailUrl = urlAarry[1].substring(2, urlAarry[1].length);
    } else {
        item.handleUrl = "";
        item.detailUrl = "";
    }
    if (item.taskCode == null || item.taskCode == undefined) {
        item.taskCode = "";
    }
    switch (true) {
        case item.productCode == 'WaterStarOne-MMS-S8':
            item.picType = 'biaowu';
            break;
        case item.productCode == 'WaterStarOne-AM-S8':
            item.picType = 'yinxiao';
            break;
        case item.productCode == 'WaterStarOne-MRH-S8':
            item.picType = 'chaobiao';
            break;
    }
    var isBatch = 0; // 0 表示false ，1 表示 true
    if (item.isBatch == true) {
        isBatch = 1;
    } else {
        isBatch = 0;
    }
    var CurentUserName = $api.getStorage('loginData').userName;
    var customerName = item.customerName != null ? item.customerName : "";
    var customerAddress = item.customerAddress != null ? item.customerAddress : "";
    var db = api.require("db");
    var SheetId = 0;
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'select Id from myTaskSheet order by Id desc limit 1'
    }, (ret, err) => {
        if (ret.status) {
            if (ret.data.length > 0) {
                SheetId = ret.data[0].Id;
                SheetId++;
            }
        }
    });
    var isBatch = 0; // 0 表示false ，1 表示 true
    if (item.isBatch == true) {
        isBatch = 1;
    } else {
        isBatch = 0;
    }
    if (item.templateId == 21) {
        var selectsql = `select * FROM myTaskSheet where taskCode='${item.taskCode}' and userName = "${CurentUserName}"`;
    } else if (item.templateId == 4) {
        var selectsql = `select * FROM myTaskSheet where taskCode='${item.taskCode}' and userName = "${CurentUserName}"`;
    } else {
        var selectsql = `select * FROM myTaskSheet where taskCode='${item.taskCode}' and userName = "${CurentUserName}"`;
    }
    db.selectSql({
        name: 'Wsdatabase',
        sql: selectsql
    }, function(ret, err) {
        if (ret.status) {
            if (ret.data.length == 0) {
                db.executeSql({
                    name: 'Wsdatabase',
                    sql: `Insert into myTaskSheet  (Id,thirdTaskId,taskCode,creationTime,submitNum,statusFlag,statusFlagText,productId,productName,ClaimTime,productCode,handleUrl,detailUrl,name,taskId,templateId,customerName,customerAddress,isBatch,taskCount,tbdCount,userName,ybCount,unconFirmedCount,bookName,bookId,orderNO,isSaveLocal,customerCode ) values (${SheetId},${item.thirdTaskId},"${item.taskCode}","${item.creationTime}",${item.submitNum},${item.statusFlag},"${item.statusFlagText}",${item.productId},"${item.productName}","${item.time}","${item.productCode}","${item.handleUrl}","${item.detailUrl}","${item.name}","${item.taskCode}",
              "${item.templateId}","${item.customerName!=null?item.customerName:""}","${item.customerAddress!=null?item.customerAddress:""}",${isBatch},${item.taskCount},${item.tbdCount},"${CurentUserName}",${item.ybCount},${item.unconFirmedCount},"${item.bookName}",${item.bookId},${item.orderNO},0,"${item.customerCode}")`
                }, (ret, err) => {
                    if (ret.status) {

                    } else {}
                });
            } else {
                db.executeSql({
                    name: 'Wsdatabase',
                    sql: `UPDATE myTaskSheet set thirdTaskId=${item.thirdTaskId},taskCode ="${item.taskCode}",creationTime="${item.creationTime}",submitNum="${item.submitNum}",statusFlag=${item.statusFlag},productId=${item.productId},productName="${item.productName}",ClaimTime="${item.time}",productCode="${item.productCode}",handleUrl="${item.handleUrl}",detailUrl="${item.detailUrl}",name="${item.name}",taskId="${item.taskCode}",templateId="${item.templateId}",customerName="${customerName}",customerAddress="${customerAddress}",isBatch=${isBatch},taskCount=${item.taskCount},tbdCount=${item.tbdCount},userName="${CurentUserName}",ybCount=${item.ybCount},unconFirmedCount=${item.unconFirmedCount},bookName="${item.bookName}",bookId=${item.bookId},orderNO=${item.orderNO},customerCode = "${item.customerCode}" where taskCode="${item.taskCode}" and userName = "${CurentUserName}"`
                }, function(ret, err) {
                    if (ret.status) {

                    }
                });

            }
        }
    });
}


//水表维护认领数据存储在本地 （我的任务点击认领进来）
function getMeterNoDataToLocal(cloudData, type = 'single', taskNoArray = "") { //type='single'表示从认领页面单个认领 ，multiple 多个任务编号，一键认领
    var Parameter = {
        TaskNo: type == 'single' ? cloudData.taskCode : taskNoArray, //api.pageParam.data.taskCode
        Status: "7", //认领后状态为7 ，待认领为1，已办理，已停止等为4.5，6
        CustomerCode: ""
    };
    var body = {
        body: JSON.stringify({
            Method: "MMS002",
            UserName: $api.getStorage("bwUserName"), //"01012"
            Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
            SerialNo: '',
            KeyCode: '', //营业
            Parameter: JSON.stringify(Parameter)
        })
    };
    api.ajax({
        url: `${$api.getStorage("bwapipath")}/api/waterMeters/info`,
        method: 'post',
        dataType: "json",
        returnAll: false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": $api.getStorage("bwHeaders")
        },
        data: body
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            if (ret.Status == 0) {
                var result = JSON.parse(ret.Data);
                insertMeterNoToLocalDataBase(cloudData, result, type);
            }
        }
    });
}

// 水表维护页面插入数据也调用此方法
function insertMeterNoToLocalDataBase(cloudData, resultData, type = 'single', fromPage = "", callback = {}) { //插入数据到本地  fromPage 用于判断是否是从水表维护页面调用该方法
    var db = api.require("db");
    var data = resultData;
    var tableId = 0;
    var insertNumbers = 0;
    var CurentUserName = $api.getStorage('loginData').userName;
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'select id from meterNoSheets order by id desc limit 1'
    }, (ret, err) => {
        if (ret.status) {
            if (ret.data.length > 0) {
                tableId = ret.data[0].id;
            }
        }
    });
    for (let i = 0; i < data.length; i++) {
        (function(i) {
            if (type == 'single') {
                var cloudTaskCode = cloudData.taskCode;
                var cloudTasKId = cloudData.taskCode; // 20200807 14:47  修改id为taskCode zxf
                var cloudTasKThirdTaskId = cloudData.thirdTaskId;
                var creationTime = cloudData.creationTime;
            } else {
                for (let j = 0; j < cloudData.length; j++) {
                    if (cloudData[j].taskCode == data[i].TaskNo) {
                        var cloudTaskCode = cloudData[j].taskCode;
                        var cloudTasKId = cloudData[j].taskCode; // 20200807 14:47  修改id为taskCode zxf
                        var cloudTasKThirdTaskId = cloudData[j].thirdTaskId;
                        var creationTime = cloudData[j].creationTime;
                        break;
                    }
                }
            }
            // 保存数据
            db.selectSql({
                name: 'Wsdatabase',
                sql: `SELECT * FROM meterNoSheets where cloudTaskCode ="${cloudTaskCode}" and CustomerCode="${data[i].CustomerCode}" and Status = "7" and userName = "${CurentUserName}"`
            }, (ret, err) => {
                if (ret.status) {
                    if (ret.data.length == 0) {
                        tableId++;
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: `INSERT INTO meterNoSheets (id,cloudTaskCode,cloudTasKId,cloudTasKThirdTaskId,Status,StatusName,CustomerCode,CustomerName,Address,Location,Nature, Caliber,MeterType,StampNo,waterLon,waterlat,taskClaimTime,taskId,isUpload,UploadErrMsg,userName,isSaveLocal) VALUES (${tableId},"${cloudTaskCode}","${cloudTasKId}","${cloudTasKThirdTaskId}","${data[i].Status}","${data[i].StatusName}","${data[i].CustomerCode}","${data[i].CustomerName}","${data[i].Address}","${data[i].Location}","${data[i].Nature}","${data[i].Caliber}","${data[i].MeterType}","${data[i].StampNo}","","","${creationTime}","${data[i].Id}",0,"","${CurentUserName}",0)`
                        }, function(ret, err) {
                            if (ret.status) {
                                insertNumbers++;
                                // 插入日志信息
                                if (insertNumbers == data.length) {
                                    var time = moment().format('YYYY-MM-DD HH:mm:ss');
                                    db.executeSql({
                                        name: 'Wsdatabase',
                                        sql: 'INSERT into Logsheet (Id,content,time,userName) values (' + i + ',"水表维护数据下载成功","' + time + '","' + CurentUserName + '")'
                                    }, function(ret, err) {
                                        if (ret.status) {
                                            //  ////console.log( "日志添加成功");
                                        } else {
                                            ////console.log(JSON.stringify(err));
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        // // 删除本地其他状态的数据
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: `DELETE FROM meterNoSheets WHERE cloudTaskCode = "${cloudTaskCode}" and CustomerCode="${data[i].CustomerCode}" and Status != "7" and userName = "${CurentUserName}"`
                        }, function(ret, err) {
                            if (ret.status) {}
                        });
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: `UPDATE  meterNoSheets set Status ="${data[i].Status}",StatusName = "${data[i].StatusName}",CustomerName="${data[i].CustomerName}",Address="${data[i].Address}",Location="${data[i].Location}",Nature="${data[i].Nature}", Caliber="${data[i].Caliber}",MeterType="${data[i].MeterType}" where cloudTaskCode ="${cloudTaskCode}" and CustomerCode="${data[i].CustomerCode}" and Status = "7" and userName = "${CurentUserName}"`
                        }, function(ret, err) {
                            if (ret.status) {}
                        });
                    }
                }
            });
            if (i == data.length - 1 && fromPage != "") { //输入添加到本地完成
                callback();
            }
            // if (i == data.length - 1 && fromPage!="" && fromPage =='meterNoAll') { //输入添加到本地完成
            //  meterAllDataNumber++;
            //   if(meterAllDataNumber < meterAllData.length){
            //      getMeterNoDataToLocal(meterNoConfirmTaskAllData[meterAllDataNumber],'meterNoAll');
            //   }
            // }
        })(i);
    }
}

// 云平台一键认领任务

function meterNoConfirmTaskAllData(data) {
    var number = 0;
    var meterNoTaskNoArray = '',
        auditTaskNoArray = '',
        taskNoAll = '',
        reviewTaskNoAll = '';
    var taskNoArr = [];
    data.forEach(function(item, index) {
        number++;
        if (item.templateId == 21) { //水表维护
            meterNoTaskNoArray += item.taskCode + ',';
        }
        if (item.templateId == 4) { //停水通知单
            taskNoAll += item.taskCode + ',';
            taskNoArr.push(item);
        }

        if (item.templateId == 2) {
            auditTaskNoArray += item.taskCode + ',';
        }
        if (item.templateId != 21 && item.templateId != 4 && item.templateId != 2) { //移改提，三来，换表等任务
            reviewTaskNoAll += item.taskCode + ',';
        }
        if (number == data.length) {
            if (meterNoTaskNoArray != '') {
                meterNoTaskNoArray = meterNoTaskNoArray.substring(0, meterNoTaskNoArray.length - 1);
                getMeterNoDataToLocal(data, 'multiple', meterNoTaskNoArray);
            }
            if (taskNoAll != '') {
                taskNoAll = taskNoAll.substring(0, taskNoAll.length - 1);
                savePostingList(taskNoAll, taskNoArr); // 张贴列表
            }
            if (reviewTaskNoAll != "") {
                reviewTaskNoAll = reviewTaskNoAll.substring(0, reviewTaskNoAll.length - 1)
                saveReviewList(reviewTaskNoAll);
            }
            if (auditTaskNoArray != "") {
                auditTaskNoArray = auditTaskNoArray.substring(0, auditTaskNoArray.length - 1);
                bwsaveAuditList(auditTaskNoArray); //停复水
            }
        }
    });
}
// 水表维护方法结束

// 张贴列表方法开始
// 张贴列表数据保存
function onsingleTaskClaim(item) {
    if (item.templateId == 4) {
        var WorkTypeId = item.taskCode;
        var userName = $api.getStorage('loginData').userName;
        PostingList(WorkTypeId, userName, item); //张贴列表单个
    }
    if (item.templateId == 21) {
        getMeterNoDataToLocal(item, 'single'); //水表维护单个任务
    }
    if (item.templateId == 2 || item.templateId == 41 || item.templateId == 42) {
        var auditTaskNoArray = item.taskCode;
        bwsaveAuditList(auditTaskNoArray); //停复水
    }
    if (item.templateId != 21 && item.templateId != 4 && item.templateId != 2) { //移改提，三来，换表等任务
        var reviewTaskNoAll = item.taskCode;
        saveReviewList(reviewTaskNoAll);
    }
}

function PostingList(WorkTypeId, userName, item) {
    var db = api.require("db");
    var WorkTypeCode = item.id;
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM POSTING_LIST where Status ="7" AND NotUploader ="0" and TaskNo = "' + WorkTypeId + '" AND userName = "' + userName + '"'
    }, function(ret, err) {
        if (ret.status) {
            ////console.log(WorkTypeId)
            if (ret.data.length > 0) {
                ////console.log(WorkTypeId)
                var dataBase = ret.data;
                // 1查询待处理
                // 判断是否有网
                if (api.connectionType != 'none') {

                    var dataBaseDC = []; //将离线待处理的循环处理出来
                    for (var i = 0; i < dataBase.length; i++) {
                        if (dataBase[i].Status == "7") {
                            dataBaseDC.push(dataBase[i])
                        }
                    }
                    ////console.log(JSON.stringify(dataBaseDC.length))
                    api.showProgress({
                        style: 'default',
                        animationType: 'fade',
                        title: '加载中...',
                        modal: false
                    });

                    var data = {
                        TaskNo: WorkTypeId
                    }
                    dataList = {
                        values: {
                            Method: 'MMS002',
                            UserName: $api.getStorage("bwUserName"),
                            Password: $api.getStorage("bwPassWord"),
                            SerialNo: '',
                            KeyCode: '',
                            Parameter: "{'TaskNo':'" + WorkTypeId + "'}"
                        }
                    }

                    api.ajax({
                        url: $api.getStorage("bwapipath") + '/api/waterMeters/info',
                        method: 'post',
                        dataType: 'json',
                        returnAll: false,
                        data: dataList
                    }, function(ret, err) {
                        if (ret) {
                            api.hideProgress();
                            if (ret && ret.Status == '0') {


                                var AllData = JSON.parse(ret.Data)
                                    // 已提交
                                var dataBaseYC = []; //已提交
                                for (var j = 0; j < AllData.length; j++) {
                                    if (AllData[j].Status != "7" && AllData[j].Status != "0" && AllData[j].Status != "1") {
                                        dataBaseYC.push(AllData[j])
                                    }
                                }


                                var datalist = [] //将在线待处理的数据将其循环出来
                                for (var i = 0; i < AllData.length; i++) {
                                    if (AllData[i].Status == "7") {
                                        datalist.push(AllData[i])
                                    }
                                }
                                // alert(111)

                                // 循环在线已终止
                                var Yzhongzhi = [] //
                                for (var i = 0; i < AllData.length; i++) {
                                    if (AllData[i].Status == "3") {
                                        Yzhongzhi.push(AllData[i])
                                    }
                                }
                                ////console.log(JSON.stringify(Yzhongzhi))
                                for (var i = 0; i < Yzhongzhi.length; i++) {
                                    var DeleteData = db.executeSqlSync({
                                        name: 'Wsdatabase',
                                        sql: 'DELETE FROM POSTING_LIST where Id = "' + Yzhongzhi[i].Id + '" AND userName = "' + userName + '"'
                                    }); //
                                    ////console.log(JSON.stringify(DeleteData))
                                }

                                // 每次刷新改变张贴总数
                                var AllDataNumer = datalist.length + dataBaseYC.length;
                                var UpdateList = db.executeSqlSync({
                                    name: 'Wsdatabase',
                                    sql: 'UPDATE POSTING_LIST SET NotSubmit="' + AllDataNumer + '"  WHERE TaskNo = "' + WorkTypeId + '" AND userName = "' + userName + '"'
                                });


                                // 判断在线待处理和离线待处理长度是否一样不一样重新下载
                                if (datalist.length == dataBaseDC.length) {

                                } else {
                                    // 将离线在线数据进行比较将不同的数据提取出来
                                    // 1、数据比较定义一个比较函数
                                    // 判读是否有新的数据
                                    var Booksdata = [];
                                    for (var i = 0; i < datalist.length; i++) {
                                        var float = true;
                                        for (var j = 0; j < dataBaseDC.length; j++) {

                                            if (datalist[i].CustomerCode == dataBaseDC[j].CustomerCode) {
                                                float = false;
                                                break;
                                            } else {
                                                float = true; //不相等单出去

                                            }

                                        }
                                        if (float) {
                                            Booksdata.push(datalist[i])
                                        }
                                    }
                                    // Booksdata是比较后的数组将其插入
                                    for (var i in Booksdata) {
                                        var sql = 'INSERT INTO POSTING_LIST(Id, Source, Code, Name, StatusName, Status, CustomerCode, CustomerName, Address, Location,' +
                                            'Nature,' +
                                            'SubNature,' +
                                            'Caliber,' +
                                            'Nameplate,' +
                                            'MeterType,' +
                                            'StampNo,' +
                                            'LastScale,' +
                                            'BeginScale,' +
                                            'EndScale,' +
                                            'Amount,' +
                                            'ArrearMoney,' +
                                            'Description,' +
                                            'Remark,' +
                                            'RemarkText,' +
                                            'OperatorId,' +
                                            'OperatedTime,' +
                                            'TaskNo,' +
                                            'DispatchTime,' +
                                            'RecordBeginScale,' +
                                            'RecordEndScale,' +
                                            'RecordAmount,' +
                                            'RecordTypdId,' +
                                            'RecordTypdName,' +
                                            'LastReadScale,' +
                                            'AuditReadScale,' +
                                            'AuditTime,' +
                                            'AuditStatus,' +
                                            'HandleTime,' +
                                            'AuditTimes,' +
                                            'UseTime,' +
                                            'NotSave,' +
                                            'Files,' +
                                            'TaskId,' +
                                            'StatusUser,' +
                                            'NotUploader,' +
                                            'userName,' +
                                            'NotSubmit) VALUES ("' + Booksdata[i].Id + '",' +
                                            '"' + Booksdata[i].Source + '",' +
                                            '"' + Booksdata[i].Code + '",' +
                                            '"' + Booksdata[i].Name + '",' +
                                            '"' + Booksdata[i].StatusName + '",' +
                                            '"' + Booksdata[i].Status + '",' +
                                            '"' + Booksdata[i].CustomerCode + '",' +
                                            '"' + Booksdata[i].CustomerName + '",' +
                                            '"' + Booksdata[i].Address + '",' +
                                            '"' + Booksdata[i].Location + '",' +
                                            '"' + Booksdata[i].Nature + '",' +
                                            '"' + Booksdata[i].SubNature + '",' +
                                            '"' + Booksdata[i].Caliber + '",' +
                                            '"' + Booksdata[i].Nameplate + '",' +
                                            '"' + Booksdata[i].MeterType + '",' +
                                            '"' + Booksdata[i].StampNo + '",' +
                                            '"' + Booksdata[i].LastScale + '",' +
                                            '"' + Booksdata[i].BeginScale + '",' +
                                            '"' + Booksdata[i].EndScale + '",' +
                                            '"' + Booksdata[i].Amount + '",' +
                                            '"' + Booksdata[i].ArrearMoney + '",' +
                                            '"' + Booksdata[i].Description + '",' +
                                            '"",' +
                                            '"' + Booksdata[i].Remark + '",' +
                                            '"' + Booksdata[i].OperatorId + '",' +
                                            '"' + Booksdata[i].OperatedTime + '",' +
                                            '"' + Booksdata[i].TaskNo + '",' +
                                            '"' + Booksdata[i].DispatchTime + '",' +
                                            '"' + Booksdata[i].RecordBeginScale + '",' +
                                            '"' + Booksdata[i].RecordEndScale + '",' +
                                            '"' + Booksdata[i].RecordAmount + '",' +
                                            '"' + Booksdata[i].RecordTypdId + '",' +
                                            '"' + Booksdata[i].RecordTypdName + '",' +
                                            '"' + Booksdata[i].LastReadScale + '",' +
                                            '"' + Booksdata[i].AuditReadScale + '",' +
                                            '"' + Booksdata[i].AuditTime + '",' +
                                            '"' + Booksdata[i].AuditStatus + '",' +
                                            '"' + Booksdata[i].HandleTime + '",' +
                                            '"' + Booksdata[i].AuditTimes + '",' +
                                            '"' + Booksdata[i].UseTime + '",' +
                                            '"0",' +
                                            '"",' +
                                            '"' + WorkTypeId + '",' + //WorkTypeCode 改为  WorkTypeId  20200807 15:49 zxf
                                            '"0",' +
                                            '"0",' +
                                            '"' + userName + '",' +
                                            '"' + AllDataNumer + '")';
                                        var PostingListret = db.executeSqlSync({
                                            name: 'Wsdatabase',
                                            sql: sql
                                        });
                                        ////console.log(JSON.stringify(PostingListret))
                                    }
                                }

                            } else {

                                api.toast({
                                    msg: ret.Message,
                                    duration: 2000,
                                    location: 'middle'
                                });
                                // DloadPostingData()
                            }
                        } else {
                            ////console.log( JSON.stringify( err ) );
                        }
                    });

                } else {
                    api.toast({
                        msg: '未连接网络',
                        duration: 2000,
                        location: 'middle'
                    });

                    // DloadPostingData()
                }
            } else {
                // 第一次下载数据
                oneOnlienData(WorkTypeId, userName, WorkTypeCode)
            }
        } else {
            // ////console.log( JSON.stringify( err ) );
        }
    });
}
// 第一次下载待处理任务
function oneOnlienData(WorkTypeId, userName, WorkTypeCode) {
    var db = api.require("db");
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        modal: false
    });

    dataList = {
        values: {
            Method: 'MMS002',
            UserName: $api.getStorage("bwUserName"),
            Password: $api.getStorage("bwPassWord"),
            SerialNo: '',
            KeyCode: '',
            Parameter: "{'TaskNo':'" + WorkTypeId + "'}"
        }
    }

    api.ajax({
        url: $api.getStorage("bwapipath") + '/api/waterMeters/info',
        method: 'post',
        dataType: 'json',
        returnAll: false,
        data: dataList
    }, function(ret, err) {
        if (ret) {
            api.hideProgress();
            if (ret && ret.Status == '0') {
                var Booksdata = [];
                var dataList = JSON.parse(ret.Data);
                var dataBaseDC = []; //待处理
                var dataBaseYC = []; //已提交
                var dataBaseCL = []; //处理中
                for (var j = 0; j < dataList.length; j++) {
                    if (dataList[j].Status == "1") {
                        dataBaseDC.push(dataList[j])
                    }
                }
                for (var j = 0; j < dataList.length; j++) {
                    if (dataList[j].Status == "7") {
                        dataBaseCL.push(dataList[j])
                        Booksdata.push(dataList[j])
                    }
                }
                for (var j = 0; j < dataList.length; j++) {
                    if (dataList[j].Status != "7" && dataList[j].Status != "0" && dataList[j].Status != "1") {
                        dataBaseYC.push(dataList[j])
                    }
                }
                var numerCtent = dataBaseCL.length + dataBaseYC.length;
                // 循环数据下载
                for (var i in Booksdata) {
                    var sql = 'INSERT INTO POSTING_LIST(Id, Source, Code, Name, StatusName, Status, CustomerCode, CustomerName, Address, Location,' +
                        'Nature,' +
                        'SubNature,' +
                        'Caliber,' +
                        'Nameplate,' +
                        'MeterType,' +
                        'StampNo,' +
                        'LastScale,' +
                        'BeginScale,' +
                        'EndScale,' +
                        'Amount,' +
                        'ArrearMoney,' +
                        'Description,' +
                        'Remark,' +
                        'RemarkText,' +
                        'OperatorId,' +
                        'OperatedTime,' +
                        'TaskNo,' +
                        'DispatchTime,' +
                        'RecordBeginScale,' +
                        'RecordEndScale,' +
                        'RecordAmount,' +
                        'RecordTypdId,' +
                        'RecordTypdName,' +
                        'LastReadScale,' +
                        'AuditReadScale,' +
                        'AuditTime,' +
                        'AuditStatus,' +
                        'HandleTime,' +
                        'AuditTimes,' +
                        'UseTime,' +
                        'NotSave,' +
                        'Files,' +
                        'TaskId,' +
                        'StatusUser,' +
                        'NotUploader,' +
                        'userName,' +
                        'NotSubmit) VALUES ("' + Booksdata[i].Id + '",' +
                        '"' + Booksdata[i].Source + '",' +
                        '"' + Booksdata[i].Code + '",' +
                        '"' + Booksdata[i].Name + '",' +
                        '"' + Booksdata[i].StatusName + '",' +
                        '"' + Booksdata[i].Status + '",' +
                        '"' + Booksdata[i].CustomerCode + '",' +
                        '"' + Booksdata[i].CustomerName + '",' +
                        '"' + Booksdata[i].Address + '",' +
                        '"' + Booksdata[i].Location + '",' +
                        '"' + Booksdata[i].Nature + '",' +
                        '"' + Booksdata[i].SubNature + '",' +
                        '"' + Booksdata[i].Caliber + '",' +
                        '"' + Booksdata[i].Nameplate + '",' +
                        '"' + Booksdata[i].MeterType + '",' +
                        '"' + Booksdata[i].StampNo + '",' +
                        '"' + Booksdata[i].LastScale + '",' +
                        '"' + Booksdata[i].BeginScale + '",' +
                        '"' + Booksdata[i].EndScale + '",' +
                        '"' + Booksdata[i].Amount + '",' +
                        '"' + Booksdata[i].ArrearMoney + '",' +
                        '"' + Booksdata[i].Description + '",' +
                        '"",' +
                        '"' + Booksdata[i].Remark + '",' +
                        '"' + Booksdata[i].OperatorId + '",' +
                        '"' + Booksdata[i].OperatedTime + '",' +
                        '"' + Booksdata[i].TaskNo + '",' +
                        '"' + Booksdata[i].DispatchTime + '",' +
                        '"' + Booksdata[i].RecordBeginScale + '",' +
                        '"' + Booksdata[i].RecordEndScale + '",' +
                        '"' + Booksdata[i].RecordAmount + '",' +
                        '"' + Booksdata[i].RecordTypdId + '",' +
                        '"' + Booksdata[i].RecordTypdName + '",' +
                        '"' + Booksdata[i].LastReadScale + '",' +
                        '"' + Booksdata[i].AuditReadScale + '",' +
                        '"' + Booksdata[i].AuditTime + '",' +
                        '"' + Booksdata[i].AuditStatus + '",' +
                        '"' + Booksdata[i].HandleTime + '",' +
                        '"' + Booksdata[i].AuditTimes + '",' +
                        '"' + Booksdata[i].UseTime + '",' +
                        '"0",' +
                        '"",' +
                        '"' + WorkTypeId + '",' + //WorkTypeCode 改为 WorkTypeId  20200807 15:49 zxf
                        '"0",' +
                        '"0",' +
                        '"' + userName + '",' +
                        '"' + numerCtent + '")';
                    var PostingListret = db.executeSqlSync({
                        name: 'Wsdatabase',
                        sql: sql
                    });
                    // ////console.log(JSON.stringify(PostingListret))

                }
            } else {
                api.toast({
                    msg: ret.Message,
                    duration: 2000,
                    location: 'middle'
                });

            }
        } else {
            // ////console.log( JSON.stringify( err ) );
        }
    });


}
// 张贴列表一键认领
//一键认领 - 停水通知单数据保存至本地  2020-05-24  zlx
function savePostingList(taskNoAll, taskNoArr) {
    api.ajax({
        url: $api.getStorage("bwapipath") + '/api/waterMeters/info',
        method: 'post',
        dataType: 'json',
        returnAll: false,
        // headers: {"Content-Type":"application/json"},
        data: {
            values: {
                Method: 'MMS002',
                UserName: $api.getStorage("bwUserName"),
                Password: $api.getStorage("bwPassWord"),
                SerialNo: '',
                KeyCode: '',
                Parameter: "{'TaskNo':'" + taskNoAll + "'}"
            }
        }
    }, function(ret, err) {
        if (ret) {
            var db = api.require("db");
            if (ret.Status == '0') {
                var Booksdata = JSON.parse(ret.Data);
                var AllDataNumer = '';
                var WorkTypeCode = '';
                for (let i = 0; i < Booksdata.length; i++) {
                    AllDataNumer = '';
                    WorkTypeCode = '';
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: "SELECT * FROM POSTING_LIST WHERE Id = '" + Booksdata[i].Id + "' AND CustomerCode = '" + Booksdata[i].CustomerCode + "' AND TaskNo = '" + Booksdata[i].TaskNo + "'"
                    }, function(ret, err) {
                        if (ret.status) {
                            if (ret.data.length == 0) {
                                for (let j = 0; j < taskNoArr.length; j++) {
                                    if (Booksdata[i].TaskNo == taskNoArr[j].taskCode) {
                                        AllDataNumer = taskNoArr[j].taskCount;
                                        WorkTypeCode = taskNoArr[j].id;
                                        break;
                                    }
                                }

                                var sql = 'INSERT INTO POSTING_LIST(Id, Source, Code, Name, StatusName, Status, CustomerCode, CustomerName, Address, Location,' +
                                    'Nature,' +
                                    'SubNature,' +
                                    'Caliber,' +
                                    'Nameplate,' +
                                    'MeterType,' +
                                    'StampNo,' +
                                    'LastScale,' +
                                    'BeginScale,' +
                                    'EndScale,' +
                                    'Amount,' +
                                    'ArrearMoney,' +
                                    'Description,' +
                                    'Remark,' +
                                    'RemarkText,' +
                                    'OperatorId,' +
                                    'OperatedTime,' +
                                    'TaskNo,' +
                                    'DispatchTime,' +
                                    'RecordBeginScale,' +
                                    'RecordEndScale,' +
                                    'RecordAmount,' +
                                    'RecordTypdId,' +
                                    'RecordTypdName,' +
                                    'LastReadScale,' +
                                    'AuditReadScale,' +
                                    'AuditTime,' +
                                    'AuditStatus,' +
                                    'HandleTime,' +
                                    'AuditTimes,' +
                                    'UseTime,' +
                                    'NotSave,' +
                                    'Files,' +
                                    'TaskId,' +
                                    'StatusUser,' +
                                    'NotUploader,' +
                                    'userName,' +
                                    'NotSubmit) VALUES ("' + Booksdata[i].Id + '",' +
                                    '"' + Booksdata[i].Source + '",' +
                                    '"' + Booksdata[i].Code + '",' +
                                    '"' + Booksdata[i].Name + '",' +
                                    '"' + Booksdata[i].StatusName + '",' +
                                    '"' + Booksdata[i].Status + '",' +
                                    '"' + Booksdata[i].CustomerCode + '",' +
                                    '"' + Booksdata[i].CustomerName + '",' +
                                    '"' + Booksdata[i].Address + '",' +
                                    '"' + Booksdata[i].Location + '",' +
                                    '"' + Booksdata[i].Nature + '",' +
                                    '"' + Booksdata[i].SubNature + '",' +
                                    '"' + Booksdata[i].Caliber + '",' +
                                    '"' + Booksdata[i].Nameplate + '",' +
                                    '"' + Booksdata[i].MeterType + '",' +
                                    '"' + Booksdata[i].StampNo + '",' +
                                    '"' + Booksdata[i].LastScale + '",' +
                                    '"' + Booksdata[i].BeginScale + '",' +
                                    '"' + Booksdata[i].EndScale + '",' +
                                    '"' + Booksdata[i].Amount + '",' +
                                    '"' + Booksdata[i].ArrearMoney + '",' +
                                    '"' + Booksdata[i].Description + '",' +
                                    '"",' +
                                    '"' + Booksdata[i].Remark + '",' +
                                    '"' + Booksdata[i].OperatorId + '",' +
                                    '"' + Booksdata[i].OperatedTime + '",' +
                                    '"' + Booksdata[i].TaskNo + '",' +
                                    '"' + Booksdata[i].DispatchTime + '",' +
                                    '"' + Booksdata[i].RecordBeginScale + '",' +
                                    '"' + Booksdata[i].RecordEndScale + '",' +
                                    '"' + Booksdata[i].RecordAmount + '",' +
                                    '"' + Booksdata[i].RecordTypdId + '",' +
                                    '"' + Booksdata[i].RecordTypdName + '",' +
                                    '"' + Booksdata[i].LastReadScale + '",' +
                                    '"' + Booksdata[i].AuditReadScale + '",' +
                                    '"' + Booksdata[i].AuditTime + '",' +
                                    '"' + Booksdata[i].AuditStatus + '",' +
                                    '"' + Booksdata[i].HandleTime + '",' +
                                    '"' + Booksdata[i].AuditTimes + '",' +
                                    '"' + Booksdata[i].UseTime + '",' +
                                    '"0",' +
                                    '"",' +
                                    '"' + WorkTypeId + '",' + //WorkTypeCode 改为 WorkTypeId  20200807 15:49 zxf
                                    '"0",' +
                                    '"0",' +
                                    '"' + $api.getStorage('loginData').userName + '",' +
                                    '"' + AllDataNumer + '")';
                                var PostingListret = db.executeSqlSync({
                                    name: 'Wsdatabase',
                                    sql: sql
                                });
                            }
                        }
                    });
                }
                return;
                for (var i in Booksdata) {
                    AllDataNumer = '';
                    WorkTypeCode = '';
                    for (var j = 0; j < taskNoArr.length; j++) {
                        if (Booksdata[i].TaskNo == taskNoArr[j].taskCode) {
                            AllDataNumer = taskNoArr[j].taskCount;
                            WorkTypeCode = taskNoArr[j].id;
                            break;
                        }
                    }

                    var sql = 'INSERT INTO POSTING_LIST(Id, Source, Code, Name, StatusName, Status, CustomerCode, CustomerName, Address, Location,' +
                        'Nature,' +
                        'SubNature,' +
                        'Caliber,' +
                        'Nameplate,' +
                        'MeterType,' +
                        'StampNo,' +
                        'LastScale,' +
                        'BeginScale,' +
                        'EndScale,' +
                        'Amount,' +
                        'ArrearMoney,' +
                        'Description,' +
                        'Remark,' +
                        'RemarkText,' +
                        'OperatorId,' +
                        'OperatedTime,' +
                        'TaskNo,' +
                        'DispatchTime,' +
                        'RecordBeginScale,' +
                        'RecordEndScale,' +
                        'RecordAmount,' +
                        'RecordTypdId,' +
                        'RecordTypdName,' +
                        'LastReadScale,' +
                        'AuditReadScale,' +
                        'AuditTime,' +
                        'AuditStatus,' +
                        'HandleTime,' +
                        'AuditTimes,' +
                        'UseTime,' +
                        'NotSave,' +
                        'Files,' +
                        'TaskId,' +
                        'StatusUser,' +
                        'NotUploader,' +
                        'userName,' +
                        'NotSubmit) VALUES ("' + Booksdata[i].Id + '",' +
                        '"' + Booksdata[i].Source + '",' +
                        '"' + Booksdata[i].Code + '",' +
                        '"' + Booksdata[i].Name + '",' +
                        '"' + Booksdata[i].StatusName + '",' +
                        '"' + Booksdata[i].Status + '",' +
                        '"' + Booksdata[i].CustomerCode + '",' +
                        '"' + Booksdata[i].CustomerName + '",' +
                        '"' + Booksdata[i].Address + '",' +
                        '"' + Booksdata[i].Location + '",' +
                        '"' + Booksdata[i].Nature + '",' +
                        '"' + Booksdata[i].SubNature + '",' +
                        '"' + Booksdata[i].Caliber + '",' +
                        '"' + Booksdata[i].Nameplate + '",' +
                        '"' + Booksdata[i].MeterType + '",' +
                        '"' + Booksdata[i].StampNo + '",' +
                        '"' + Booksdata[i].LastScale + '",' +
                        '"' + Booksdata[i].BeginScale + '",' +
                        '"' + Booksdata[i].EndScale + '",' +
                        '"' + Booksdata[i].Amount + '",' +
                        '"' + Booksdata[i].ArrearMoney + '",' +
                        '"' + Booksdata[i].Description + '",' +
                        '"",' +
                        '"' + Booksdata[i].Remark + '",' +
                        '"' + Booksdata[i].OperatorId + '",' +
                        '"' + Booksdata[i].OperatedTime + '",' +
                        '"' + Booksdata[i].TaskNo + '",' +
                        '"' + Booksdata[i].DispatchTime + '",' +
                        '"' + Booksdata[i].RecordBeginScale + '",' +
                        '"' + Booksdata[i].RecordEndScale + '",' +
                        '"' + Booksdata[i].RecordAmount + '",' +
                        '"' + Booksdata[i].RecordTypdId + '",' +
                        '"' + Booksdata[i].RecordTypdName + '",' +
                        '"' + Booksdata[i].LastReadScale + '",' +
                        '"' + Booksdata[i].AuditReadScale + '",' +
                        '"' + Booksdata[i].AuditTime + '",' +
                        '"' + Booksdata[i].AuditStatus + '",' +
                        '"' + Booksdata[i].HandleTime + '",' +
                        '"' + Booksdata[i].AuditTimes + '",' +
                        '"' + Booksdata[i].UseTime + '",' +
                        '"0",' +
                        '"",' +
                        '"' + WorkTypeId + '",' + // //WorkTypeCode 改为 WorkTypeId  20200807 15:49 zxf
                        '"0",' +
                        '"0",' +
                        '"' + $api.getStorage('loginData').userName + '",' +
                        '"' + AllDataNumer + '")';
                    var PostingListret = db.executeSqlSync({
                        name: 'Wsdatabase',
                        sql: sql
                    });

                }
            } else {
                api.confirm({
                    title: '数据保存失败',
                    msg: '停水通知单数据保存至本地失败，原因：' + ret.Message,
                    buttons: ['确定', '取消']
                }, function(ret, err) {

                });
            }
        } else {
            api.confirm({
                title: '数据保存失败',
                msg: '停水通知单数据保存至本地失败，原因：' + err.msg,
                buttons: ['确定', '取消']
            }, function(ret, err) {});
        }
    });
}
// 张贴列表方法结束


// 表务其他类型工单方法开始
//判断表务基础数据表-办理数据表 是否最新 2020-06-05  zlx
function reviewTableNew() {
    var db = api.require("db");
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_BASIC_LIST'
    }, function(ret, err) {
        if (ret.status) {
            db.selectSql({
                name: 'Wsdatabase',
                sql: 'PRAGMA table_info([Review_TASK_BASIC_LIST])'
            }, function(ret, err) {
                if (ret.status) {
                    //console.log( JSON.stringify( ret ) );
                    var fieldArr = ret.data;
                    var isDelete = true;
                    for (let i = 0; i < fieldArr.length; i++) {
                        if (fieldArr[i].name == 'ActivityCode') {
                            isDelete = false;
                            break;
                        }
                    }
                    //不是最新 数据表 - 删除本地数据表 - 再创建
                    if (isDelete) {
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: 'DROP TABLE Review_TASK_BASIC_LIST'
                        }, function(ret, err) {
                            if (ret.status) {
                                //console.log(JSON.stringify(ret));
                                //创建 最新稽核数据表
                                createReviewBasicData();
                            } else {
                                //console.log( JSON.stringify( err ) );
                            }
                        });
                    }
                } else {
                    //console.log( JSON.stringify( err ) );
                }
            });
        } else {
            createReviewBasicData();
        }
    });

    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_HANDLED_LIST'
    }, function(ret, err) {
        if (ret.status) {
            db.selectSql({
                name: 'Wsdatabase',
                sql: 'PRAGMA table_info([Review_TASK_HANDLED_LIST])'
            }, function(ret, err) {
                if (ret.status) {
                    //console.log( JSON.stringify( ret ) );
                    var fieldArr = ret.data;
                    var isDelete = true;
                    for (let i = 0; i < fieldArr.length; i++) {
                        if (fieldArr[i].name == 'isUpload') {
                            isDelete = false;
                            break;
                        }
                    }
                    //不是最新 数据表 - 删除本地数据表 - 再创建
                    if (isDelete) {
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: 'DROP TABLE Review_TASK_HANDLED_LIST'
                        }, function(ret, err) {
                            if (ret.status) {
                                //console.log(JSON.stringify(ret));
                                //创建 最新稽核数据表
                                createReviewHandledData();
                            } else {
                                //console.log( JSON.stringify( err ) );
                            }
                        });
                    }
                } else {
                    //console.log( JSON.stringify( err ) );
                }
            });
        } else {
            createReviewHandledData();
        }
    });
}
//创建表务基础数据 修改 2020-06-05 zlx   - 办理数据表
function createReviewBasicData() {
    var db = api.require("db");
    var basicSql = "CREATE TABLE Review_TASK_BASIC_LIST(" +
        "ReqCode TEXT," + //流程编号
        "IsEnd TEXT," + //是够结束 1结束， 0 处理中
        "CustomerName TEXT," + //用户名称
        "ServiceTypeId TEXT," + //流程类型 13移改提 3换表，14 校表 ，15三来工单，16其他工单
        "CustomerCode TEXT," + //户号
        "Address TEXT," + //地址
        "Caliber TEXT," + //口径
        "LastScale TEXT," + //旧表止度
        "NatureName TEXT," + //用水性质
        "CreateTime TEXT," + //创建时间
        "Location TEXT," + //表位
        "TypeName TEXT," + //工单类型
        "Remark TEXT," + //备注
        "WorkflowId TEXT," + //流程ID
        "ActivityId TEXT," + //节点ID
        "ActivityCode TEXT," + //节点ID
        "StepId TEXT," + //指向ID
        "MeterRemark TEXT," + //原因
        "Path TEXT," + //文件后缀|文件地址, 文件后缀|文件地址
        "Processinglevelid TEXT," + //处理级别
        "UsgentText TEXT," + //紧急情况
        "AreasName TEXT," + //反映区域
        "Phone TEXT," + //客户电话
        "SourceName TEXT," + //信息来源
        "EndTime TEXT," + //计划结束时间
        "OrderNo TEXT," + //工单编号
        "AppAddress TEXT," + //定位地址
        "Files TEXT," + //图片信息
        "Budgetaudit TEXT," + //转办和延期记录
        "SaveTime TEXT," + //保存时间
        "userName TEXT," + //当前登录用户名
        "isUploadAndSave TEXT," + //默认 0-待办  1-已上传 2-已保存
        "fieldOne TEXT,fieldTwo TEXT,fieldThree TEXT,fieldFour TEXT,fieldFive TEXT,SurveyRemark TEXT)"; //预留字段
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_BASIC_LIST'
    }, function(ret, err) {
        if (ret.status) {
            ////console.log( JSON.stringify( ret ) );
        } else {
            db.executeSql({
                name: 'Wsdatabase',
                sql: basicSql
            }, function(ret, err) {
                if (ret.status) {
                    ////console.log( JSON.stringify( ret ) );
                } else {
                    ////console.log( JSON.stringify( err ) );
                }
            });
        }
    });
}

//创建表务办理表 2020-06-05
function createReviewHandledData() {
    var db = api.require("db");
    var handledSql = "CREATE TABLE Review_TASK_HANDLED_LIST(" +
        "ReqCode TEXT," + //流程编号
        "Longitude TEXT," + //经度
        "Latitude TEXT," + //纬度
        "Location TEXT," + //经纬度坐标地址
        "Remark TEXT," + //处理结果
        "BeginScale TEXT," + //旧表止度
        "LastReadScale TEXT," + //旧表的最后抄见计数
        "OriginalScale TEXT," + //新表起度
        "OldAmount TEXT," + //换表水量
        "StampNo TEXT," + //水表表号
        "ComputeTypeId TEXT," + //换表水量计算方式
        "Caliber TEXT," + //水表口径
        "MeterTypeId TEXT," + //水表类型
        "NamePlateId TEXT," + //水表铭牌
        "ModelId TEXT," + //水表型号
        "InstallationModeId TEXT," + //安装方式
        "ConcreteScale TEXT," + //实际表码
        "TypeId TEXT," + //文件后缀
        "filePath TEXT," + //路径
        "audioPath TEXT," + //音频路径
        "videoPath TEXT," + //视频路径
        "Title TEXT," + //标题
        "isUpload TEXT," + //是否上传
        "userName TEXT," + //当前登录用户名
        "AttachmentType TEXT," + //附件类型 申请1 处理 4
        "fieldOne TEXT,fieldTwo TEXT,fieldThree TEXT,fieldFour TEXT,fieldFive TEXT)"; //预留字段
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_HANDLED_LIST'
    }, function(ret, err) {
        if (ret.status) {
            ////console.log( JSON.stringify( ret ) );
        } else {
            db.executeSql({
                name: 'Wsdatabase',
                sql: handledSql
            }, function(ret, err) {
                if (ret.status) {
                    ////console.log( JSON.stringify( ret ) );
                } else {
                    ////console.log( JSON.stringify( err ) );
                }
            });
        }
    });
}

//插入基础数据 2020-06-01 zlx
function insertReviewData(taskItem) {
    var db = api.require("db");
    var insertSql = "INSERT INTO Review_TASK_BASIC_LIST VALUES (" +
        "'" + taskItem.ReqCode + "'," +
        "'" + taskItem.IsEnd + "'," +
        "'" + taskItem.CustomerName + "'," +
        "'" + taskItem.ServiceTypeId + "'," +
        "'" + taskItem.CustomerCode + "'," +
        "'" + taskItem.Address + "'," +
        "'" + taskItem.Caliber + "'," +
        "'" + taskItem.LastScale + "'," +
        "'" + taskItem.NatureName + "'," +
        "'" + taskItem.CreateTime + "'," +
        "'" + taskItem.Location + "'," +
        "'" + taskItem.TypeName + "'," +
        "'" + taskItem.Remark + "'," +
        "'" + taskItem.WorkflowId + "'," +
        "'" + taskItem.ActivityId + "'," +
        "'" + taskItem.ActivityCode + "'," +
        "'" + taskItem.StepId + "'," +
        "'" + taskItem.MeterRemark + "'," +
        "'" + taskItem.Path + "'," +
        "'" + taskItem.Processinglevelid + "'," +
        "'" + taskItem.UsgentText + "'," +
        "'" + taskItem.AreasName + "'," +
        "'" + taskItem.Phone + "'," +
        "'" + taskItem.SourceName + "'," +
        "'" + taskItem.EndTime + "'," +
        "'" + taskItem.OrderNo + "'," +
        "'" + taskItem.AppAddress + "'," +
        "'" + JSON.stringify(taskItem.Files) + "'," +
        "'" + JSON.stringify(taskItem.Budgetaudit) + "', '','" + $api.getStorage('loginData').userName + "', '0','" + taskItem.ReaderName + "','" + taskItem.ReaderPhone + "','" + taskItem.InstallMode + "','" + taskItem.SbTypeId + "','" + taskItem.Longitude + "," + taskItem.Latitude + "','" + taskItem.SurveyRemark + "')";
    var ret = db.executeSqlSync({
        name: 'Wsdatabase',
        sql: insertSql
    });
    ////console.log(JSON.stringify(ret));
}

//更新基础数据
function updateReviewData(taskItem) {
    var db = api.require("db");
    var updateSql = "UPDATE Review_TASK_BASIC_LIST SET " +
        "IsEnd = '" + taskItem.IsEnd + "'," +
        "CustomerName = '" + taskItem.CustomerName + "'," +
        "ServiceTypeId = '" + taskItem.ServiceTypeId + "'," +
        "CustomerCode = '" + taskItem.CustomerCode + "'," +
        "Address = '" + taskItem.Address + "'," +
        "Caliber = '" + taskItem.Caliber + "'," +
        "LastScale = '" + taskItem.LastScale + "'," +
        "NatureName = '" + taskItem.NatureName + "'," +
        "CreateTime = '" + taskItem.CreateTime + "'," +
        "Location = '" + taskItem.Location + "'," +
        "TypeName = '" + taskItem.TypeName + "'," +
        "Remark = '" + taskItem.Remark + "'," +
        "WorkflowId = '" + taskItem.WorkflowId + "'," +
        "ActivityId = '" + taskItem.ActivityId + "'," +
        "ActivityCode = '" + taskItem.ActivityCode + "'," +
        "StepId = '" + taskItem.StepId + "'," +
        "MeterRemark = '" + taskItem.MeterRemark + "'," +
        "Path = '" + taskItem.Path + "'," +
        "Processinglevelid = '" + taskItem.Processinglevelid + "'," +
        "UsgentText = '" + taskItem.UsgentText + "'," +
        "AreasName = '" + taskItem.AreasName + "'," +
        "Phone = '" + taskItem.Phone + "'," +
        "SourceName = '" + taskItem.SourceName + "'," +
        "EndTime = '" + taskItem.EndTime + "'," +
        "OrderNo = '" + taskItem.OrderNo + "'," +
        "AppAddress = '" + taskItem.AppAddress + "'," +
        "Files = '" + JSON.stringify(taskItem.Files) + "'," +
        "Budgetaudit = '" + JSON.stringify(taskItem.Budgetaudit) + "', isUploadAndSave = '0',SurveyRemark='" + taskItem.SurveyRemark + "',fieldOne='" + taskItem.ReaderName + "',fieldTwo='" + taskItem.ReaderPhone + "',fieldThree = '" + taskItem.InstallMode + "',fieldFour = '" + taskItem.SbTypeId + "',fieldFive = '" + taskItem.Longitude + "," + taskItem.Latitude + "' WHERE ReqCode = '" + taskItem.ReqCode + "'";
    var updateRet = db.executeSqlSync({
        name: 'Wsdatabase',
        sql: updateSql
    });
    console.log(JSON.stringify(updateRet));
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_HANDLED_LIST WHERE ReqCode = "' + taskItem.ReqCode + '"'
    }, function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (ret.status) {
            if (ret.data.length > 0) {
                db.executeSql({
                    name: 'Wsdatabase',
                    sql: 'UPDATE Review_TASK_HANDLED_LIST SET isUpload = "0" WHERE ReqCode = "' + taskItem.ReqCode + '"'
                }, function(ret, err) {
                    console.log(JSON.stringify(ret));
                    console.log(JSON.stringify(err));
                    if (ret.status) {

                    } else {

                    }
                });

            }
        } else {

        }
    });

}

//查询任务详情
function saveReviewList(reviewTaskNoAll) {
    var db = api.require("db");
    var headers = {};
    headers["Content-Type"] = 'application/json';
    headers.Authorization = $api.getStorage("bwHeaders");
    api.ajax({
        url: $api.getStorage("bwapipath") + '/webapi/request/GetMMS',
        method: 'post',
        timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: {
            body: {
                Method: 'MMS104',
                UserName: $api.getStorage("bwUserName"), //"01012"
                Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
                SerialNo: '',
                KeyCode: '',
                Parameter: JSON.stringify({
                    ReqCode: reviewTaskNoAll,
                    TypeId: '1'
                })
            }
        }
    }, function(ret, err) {
        if (ret) {
            ////console.log( JSON.stringify( ret ) );
            if (ret.Status == '0') {
                var reviewData = JSON.parse(ret.Data);
                for (let i = 0; i < reviewData.length; i++) {
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: "SELECT * FROM Review_TASK_BASIC_LIST WHERE ReqCode = '" + reviewData[i].ReqCode + "'"
                    }, function(ret, err) {
                        if (ret.status) {
                            if (ret.data.length > 0) {

                                updateReviewData(reviewData[i]);
                            } else {
                                insertReviewData(reviewData[i]);
                            }
                        } else {
                            ////console.log( JSON.stringify( err ) );
                        }
                    });

                }
            }
        } else {
            ////console.log( JSON.stringify( err ) );
        }
    });
}

//创建 下拉框数据表
function createSelectData() {
    var db = api.require("db");
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_SELECT_DATA'
    }, function(ret, err) {
        if (ret.status) {
            ////console.log( JSON.stringify( ret ) );
        } else {
            ////console.log( JSON.stringify( err ) );
            var createSql = "CREATE TABLE Review_SELECT_DATA(TypeId TEXT, TypeData TEXT)";
            db.executeSql({
                name: 'Wsdatabase',
                sql: createSql
            }, function(ret, err) {
                if (ret.status) {
                    ////console.log( JSON.stringify( ret ) );
                } else {
                    ////console.log( JSON.stringify( err ) );
                }
            });
        }
    });
}

function querySelet(typeId, typeData) {
    var db = api.require("db");
    db.selectSql({
        name: 'Wsdatabase',
        sql: "SELECT * FROM Review_SELECT_DATA WHERE TypeId = '" + typeId + "'"
    }, function(ret, err) {
        if (ret.status) {
            // //console.log( JSON.stringify( ret ) );
            if (ret.data.length > 0) {
                updateSelect(typeId, typeData);
            } else {
                insertSelet(typeId, typeData);
            }
        } else {
            ////console.log( JSON.stringify( err ) );
        }
    });
}

function insertSelet(typeId, typeData) {
    var db = api.require("db");
    db.executeSql({
        name: 'Wsdatabase',
        sql: "INSERT INTO Review_SELECT_DATA (TypeId,TypeData ) VALUES ('" + typeId + "', '" + typeData + "' )"
    }, function(ret, err) {
        // //console.log( JSON.stringify( err ) );
        if (ret.status) {
            // //console.log( JSON.stringify( ret ) );
        } else {
            ////console.log( JSON.stringify( err ) );
        }
    });
}

function updateSelect(typeId, typeData) {
    var db = api.require("db");
    db.executeSql({
        name: 'Wsdatabase',
        sql: "UPDATE Review_SELECT_DATA SET TypeData = '" + typeData + "' WHERE TypeId = '" + typeId + "'"
    }, function(ret, err) {
        if (ret.status) {
            // //console.log( JSON.stringify( ret ) );
        } else {
            ////console.log( JSON.stringify( err ) );
        }
    });
}

//获取下拉框数据
function getSelectData() {
    //水表口径
    bwPublicfnPost({
        'TypeId': 'SBKJ'
    }, function(ret, err) {
        if (ret && ret.Status == 0) {
            querySelet('SBKJ', ret.Data);
        }
    });

    //水表类型
    bwPublicfnPost({
        'TypeId': 'SBLX'
    }, function(ret, err) {
        if (ret && ret.Status == 0) {
            querySelet('SBLX', ret.Data);
        }
    });

    //水表铭牌
    bwPublicfnPost({
        'TypeId': 'SBMP'
    }, function(ret, err) {
        if (ret && ret.Status == 0) {
            querySelet('SBMP', ret.Data);
        }
    });

    //水表安装方式
    bwPublicfnPost({
        'TypeId': 'SBAZFS'
    }, function(ret, err) {
        if (ret && ret.Status == 0) {
            querySelet('SBAZFS', ret.Data);
        }
    });

    //水表型号
    bwPublicfnPost({
        'TypeId': 'SBXH'
    }, function(ret, err) {
        if (ret && ret.Status == 0) {
            querySelet('SBXH', ret.Data);
        }
    });

    //换表水量计算方式
    bwPublicfnPost({
        'TypeId': 'HBSLJSFS'
    }, function(ret, err) {
        if (ret && ret.Status == 0) {
            querySelet('HBSLJSFS', ret.Data);
        }
    });
}

//封装请求方法
function bwPublicfnPost(data, callback) {
    var headers = {};

    var body = {
        body: JSON.stringify({
            Method: 'MMS103',
            UserName: $api.getStorage("bwUserName"), //"01012"
            Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
            SerialNo: '',
            KeyCode: '', //营业
            Parameter: JSON.stringify(data)
        })
    };

    headers["Content-Type"] = 'application/json';

    api.ajax({
        url: $api.getStorage("bwapipath") + '/api/waterMeters/info',
        method: 'post',
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: body
    }, function(ret, err) {
        api.hideProgress();
        callback(ret, err);
    });
}


// 停复水工单
//判断是否是最新的稽核数据表 2020-06-01 zlx
function bwauditCreatTable() {
    var db = api.require("db");
    // 稽核数据表
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM AUDIT_TASK_LIST'
    }, function(ret, err) {
        if (ret.status) {
            //有表 根据字段验证是否是最新数据表
            db.selectSql({
                name: 'Wsdatabase',
                sql: 'PRAGMA table_info([AUDIT_TASK_LIST]);'
            }, function(ret, err) {
                if (ret.status) {
                    var fieldArr = ret.data;
                    var isDelete = true;
                    for (let i = 0; i < fieldArr.length; i++) {
                        if (fieldArr[i].name == 'UserRemark') {
                            isDelete = false;
                            break;
                        }
                    }
                    //不是最新 数据表 - 删除本地数据表 - 再创建
                    if (isDelete) {
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: 'DROP TABLE AUDIT_TASK_LIST'
                        }, function(ret, err) {
                            if (ret.status) {
                                //console.log(JSON.stringify(ret));
                                //创建 最新稽核数据表
                                bwcreateAuditData();
                            } else {
                                // alert( JSON.stringify( err ) );
                            }
                        });
                    }
                } else {
                    //console.log( JSON.stringify( err ) );
                }
            });
        } else {
            //本地无表
            bwcreateAuditData();
        }
    });

    bwauditSelectData();
}


//创建稽核数据表 2020-06-01 zlx
function bwcreateAuditData() {
    var db = api.require("db");
    var Sql = "CREATE TABLE AUDIT_TASK_LIST(" +
        "Id TEXT," + //工单Id
        "Source TEXT," + //工单来源
        "Code TEXT," + //工单类型编码
        "Name TEXT," + //工单类型名称
        "Status TEXT," + //状态
        "StatusName TEXT," + //状态名称
        "CustomerCode TEXT," + //用户编号
        "CustomerName TEXT," + //用户名称
        "Mobile TEXT," + //移动电话
        "Telphone TEXT," + //固定电话
        "Address TEXT," + //地址
        "Location TEXT," + //表位
        "Nature TEXT," + //用水性质
        "SubNature TEXT," + //性质细分
        "Caliber TEXT," + //水表口径
        "Nameplate TEXT," + //水表铭牌
        "MeterType TEXT," + //水表类型
        "StampNo TEXT," + //水表表号
        "LastScale TEXT," + //最后计费止度
        "BeginScale TEXT," + //欠费起度
        "EndScale TEXT," + //欠费止度
        "Amount TEXT," + //欠费水量
        "ArrearMoney TEXT," + //欠费金额
        "Description TEXT," + //办理描述
        "Remark TEXT," + //申请备注
        "OperatorId TEXT," + //申请人
        "OperatedTime TEXT," + //申请时间
        "TaskNo TEXT," + //任务编号
        "RecordBeginScale TEXT," + //复核任务水表起度
        "RecordEndScale TEXT," + //复核任务水表止度
        "RecordAmount TEXT," + //复核任务水量
        "RecordTypdId TEXT," + //复核任务抄表类型
        "RecordTypdName TEXT," + //复核任务抄表类型名称
        "LastReadScale TEXT," + //最后抄见止度
        "AuditReadScale TEXT," + //稽核止度
        "DispatchTime TEXT," + //分派时间
        "UseTime TEXT," + //领用时间
        "HandleTime TEXT," + //办理时间
        "AuditTime TEXT," + //审核时间
        "AuditTimes TEXT," + //审核不通过次数
        "Files TEXT," + //当前任务所有的文件信息(如果存在)
        "Handles TEXT," + //当前任务所有的操作信息
        "Coordinates TEXT," + //任务办理坐标
        "UsedTypeId TEXT," + //水表使用状态(抄表复核办理时不能为空)
        "AuditStatus TEXT," + //处理状态
        "FileUrl TEXT," + //文件Url, 多个文件以 | 分隔
        "FileType TEXT," + //文件类型 jpg, mp4, mp3, 多个以 | 分隔, 与文件url或文件流一一对应
        "Type TEXT," + //图片分类 水表图片	1 异常单照片	2 漏水图片	3  视频	4   音频	5
        "ReadTime TEXT," + //抄表时间(抄表复核办理时不能为空)
        "ReviewStateText TEXT," + //稽核-复核文字显示
        "SelectData TEXT," + //稽核、复核下拉框数据
        "ImgStatus TEXT," + //照片类型数据
        "UserScale TEXT," + //录入的复核止度
        "UserAmount TEXT," + //录入的复核用量
        "ActualMeter TEXT," + //实际表码
        "FileLocation TEXT," + //文件坐标经纬度,经纬度用,号隔开, 多个经纬度用|隔开
        "LocationAddress TEXT," + //提交-保存时地址
        "VideoPath TEXT," + //视频文件路径
        "AudioPath TEXT," + //音频文件路径
        "isFail TEXT," + //上传失败
        "FailRemark TEXT," + //上传失败原因
        "userName TEXT," + //当前登录用户
        "SaveTime TEXT," + //保存时间
        "isUploadAndSave TEXT," + //默认 0-待办  1-已上传 2-已保存
        "UserRemark TEXT," + //用户输入的备注
        "fieldOne TEXT,fieldTwo TEXT,fieldThree TEXT,fieldFour TEXT,fieldFive TEXT)"; //预留字段
    db.executeSql({
        name: 'Wsdatabase',
        sql: Sql
    }, function(ret, err) {
        if (ret.status) {
            //console.log( JSON.stringify( ret ) );
        } else {
            //console.log( JSON.stringify( err ) );
        }
    });
}

//插入数据 2020-06-01 zlx
function bwinsertAuditData(taskItem) {
    var db = api.require("db");
    var insertSql = "INSERT INTO AUDIT_TASK_LIST VALUES (" +
        "'" + taskItem.Id + "'," +
        "'" + taskItem.Source + "'," +
        "'" + taskItem.Code + "'," +
        "'" + taskItem.Name + "'," +
        "'" + taskItem.Status + "'," +
        "'" + taskItem.StatusName + "'," +
        "'" + taskItem.CustomerCode + "'," +
        "'" + taskItem.CustomerName + "'," +
        "'" + taskItem.Mobile + "'," +
        "'" + taskItem.Telphone + "'," +
        "'" + taskItem.Address + "'," +
        "'" + taskItem.Location + "'," +
        "'" + taskItem.Nature + "'," +
        "'" + taskItem.SubNature + "'," +
        "'" + taskItem.Caliber + "'," +
        "'" + taskItem.Nameplate + "'," +
        "'" + taskItem.MeterType + "'," +
        "'" + taskItem.StampNo + "'," +
        "'" + taskItem.LastScale + "'," +
        "'" + taskItem.BeginScale + "'," +
        "'" + taskItem.EndScale + "'," +
        "'" + taskItem.Amount + "'," +
        "'" + taskItem.ArrearMoney + "'," +
        "'" + taskItem.Description + "'," +
        "'" + taskItem.Remark + "'," +
        "'" + taskItem.OperatorId + "'," +
        "'" + taskItem.OperatedTime + "'," +
        "'" + taskItem.TaskNo + "'," +
        "'" + taskItem.RecordBeginScale + "'," +
        "'" + taskItem.RecordEndScale + "'," +
        "'" + taskItem.RecordAmount + "'," +
        "'" + taskItem.RecordTypdId + "'," +
        "'" + taskItem.RecordTypdName + "'," +
        "'" + taskItem.LastReadScale + "'," +
        "'" + taskItem.AuditReadScale + "'," +
        "'" + taskItem.DispatchTime + "'," +
        "'" + taskItem.UseTime + "'," +
        "'" + taskItem.HandleTime + "'," +
        "'" + taskItem.AuditTime + "'," +
        "'" + taskItem.AuditTimes + "'," +
        "'" + JSON.stringify(taskItem.Files) + "'," +
        "'" + JSON.stringify(taskItem.Handles) + "'," +
        "'" + JSON.stringify(taskItem.Coordinates) + "'," +
        "'','','','','','','','','','','','','','','','','0','','" + $api.getStorage('loginData').userName + "','','0','','','','','','')";
    db.executeSql({
        name: 'Wsdatabase',
        sql: insertSql
    }, function(ret, err) {
        if (ret.status) {

        } else {
            //console.log( JSON.stringify( err ) );
        }
    });
}

//更新数据 2020-06-01 zlx
function bwupdateAuditData(taskItem) {
    var db = api.require("db");
    var updateSql = "UPDATE AUDIT_TASK_LIST SET " +
        "Source = '" + taskItem.Source + "'," +
        "Code = '" + taskItem.Code + "'," +
        "Name = '" + taskItem.Name + "'," +
        "Status = '" + taskItem.Status + "'," +
        "StatusName = '" + taskItem.StatusName + "'," +
        "CustomerCode = '" + taskItem.CustomerCode + "'," +
        "CustomerName = '" + taskItem.CustomerName + "'," +
        "Mobile = '" + taskItem.Mobile + "'," +
        "Telphone = '" + taskItem.Telphone + "'," +
        "Address = '" + taskItem.Address + "'," +
        "Location = '" + taskItem.Location + "'," +
        "Nature = '" + taskItem.Nature + "'," +
        "SubNature = '" + taskItem.SubNature + "'," +
        "Caliber = '" + taskItem.Caliber + "'," +
        "Nameplate = '" + taskItem.Nameplate + "'," +
        "MeterType = '" + taskItem.MeterType + "'," +
        "StampNo = '" + taskItem.StampNo + "'," +
        "LastScale = '" + taskItem.LastScale + "'," +
        "BeginScale = '" + taskItem.BeginScale + "'," +
        "EndScale = '" + taskItem.EndScale + "'," +
        "Amount = '" + taskItem.Amount + "'," +
        "ArrearMoney = '" + taskItem.ArrearMoney + "'," +
        "Description = '" + taskItem.Description + "'," +
        "Remark = '" + taskItem.Remark + "'," +
        "OperatorId = '" + taskItem.OperatorId + "'," +
        "OperatedTime = '" + taskItem.OperatedTime + "'," +
        "RecordBeginScale = '" + taskItem.RecordBeginScale + "'," +
        "RecordEndScale = '" + taskItem.RecordEndScale + "'," +
        "RecordAmount = '" + taskItem.RecordAmount + "'," +
        "RecordTypdId = '" + taskItem.RecordTypdId + "'," +
        "RecordTypdName = '" + taskItem.RecordTypdName + "'," +
        "LastReadScale = '" + taskItem.LastReadScale + "'," +
        "AuditReadScale = '" + taskItem.AuditReadScale + "'," +
        "DispatchTime = '" + taskItem.DispatchTime + "'," +
        "UseTime = '" + taskItem.UseTime + "'," +
        "HandleTime = '" + taskItem.HandleTime + "'," +
        "AuditTime = '" + taskItem.AuditTime + "'," +
        "AuditTimes = '" + taskItem.AuditTimes + "'," +
        "Handles = '" + JSON.stringify(taskItem.Handles) + "' WHERE Id = '" + taskItem.Id + "'";
    db.executeSql({
        name: 'Wsdatabase',
        sql: updateSql
    }, function(ret, err) {
        if (ret.status) {
            //console.log( JSON.stringify( ret ) );
        } else {
            //console.log( JSON.stringify( err ) );
        }
    });
}

//获取稽核状态 - 复核状态 - 图片类型数据
var bwauditStatusData = bwreviewStatusData = bwimgStatusData = '';

function bwauditSelectData() {
    if (api.connectionType != 'none') {
        if ($api.getStorage('jhUserName') != undefined && $api.getStorage('jhPassWord') != undefined) {
            api.ajax({
                url: $api.getStorage("jhapipath") + 'waterMeters/info',
                method: 'post',
                dataType: 'json',
                data: {
                    values: {
                        "UserName": $api.getStorage("jhUserName"),
                        "Password": $api.getStorage("jhPassWord"),
                        "SerialNo": '',
                        "Longitude": '',
                        "Latitude": '',
                        "Method": "MMS103",
                        "Parameter": "{'TypeId':'JHZT'}"
                    }
                }
            }, function(ret, err) {
                if (ret) {
                    if (ret.Status == 0) {
                        bwauditStatusData = ret.Data;
                    }
                    // //console.log( JSON.stringify( ret ) );
                } else {
                    // //console.log( JSON.stringify( err ) );
                }
            });
            var body = {
                body: {
                    UserName: $api.getStorage("jhUserName"),
                    Password: $api.getStorage("jhPassWord"),
                    SerialNo: "",
                    Method: "R999",
                    Parameter: JSON.stringify({
                        ClientId: api.deviceId,
                        ClientName: api.deviceModel,
                        OperatorId: $api.getStorage('jhUserId'),
                        OperatorName: $api.getStorage('jhUserName'),
                        Required: "",
                        Type: "104"
                    })
                }
            };
            api.ajax({
                url: $api.getStorage("jhapipath") + 'waterMeters/info',
                method: "post",
                timeout: 100,
                dataType: "json",
                returnAll: false,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": $api.getStorage('jhHeaders')
                },
                data: body
            }, function(ret, err) {
                if (ret) {
                    // //console.log( JSON.stringify( ret ) );
                    if (ret.Status == 0) {
                        bwreviewStatusData = ret.Data;
                    }
                } else {
                    // //console.log( JSON.stringify( err ) );
                }
            });

            api.ajax({
                url: $api.getStorage("jhapipath") + 'waterMeters/info',
                method: 'post',
                dataType: 'json',
                data: {
                    values: {
                        "UserName": $api.getStorage("jhUserName"),
                        "Password": $api.getStorage("jhPassWord"),
                        "SerialNo": '',
                        "Longitude": '',
                        "Latitude": '',
                        "Method": "MMS103",
                        "Parameter": "{'TypeId':'RWWJLX'}"
                    }
                }
            }, function(ret, err) {
                if (ret) {
                    // //console.log( JSON.stringify( ret ) );
                    if (ret.Status == 0) {
                        bwimgStatusData = ret.Data;
                    }
                } else {
                    // //console.log( JSON.stringify( err ) );
                }
            });
        }
    }
}

//查询任务详情
function bwsaveAuditList(auditTaskNoAll) {
    var db = api.require("db");
    api.ajax({
        url: $api.getStorage("jhapipath") + 'waterMeters/info',
        method: 'post',
        dataType: 'json',
        returnAll: false,
        data: {
            values: {
                Method: 'MMS002',
                UserName: $api.getStorage("jhUserName"),
                Password: $api.getStorage("jhPassWord"),
                SerialNo: '',
                KeyCode: '',
                Parameter: "{'TaskNo':'" + auditTaskNoAll + "'}"
            }
        }
    }, function(ret, err) {
        if (ret) {
            //console.log( JSON.stringify( ret ) );
            if (ret.Status == '0') {
                var auditData = JSON.parse(ret.Data);
                for (let i = 0; i < auditData.length; i++) {
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: "SELECT * FROM AUDIT_TASK_LIST WHERE Id = '" + auditData[i].Id + "' AND userName = '" + $api.getStorage('loginData').userName + "' AND isUploadAndSave != '1'"
                    }, function(ret, err) {
                        if (ret.status) {
                            //console.log( JSON.stringify( ret ) );
                            if (ret.data.length > 0) {
                                bwupdateAuditData(auditData[i]);
                            } else {
                                bwinsertAuditData(auditData[i]);
                            }
                        } else {
                            //console.log( JSON.stringify( err ) );
                        }
                    });
                }
            }
        } else {
            //console.log( JSON.stringify( err ) );
        }
    });
}
