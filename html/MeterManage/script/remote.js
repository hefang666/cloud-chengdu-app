var app = {
    apipath: `${$api.getStorage("bwapipath")}/api/waterMeters/info`,
    bwapipath: `${$api.getStorage("bwapipath")}/webapi/request/postmms`,
    bwgetmmsapipath: `${$api.getStorage("bwapipath")}/webapi/request/GetMMS`,
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
    headers.Authorization = $api.getStorage("bwHeaders");
    // api.openWin({
    //     name: 'index',
    //     url: 'widget://index.html'
    // });
    // console.log(HandleUserRegistrationService/GetList);
    api.ajax({
        // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
        // url: app.apipath + path,
        url: app.apipath,
        method: isDelete ? 'delete' : 'get',
        // timeout: 15,
        dataType: 'json',
        headers: headers,
        traditional: true
    }, function(ret, err) {
        api.hideProgress();
        // api.refreshHeaderLoadDone();
        callback(ret, err);
        if (err) {
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
    });
};

function fnPost(Methods, data, contentType, isLogin, isPut, callback, files = "null", isErr = false) {
    var headers = {};
    // console.log(JSON.stringify(files))

    if (files == "null") {
        var body = {
            body: JSON.stringify({
                Method: Methods,
                UserName: $api.getStorage("bwUserName"), //"01012"
                Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
                SerialNo: '',
                KeyCode: '', //营业
                Parameter: JSON.stringify(data)
            })
        };
    } else {
          var body = {
            values:{
              "Method": Methods,
              "UserName": $api.getStorage("bwUserName"), //"01012"
              "Password": $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
              "SerialNo": '',
              "KeyCode": '', //营业
              "Parameter":data
            },
            files:files
          }
    }

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
        headers.Authorization = $api.getStorage("bwHeaders");
    }
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });

    // vue 测试
    // app.apipath = 'http://' + $api.getStorage('apiUrl')+'/api/'+path;
    // console.log( app.apipath);
    api.ajax({
        url: app.apipath, //app.apipath+path
        method: isPut ? 'put' : 'post',
        // timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: files == 'null'?headers:{},
        data: body
    }, function(ret, err) {
        // api.refreshHeaderLoadDone();
        callback(ret, err);
        if (err) {
            if (isErr) {
                callback(false, err);
            }
            callback(ret, err);
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
                    if (isErr == false) {
                        api.toast({
                            msg: err.body,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                }
            } else {
                if (isErr == false) {
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'top'
                    });
                }

            }
        }
    });
};

function jhFnPost(Methods, data, contentType, isLogin, isPut, callback, files = "null", isErr = false) {
    var headers = {};
    // console.log(JSON.stringify(files))

    if (files == "null") {
        var body = {
            body: JSON.stringify({
                Method: Methods,
                UserName: $api.getStorage("jhUserName"), //"01012"
                Password: $api.getStorage("jhPassWord"), // "g6OuZomFp3E="
                SerialNo: '',
                KeyCode: '', //营业
                Parameter: JSON.stringify(data)
            })
        };
    } else {
          var body = {
            values:{
              "Method": Methods,
              "UserName": $api.getStorage("jhUserName"), //"01012"
              "Password": $api.getStorage("jhPassWord"), // "g6OuZomFp3E="
              "SerialNo": '',
              "KeyCode": '', //营业
              "Parameter":data
            },
            files:files
          }
    }

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
        headers.Authorization = $api.getStorage("bwHeaders");
    }
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });

    // vue 测试
    // app.apipath = 'http://' + $api.getStorage('apiUrl')+'/api/'+path;
    // console.log( app.apipath);
    api.ajax({
        url: `${$api.getStorage("jhapipath")}waterMeters/info`, //app.apipath+path
        method: isPut ? 'put' : 'post',
        // timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: files == 'null'?headers:{},
        data: body
    }, function(ret, err) {
        // api.refreshHeaderLoadDone();
        callback(ret, err);
        if (err) {
            if (isErr) {
                callback(false, err);
            }
            callback(ret, err);
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
                    if (isErr == false) {
                        api.toast({
                            msg: err.body,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                }
            } else {
                if (isErr == false) {
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'top'
                    });
                }

            }
        }
    });
};


function bwfnGet(path, data, isDelete, callback) {
    var headers = {};
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if (isDelete) {
        headers["Content-Type"] = 'application/json';
    }
    // headers.Authorization = $api.getStorage('loginInfo');
    headers.Authorization = $api.getStorage("bwHeaders");

    api.ajax({
        // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
        // url: app.apipath + path,
        url: app.bwapipath,
        method: isDelete ? 'delete' : 'get',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        traditional: true
    }, function(ret, err) {
        api.hideProgress();
        // api.refreshHeaderLoadDone();
        callback(ret, err);
        if (err) {
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
    });
};

function bwfnPost(Methods, data, contentType, isLogin, isPut, callback, isErr = false) {

    var headers = {};
    var body = {
        body: JSON.stringify({
            Method: Methods,
            UserName: $api.getStorage("bwUserName"), //"01012"
            Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
            SerialNo: '',
            KeyCode: '',
            Parameter: JSON.stringify(data)
        })
    };
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
        // headers.Authorization = $api.getStorage('loginInfo');

    }
    headers.Authorization = $api.getStorage("bwHeaders");
    // console.log(JSON.stringify(  headers));
    // headers.Authorization = '[{\"key\":\"10046\"},{\"key\":\"g6OuZomFp3E=\"}]';

    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });

    api.ajax({
        url: app.bwapipath, //app.apipath+path
        method: isPut ? 'put' : 'post',
        timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: body
    }, function(ret, err) {
        // api.refreshHeaderLoadDone();
        api.hideProgress();
        callback(ret, err);
        if (err) {
            if (isErr) {
                callback(false, err);
            }
            callback(ret, err);
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
                    if (isErr == false) {
                        api.toast({
                            msg: err.body,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                }
            } else {
                if (isErr == false) {
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'top'
                    });
                }

            }
        }
    });
};

function bwfnPostNew(Methods, data, contentType, isLogin, isPut, callback, isErr = false) {

    var headers = {};
    var body = {
        body: JSON.stringify({
            Method: Methods,
            UserName: $api.getStorage("bwUserName"), //"01012"
            Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
            SerialNo: '',
            KeyCode: '',
            Parameter: JSON.stringify(data)
        })
    };
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

    }
    headers.Authorization = $api.getStorage("bwHeaders");

    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });

    api.ajax({
        url: app.bwapipath, //app.apipath+path
        method: isPut ? 'put' : 'post',
        timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: body
    }, function(ret, err) {
        callback(ret, err);
        if (err) {
            if (isErr) {
                callback(false, err);
            }
            callback(ret, err);
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
                    if (isErr == false) {
                        api.toast({
                            msg: err.body,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                }
            } else {
                if (isErr == false) {
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'top'
                    });
                }

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

function fngetmmsGet(path, data, isDelete, callback) {
    var headers = {};
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if (isDelete) {
        headers["Content-Type"] = 'application/json';
    }
    headers.Authorization = $api.getStorage("bwHeaders");
    // api.openWin({
    //     name: 'index',
    //     url: 'widget://index.html'
    // });
    // console.log(HandleUserRegistrationService/GetList);
    api.ajax({
        // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
        // url: app.apipath + path,
        url: app.bwgetmmsapipath,
        method: isDelete ? 'delete' : 'get',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        traditional: true
    }, function(ret, err) {
        api.hideProgress();
        // api.refreshHeaderLoadDone();
        callback(ret, err);
        if (err) {
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
    });
};

function fngetmmsPost(Methods, data, contentType, isLogin, isPut, callback, isErr = false, files = {}) {
    var headers = {};
    var body = {
        body: JSON.stringify({
            Method: Methods,
            UserName: $api.getStorage("bwUserName"), //"01012"
            Password: $api.getStorage("bwPassWord"), // "g6OuZomFp3E="
            SerialNo: '11111111',
            KeyCode: '', //营业
            Parameter: JSON.stringify(data)
        }),
        files: files
    };
    // console.log(JSON.stringify(body));
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
        headers.Authorization = $api.getStorage("bwHeaders");
    }
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });

    // vue 测试
    // app.apipath = 'http://' + $api.getStorage('apiUrl')+'/api/'+path;
    console.log(app.bwgetmmsapipath);
    api.ajax({
        url: app.bwgetmmsapipath, //app.apipath+path
        method: isPut ? 'put' : 'post',
        timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: body
    }, function(ret, err) {
        // api.refreshHeaderLoadDone();
        api.hideProgress();
        callback(ret, err);
        if (err) {
            if (isErr) {
                callback(false, err);
            }
            callback(ret, err);
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
                    if (isErr == false) {
                        api.toast({
                            msg: err.body,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                }
            } else {
                if (isErr == false) {
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'top'
                    });
                }

            }
        }
    });
};
