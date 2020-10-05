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
    db.executeSql({
        name: 'Wsdatabase',
        sql: `UPDATE myTaskSheet set thirdTaskId=${item.thirdTaskId},taskCode ="${item.taskCode}",creationTime="${item.creationTime}",submitNum="${item.submitNum}",statusFlag=${item.statusFlag},statusFlagText="${item.statusFlagText}",productId=${item.productId},productName="${item.productName}",ClaimTime="${item.time}",productCode="${item.productCode}",handleUrl="${item.handleUrl}",detailUrl="${item.detailUrl}",name="${item.name}",taskId="${item.taskCode}",templateId="${item.templateId}",customerName="${customerName}",customerAddress="${customerAddress}",isBatch=${isBatch},taskCount=${item.taskCount},tbdCount=${item.tbdCount},userName="${CurentUserName}",ybCount=${item.ybCount},unconFirmedCount=${item.unconFirmedCount},bookName="${item.bookName}",bookId=${item.bookId},orderNO=${item.orderNO} where taskId = "${item.id}" or taskCode="${item.taskCode}" and userName = "${CurentUserName}"`
    }, function(ret, err) {
        if (ret.status) {}
    });
}

//水表维护认领数据存储在本地 （我的任务点击认领进来）
function getMeterNoDataToLocal(data,fromPage='meterNoAll') {
    var Parameter = {
        TaskNo: data.taskCode, //api.pageParam.data.taskCode
        Status: "7",
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
                insertMeterNoToLocalDataBase(data,result,fromPage);
            }
        }
    });
}

function insertMeterNoToLocalDataBase(cloudData,data,fromPage="",callback={}) { //插入数据到本地
    var db = api.require("db");
    var tableId = 0;
    var cloudTaskCode =cloudData.taskCode;
    var cloudTasKId = cloudData.taskCode;
    var cloudTasKThirdTaskId = cloudData.thirdTaskId;
    var creationTime =cloudData.creationTime;
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
                                            //  console.log( "日志添加成功");
                                        } else {
                                            console.log(JSON.stringify(err));
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
            if (i == data.length - 1 && fromPage!="" && fromPage!='meterNoAll') { //输入添加到本地完成
              callback();
            }
            if (i == data.length - 1 && fromPage!="" && fromPage =='meterNoAll') { //输入添加到本地完成
             meterAllDataNumber++;
              if(meterAllDataNumber < meterAllData.length){
                 getMeterNoDataToLocal(meterNoConfirmTaskAllData[meterAllDataNumber],'meterNoAll');
              }
            }
        })(i);
    }
}
// 云平台一键认领任务
var meterAllDataNumber = 0
var meterNoConfirmTaskAllData =[];
function meterNoConfirmTaskAllData(data){
  meterNoConfirmTaskAllData = data;
  getMeterNoDataToLocal(meterNoConfirmTaskAllData[meterAllDataNumber],'meterNoAll');
}
