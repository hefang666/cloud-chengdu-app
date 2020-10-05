  //判断是否是最新的稽核数据表 2020-06-01 zlx
  //判断是否是最新的稽核数据表 2020-06-01 zlx
  function auditCreatTable() {
    var db = api.require("db");
    // 稽核数据表
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM AUDIT_TASK_LIST'
    }, function(ret, err){
        if( ret.status ){
            //有表 根据字段验证是否是最新数据表
            db.selectSql({
                name: 'Wsdatabase',
                sql: 'PRAGMA table_info([AUDIT_TASK_LIST]);'
            }, function(ret, err){
                if( ret.status ) {
                  var fieldArr = ret.data;
                  var isDelete = true;
                  for (let i = 0; i < fieldArr.length; i++) {
                    if (fieldArr[i].name == 'isUploadAndSave') {
                      isDelete = false;
                      break;
                    }
                  }
                  //不是最新 数据表 - 删除本地数据表 - 再创建
                  if (isDelete) {
                    db.executeSql({
                        name: 'Wsdatabase',
                        sql: 'DROP TABLE AUDIT_TASK_LIST'
                    }, function(ret, err){
                        if( ret.status ){
                          console.log(JSON.stringify(ret));
                          //创建 最新稽核数据表
                          createAuditData();
                        }else{
                          alert( JSON.stringify( err ) );
                        }
                    });
                  }
                } else {
                  console.log( JSON.stringify( err ) );
                }
            });
        }else{
            //本地无表
            createAuditData();
        }
    });

    auditSelectData();
  }


  //创建稽核数据表 2020-06-01 zlx
  function createAuditData() {
    var db = api.require("db");
    var Sql = "CREATE TABLE AUDIT_TASK_LIST("+
              "Id TEXT,"+                 //工单Id
              "Source TEXT,"+             //工单来源
              "Code TEXT,"+               //工单类型编码
              "Name TEXT,"+               //工单类型名称
              "Status TEXT,"+             //状态
              "StatusName TEXT,"+         //状态名称
              "CustomerCode TEXT,"+       //用户编号
              "CustomerName TEXT,"+       //用户名称
              "Mobile TEXT,"+             //移动电话
              "Telphone TEXT,"+           //固定电话
              "Address TEXT,"+            //地址
              "Location TEXT,"+           //表位
              "Nature TEXT,"+             //用水性质
              "SubNature TEXT,"+          //性质细分
              "Caliber TEXT,"+            //水表口径
              "Nameplate TEXT,"+          //水表铭牌
              "MeterType TEXT,"+          //水表类型
              "StampNo TEXT,"+            //水表表号
              "LastScale TEXT,"+          //最后计费止度
              "BeginScale TEXT,"+         //欠费起度
              "EndScale TEXT,"+           //欠费止度
              "Amount TEXT,"+             //欠费水量
              "ArrearMoney TEXT,"+        //欠费金额
              "Description TEXT,"+        //办理描述
              "Remark TEXT,"+             //申请备注
              "OperatorId TEXT,"+         //申请人
              "OperatedTime TEXT,"+       //申请时间
              "TaskNo TEXT,"+             //任务编号
              "RecordBeginScale TEXT,"+   //复核任务水表起度
              "RecordEndScale TEXT,"+     //复核任务水表止度
              "RecordAmount TEXT,"+       //复核任务水量
              "RecordTypdId TEXT,"+       //复核任务抄表类型
              "RecordTypdName TEXT,"+     //复核任务抄表类型名称
              "LastReadScale TEXT,"+      //最后抄见止度
              "AuditReadScale TEXT,"+     //稽核止度
              "DispatchTime TEXT,"+       //分派时间
              "UseTime TEXT,"+            //领用时间
              "HandleTime TEXT,"+         //办理时间
              "AuditTime TEXT,"+          //审核时间
              "AuditTimes TEXT,"+         //审核不通过次数
              "Files TEXT,"+              //当前任务所有的文件信息(如果存在)
              "Handles TEXT,"+            //当前任务所有的操作信息
              "Coordinates TEXT,"+        //任务办理坐标
              "UsedTypeId TEXT,"+         //水表使用状态(抄表复核办理时不能为空)
              "AuditStatus TEXT,"+        //处理状态
              "FileUrl TEXT,"+            //文件Url, 多个文件以 | 分隔
              "FileType TEXT,"+           //文件类型 jpg, mp4, mp3, 多个以 | 分隔, 与文件url或文件流一一对应
              "Type TEXT,"+               //图片分类 水表图片	1 异常单照片	2 漏水图片	3  视频	4   音频	5
              "ReadTime TEXT,"+           //抄表时间(抄表复核办理时不能为空)
              "ReviewStateText TEXT,"+    //稽核-复核文字显示
              "SelectData TEXT,"+         //稽核、复核下拉框数据
              "ImgStatus TEXT,"+          //照片类型数据
              "UserScale TEXT,"+          //录入的复核止度
              "UserAmount TEXT,"+         //录入的复核用量
              "ActualMeter TEXT,"+        //实际表码
              "FileLocation TEXT,"+       //文件坐标经纬度,经纬度用,号隔开, 多个经纬度用|隔开
              "LocationAddress TEXT,"+    //提交-保存时地址
              "VideoPath TEXT,"+          //视频文件路径
              "AudioPath TEXT,"+          //音频文件路径
              "isFail TEXT,"+             //上传失败
              "FailRemark TEXT,"+         //上传失败原因
              "userName TEXT,"+           //当前登录用户
              "SaveTime TEXT,"+           //保存时间
              "isUploadAndSave TEXT)";    //默认 0-待办  1-已上传 2-已保存
    db.executeSql({
        name: 'Wsdatabase',
        sql: Sql
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
            console.log( JSON.stringify( err ) );
        }
    });
  }

  //插入数据 2020-06-01 zlx
  function insertAuditData(taskItem) {
    var db = api.require("db");
    var insertSql = "INSERT INTO AUDIT_TASK_LIST VALUES ("+
                    "'"+ taskItem.Id +"',"+
                    "'"+ taskItem.Source +"',"+
                    "'"+ taskItem.Code +"',"+
                    "'"+ taskItem.Name +"',"+
                    "'"+ taskItem.Status +"',"+
                    "'"+ taskItem.StatusName +"',"+
                    "'"+ taskItem.CustomerCode +"',"+
                    "'"+ taskItem.CustomerName +"',"+
                    "'"+ taskItem.Mobile +"',"+
                    "'"+ taskItem.Telphone +"',"+
                    "'"+ taskItem.Address +"',"+
                    "'"+ taskItem.Location +"',"+
                    "'"+ taskItem.Nature +"',"+
                    "'"+ taskItem.SubNature +"',"+
                    "'"+ taskItem.Caliber +"',"+
                    "'"+ taskItem.Nameplate +"',"+
                    "'"+ taskItem.MeterType +"',"+
                    "'"+ taskItem.StampNo +"',"+
                    "'"+ taskItem.LastScale +"',"+
                    "'"+ taskItem.BeginScale +"',"+
                    "'"+ taskItem.EndScale +"',"+
                    "'"+ taskItem.Amount +"',"+
                    "'"+ taskItem.ArrearMoney +"',"+
                    "'"+ taskItem.Description +"',"+
                    "'"+ taskItem.Remark +"',"+
                    "'"+ taskItem.OperatorId +"',"+
                    "'"+ taskItem.OperatedTime +"',"+
                    "'"+ taskItem.TaskNo +"',"+
                    "'"+ taskItem.RecordBeginScale +"',"+
                    "'"+ taskItem.RecordEndScale +"',"+
                    "'"+ taskItem.RecordAmount +"',"+
                    "'"+ taskItem.RecordTypdId +"',"+
                    "'"+ taskItem.RecordTypdName +"',"+
                    "'"+ taskItem.LastReadScale +"',"+
                    "'"+ taskItem.AuditReadScale +"',"+
                    "'"+ taskItem.DispatchTime +"',"+
                    "'"+ taskItem.UseTime +"',"+
                    "'"+ taskItem.HandleTime +"',"+
                    "'"+ taskItem.AuditTime +"',"+
                    "'"+ taskItem.AuditTimes +"',"+
                    "'"+ JSON.stringify(taskItem.Files) +"',"+
                    "'"+ JSON.stringify(taskItem.Handles) +"',"+
                    "'"+ JSON.stringify(taskItem.Coordinates) +"',"+
                    "'','','','','','','','','','','','','','','','','0','','"+ $api.getStorage('loginData').userName +"','','0')";
    db.executeSql({
        name: 'Wsdatabase',
        sql: insertSql
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
            var updateSql = '';
            if (taskItem.Code == 43) {
              updateSql = "UPDATE AUDIT_TASK_LIST SET SelectData = '"+ reviewStatusData +"', ImgStatus = '"+ imgStatusData +"' WHERE Id = '"+ taskItem.Id +"'";
            } else if (taskItem.Code == 45) {
              updateSql = "UPDATE AUDIT_TASK_LIST SET SelectData = '"+ auditStatusData +"' WHERE Id = '"+ taskItem.Id +"'";
            }
            db.executeSql({
                name: 'Wsdatabase',
                sql: updateSql
            }, function(ret, err){
                if( ret.status ){
                    console.log( JSON.stringify( ret ) );
                }else{
                    console.log( JSON.stringify( err ) );
                }
            });
        }else{
            console.log( JSON.stringify( err ) );
        }
    });
  }

  //更新数据 2020-06-01 zlx
  function updateAuditData(taskItem) {
    var db = api.require("db");
    var updateSql = "UPDATE AUDIT_TASK_LIST SET "+
                    "Source = '"+ taskItem.Source +"',"+
                    "Code = '"+ taskItem.Code +"',"+
                    "Name = '"+ taskItem.Name +"',"+
                    "Status = '"+ taskItem.Status +"',"+
                    "StatusName = '"+ taskItem.StatusName +"',"+
                    "CustomerCode = '"+ taskItem.CustomerCode +"',"+
                    "CustomerName = '"+ taskItem.CustomerName +"',"+
                    "Mobile = '"+ taskItem.Mobile +"',"+
                    "Telphone = '"+ taskItem.Telphone +"',"+
                    "Address = '"+ taskItem.Address +"',"+
                    "Location = '"+ taskItem.Location +"',"+
                    "Nature = '"+ taskItem.Nature +"',"+
                    "SubNature = '"+ taskItem.SubNature +"',"+
                    "Caliber = '"+ taskItem.Caliber +"',"+
                    "Nameplate = '"+ taskItem.Nameplate +"',"+
                    "MeterType = '"+ taskItem.MeterType +"',"+
                    "StampNo = '"+ taskItem.StampNo +"',"+
                    "LastScale = '"+ taskItem.LastScale +"',"+
                    "BeginScale = '"+ taskItem.BeginScale +"',"+
                    "EndScale = '"+ taskItem.EndScale +"',"+
                    "Amount = '"+ taskItem.Amount +"',"+
                    "ArrearMoney = '"+ taskItem.ArrearMoney +"',"+
                    "Description = '"+ taskItem.Description +"',"+
                    "Remark = '"+ taskItem.Remark +"',"+
                    "OperatorId = '"+ taskItem.OperatorId +"',"+
                    "OperatedTime = '"+ taskItem.OperatedTime +"',"+
                    "RecordBeginScale = '"+ taskItem.RecordBeginScale +"',"+
                    "RecordEndScale = '"+ taskItem.RecordEndScale +"',"+
                    "RecordAmount = '"+ taskItem.RecordAmount +"',"+
                    "RecordTypdId = '"+ taskItem.RecordTypdId +"',"+
                    "RecordTypdName = '"+ taskItem.RecordTypdName +"',"+
                    "LastReadScale = '"+ taskItem.LastReadScale +"',"+
                    "AuditReadScale = '"+ taskItem.AuditReadScale +"',"+
                    "DispatchTime = '"+ taskItem.DispatchTime +"',"+
                    "UseTime = '"+ taskItem.UseTime +"',"+
                    "HandleTime = '"+ taskItem.HandleTime +"',"+
                    "AuditTime = '"+ taskItem.AuditTime +"',"+
                    "AuditTimes = '"+ taskItem.AuditTimes +"',"+
                    "Handles = '"+ JSON.stringify(taskItem.Handles) +"' WHERE Id = '"+ taskItem.Id +"'";
    db.executeSql({
        name: 'Wsdatabase',
        sql: updateSql
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
            console.log( JSON.stringify( err ) );
        }
    });
  }

  //获取稽核状态 - 复核状态 - 图片类型数据
  var auditStatusData = reviewStatusData = imgStatusData = '';
  function auditSelectData() {
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
        },function(ret, err){
            if (ret) {
                if (ret.Status == 0) {
                  auditStatusData = ret.Data;
                }
                // console.log( JSON.stringify( ret ) );
            } else {
                // console.log( JSON.stringify( err ) );
            }
        });
        var body ={
          body:{
            UserName:$api.getStorage("jhUserName"),
            Password:$api.getStorage("jhPassWord"),
            SerialNo:"",
            Method:"R999",
            Parameter:JSON.stringify({
              ClientId:api.deviceId,
              ClientName:api.deviceModel,
              OperatorId:$api.getStorage('jhUserId'),
              OperatorName:$api.getStorage('jhUserName'),
              Required:"",
              Type:"104"
            })
          }
        };
        api.ajax({
            url: $api.getStorage("jhapipath") + 'waterMeters/info',
            method: "post",
            timeout: 100,
            dataType: "json",
            returnAll: false,
            headers:{"Content-Type":"application/json","Authorization": $api.getStorage('jhHeaders')},
            data: body
        },function(ret, err){
            if (ret) {
                // console.log( JSON.stringify( ret ) );
                if (ret.Status == 0) {
                  reviewStatusData = ret.Data;
                }
            } else {
                // console.log( JSON.stringify( err ) );
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
        },function(ret, err){
            if (ret) {
                // console.log( JSON.stringify( ret ) );
                if (ret.Status == 0) {
                  imgStatusData = ret.Data;
                }
            } else {
                // console.log( JSON.stringify( err ) );
            }
        });
      }
    }
  }

  //查询任务详情
  function saveAuditList(auditTaskNoAll, type, data) {
    var db = api.require("db");
    console.log($api.getStorage("jhapipath"));
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
    },function(ret, err){
        if (ret) {
            console.log( JSON.stringify( ret ) );
            if (ret.Status == '0') {
              var auditData = JSON.parse(ret.Data);
              for (let i = 0; i < auditData.length; i++) {
                db.selectSql({
                    name: 'Wsdatabase',
                    sql: "SELECT * FROM AUDIT_TASK_LIST WHERE Id = '"+ auditData[i].Id +"' AND userName = '"+ $api.getStorage('loginData').userName +"' AND isUploadAndSave != '1'"
                }, function(ret, err){
                    if( ret.status ){
                        console.log( JSON.stringify( ret ) );
                        if (ret.data.length > 0) {
                          updateAuditData(auditData[i]);
                        } else {
                          insertAuditData(auditData[i]);
                        }
                    }else{
                        console.log( JSON.stringify( err ) );
                    }
                });
              }
            }
        } else {
            console.log( JSON.stringify( err ) );
        }
    });
  }
