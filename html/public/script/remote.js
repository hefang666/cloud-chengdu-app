// var apiUrl = 'http://' + $api.getStorage('apiUrl');
var app = {
    apipath: apiUrl + '/api/',
    // apipath:'',
};
var now = Date.now();

function fnGet(path, data, isDelete, callback) {

    var headers = {};
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if (isDelete) {
        headers["Content-Type"] = 'application/json';
    }
    headers.Authorization = $api.getStorage('loginInfo');
    // api.openWin({
    //     name: 'index',
    //     url: 'widget://index.html'
    // });
    // console.log(HandleUserRegistrationService/GetList);
    api.ajax({
        // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
        url: app.apipath + path,
        method: isDelete ? 'delete' : 'get',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        traditional: true
    }, function(ret, err) {
      if(ret){
        api.hideProgress();
        // api.refreshHeaderLoadDone();
        callback(ret, err);
      }
        if (err) {
          if(err.code == 1){
            api.showProgress({
                title: '加载中',
                modal: false
            });
            app.apipath = getApiPathAddress();
            api.ajax({
                // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
                url: app.apipath + path,
                method: isDelete ? 'delete' : 'get',
                timeout: 15,
                dataType: 'json',
                headers: headers,
                traditional: true
            }, function(ret, err) {
              if(ret){
                api.hideProgress();
                // api.refreshHeaderLoadDone();
                callback(ret, err);
              }
                if (err) {
                  if(err.code == 1){
                    api.toast({
                        msg: '网络请求超时',
                        duration: 2000,
                        location: 'bottom'
                    });

                  }else {
                        errMessage(err);
                    }
                }

            });

          }else {
              errMessage(err);
            }
        }
    });
};

function errMessage(err){
  if (err.body) {
        if (err.body.error) {
            if (err.body.error.message == '10000') {
                api.toast({
                    msg: err.body.error.details,
                    duration: 2000,
                    location: 'top'
                });
            } else {
                api.toast({
                    msg: err.body.error.message,
                    duration: 2000,
                    location: 'top'
                });
            }
            if (err.body.error.message == '当前用户没有登录到系统！') {
                // console.log(111);
                setTimeout(function() {
                    api.closeToWin({
                        name: 'login'
                    });
                }, 200);
            }
        } else {
            api.toast({
                msg: err.body,
                duration: 2000,
                location: 'top'
            });
        }
    } else {
        api.toast({
            msg: err.msg,
            duration: 2000,
            location: 'top'
        });
    }
}


// function fnPost(path, data, contentType, isLogin, isPut, callback,isErr=false) {
function fnPost(path, data, contentType, isLogin, isPut, callback) {
  // var apipath = getApiPathAddress();

    // app.apipath= apipath !='' && apipath !=undefined?apipath:app.apipath;
      // console.log(JSON.stringify(app.apipath));
    var headers = {};
    if (contentType) {
        headers["Content-Type"] = contentType
    }
    if (isLogin) {
        if (!$api.getStorage('loginInfo')) {
            setTimeout(function() {
                api.closeToWin({
                    name: 'login'
                });
            }, 200);
            return;
        }
        headers.Authorization = $api.getStorage('loginInfo');
    }
    api.showProgress({
        title: '加载中',
        modal: false
    });

    api.ajax({
        url: 'http://' + $api.getStorage('apiUrl') + '/api/' + path,
        method: isPut ? 'put' : 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: data
    }, function(ret, err) {
        // api.refreshHeaderLoadDone();
        if(ret){
          api.hideProgress();
          callback(ret, err);
        }
        if (err) {
            if(err.code == 1){ //超时
              api.showProgress({
                  title: '加载中',
                  modal: false
              });
             app.apipath = getApiPathAddress();
              api.ajax({
                  url:  app.apipath + path,
                  method: isPut ? 'put' : 'post',
                  timeout: 60,
                  dataType: 'json',
                  returnAll: false,
                  headers: headers,
                  data: data
              }, function(ret, err) {
                if(ret){
                  api.hideProgress();
                  callback(ret, err);
                }
                  if (err) {
                      if(err.code == 1){ //超时
                      api.toast({
                          msg: '网络请求超时',
                          duration: 2000,
                          location: 'bottom'
                      });
                      }else{
                        fnPostErrMessage(err);
                      }
                  }
              });
            }else{
              fnPostErrMessage(err);
            }
        }
    });
};
function fnPostErrMessage(err){
  if (err.statusCode == 401) {
      api.openWin({
          name: 'login_New',
          url: 'widget://html/login/login_New.html',
          slidBackEnabled: false,
          bgColor: 'widget://image/login/login_backgroud.png'
      });
  }
  if (err.body) {
      if (err.body.error) {
          if (err.body.error.message == '10000') {
              api.toast({
                  msg: err.body.error.details,
                  duration: 2000,
                  location: 'top'
              });
          } else {
              api.toast({
                  msg: err.body.error.message,
                  duration: 2000,
                  location: 'top'
              });
          }
          if (err.body.error.message == '当前用户没有登录到系统！') {
              // console.log(111);
              setTimeout(function() {
                  api.openWin({
                      name: 'login_New',
                      url: 'widget://html/login/login_New.html',
                      slidBackEnabled: false,
                      bgColor: 'widget://image/login/login_backgroud.png'
                  });
              }, 200);
          }
      } else {
          api.toast({
              msg: err.body,
              duration: 2000,
              location: 'top'
          });
      }
  } else {
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'top'
      });
  }
}
//zxf 2020-04-11
function fnPost1(path, data, contentType, isLogin, isPut, callback) {
    var headers = {};

    if (contentType) {
        headers["Content-Type"] = contentType
    }

    if (isLogin) {
        if (!$api.getStorage('loginInfo')) {
            setTimeout(function() {
                api.closeToWin({
                    name: 'login'
                });
            }, 200);
            return;
        }
        headers.Authorization = $api.getStorage('loginInfo');
    }
    api.showProgress({
        title: '加载中',
        modal: false
    });

    api.ajax({
        url: app.apipath + path,
        method: isPut ? 'put' : 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: data
    }, function(ret, err) {
         if(ret){
             callback(ret, err);
         }
        if (err) {
          if(err.code == 1){ //超时
            api.showProgress({
                title: '加载中',
                modal: false
            });
           app.apipath = getApiPathAddress();
            api.ajax({
                url: app.apipath + path,
                method: isPut ? 'put' : 'post',
                timeout: 60,
                dataType: 'json',
                returnAll: false,
                headers: headers,
                data: data
            }, function(ret, err) {
              if(ret){
                api.hideProgress();
                callback(ret, err);
              }
                if (err) {
                    if(err.code == 1){ //超时
                    api.toast({
                        msg: '网络请求超时',
                        duration: 2000,
                        location: 'bottom'
                    });
                    }else{
                      fnPostErrMessage(err);
                    }
                }
            });
          }else{
            fnPostErrMessage(err);
          }
        }
    });
};

// ajax同步访问
var asynAjax = {
    get: function(path, where, page, limit, fn) {
        var obj = new XMLHttpRequest();
        var url = app.apipath + path + '?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}';
        obj.open('GET', url, false);
        obj.onreadystatechange = function() {
            var ret, err;
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
                ret = obj.responseText;
            } else {
                err = obj.responseText;
            }
            fn.call(ret, ret);
        };
        obj.send();
    },
    post: function(path, data, fn) {
        var obj = new XMLHttpRequest();
        obj.open("POST", url, false);
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        obj.onreadystatechange = function() {
            var ret, err;
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
                ret = obj.responseText;
            } else {
                err = obj.responseText;
            }
            fn.call(ret, ret);
        };
        obj.send(data);
    }
}
