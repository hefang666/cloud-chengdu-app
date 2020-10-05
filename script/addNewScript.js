// 判断应用是否存在，动态添加组件js
function addNewScript(callback) {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var sumNUmber = 0,
        meterManageNumber = 0,
        meterReadingNumber = 0,
        auditNumber = 0;
    if (userLoginInformation != undefined) {
        if (userLoginInformation.appList != undefined) {
            var appList = userLoginInformation.appList[0].applications;
            if(appList!=null){
              for (var i = 0; i < appList.length; i++) {
                  sumNUmber++;
                  switch (true) {
                      case appList[i].coding == 'WaterStarOne-MMS-S8':
                          meterManageNumber++;
                          break;
                      case appList[i].coding == 'WaterStarOne-MRH-S8':
                          meterReadingNumber++;
                          break;
                      case appList[i].coding == 'WaterStarOne-AM-S8':
                          auditNumber++;
                          break;
                  }
                  if (sumNUmber == appList.length) {
                      var ret = {
                          meterManageNumber: meterManageNumber,
                          auditNumber: auditNumber
                      }
                      callback(ret);
                  }
              }
            }
        }else{
          var ret = {
              meterManageNumber: meterManageNumber,
              auditNumber: auditNumber
          }
          callback(ret);
        }
    }
};
function addDynamicallyScript(ret,callback){
  if (ret.meterManageNumber != 0) {  //判断是否有表务应用
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "file://" + api.fsDir + "/wgt/MeterManage/script/meterManageLocalData.js";
      // document.getElementsByTagName("script")[2].after(script);
      var element = document.getElementsByTagName("script")[2];
      $(element).after(script);
      script.onload = script.onreadystatechange = function() {
          if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
              // 判断是否有稽核应用
          if (ret.auditNumber != 0) {
              var script1 = document.createElement("script");
              script1.type = "text/javascript";
              script1.src = "file://" + api.fsDir + "/wgt/Audit/JavaScript/AuditTable.js";
              // document.getElementsByTagName("script")[3].after(script1);
              var element = document.getElementsByTagName("script")[3];
              $(element).after(script1);
              script1.onload = script1.onreadystatechange = function() {
                  if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                          callback();
                  }
              };
            } else{
              callback();
            }
          }
      };

  } else{
    if (ret.auditNumber != 0) {
        var script1 = document.createElement("script");
        script1.type = "text/javascript";
        script1.src = "file://" + api.fsDir + "/wgt/Audit/JavaScript/AuditTable.js";
        // document.getElementsByTagName("script")[2].after(script1);
        var element = document.getElementsByTagName("script")[2];
        $(element).after(script1);
        script1.onload = script1.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    callback();
            }
        };
      }
  }
  if(ret.auditNumber ==0 && ret.meterManageNumber ==0){
   callback();
  }
}
