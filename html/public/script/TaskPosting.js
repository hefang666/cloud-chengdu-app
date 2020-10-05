function loadPostingToLocal(item){
  var WorkTypeId = item.taskCode
  var userName = $api.getStorage('loginData').userName;
  PostingList(WorkTypeId,userName,item)
}
function PostingList(WorkTypeId,userName,item){
    var db = api.require("db");
    var WorkTypeCode = item.id;
    db.selectSql({
      name: 'Wsdatabase',
      sql: 'SELECT * FROM POSTING_LIST where Status ="7" AND NotUploader ="0" and TaskNo = "'+WorkTypeId+'" AND userName = "'+userName+'"'
    }, function(ret, err){
        if( ret.status ){
          console.log(WorkTypeId)
            if(ret.data.length>0){
              console.log(WorkTypeId)
              var dataBase = ret.data;
              // 1查询待处理
              // 判断是否有网
              if (api.connectionType != 'none'){

                  var dataBaseDC = [];//将离线待处理的循环处理出来
                  for (var i = 0; i < dataBase.length; i++){
                    if(dataBase[i].Status=="7"){
                      dataBaseDC.push(dataBase[i])
                    }
                  }
                  console.log(JSON.stringify(dataBaseDC.length))
                  api.showProgress({
                      style: 'default',
                      animationType: 'fade',
                      title: '加载中...',
                      modal: false
                  });

                  var data = {
                    TaskNo:WorkTypeId
                  }
                  dataList={
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
                  },function(ret, err){
                      if (ret) {
                        api.hideProgress();
                        if (ret && ret.Status == '0'){


                            var AllData = JSON.parse(ret.Data)
                            // 已提交
                            var dataBaseYC = [];//已提交
                              for (var j = 0; j < AllData.length; j++){
                                if(AllData[j].Status!="7" && AllData[j].Status!="0"&& AllData[j].Status!="1"){
                                  dataBaseYC.push(AllData[j])
                                }
                              }


                            var datalist = []//将在线待处理的数据将其循环出来
                            for (var i = 0; i < AllData.length; i++){
                              if(AllData[i].Status=="7"){
                                datalist.push(AllData[i])
                              }
                            }
                            // alert(111)

                            // 循环在线已终止
                            var Yzhongzhi = []//
                            for (var i = 0; i < AllData.length; i++){
                              if(AllData[i].Status=="3"){
                                Yzhongzhi.push(AllData[i])
                              }
                            }
                            console.log(JSON.stringify(Yzhongzhi))
                            for (var i = 0; i < Yzhongzhi.length; i++) {
                              var DeleteData = db.executeSqlSync({
                                name: 'Wsdatabase',
                                sql: 'DELETE FROM POSTING_LIST where Id = "'+Yzhongzhi[i].Id+'" AND userName = "'+userName+'"'
                              }); //
                              console.log(JSON.stringify(DeleteData))
                            }

                            // 每次刷新改变张贴总数
                            var AllDataNumer = datalist.length+dataBaseYC.length;
                            var UpdateList = db.executeSqlSync({
                              name: 'Wsdatabase',
                              sql: 'UPDATE POSTING_LIST SET NotSubmit="'+AllDataNumer+'"  WHERE TaskNo = "'+WorkTypeId+'" AND userName = "'+userName+'"'
                            });


                            // 判断在线待处理和离线待处理长度是否一样不一样重新下载
                            if(datalist.length==dataBaseDC.length){

                            }else {
                              // 将离线在线数据进行比较将不同的数据提取出来
                              // 1、数据比较定义一个比较函数
                            // 判读是否有新的数据
                              var Booksdata = [];
                              for(var i=0;i<datalist.length;i++){
                                var float = true;
                                for (var j = 0; j < dataBaseDC.length; j++) {

                                  if(datalist[i].CustomerCode==dataBaseDC[j].CustomerCode){
                                      float=false;
                                      break;
                                  }else {
                                    float=true;//不相等单出去

                                  }

                                }
                                if(float){
                                  Booksdata.push(datalist[i])
                                }
                              }
                                // Booksdata是比较后的数组将其插入
                                for(var i in Booksdata){
                                  var sql = 'INSERT INTO POSTING_LIST(Id, Source, Code, Name, StatusName, Status, CustomerCode, CustomerName, Address, Location,'+
                                    'Nature,'+
                                    'SubNature,'+
                                    'Caliber,'+
                                    'Nameplate,'+
                                    'MeterType,'+
                                    'StampNo,'+
                                    'LastScale,'+
                                    'BeginScale,'+
                                    'EndScale,'+
                                    'Amount,'+
                                    'ArrearMoney,'+
                                    'Description,'+
                                    'Remark,'+
                                    'RemarkText,'+
                                    'OperatorId,'+
                                    'OperatedTime,'+
                                    'TaskNo,'+
                                    'DispatchTime,'+
                                    'RecordBeginScale,'+
                                    'RecordEndScale,'+
                                    'RecordAmount,'+
                                    'RecordTypdId,'+
                                    'RecordTypdName,'+
                                    'LastReadScale,'+
                                    'AuditReadScale,'+
                                    'AuditTime,'+
                                    'AuditStatus,'+
                                    'HandleTime,'+
                                    'AuditTimes,'+
                                    'UseTime,'+
                                    'NotSave,'+
                                    'Files,'+
                                    'TaskId,'+
                                    'StatusUser,'+
                                    'NotUploader,'+
                                    'userName,'+
                                    'NotSubmit) VALUES ("' + Booksdata[i].Id + '",' +
                                        '"' + Booksdata[i].Source + '",'+
                                        '"' + Booksdata[i].Code + '",'+
                                        '"' + Booksdata[i].Name + '",'+
                                        '"' + Booksdata[i].StatusName + '",'+
                                        '"' + Booksdata[i].Status + '",'+
                                        '"' + Booksdata[i].CustomerCode + '",'+
                                        '"' + Booksdata[i].CustomerName + '",'+
                                        '"' + Booksdata[i].Address + '",'+
                                        '"' + Booksdata[i].Location + '",'+
                                        '"' + Booksdata[i].Nature + '",'+
                                        '"' + Booksdata[i].SubNature + '",'+
                                        '"' + Booksdata[i].Caliber + '",'+
                                        '"' + Booksdata[i].Nameplate + '",'+
                                        '"' + Booksdata[i].MeterType + '",'+
                                        '"' + Booksdata[i].StampNo + '",'+
                                        '"' + Booksdata[i].LastScale + '",'+
                                        '"' + Booksdata[i].BeginScale + '",'+
                                        '"' + Booksdata[i].EndScale + '",'+
                                        '"' + Booksdata[i].Amount + '",'+
                                        '"' + Booksdata[i].ArrearMoney + '",'+
                                        '"' + Booksdata[i].Description + '",'+
                                        '"",'+
                                        '"' + Booksdata[i].Remark + '",'+
                                        '"' + Booksdata[i].OperatorId + '",'+
                                        '"' + Booksdata[i].OperatedTime + '",'+
                                        '"' + Booksdata[i].TaskNo + '",'+
                                        '"' + Booksdata[i].DispatchTime + '",'+
                                        '"' + Booksdata[i].RecordBeginScale + '",'+
                                        '"' + Booksdata[i].RecordEndScale + '",'+
                                        '"' + Booksdata[i].RecordAmount + '",'+
                                        '"' + Booksdata[i].RecordTypdId + '",'+
                                        '"' + Booksdata[i].RecordTypdName + '",'+
                                        '"' + Booksdata[i].LastReadScale + '",'+
                                        '"' + Booksdata[i].AuditReadScale + '",'+
                                        '"' + Booksdata[i].AuditTime + '",'+
                                        '"' + Booksdata[i].AuditStatus + '",'+
                                        '"' + Booksdata[i].HandleTime + '",'+
                                        '"' + Booksdata[i].AuditTimes + '",'+
                                        '"' + Booksdata[i].UseTime + '",'+
                                        '"0",'+
                                        '"",'+
                                        '"' + WorkTypeCode + '",'+
                                        '"0",'+
                                        '"0",'+
                                        '"' + userName + '",'+
                                        '"'+ AllDataNumer +'")';
                                  var PostingListret = db.executeSqlSync({
                                      name: 'Wsdatabase',
                                      sql: sql
                                  });
                                  console.log(JSON.stringify(PostingListret))
                                }
                            }

                        }else {

                          api.toast({
                          msg:ret.Message,
                          duration: 2000,
                          location: 'middle'
                          });
                          // DloadPostingData()
                        }
                      } else {
                          console.log( JSON.stringify( err ) );
                      }
                  });

              }else {
                api.toast({
                    msg: '未连接网络',
                    duration: 2000,
                    location: 'middle'
                });

                // DloadPostingData()
              }
            }else {
                // 第一次下载数据
                oneOnlienData(WorkTypeId,userName,WorkTypeCode)
              }
        }else{
            // console.log( JSON.stringify( err ) );
        }
    });
}
// 第一次下载待处理任务
function oneOnlienData(WorkTypeId,userName,WorkTypeCode){
  var db = api.require("db");
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '加载中...',
      modal: false
  });

  dataList={
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
  },function(ret, err){
      if (ret) {
        api.hideProgress();
        if (ret && ret.Status == '0'){
          var Booksdata = [];
          var dataList = JSON.parse(ret.Data);
          var dataBaseDC = [];//待处理
          var dataBaseYC = [];//已提交
          var dataBaseCL = [];//处理中
          for (var j = 0; j < dataList.length; j++){
            if(dataList[j].Status=="1"){
              dataBaseDC.push(dataList[j])
            }
          }
          for (var j = 0; j < dataList.length; j++){
            if(dataList[j].Status=="7"){
              dataBaseCL.push(dataList[j])
              Booksdata.push(dataList[j])
            }
          }
          for (var j = 0; j < dataList.length; j++){
            if(dataList[j].Status!="7" && dataList[j].Status!="0"&& dataList[j].Status!="1"){
              dataBaseYC.push(dataList[j])
            }
          }
          var numerCtent =  dataBaseCL.length+dataBaseYC.length;
          // 循环数据下载
          for(var i in Booksdata){
            var sql = 'INSERT INTO POSTING_LIST(Id, Source, Code, Name, StatusName, Status, CustomerCode, CustomerName, Address, Location,'+
              'Nature,'+
              'SubNature,'+
              'Caliber,'+
              'Nameplate,'+
              'MeterType,'+
              'StampNo,'+
              'LastScale,'+
              'BeginScale,'+
              'EndScale,'+
              'Amount,'+
              'ArrearMoney,'+
              'Description,'+
              'Remark,'+
              'RemarkText,'+
              'OperatorId,'+
              'OperatedTime,'+
              'TaskNo,'+
              'DispatchTime,'+
              'RecordBeginScale,'+
              'RecordEndScale,'+
              'RecordAmount,'+
              'RecordTypdId,'+
              'RecordTypdName,'+
              'LastReadScale,'+
              'AuditReadScale,'+
              'AuditTime,'+
              'AuditStatus,'+
              'HandleTime,'+
              'AuditTimes,'+
              'UseTime,'+
              'NotSave,'+
              'Files,'+
              'TaskId,'+
              'StatusUser,'+
              'NotUploader,'+
              'userName,'+
              'NotSubmit) VALUES ("' + Booksdata[i].Id + '",' +
                  '"' + Booksdata[i].Source + '",'+
                  '"' + Booksdata[i].Code + '",'+
                  '"' + Booksdata[i].Name + '",'+
                  '"' + Booksdata[i].StatusName + '",'+
                  '"' + Booksdata[i].Status + '",'+
                  '"' + Booksdata[i].CustomerCode + '",'+
                  '"' + Booksdata[i].CustomerName + '",'+
                  '"' + Booksdata[i].Address + '",'+
                  '"' + Booksdata[i].Location + '",'+
                  '"' + Booksdata[i].Nature + '",'+
                  '"' + Booksdata[i].SubNature + '",'+
                  '"' + Booksdata[i].Caliber + '",'+
                  '"' + Booksdata[i].Nameplate + '",'+
                  '"' + Booksdata[i].MeterType + '",'+
                  '"' + Booksdata[i].StampNo + '",'+
                  '"' + Booksdata[i].LastScale + '",'+
                  '"' + Booksdata[i].BeginScale + '",'+
                  '"' + Booksdata[i].EndScale + '",'+
                  '"' + Booksdata[i].Amount + '",'+
                  '"' + Booksdata[i].ArrearMoney + '",'+
                  '"' + Booksdata[i].Description + '",'+
                  '"",'+
                  '"' + Booksdata[i].Remark + '",'+
                  '"' + Booksdata[i].OperatorId + '",'+
                  '"' + Booksdata[i].OperatedTime + '",'+
                  '"' + Booksdata[i].TaskNo + '",'+
                  '"' + Booksdata[i].DispatchTime + '",'+
                  '"' + Booksdata[i].RecordBeginScale + '",'+
                  '"' + Booksdata[i].RecordEndScale + '",'+
                  '"' + Booksdata[i].RecordAmount + '",'+
                  '"' + Booksdata[i].RecordTypdId + '",'+
                  '"' + Booksdata[i].RecordTypdName + '",'+
                  '"' + Booksdata[i].LastReadScale + '",'+
                  '"' + Booksdata[i].AuditReadScale + '",'+
                  '"' + Booksdata[i].AuditTime + '",'+
                  '"' + Booksdata[i].AuditStatus + '",'+
                  '"' + Booksdata[i].HandleTime + '",'+
                  '"' + Booksdata[i].AuditTimes + '",'+
                  '"' + Booksdata[i].UseTime + '",'+
                  '"0",'+
                  '"",'+
                  '"' + WorkTypeCode + '",'+
                  '"0",'+
                  '"0",'+
                  '"' + userName + '",'+
                  '"'+ numerCtent +'")';
            var PostingListret = db.executeSqlSync({
                name: 'Wsdatabase',
                sql: sql
            });
            console.log(JSON.stringify(PostingListret))

          }
        }else {
          api.toast({
                        msg:ret.Message,
                        duration: 2000,
                        location: 'middle'
                    });

        }
      } else {
          // console.log( JSON.stringify( err ) );
      }
  });


}
