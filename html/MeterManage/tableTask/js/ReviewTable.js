  //创建表务基础数据 - 办理数据表 2020-06-01 zlx
  function createReviewData() {
    var db = api.require("db");
    var basicSql = "CREATE TABLE Review_TASK_BASIC_LIST("+
                   "ReqCode TEXT,"+            //流程编号
                   "IsEnd TEXT,"+              //是够结束 1结束， 0 处理中
                   "CustomerName TEXT,"+       //用户名称
                   "ServiceTypeId TEXT,"+      //流程类型 13移改提 3换表，14 校表 ，15三来工单，16其他工单
                   "CustomerCode TEXT,"+       //户号
                   "Address TEXT,"+            //地址
                   "Caliber TEXT,"+            //口径
                   "LastScale TEXT,"+          //旧表止度
                   "NatureName TEXT,"+         //用水性质
                   "CreateTime TEXT,"+         //创建时间
                   "Location TEXT,"+           //表位
                   "TypeName TEXT,"+           //工单类型
                   "Remark TEXT,"+             //备注
                   "WorkflowId TEXT,"+         //流程ID
                   "ActivityId TEXT,"+         //节点ID
                   "StepId TEXT,"+             //指向ID
                   "MeterRemark TEXT,"+        //原因
                   "Path TEXT,"+               //文件后缀|文件地址, 文件后缀|文件地址
                   "Processinglevelid TEXT,"+  //处理级别
                   "UsgentText TEXT,"+         //紧急情况
                   "AreasName TEXT,"+          //反映区域
                   "Phone TEXT,"+              //客户电话
                   "SourceName TEXT,"+         //信息来源
                   "EndTime TEXT,"+            //计划结束时间
                   "OrderNo TEXT,"+            //工单编号
                   "AppAddress TEXT,"+         //定位地址
                   "Files TEXT,"+              //图片信息
                   "Budgetaudit TEXT,"+        //转办和延期记录
                   "SaveTime TEXT,"+           //保存时间
                   "userName TEXT,"+           //当前登录用户名
                   "isUploadAndSave TEXT,"+    //默认 0-待办  1-已上传 2-已保存
                   "fieldOne TEXT,fieldTwo TEXT,fieldThree TEXT,fieldFour TEXT,fieldFive TEXT)";  //预留字段
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_BASIC_LIST'
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
          db.executeSql({
              name: 'Wsdatabase',
              sql: basicSql
          }, function(ret, err){
              if( ret.status ){
                  console.log( JSON.stringify( ret ) );
              }else{
                  console.log( JSON.stringify( err ) );
              }
          });
        }
    });

    var handledSql = "CREATE TABLE Review_TASK_HANDLED_LIST("+
                     "ReqCode TEXT,"+               //流程编号
                     "Longitude TEXT,"+             //经度
                     "Latitude TEXT,"+              //纬度
                     "Location TEXT,"+              //经纬度坐标地址
                     "Remark TEXT,"+                //处理结果
                     "BeginScale TEXT,"+            //旧表止度
                     "LastReadScale TEXT,"+         //旧表的最后抄见计数
                     "OriginalScale TEXT,"+         //新表起度
                     "OldAmount TEXT,"+             //换表水量
                     "StampNo TEXT,"+               //水表表号
                     "ComputeTypeId TEXT,"+         //换表水量计算方式
                     "Caliber TEXT,"+               //水表口径
                     "MeterTypeId TEXT,"+           //水表类型
                     "NamePlateId TEXT,"+           //水表铭牌
                     "ModelId TEXT,"+               //水表型号
                     "InstallationModeId TEXT,"+    //安装方式
                     "ConcreteScale TEXT,"+         //实际表码
                     "TypeId TEXT,"+                //文件后缀
                     "filePath TEXT,"+              //路径
                     "audioPath TEXT,"+             //音频路径
                     "videoPath TEXT,"+             //视频路径
                     "Title TEXT,"+                 //标题
                     "isUpload TEXT,"+              //是否上传
                     "userName TEXT,"+              //当前登录用户名
                     "AttachmentType TEXT,"+        //附件类型 申请1 处理 4
                     "fieldOne TEXT,fieldTwo TEXT,fieldThree TEXT,fieldFour TEXT,fieldFive TEXT)";  //预留字段
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_TASK_HANDLED_LIST'
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
            db.executeSql({
               name: 'Wsdatabase',
               sql: handledSql
            }, function(ret, err){
               if( ret.status ){
                   console.log( JSON.stringify( ret ) );
               }else{
                   console.log( JSON.stringify( err ) );
               }
            });
        }
    });

  }

  //插入基础数据 2020-06-01 zlx
  function insertReviewData(taskItem) {
    var db = api.require("db");
    var insertSql = "INSERT INTO Review_TASK_BASIC_LIST VALUES ("+
                    "'"+ taskItem.ReqCode +"',"+
                    "'"+ taskItem.IsEnd +"',"+
                    "'"+ taskItem.CustomerName +"',"+
                    "'"+ taskItem.ServiceTypeId +"',"+
                    "'"+ taskItem.CustomerCode +"',"+
                    "'"+ taskItem.Address +"',"+
                    "'"+ taskItem.Caliber +"',"+
                    "'"+ taskItem.LastScale +"',"+
                    "'"+ taskItem.NatureName +"',"+
                    "'"+ taskItem.CreateTime +"',"+
                    "'"+ taskItem.Location +"',"+
                    "'"+ taskItem.TypeName +"',"+
                    "'"+ taskItem.Remark +"',"+
                    "'"+ taskItem.WorkflowId +"',"+
                    "'"+ taskItem.ActivityId +"',"+
                    "'"+ taskItem.StepId +"',"+
                    "'"+ taskItem.MeterRemark +"',"+
                    "'"+ taskItem.Path +"',"+
                    "'"+ taskItem.Processinglevelid +"',"+
                    "'"+ taskItem.UsgentText +"',"+
                    "'"+ taskItem.AreasName +"',"+
                    "'"+ taskItem.Phone +"',"+
                    "'"+ taskItem.SourceName +"',"+
                    "'"+ taskItem.EndTime +"',"+
                    "'"+ taskItem.OrderNo +"',"+
                    "'"+ taskItem.AppAddress +"',"+
                    "'"+ JSON.stringify(taskItem.Files) +"',"+
                    "'"+ JSON.stringify(taskItem.Budgetaudit) +"', '','"+$api.getStorage('loginData').userName+"', '0','','','','','')";
    var ret = db.executeSqlSync({
        name: 'Wsdatabase',
        sql: insertSql
    });
    console.log(JSON.stringify(ret));
  }

  //更新基础数据
  function updateReviewData(taskItem) {
    var db = api.require("db");
    var updateSql = "UPDATE Review_TASK_BASIC_LIST SET "+
                    "IsEnd = '"+ taskItem.IsEnd +"',"+
                    "CustomerName = '"+ taskItem.CustomerName +"',"+
                    "ServiceTypeId = '"+ taskItem.ServiceTypeId +"',"+
                    "CustomerCode = '"+ taskItem.CustomerCode +"',"+
                    "Address = '"+ taskItem.Address +"',"+
                    "Caliber = '"+ taskItem.Caliber +"',"+
                    "LastScale = '"+ taskItem.LastScale +"',"+
                    "NatureName = '"+ taskItem.NatureName +"',"+
                    "CreateTime = '"+ taskItem.CreateTime +"',"+
                    "Location = '"+ taskItem.Location +"',"+
                    "TypeName = '"+ taskItem.TypeName +"',"+
                    "Remark = '"+ taskItem.Remark +"',"+
                    "WorkflowId = '"+ taskItem.WorkflowId +"',"+
                    "ActivityId = '"+ taskItem.ActivityId +"',"+
                    "StepId = '"+ taskItem.StepId +"',"+
                    "MeterRemark = '"+ taskItem.MeterRemark +"',"+
                    "Path = '"+ taskItem.Path +"',"+
                    "Processinglevelid = '"+ taskItem.Processinglevelid +"',"+
                    "UsgentText = '"+ taskItem.UsgentText +"',"+
                    "AreasName = '"+ taskItem.AreasName +"',"+
                    "Phone = '"+ taskItem.Phone +"',"+
                    "SourceName = '"+ taskItem.SourceName +"',"+
                    "EndTime = '"+ taskItem.EndTime +"',"+
                    "OrderNo = '"+ taskItem.OrderNo +"',"+
                    "AppAddress = '"+ taskItem.AppAddress +"',"+
                    "Files = '"+ JSON.stringify(taskItem.Files) +"',"+
                    "Budgetaudit = '"+ JSON.stringify(taskItem.Budgetaudit) +"', isUploadAndSave = '0' WHERE ReqCode = '"+ taskItem.ReqCode +"'";
    db.executeSqlSync({
      name: 'Wsdatabase',
      sql: updateSql
    });
  }

  //查询任务详情
  function saveReviewList(reviewTaskNoAll, type, data){
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
            values: {
                Method: 'MMS104',
                UserName: $api.getStorage("bwUserName"), //"01012"
                Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
                SerialNo: '',
                KeyCode: '',
                Parameter: "{'ReqCode':'"+ reviewTaskNoAll +"', 'TypeId': '1'}"
            }
        }
    },function(ret, err){
        if (ret) {
            console.log( JSON.stringify( ret ) );
            if (ret.Status == '0') {
              var reviewData = JSON.parse(ret.Data);
              for (let i = 0; i < reviewData.length; i++) {
                db.selectSql({
                    name: 'Wsdatabase',
                    sql: "SELECT * FROM Review_TASK_BASIC_LIST WHERE ReqCode = '"+ reviewData[i].ReqCode +"' AND isUploadAndSave != '1'"
                }, function(ret, err){
                    if( ret.status ){
                        console.log( JSON.stringify( ret ) );
                        if (ret.data.length > 0) {
                          updateReviewData(reviewData[i]);
                        } else {
                          insertReviewData(reviewData[i]);
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

  //创建 下拉框数据表
  function createSelectData() {
    var db = api.require("db");
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Review_SELECT_DATA'
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
            console.log( JSON.stringify( err ) );
            var createSql = "CREATE TABLE Review_SELECT_DATA(TypeId TEXT, TypeData TEXT)";
            db.executeSql({
                name: 'Wsdatabase',
                sql: createSql
            }, function(ret, err){
                if( ret.status ){
                    console.log( JSON.stringify( ret ) );
                }else{
                    console.log( JSON.stringify( err ) );
                }
            });
        }
    });
  }

  function querySelet(typeId, typeData) {
    var db = api.require("db");
    db.selectSql({
        name: 'Wsdatabase',
        sql: "SELECT * FROM Review_SELECT_DATA WHERE TypeId = '"+ typeId +"'"
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
            if (ret.data.length > 0) {
              updateSelect(typeId, typeData);
            } else {
              insertSelet(typeId, typeData);
            }
        }else{
            console.log( JSON.stringify( err ) );
        }
    });
  }

  function insertSelet(typeId, typeData) {
    var db = api.require("db");
    db.executeSql({
        name: 'Wsdatabase',
        sql: "INSERT INTO Review_SELECT_DATA('"+ typeId +"', '"+ typeData +"')"
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
            console.log( JSON.stringify( err ) );
        }
    });
  }

  function updateSelect(typeId, typeData) {
    var db = api.require("db");
    db.executeSql({
        name: 'Wsdatabase',
        sql: "UPDATE Review_SELECT_DATA SET TypeData = '"+ typeData +"' WHERE TypeId = '"+ typeId +"'"
    }, function(ret, err){
        if( ret.status ){
            console.log( JSON.stringify( ret ) );
        }else{
            console.log( JSON.stringify( err ) );
        }
    });
  }

  //获取下拉框数据
  function getSelectData() {
    //水表口径
    fnPost({'TypeId': 'SBKJ'}, function(ret, err){
      if (ret && ret.Status == 0) {
        querySelet('SBKJ', ret.Data);
      }
    });

    //水表类型
    fnPost({'TypeId': 'SBLX'}, function(ret, err){
      if (ret && ret.Status == 0) {
        querySelet('SBLX', ret.Data);
      }
    });

    //水表铭牌
    fnPost({'TypeId': 'SBMP'}, function(ret, err){
      if (ret && ret.Status == 0) {
        querySelet('SBMP', ret.Data);
      }
    });

    //水表安装方式
    fnPost({'TypeId': 'SBAZFS'}, function(ret, err){
      if (ret && ret.Status == 0) {
        querySelet('SBAZFS', ret.Data);
      }
    });

    //水表型号
    fnPost({'TypeId': 'SBXH'}, function(ret, err){
      if (ret && ret.Status == 0) {
        querySelet('SBXH', ret.Data);
      }
    });

    //换表水量计算方式
    fnPost({'TypeId': 'HBSLJSFS'}, function(ret, err){
      if (ret && ret.Status == 0) {
        querySelet('HBSLJSFS', ret.Data);
      }
    });
  }

  //封装请求方法
  function fnPost(data, callback) {
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
    },function(ret, err){
        callback(ret, err);
    });
  }
