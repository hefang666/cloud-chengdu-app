var apiUrl = 'http://' + $api.getStorage('apiUrl');
// var apiUrl = 'http://192.168.0.93:8002';
// var apiUrl = 'http://192.168.0.43:8889';
//字符串替换所有匹配字段
String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

/**
 * 日期转字符串
 * @param fmt
 * @returns
 */
Date.prototype.Format = function(fmt) {   
    var o = {       
        "M+": this.getMonth() + 1, //月份
               "d+": this.getDate(), //日
               "h+": this.getHours(), //小时
               "m+": this.getMinutes(), //分
               "s+": this.getSeconds(), //秒
               "q+": Math.floor((this.getMonth() + 3) / 3), //季度
               "S": this.getMilliseconds() //毫秒
               
    };   
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));   
    }
    for (var k in o) {      
        if (new RegExp("(" + k + ")").test(fmt)) {         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));      
        }   
    }   
    return fmt;
}

//获取时分秒
function getTime(data) {
    var str = data;
    var num = str.indexOf("T");
    if (num != -1) {
        str = str.substr(num + 1);
        return str;
    } else {
        return "";
    }
}

//判断是否为空
function isEmpty(mixed_var) {
    var key;
    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
        return true;
    }
    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }
    return false;
}

// 获取后端服务提供的公共参数
//     TenantId             租户ID，如果为null，则根据当前登录自动获取租户ID，为-1(这里假设ID都是从1开始的值)，则租户ID为null
//     OrgId                组织ID，如果为null，则根据当前登录自动获取组织ID
function getPublicParameter(TenantId, OrgId, ProductId, Code) {
    var result = null;
    var tenantId = TenantId;
    var orgId = OrgId;

    var loginInfo = $api.getStorage('UserLoginInfo');
    if (typeof loginInfo === 'object') {
        if (tenantId == null) tenantId = loginInfo.tenantInfo.tenantId;
        if (orgId == null) orgId = loginInfo.userInfo.orgId;
    }
    if (tenantId == -1) tenantId = null;

    var queryString = 'TenantId=' + tenantId + '&OrgId=' + orgId + '&ProductId=' + ProductId + '&Code=' + Code;
    var url = apiUrl + '/api/services/app/Authorization/GetPublicParameter?' + queryString;

    var obj = new XMLHttpRequest();
    obj.open('GET', url, false);
    obj.send(null);
    // alert('地址：' + url + '\r\n响应：' + obj.responseText);
    var ret = getResultfromXMLHttpRequest(obj);
    if (ret) result = ret.value;

    return result;
}

// 从XMLHttpRequest请求对象中返回结果，如果请求失败返回null
function getResultfromXMLHttpRequest(objXMLHttpRequest) {
    var result = null;
    var errCode = null;
    var errText = null;

    if (objXMLHttpRequest != null) {
        if (objXMLHttpRequest.readyState == 4 && objXMLHttpRequest.status == 200 || objXMLHttpRequest.status == 304) {
            var response = $api.strToJson(objXMLHttpRequest.responseText);
            if (response && response.success) {
                result = response.result;
            } else {
                errText = response.error;
            }
        } else {
            errCode = objXMLHttpRequest.status;
            errText = objXMLHttpRequest.statusText;
        }
    }

    if (errText) {
        api.toast({
            msg: '错误号：' + errCode + '\r\n描述：' + errText,
            duration: 5000,
            location: 'top'
        });
    }

    return result;
}

// 获取当前屏幕的方向，即是横屏还是竖屏显示
function getOrientation() {
    return (window.orientation == 90 || window.orientation == -90 ? 'landscape' : 'portrait');
}

// 设置屏幕横屏或竖屏显示
function setOrientation(orientation) {
    var curOrientation = getOrientation();
    if (orientation && orientation != curOrientation) {
        if (orientation == 'portrait') {
            api.setScreenOrientation({
                orientation: 'auto_portrait'
            });
        } else {
            api.setScreenOrientation({
                orientation: 'auto_landscape'
            });
        }
    }
}

//ios向右滑动时设置状态栏颜色
function setIOSBar() {
    api.addEventListener({
        name: 'viewdisappear'
    }, function(ret, err) {
        if (api.systemType == 'ios') {
            api.setStatusBarStyle({
                style: 'light',
            });
        }
    });
}

function changeFontSize() {
    var changeSize = $api.getStorage('fontSize');
    if (changeSize == undefined || changeSize == 'normal') {
        document.body.style.setProperty('--fontsize9', '0.9rem');
        document.body.style.setProperty('--fontsize85', '0.85rem');
        document.body.style.setProperty('--fontsize8', '0.8rem');
        document.body.style.setProperty('--fontsize75', '0.75rem');
        document.body.style.setProperty('--fontsize7', '0.7rem');
        document.body.style.setProperty('--fontsize65', '0.65rem');
        document.body.style.setProperty('--fontsize6', '0.6rem');
        document.body.style.setProperty('--fontsize55', '0.55rem');
        document.body.style.setProperty('--fontsize5', '0.5rem');
        document.body.style.setProperty('--fontsize45', '0.45rem');
        document.body.style.setProperty('--fontsize4', '0.4rem');
        document.body.style.setProperty('--width2', '2rem');
        document.body.style.setProperty('--width34', '3.4rem');
        document.body.style.setProperty('--width42', '4.2rem');
    } else if (changeSize == 'large') {
        document.body.style.setProperty('--fontsize9', '0.99rem');
        document.body.style.setProperty('--fontsize85', '0.935rem');
        document.body.style.setProperty('--fontsize8', '0.88rem');
        document.body.style.setProperty('--fontsize75', '0.825rem');
        document.body.style.setProperty('--fontsize7', '0.77rem');
        document.body.style.setProperty('--fontsize65', '0.715rem');
        document.body.style.setProperty('--fontsize6', '0.66rem');
        document.body.style.setProperty('--fontsize55', '0.605rem');
        document.body.style.setProperty('--fontsize5', '0.55rem');
        document.body.style.setProperty('--fontsize45', '0.495rem');
        document.body.style.setProperty('--fontsize4', '0.44rem');
        document.body.style.setProperty('--width2', '2.2rem');
        document.body.style.setProperty('--width34', '3.74rem');
        document.body.style.setProperty('--width42', '4.62rem');
    } else if (changeSize == 'small') {
        document.body.style.setProperty('--fontsize9', '0.81rem');
        document.body.style.setProperty('--fontsize85', '0.765rem');
        document.body.style.setProperty('--fontsize8', '0.72rem');
        document.body.style.setProperty('--fontsize75', '0.675rem');
        document.body.style.setProperty('--fontsize7', '0.63rem');
        document.body.style.setProperty('--fontsize65', '0.585rem');
        document.body.style.setProperty('--fontsize6', '0.54em');
        document.body.style.setProperty('--fontsize55', '0.495rem');
        document.body.style.setProperty('--fontsize5', '0.45rem');
        document.body.style.setProperty('--fontsize45', '0.405rem');
        document.body.style.setProperty('--fontsize4', '0.36rem');
        document.body.style.setProperty('--width2', '1.8rem');
        document.body.style.setProperty('--width34', '3.06rem');
        document.body.style.setProperty('--width42', '3.78rem');
    }
}

changeFontSize();

 // zxf 模拟弹窗
// function dialogAlert(params, callback) {
//   var BtnNumbers = '';
//     if (params.buttons.length != 0 || params.buttons != undefined) {
//         var buttons = params.buttons;
//         for (var i = 0; i < buttons.length; i++) {
//             // BtnNumbers += `<div class="dialogBtn" data-attr='${i+1}'>${buttons[i]}</div>`;
//               BtnNumbers += '<div class="dialogBtn" data-attr="'+i+1+'">'+buttons[i]+'</div>';
//         }
//     }
//     if (BtnNumbers == '') {
//         BtnNumbers = '<div class="dialogBtn" data-attr="1">确定</div><div class="dialogBtn" data-attr="2">取消</div>';
//     }
//     if (params.buttons.length == 0) {
//         BtnNumbers = "";
//     }
//     if (BtnNumbers == "") {
//         var HtmlCentent ='<div class="dilogMark"><div class="dialogBox"><div class="dialog_title"><span>'+params.title!='' || params.title!=undefined  || params.title!= null ?params.title : '提示'+'</span></div><div class="dialog_body"><span>'+params.content !='' || params.content !=undefined ? params.content:'确定要操作吗'+'</span></div></div></div>';
//     } else {
//         var HtmlCentent = '<div class="dilogMark"><div class="dialogBox"><div class="dialog_title"><span>'+params.title!='' || params.title!=undefined  || params.title!= null ?params.title : '提示'+'</span></div><div class="dialog_body"><span>'+params.content !='' || params.content !=undefined ? params.content:'确定要操作吗'+'</span></div><div class="dialog_footer">'+BtnNumbers+'</div></div></div>';
//     }
//     // 在标签结束前添加html内容
//     document.body.insertAdjacentHTML('beforeend', HtmlCentent);
//     if (params.content.length > 15) {
//         document.querySelector('.dialog_body').classList.add("lang_content");
//     }
//     // 为按钮添加单击事件
//     checkDialogBtn(callback);
// };
//
// function checkDialogBtn(callback) {
//     var dialogBtn = $('.dialogBtn');
//     $(dialogBtn[dialogBtn.length - 1]).addClass('noneBorder');
//     var isClose = false;
//     for (var i = 0; i < dialogBtn.length; i++) {
//         $(dialogBtn[i]).on('click', function() {
//             $(this).removeClass('active').addClass("active");
//             var index = $(this).attr('data-attr');
//             //  确定
//             var data = {
//                 buttonIndex: index
//             }
//             callback(data);
//             // 移除标签
//             document.body.removeChild(document.querySelector('.dilogMark'));
//             isClose = true;
//         });
//         if (isClose) {
//             break;
//         }
//     }
// }


// // 下载插件包
// function CheckAppVsersionByTeantId() {
//     api.closeFrame({
//         name: 'main'
//     });
//     var userLoginInformation = $api.getStorage('userLoginInformation');
//     userLoginInformation.newVersionRemark = [];
//     userLoginInformation.newVersionNumber = 0;
//     $api.setStorage('userLoginInformation', userLoginInformation);
//     var CloudIsExist = true;
//     if (userLoginInformation.loginSuccessData != undefined) { //判断用户是否登录
//         fnPost('services/app/AppVersionService/CheckAppVsersionByTeantId', {
//             body: JSON.stringify({
//                 "tenantId": userLoginInformation.loginSuccessData.tenantId
//             })
//         }, 'application/json', true, false, function(ret, err){
//             api.hideProgress();
//             if (ret && ret.success) {
//                 var callbackResult = ret.result;
//                 if (callbackResult.length != 0) {
//                     if (userLoginInformation != undefined) {
//                         if (userLoginInformation.versionInformation.length > 0) {
//                             // 用于判断public公共文件是否存在
//                             var versionInformation = userLoginInformation.versionInformation;
//                             for (var n = 0; n < versionInformation.length; n++) {
//                                 if (versionInformation[n].moduleCode == 'WaterStarOne-Cloud-S9') {
//                                     CloudIsExist = true;
//                                 } else {
//                                     CloudIsExist = false;
//                                 }
//                             }
//                             if (CloudIsExist == false) {
//                                 for (var i = 0; i < callbackResult.length; i++) {
//                                     if (callbackResult[i].moduleCode == 'WaterStarOne-Cloud-S9') {
//                                         callbackResult[i].newVersionPackageUrl = '';
//                                         callbackResult[i].newHasVersion = false;
//                                         callbackResult[i].newVersionNo = '';
//                                         versionInformation.push(callbackResult[i]);
//                                         addNewApplication(callbackResult[i],false); //下载新的应用到本地  newApplicationList每次接口查询出来的结果
//                                         break;
//                                     }
//                                 }
//                             }
//                             // 判断应用是否有新版本
//                             checkNewVersion(callbackResult);
//                         } else {
//                             //是否是第一次登陆
//                             if (api.connectionType != 'none') {
//                                 var appList = userLoginInformation.appList[0].applications;
//                                 var versionInformation = [];
//                                 var appNumber = 0;
//                                 for (var i = 0; i < callbackResult.length; i++) {
//                                     if (callbackResult[i].moduleCode == 'WaterStarOne-Cloud-S9') {
//                                         versionInformation.push(callbackResult[i]);
//                                     }
//                                     appNumber++;
//                                     if (appList != undefined) {
//                                         for (var j = 0; j < appList.length; j++) {
//                                             if (callbackResult[i].moduleCode === appList[j].coding) { //判断应用列表和版本返回的数据相同才可以显示和下载
//                                                 callbackResult[i].newVersionPackageUrl = '';
//                                                 callbackResult[i].newHasVersion = false;
//                                                 callbackResult[i].newVersionNo = '';
//                                                 versionInformation.push(callbackResult[i]);
//                                             }
//                                         }
//                                     }
//                                 }
//                                 if (appNumber == callbackResult.length) {
//                                     userLoginInformation.versionInformation = versionInformation;
//                                     $api.setStorage('userLoginInformation', userLoginInformation);
//                                     downLoadZip(callbackResult);
//                                 }
//                             }
//                         }
//                     }
//                 }
//
//             } else {
//                 api.toast({
//                     msg: '网络无法连接，请检查网络配置',
//                     duration: 2000,
//                     location: 'top'
//                 });
//
//             }
//         });
//     }
// }

// 检查应用是否有新版本
function checkNewVersion(newApplicationList) {
    var newApplicationList = newApplicationList;
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var oldApplicationList = userLoginInformation.versionInformation; //版本信息
    if (userLoginInformation.appList != undefined && userLoginInformation.appList != null) {
        var appList = userLoginInformation.appList[0].applications;
    }
    var number = 0;
    var hasNewVersion = 0;
    // console.log(JSON.stringify(oldApplicationList))
    // 判断是否添加了新的应用
    if (appList != null) {
        // if (appList.length != oldApplicationList.length - 1) {
        for (var v = 0; v < appList.length; v++) {
            var oldNumber = 0;
            for (var old = 0; old < oldApplicationList.length; old++) {
                if (appList[v].coding !== oldApplicationList[old].moduleCode) {
                    oldNumber++;
                }
                if (oldNumber == oldApplicationList.length) {
                    // 添加新的应用（查找文件，查勘文件是否存在。不存在。则默认下载解压）
                    for (var n = 0; n < newApplicationList.length; n++) {
                        if (appList[v].coding == newApplicationList[n].moduleCode) {
                            newApplicationList[n].newVersionPackageUrl = '';
                            newApplicationList[n].newHasVersion = false;
                            newApplicationList[n].newVersionNo = '';
                            oldApplicationList.push(newApplicationList[n]);
                            addNewApplication(newApplicationList[n],false);
                            break;
                        }
                    }
                }
            }
        }
        // }

        for (var i = 0; i < newApplicationList.length; i++) {
            number++;
            var isNewData = 0;
            for (var j = 0; j < oldApplicationList.length; j++) {
                // 针对公共文件 不提示有新的版本，有新的版本，就直接更新
                if (newApplicationList[i].moduleCode == 'WaterStarOne-Cloud-S9' && oldApplicationList[j].moduleCode == 'WaterStarOne-Cloud-S9') {
                    if (newApplicationList[i].versionNo != oldApplicationList[j].versionNo || newApplicationList[i].packetUrl !== oldApplicationList[j].packetUrl) {
                        removeFilesToLocal(newApplicationList[i], true);
                        addNewApplication(newApplicationList[i],false);
                        newApplicationList[i].newVersionPackageUrl = newApplicationList[i].packetUrl;
                        newApplicationList[i].newHasVersion = false;
                        newApplicationList[i].newVersionNo = newApplicationList[i].versionNo;
                        oldApplicationList[j] = newApplicationList[i];
                    }

                }
                for (var vp = 0; vp < appList.length; vp++) {
                    // 已有的应用，判断是否有新版本
                    if (newApplicationList[i].moduleCode == oldApplicationList[j].moduleCode && appList[vp].coding == newApplicationList[i].moduleCode) {
                        if (newApplicationList[i].versionNo != oldApplicationList[j].versionNo) {
                            hasNewVersion++;
                            oldApplicationList[j].newVersionPackageUrl = newApplicationList[i].packetUrl;
                            oldApplicationList[j].newHasVersion = true;
                            oldApplicationList[j].newVersionNo = newApplicationList[i].versionNo;
                            oldApplicationList[j].creationTime = newApplicationList[i].creationTime;
                            oldApplicationList[j].creatorUserId = newApplicationList[i].creatorUserId;
                            oldApplicationList[j].creatorUserName = newApplicationList[i].creatorUserName;
                            oldApplicationList[j].tenantId = newApplicationList[i].tenantId;
                            oldApplicationList[j].lanApiUrl = newApplicationList[i].lanApiUrl;
                            oldApplicationList[j].netApiUrl = newApplicationList[i].netApiUrl;
                            oldApplicationList[j].remark = newApplicationList[i].remark;
                            oldApplicationList[j].tenantName = newApplicationList[i].tenantName;
                            break;
                        }
                        if (newApplicationList[i].packetUrl != oldApplicationList[j].packetUrl) {
                            hasNewVersion++;
                            oldApplicationList[j].newVersionPackageUrl = newApplicationList[i].packetUrl;
                            oldApplicationList[j].newHasVersion = true;
                            oldApplicationList[j].newVersionNo = newApplicationList[i].versionNo;
                            oldApplicationList[j].creationTime = newApplicationList[i].creationTime;
                            oldApplicationList[j].creatorUserId = newApplicationList[i].creatorUserId;
                            oldApplicationList[j].creatorUserName = newApplicationList[i].creatorUserName;
                            oldApplicationList[j].tenantId = newApplicationList[i].tenantId;
                            oldApplicationList[j].lanApiUrl = newApplicationList[i].lanApiUrl;
                            oldApplicationList[j].netApiUrl = newApplicationList[i].netApiUrl;
                            oldApplicationList[j].remark = newApplicationList[i].remark;
                            oldApplicationList[j].tenantName = newApplicationList[i].tenantName;
                            break;
                        }
                    }
                }

            }
        }
    }
    if (number == newApplicationList.length) {
        for (var i = 0; i < oldApplicationList.length; i++) {
            if (oldApplicationList[i].moduleCode == 'WaterStarOne-Cloud-S9') {
                if (oldApplicationList[i].newHasVersion) {
                    oldApplicationList[i].newHasVersion = false;
                    checkLocalFile(oldApplicationList[i]);
                    break;
                }
            }
        }
        userLoginInformation.versionInformation = oldApplicationList;
        // console.log(JSON.stringify(userLoginInformation.versionInformation));
        $api.setStorage('userLoginInformation', userLoginInformation);
    }
    if (hasNewVersion != 0) {
        // console.log(hasNewVersion)
        api.openFrame({
            name: 'updateVersion_frame',
            url: './updateVersion_frame.html',
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: 'auto'
            },
            bounces: false,
            pageParam: {
                type: 'update'
            },
            bgColor: 'rgba(0,0,0,0.1)',
        });
    } else {
        IsDecompression();
        //查询手机是否开启GPS定位 zxf 2020-4-12
        checkPhoneGPS(false);
    }

}


// 删除指定的本地zip包
// function removeFilesToLocal(data, firstLoad = false) {
function removeFilesToLocal(data, firstLoad) {
    var fs = api.require("fs");
    data.productName = data.moduleName;
    deleteLocalWgt(data);
    fs.remove({
        path: 'fs://'+data.moduleName+'.zip'
    }, function(ret, err) {
        if (ret.status) {
            if (firstLoad) {
                addNewApplication(data, true);
            }
        }
    });
}

// 删除本地fs//wgt里面相应的数据
function deleteLocalWgt(app) {
    var wgtName = '';
    var fs = api.require("fs");
    switch (true) {
        case app.coding == "WaterStarOne-MRH-S8":
            wgtName = "MeterReading"
            break;
        case app.coding == "WaterStarOne-MMS-S8":
            wgtName = "MeterManage"
            break;
        case app.coding == "WaterStarOne-AM-S8":
            wgtName = "Audit"
            break;
    }
    if (wgtName != '') {
        fs.remove({
            path:' fs://wgt/'+wgtName+''
        }, function(ret, err) {
            if (ret.status) {}
        });
    }
}
// 删除本地组件化文件 zxf 2020-04-10
function deleteLocalVesios(data) {
    var fs = api.require("fs");
    var versionInformation = data.versionInformation;
    for (var i = 0; i < versionInformation.length; i++) {
        fs.remove({
            path:' fs://'+versionInformation[i].moduleName+'.zip'
        }, function(ret, err) {
            if (ret.status) {

            }
        });
        versionInformation[i].coding = versionInformation[i].moduleCode;
        deleteLocalWgt(versionInformation[i]);
    }
    // fs.remove({
    //     path: 'fs://wgt'
    // }, function(ret, err) {
    //     if (ret.status) {
    //
    //     }
    // });
}

// 下载模块文件
var progressValue = 0;
function downLoadZip() {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var versionInformation = userLoginInformation.versionInformation;
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块
    // 当前登录人员有应用列表
    if (versionInformation.length > 0) {
        // 进度条
        var isChangeApiUrl = $api.getStorage('isChangeApiUrl');
        if (isChangeApiUrl == "false") {
            var UIActionProgress = api.require('UIActionProgress');
            UIActionProgress.open({
                // maskBg: 'rgba(0,0,0,0.5)',
                styles: {
                    h: 108,
                    bg: '#fff',
                    title: {
                        size: 13,
                        color: '#000',
                        marginT: 10
                    },
                    msg: {
                        size: 12,
                        color: '#000',
                        marginT: 5
                    },
                    lable: {
                        size: 12,
                        color: '#696969',
                        marginB: 5
                    },
                    progressBar: {
                        size: 2,
                        normal: '#000',
                        active: '#4876FF',
                        marginB: 35,
                        margin: 5
                    }
                },
            }, function(ret) {
                UIActionProgress.close();
                // api.alert({
                //     msg: JSON.stringify(ret)
                // });
            });
        }
        var numberNo = 0;
        for (var i = 0; i < versionInformation.length; i++) {
            (function(i) {
                numberNo++;
                var moduleName = versionInformation[i].moduleName.replace(/(^\s*)/g, "");
                if (versionInformation[i].packetUrl != "") {
                    var packetUrl = versionInformation[i].packetUrl.replace(/(^\s*)/g, "");
                }

                // 判断文件是否存在
                fs.exist({
                    path: 'fs://'+moduleName+'.zip'
                }, function(ret, err) {
                    if (ret.exist) {
                        // 文件存在,并且有新的版本，则更新
                        if (versionInformation[i].newHasVersion == true) {
                            // removeFilesToLocal(versionInformation[i], false);
                            var newpacketUrl = versionInformation[i].newVersionPackageUrl.replace(/(^\s*)/g, "");
                            var downloadUrl = apiUrl + newpacketUrl;
                            // 用于显示更新的内容
                            var localStorageInfo = $api.getStorage('userLoginInformation');
                            var newVersionRemark = localStorageInfo.newVersionRemark;
                            var num = 0;
                            if (newVersionRemark.length == 0 && versionInformation[i].newHasVersion == true) {
                                localStorageInfo.newVersionRemark.push(versionInformation[i]);
                                localStorageInfo.newVersionNumber++;
                            } else {
                                for (var j = 0; j < newVersionRemark.length; j++) {
                                    if (newVersionRemark[j].moduleCode !== versionInformation[i].moduleCode && versionInformation[i].newHasVersion == true) {
                                        localStorageInfo.newVersionRemark.push(versionInformation[i]);
                                        localStorageInfo.newVersionNumber++;
                                    }
                                    // else {
                                    //     newVersionRemark[j] = versionInformation[i];
                                    // }
                                }
                            }
                            $api.setStorage('userLoginInformation', localStorageInfo);
                            // 用于显示更新的内容结束
                            downLoadZipToLocal(moduleName, downloadUrl, zip, UIActionProgress, versionInformation[i]);
                        }
                        UIActionProgress.close();
                    } else {
                        // 文件不存在，下载
                        if (packetUrl != '') {
                            var downloadUrl = apiUrl + packetUrl;
                            downLoadZipToLocal(moduleName, downloadUrl, zip, UIActionProgress, versionInformation[i]);
                        }
                    }
                });
            })(i);
        }
        if (numberNo == versionInformation.length) {
            userLoginInformation.versionInformation = versionInformation;
            $api.setStorage('userLoginInformation', userLoginInformation);
        }
    } else {
        //     // 当前登录人员没有应用列表
    }
}


function downLoadZipToLocal(moduleName, downloadUrl, zip, UIActionProgress, singleVersionInformation) {
    var singleVersionInformation = singleVersionInformation;
    api.download({
        url: downloadUrl,
        savePath:'fs://'+moduleName+'.zip',
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
          removeFilesToLocal(singleVersionInformation, true);
            progressValue++;
            //下载成功
            zip.unarchive({
                file: 'fs://'+moduleName+'.zip',
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {
                    var userLoginInformation = $api.getStorage('userLoginInformation');
                    var versionInformation = userLoginInformation.versionInformation;
                    for (var i = 0; i < versionInformation.length; i++) {
                        if (singleVersionInformation.moduleCode == versionInformation[i].moduleCode && singleVersionInformation.newHasVersion == true) {
                            versionInformation[i].packetUrl = versionInformation[i].newVersionPackageUrl;
                            versionInformation[i].versionNo = versionInformation[i].newVersionNo;
                            versionInformation[i].newVersionPackageUrl = '';
                            versionInformation[i].newHasVersion = false;
                            versionInformation[i].newVersionNo = '';
                            break;
                        }
                    }
                    userLoginInformation.versionInformation = versionInformation;
                    $api.setStorage('userLoginInformation', userLoginInformation);
                    if (versionInformation.length == progressValue) {
                        UIActionProgress.close();
                    }
                    if (userLoginInformation.newVersionRemark.length > 0) {
                        if (userLoginInformation.newVersionNumber == userLoginInformation.newVersionRemark.length) {
                            api.openFrame({
                                name: 'updateVersion_frame',
                                url: './updateVersion_frame.html',
                                rect: {
                                    x: 0,
                                    y: 0,
                                    w: 'auto',
                                    h: 'auto'
                                },
                                bounces: false,
                                pageParam: {
                                    type: 'remark',
                                    number: 'all'
                                },
                                bgColor: 'rgba(0,0,0,0.1)',
                            });
                        }
                    }

                }
            });
        } else {
            UIActionProgress.setData({
                data: {
                    title: '正在为您下载更新资源包',
                    value: ret.percent
                }
            });

        }
    });
}

// 查询本地是否存在文件(不存在就提示（网络没有连接）)
function checkLocalFile(datas) {
    var fs = api.require('fs');
    var zip = api.require('zip');
    var downloadUrl = apiUrl + datas.packetUrl;
    api.download({
        url: downloadUrl,
        savePath: 'fs://'+datas.moduleName+'.zip',
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            //下载成功
            zip.unarchive({
                file:'fs://'+datas.moduleName+'.zip',
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {}
            });
        }
    });
}
//判断文件是否已经解压
function IsDecompression() {
    var fs = api.require("fs");
    var zip = api.require("zip");
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var versionInformation = userLoginInformation.versionInformation;
    // 判断文件是否存在
    fs.exist({
        path: 'fs://wgt'
    }, function(ret, err) {
        if (ret.exist) {
            for (var i = 0; i < versionInformation.length; i++) {
                (function(i) {
                    var moduleName = versionInformation[i].moduleName.replace(/(^\s*)/g, "");
                    fs.exist({
                        path: 'fs://'+moduleName+'.zip'
                    }, function(ret, err) {
                        if (ret.exist) {
                            zip.unarchive({
                                file: 'fs://'+moduleName+'.zip',
                                password: '',
                                toPath: 'fs://wgt/'
                            }, function(ret, err) {
                                if (ret.status) {}
                            });
                        }
                    });
                })(i);
            }

        }
    });
}

// 下载设置-关于版本中单个应用更新
function singleAppUpdate(datas, isParams, callback) {
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块

    // 进度条
    var UIActionProgress = api.require('UIActionProgress');
    UIActionProgress.open({
        // maskBg: 'rgba(0,0,0,0.5)',
        styles: {
            h: 108,
            bg: '#fff',
            title: {
                size: 13,
                color: '#000',
                marginT: 10
            },
            msg: {
                size: 12,
                color: '#000',
                marginT: 5
            },
            lable: {
                size: 12,
                color: '#696969',
                marginB: 5
            },
            progressBar: {
                size: 2,
                normal: '#000',
                active: '#4876FF',
                marginB: 35,
                margin: 5
            }
        },
    }, function(ret) {
        UIActionProgress.close();
        // api.alert({
        //     msg: JSON.stringify(ret)
        // });
    });
    var moduleName = datas.moduleName.replace(/(^\s*)/g, "");

    if (isParams) {
        var packetUrl = datas.newVersionPackageUrl.replace(/(^\s*)/g, "");
    } else {
        var packetUrl = datas.packetUrl.replace(/(^\s*)/g, "");
    }

    api.download({
        url: apiUrl + packetUrl,
        savePath: 'fs://'+moduleName+'.zip',
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            //下载成功
            zip.unarchive({
                file:'fs://'+moduleName+'.zip',
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {
                    var userLoginInformation = $api.getStorage('userLoginInformation');
                    var versionInformation = userLoginInformation.versionInformation;
                    for (var i = 0; i < versionInformation.length; i++) {
                        if (versionInformation[i].moduleCode == datas.moduleCode) {
                            versionInformation[i].packetUrl = datas.newVersionPackageUrl;
                            versionInformation[i].versionNo = datas.newVersionNo;
                            versionInformation[i].newVersionPackageUrl = '';
                            versionInformation[i].newHasVersion = false;
                            versionInformation[i].newVersionNo = '';
                            break;
                        }
                    }
                    userLoginInformation.versionInformation = versionInformation;
                    $api.setStorage('userLoginInformation', userLoginInformation);
                    callback(true);
                    UIActionProgress.close();
                    api.toast({
                        msg: '版本更新成功!',
                        duration: 2000,
                        location: 'top'
                    });
                }
            });
        } else {
            UIActionProgress.setData({
                data: {
                    title: '正在为您下载更新资源包',
                    value: ret.percent
                }
            });
        }
    });
}

// 添加新的应用
// function addNewApplication(datas, isPublic = false) { //isPublic 公告文件是否有更新
function addNewApplication(datas, isPublic) { //isPublic 公告文件是否有更新
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块
    var moduleName = datas.moduleName.replace(/(^\s*)/g, "");
    var packetUrl = datas.packetUrl.replace(/(^\s*)/g, "");
    var fileInfo = {
        moduleName: moduleName,
        packetUrl: packetUrl,
        zip: zip
    }
    fs.exist({
        path: 'fs://'+moduleName+'.zip'
    }, function(ret, err) {
        if (ret.exist) {
            if (isPublic) {
                downloadFile(fileInfo, true);
            }
        } else {
            downloadFile(fileInfo,false);
        }
    });

}

function downloadFile(fileInfo, IsExist) {
  // function downloadFile(fileInfo, IsExist = false) {
    // IsExist 如果是已有的压缩包存在，则判断解压文件中是否存在，存在，则解压
    var fs = api.require("fs");
    if (IsExist) {
        fs.exist({
            path:'fs://wgt/'+fileInfo.moduleName+''
        }, function(ret, err) {
            if (ret.exist) {

            } else {
                fileInfo.zip.unarchive({
                    file: 'fs://'+fileInfo.moduleName+'.zip',
                    password: '',
                    toPath: 'fs://wgt/'
                }, function(ret, err) {
                    if (ret.status) {}
                });
            }
        });
    } else {
        api.download({
            url: apiUrl + fileInfo.packetUrl,
            savePath: 'fs://'+fileInfo.moduleName+'.zip',
            report: true,
            cache: false,
            allowResume: true
        }, function(ret, err) {
            if (ret.state == 1) {
                //下载成功
                fileInfo.zip.unarchive({
                    file: 'fs://'+fileInfo.moduleName+'.zip',
                    password: '',
                    toPath: 'fs://wgt/'
                }, function(ret, err) {
                    if (ret.status) {}
                });
            }
        });
    }
}


// 自动登录
function automaticLanding() {
    fnPost('services/app/PushInterface/ConnectionTest', {}, 'application/json', true, false, function(ret, err) {
        api.hideProgress();
        if (ret && ret.success && ret.result) {
            APPAuthenticate();
        }
    });
}

function APPAuthenticate() {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    // app
    if (userLoginInformation != undefined && userLoginInformation.loginData != undefined) {
        var isAccount = $api.getStorage('isAccount');
        var postUrl = isAccount!=undefined?isAccount ==1?'TokenAuth/Authenticate':'TokenAuth/APPAuthenticate':'TokenAuth/APPAuthenticate';
        fnPost(postUrl, {
            body: JSON.stringify(userLoginInformation.loginData)
        }, 'application/json', true, false, function(ret, err) {
            api.hideProgress();
            if (ret) {
                if (ret.success) {
                    // 保存用户登录成功后所有信息 zxf 2019.12.9
                    var Authorization = 'Bearer ' + ret.result.accessToken;
                    $api.setStorage('loginInfo', Authorization);
                    $api.setStorage('allTenants', ret.result.allTenants);
                    $api.setStorage('tenantId', ret.result.tenantId);
                    $api.setStorage('loginData', userLoginInformation.loginData);
                    $api.setStorage('isChangeApiUrl', "false");
                    loginedData = $api.getStorage('loginUsers');
                    var userData = {
                        account: userLoginInformation.loginData.userName,
                        password: userLoginInformation.loginData.password
                    }
                    var bindData = {
                        userId: ret.result.userId,
                        machineCode: $api.getStorage('registrationId') //手机唯一编码 index中
                    }
                    var recentUser = {
                        account: "",
                        password: ""
                    };
                    fnPost('services/app/User/UpdateMachineCode', {
                        body: JSON.stringify(bindData)
                    }, 'application/json', true, true, function(ret, err) {
                        api.hideProgress();
                    })
                    recentUser.account = userLoginInformation.loginData.userName;
                    recentUser.password = userLoginInformation.loginData.password;
                    $api.setStorage('recentUser', recentUser);
                    if (loginedData == undefined) {
                        loginedData = [];
                    }
                    if (loginedData.length == 0) {
                        loginedData.push(userData);
                    } else {
                        for (var i = 0; i < loginedData.length; i++) {
                            if (loginedData[i].account == userData.account) {
                                break
                            }
                            if (i == loginedData.length - 1) {
                                loginedData.push(userData);
                            }
                        }
                    }
                    $api.setStorage('loginUsers', loginedData);
                } else {
                    api.openWin({
                        name: 'login',
                        url: 'widget://html/login/login.html',
                        slidBackEnabled: false,
                        bgColor: 'widget://image/login/login_backgroud.png'
                    });
                }
            }
        }, true);
    }
}

function getCurrentLocation() {
    var CurrentLocation = {
        lon: "",
        lat: "",
    }
    var bMap = api.require('bMap');
    bMap.getLocation({
        accuracy: '100m',
        autoStop: true,
        filter: 1
    }, function(ret, err) {
        if (ret.status) {
            CurrentLocation.lon = ret.lon;
            CurrentLocation.lat = ret.lat;
            $api.setStorage('CurrentLocation', CurrentLocation);
        } else {
            $api.setStorage('CurrentLocation', CurrentLocation);
        }
    });
}

// 判断app是否存在
// function appIsExists(item = undefined, callback) {
function appIsExists(item,callback) {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var isHasNumber = 0;
    var sumNUmber = 0;
    var meterManageNumber = 0,
        auditNumber = 0,
        meterReadingNumber = 0;
    var ret = {
        status: false,
        appName: ""
    };
    if (userLoginInformation != undefined) {
        if (userLoginInformation.appList != undefined) {
            var appList = userLoginInformation.appList[0].applications;
            if (appList == null) {
                if (item != undefined) {
                    switch (true) {
                        case item.productCode == 'WaterStarOne-MMS-S8':
                            ret.appName = "表务管理";
                            callback(ret);
                            break;
                        case item.productCode == 'WaterStarOne-MRH-S8':
                            ret.appName = "抄表管家";
                            callback(ret);
                            break;
                        case item.productCode == 'WaterStarOne-AM-S8':
                            ret.appName = "稽核管理";
                            callback(ret);
                            break;
                    }
                } else {
                    ret.appName = '表务管理,稽核管理';
                    callback(ret);
                }
                return
            }
            if (appList.length > 0) {
                for (var i = 0; i < appList.length; i++) {
                    sumNUmber++;
                    if (item != undefined) {
                        if (appList[i].coding == item.productCode) {
                            isHasNumber++;
                        }
                        if (sumNUmber == appList.length) {
                            if (isHasNumber == 0) {
                                switch (true) {
                                    case item.productCode == 'WaterStarOne-MMS-S8':
                                        ret.appName = "表务管理";
                                        callback(ret);
                                        break;
                                    case item.productCode == 'WaterStarOne-MRH-S8':
                                        ret.appName = "抄表管家";
                                        callback(ret);
                                        break;
                                    case item.productCode == 'WaterStarOne-AM-S8':
                                        ret.appName = "稽核管理";
                                        callback(ret);
                                        break;
                                }
                            } else {
                                ret.status = true;
                                callback(ret);
                            }
                        }
                    } else {
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
                            if (meterManageNumber == 0) {
                                ret.appName += "表务管理,";
                            }
                            if (meterReadingNumber == 0) {
                                ret.appName += "抄表管家,";
                            }
                            if (auditNumber == 0) {
                                ret.appName += "稽核管理,";
                            }
                            if (meterManageNumber != 0 && meterReadingNumber != 0 && auditNumber != 0) {
                                ret.status = true;
                            } else {
                                ret.appName = ret.appName.substring(0, ret.appName.length - 1);
                            }
                            callback(ret);
                        }
                    }
                }
            }

        }
    }
}

//一键认领 - 判断APP是否存在 2020-05-23  zlx
function appIsExistAll(callbackAll) {
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    var headers = {};
    headers.Authorization = $api.getStorage('loginInfo');
    var CurrentLocation = $api.getStorage('CurrentLocation');
    var claimArr = [];
    api.ajax({
        url: apiUrl + '/api/services/app/WorkFlow/GetUnconFirmedTasks?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account=' + $api.getStorage("jhUserName") + '&PassWord=' + $api.getStorage("jhPassWord") + '&PageIndex=1&MaxResultCount=1000',
        method: 'get',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        traditional: true
    }, function(ret, err) {
        if (ret) {
            if (ret.success) {
                if (ret.result.items.length > 0) {
                    claimArr = ret.result.items;
                    var isOk = true;
                    for (var i = 0; i < claimArr.length; i++) {
                        appIsExists(claimArr[i], function(ret) {
                            if (!ret.status) {
                                api.hideProgress();
                                isOk = false;
                                callbackAll(ret);
                            }
                        });
                        if (!isOk) {
                            break;
                        }
                        if (i == (claimArr.length - 1) && isOk) {
                            callbackAll({
                                status: true,
                                appName: ""
                            });
                        }
                    }
                }
            }
        } else {
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
}


// 首页任务一键认领
function ConfirmTaskAll(type) {
    var UserName = PassWord = "";
    appIsExistAll(function(ret) {
        if (ret.status) {
            // 一键领取所有任务
            var CurrentLocation = $api.getStorage('CurrentLocation');
            var body = {
                body: JSON.stringify({
                    lng: CurrentLocation.lon,
                    lat: CurrentLocation.lat,
                    account: $api.getStorage('bwUserName') != undefined ? $api.getStorage('bwUserName') : ($api.getStorage('jhUserName') != undefined ? $api.getStorage('jhUserName') : ""),
                    passWord: $api.getStorage('bwPassWord') != undefined ? $api.getStorage('bwPassWord') : ($api.getStorage('jhPassWord') != undefined ? $api.getStorage('jhPassWord') : "")
                })
            };
            fnPost('services/app/WorkFlow/ConfirmTaskAll', body, 'application/json', true, false, function(ret, err) {
                api.hideProgress();
                console.log(JSON.stringify(ret));
                console.log(JSON.stringify(err))
                if (ret) {
                    if (ret.success) {
                        var auditTaskNoArray = '';
                        var data = ret.result;
                        var number = 0;
                        for (var i = 0; i < data.length; i++) {
                            number++;
                            var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                            data[i].ClaimTime = time;
                            if (data[i].url != "" && data[i].url != null && data[i].url != 'string') {
                                var urlAarry = data[i].url.split('|');
                                var detailUrl = urlAarry[1].substring(2, urlAarry[1].length);
                                data[i].handleUrl = urlAarry[0].substring(2, urlAarry[0].length);
                                data[i].detailUrl = urlAarry[1].substring(2, urlAarry[1].length);
                            } else {
                                data[i].handleUrl = "";
                                data[i].detailUrl = "";
                            }
                            if (data[i].taskCode == null || data[i].taskCode == undefined) {
                                data[i].taskCode = "";
                            }
                            switch (true) {
                                case data[i].productCode == 'WaterStarOne-MMS-S8':
                                    data[i].picType = 'biaowu';
                                    break;
                                case data[i].productCode == 'WaterStarOne-AM-S8':
                                    data[i].picType = 'yinxiao';
                                    break;
                                case data[i].productCode == 'WaterStarOne-MRH-S8':
                                    data[i].picType = 'chaobiao';
                                    break;
                            }
                            if (data[i].templateId == 43 || data[i].templateId == 45) {
                                auditTaskNoArray += data[i].taskCode + ',';
                            }

                            if (number == data.length) {
                                addNewScript(function(ret) { //判断应用是否存在
                                    if (ret.meterManageNumber != 0) {
                                        meterNoConfirmTaskAllData(data); //水表维护一键认领下载数据到本地
                                    }
                                    if (ret.auditNumber != 0) {
                                        if (auditTaskNoArray != "") {
                                            auditTaskNoArray = auditTaskNoArray.substring(0, auditTaskNoArray.length - 1);
                                            saveAuditList(auditTaskNoArray); //调用稽核应用里面的方法
                                        }
                                    }
                                });
                                claimTaskOk(type, data); //保存任务列表数据到本地
                            }
                        }

                    } else {
                        api.hideProgress();
                        api.toast({
                            msg: '领用失败',
                            duration: 2000,
                            location: 'middle'
                        });
                    }
                } else {
                    api.hideProgress();
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'middle'
                    });
                }
            });
        } else {
            if (ret.appName == "") {
                ret.appName = '表务管理,稽核管理,抄表管家';
            }
            api.toast({
                msg: '请先添加'+ret.appName+'应用',
                duration: 2000,
                location: 'middle'
            });
        }
    });

}

//一键认领  认领成功处理 2020-05-24 zlx
function claimTaskOk(type, data) {
    api.hideProgress();
    vant.Toast('任务认领成功');
    api.sendEvent({
        name: 'updataConFirmedNumber',
    });
    var url = '';
    if (type == "home") {
        $(".newTaskText").html('认领列表');
    }
    for (var i = 0; i < data.length; i++) {
        (function(i) {
            openTaskDispose(data[i],'','',false);
        })(i);
    }
    if (type == 'task') {
        api.closeToWin({
            name: 'ClaimTask'
        });
    }
    api.openWin({
        name: 'MyTask',
        url: 'widget://html/Task/MyTask.html',
    });
}


// 我的任务存放到本地
function openTaskDispose(item, type, page, fromclaimTask) {
  // 注释部分为暂时测试，接口返回的coding 是错误的 20200807 14:09 zxf
    // appIsExists(item, function(ret) {
    //     if (ret.status) {
            var db = api.require("db");
            if (page != "detail" && fromclaimTask == false) {
                var SheetId = 0;
                db.selectSql({
                    name: 'Wsdatabase',
                    sql: 'select Id from myTaskSheet order by Id desc limit 1'
                }, function(ret, err){
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
                var CurentUserName = $api.getStorage('loginData').userName;
                //  查询数据库中是否有该数据
                if (item.taskCode != undefined) {
                    if (item.templateId == 21) {
                        var selectsql = 'select * FROM myTaskSheet where taskCode='+item.taskCode+' and userName = "'+CurentUserName+'"';
                    } else if (item.templateId == 4) {
                        var selectsql = 'select * FROM myTaskSheet where taskCode='+item.taskCode+' and userName = "'+CurentUserName+'"';
                    } else {
                        var selectsql = 'select * FROM myTaskSheet where taskCode='+item.taskCode+' and userName = "'+CurentUserName+'"';
                    }
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: selectsql
                    }, function(ret, err) {
                        if (ret.status) {
                            if (ret.data.length == 0) {
                                db.executeSql({
                                    name: 'Wsdatabase',
                                    sql:'Insert into myTaskSheet  (Id,thirdTaskId,taskCode,creationTime,submitNum,statusFlag,statusFlagText,productId,productName,ClaimTime,productCode,handleUrl,detailUrl,name,taskId,templateId,customerName,customerAddress,isBatch,taskCount,tbdCount,userName,ybCount,unconFirmedCount,bookName,bookId,orderNO,isSaveLocal,customerCode ) value('+SheetId+','+item.thirdTaskId+',"'+item.taskCode+'","'+item.creationTime+'",'+item.submitNum+','+item.statusFlag+',"'+item.statusFlagText+'",'+item.productId+',"'+item.productName+'","'+item.time+'","'+item.productCode+'","'+item.handleUrl+'","'+item.detailUrl+'","'+item.name+'","'+item.taskCode+
                                    '","'+item.templateId+'","'+item.customerName!=null?item.customerName:""+'","'+item.customerAddress!=null?item.customerAddress:""+'",'+isBatch+','+item.taskCount+','   +item.tbdCount+',"'+CurentUserName+'",'+item.ybCount+','+item.unconFirmedCount+',"'+item.bookName+'",'+item.bookId+','+item.orderNO+',0,"'+item.customerCode+'")'
                                }, function(ret, err){
                                    if (ret.status) {

                                    } else {}
                                });
                            } else {
                                var customerName = item.customerName != null ? item.customerName : "";
                                var customerAddress = item.customerAddress != null ? item.customerAddress : "";
                                db.executeSql({
                                    name: 'Wsdatabase',
                                    sql: 'UPDATE myTaskSheet set thirdTaskId='+item.thirdTaskId+',taskCode ="'+item.taskCode+'",creationTime="'+item.creationTime+'",submitNum="'+item.submitNum+'",statusFlag='+item.statusFlag+',productId='+item.productId+',productName="'+item.productName+'",ClaimTime="'+item.time+'",productCode="'+item.productCode+'",handleUrl="'+item.handleUrl+'",detailUrl="'+item.detailUrl+'",name="'+item.name+
                                    '",taskId="'+item.taskCode+'",templateId="'+item.templateId+'",customerName="'+customerName+'",customerAddress="'+customerAddress+'",isBatch='+isBatch+',taskCount='+item.taskCount+',tbdCount='+item.tbdCount+',userName="'+CurentUserName+'",ybCount='+item.ybCount+',unconFirmedCount='+item.unconFirmedCount+',bookName="'+item.bookName+'",bookId='+item.bookId+',orderNO='+item.orderNO+
                                    ',customerCode = "'+item.customerCode+'" where taskCode="'+item.taskCode+'" and userName = "'+CurentUserName+'"'
                                }, function(ret, err) {
                                    if (ret.status) {


                                    }
                                });

                            }
                        }
                    });
                }
                db.executeSql({
                    name: 'Wsdatabase',
                    sql: 'DELETE FROM myTaskSheet WHERE taskId = "undefined"'
                }, function(ret, err) {
                    if (ret.status) {}
                });

            }
            if (page == 'handle' && page != '') {
                var name = getWinName(item.handleUrl);
                // if (item.templateId == 45) {
                //     item.handleUrl = 'widget://html/Audit/TaskProces/MeterReadProces.html'
                // }
                // if (item.templateId == 43) {
                //     item.handleUrl = 'widget://html/Audit/TaskProces/WaterAbnormal.html'
                // }
                //
                // if (item.templateId != 45 && item.templateId != 43 && item.templateId != 4 && item.templateId != 21) {
                //     item.handleUrl = 'widget://html/MeterManage/tableTask/tableTask.html'
                // }
                // if (item.templateId == 2 || item.templateId == 41 || item.templateId == 42) {
                //     item.handleUrl = 'widget://html/MeterManage/tableTask/stopAfterWater.html'
                // }
                // if (item.templateId == 21) {
                //     item.handleUrl = 'widget://html/MeterManage/MeterNo/MeterNo.html'
                // }
                // if (item.templateId == 4) {
                //     item.handleUrl = 'widget://html/MeterManage/Postinglists/Postinglists.html'
                // }
                api.openWin({
                    name: name,
                    url: item.handleUrl,
                    pageParam: {
                        data: item,
                        type: type
                    }
                });
            }
            if (page == 'detail' && page != '') {
                var name = getWinName(item.detailUrl);
                api.openWin({
                    name: name,
                    url: item.detailUrl,
                    pageParam: {
                        data: item,
                    }
                })
            }

    //     } else {
    //         api.toast({
    //             msg: `请先添加${ret.appName}应用`,
    //             duration: 2000,
    //             location: 'middle'
    //         });
    //     }
    // })

}
//获取urlh中window的名称
function getWinName(str) {
    if (str == "" || str == null || str == undefined) {
        return "";
    }
    var index = str.lastIndexOf("\/");
    str = str.substring(index + 1, str.length - 5);
    return str;
}


function onCreateFS() {
    var fs = api.require('fs');
    // 判断文件夹是否存在，存在就打开数据库，不存在，就建立文件夹后在打开数据库（数据库打开，各个页面都可以操作，除非自己手动关闭）
    fs.exist({
        path: 'fs://Wsdatabase'
    }, function(ret, err){
        if (ret.exist) {
            // 创建数据库（存在就打开，不存在就创建）
            openDatabase();
        } else {
            // 创建数据库文件
            fs.createDir({
                path: 'fs://Wsdatabase'
            }, function(ret, err){
                if (ret.status) {
                    // 创建数据库（存在就打开，不存在就创建）
                    openDatabase();
                } else {
                    console.log(JSON.stringify(err));
                }
            });
        }
    });

}

function openDatabase() {
    // 打开数据库
    var db = api.require('db');
    db.openDatabase({
        name: 'Wsdatabase',
        path: 'fs://Wsdatabase/Wsdatabase.db'
    }, function(ret, err){
        if (ret.status) {
            // 数据打开成功后，创建数据表
            createTables();
            createVersionInfoSheets();
        } else {
            console.log(JSON.stringify(err));
        }
    });
}

function createTables() {
    var db = api.require("db");
    //创建用户表（用户保存本地数据和删除本地数据功能（判断用户，如果10天没有登录，就删除本地数据（每次进入首页的时候判断当前用户，并更新当前用的登录时间））） zxf 2020-04-10
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM UserSheets'
    }, function(ret, err) {
        if (ret.status) {
            // 存在
        } else {
            // 不存在，则创建数据表
            //  isDelete 0 表示不删，1表示删除（时间已经到10天）
            db.executeSql({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE UserSheets(Id int, username varchar(255), userPassword varchar(255), loginTime varchar(255),isDelete int)'
            }, function(ret, err) {
                if (ret.status) {

                }
            });

        }
    });

    // db.executeSql({
    //     name: 'Wsdatabase',
    //     sql: 'DROP TABLE myTaskSheet '
    // }, function(ret, err){
    //     if( ret.status ){
    //         alert( JSON.stringify( ret ) );
    //     }else{
    //         alert( JSON.stringify( err ) );
    //     }
    // });
    // 我的任务表
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM myTaskSheet'
    }, function(ret, err) {
        if (ret.status) {
            // 存在
        } else {
            // 不存在，则创建数据表
            db.executeSql({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE myTaskSheet(Id int, thirdTaskId int, taskCode varchar(255), creationTime varchar(255), submitNum int, statusFlag int,statusFlagText varchar(255),productId int,productName varchar(255),ClaimTime varchar(255),productCode varchar(255),handleUrl varchar(255), detailUrl varchar(255),name varchar(255),taskId varchar(255),templateId varchar(255),customerName varchar(255),customerAddress varchar(255),isBatch int,taskCount int,tbdCount int,userName varchar,ybCount int,unconFirmedCount int,bookName varchar(255),bookId int,orderNO int,isSaveLocal int,customerCode varchar(255))'
            }, function(ret, err) {
                if (ret.status) {
                    console.log(JSON.stringify(ret));
                    // console.log( "我的任务表创建成功" );
                }
            });

        }
    });

}

// 创建表务这边的表
function waterCreatTable() {
    var db = api.require("db");
    //  表务日志表
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM Logsheet'
    }, function(ret, err) {
        if (ret.status) {
            // 存在
        } else {
            // 表不存在
            db.executeSql({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE Logsheet(Id int,content varchar(255), time varchar(255),userName varchar(255))'
            }, function(ret, err){
                if (ret.status) {

                }
            });
            // console.log(JSON.stringify(err));
        }
    });
    // db.executeSql({
    //     name: 'Wsdatabase',
    //     sql: 'drop table POSTING_LIST'
    // }, function(ret, err){
    //     if( ret.status ){
    //         alert( JSON.stringify( ret ) );
    //     }else{
    //         alert( JSON.stringify( err ) );
    //     }
    // });

    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM POSTING_LIST'
    }, function(ret, err) {
        if (ret.status) {
            // alert( JSON.stringify( ret ) );
        } else {
            var retCREATE = db.executeSqlSync({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE POSTING_LIST("_id" INTEGER PRIMARY KEY AUTOINCREMENT, Id TEXT, Source TEXT, Code TEXT, Name TEXT, StatusName TEXT, Status TEXT, CustomerCode TEXT, CustomerName TEXT, Address TEXT, Location TEXT,' +
                    'Nature TEXT,' +
                    'SubNature TEXT,' +
                    'Caliber TEXT,' +
                    'Nameplate TEXT,' +
                    'MeterType TEXT,' +
                    'StampNo TEXT,' +
                    'LastScale TEXT,' +
                    'BeginScale TEXT,' +
                    'EndScale TEXT,' +
                    'Amount TEXT,' +
                    'ArrearMoney TEXT,' +
                    'Description TEXT,' +
                    'Remark TEXT,' +
                    'OperatorId TEXT,' +
                    'OperatedTime TEXT,' +
                    'TaskNo TEXT,' +
                    'DispatchTime TEXT,' +
                    'RecordBeginScale TEXT,' +
                    'RecordEndScale TEXT,' +
                    'RecordAmount TEXT,' +
                    'RecordTypdId TEXT,' +
                    'RecordTypdName TEXT,' +
                    'LastReadScale TEXT,' +
                    'AuditReadScale TEXT,' +
                    'AuditTime TEXT,' +
                    'AuditStatus TEXT,' +
                    'HandleTime TEXT,' +
                    'AuditTimes TEXT,' +
                    'UseTime TEXT,' +
                    'NotSubmit TEXT,' +
                    'NotSave TEXT,' +
                    'TaskId TEXT,' +
                    'Files TEXT,' +
                    'StatusUser TEXT,' +
                    'PostringLon TEXT,' +
                    'PostringLat TEXT,' +
                    'PostringLoction TEXT,RemarkText TEXT,userName TEXT,NotUploader TEXT)'
            });

        }
    });

    // 2、张贴列表图片表
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM POSTING_IMAGE'
    }, function(ret, err) {
        if (ret.status) {

        } else {
            var retCREATE = db.executeSqlSync({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE POSTING_IMAGE("_id" INTEGER PRIMARY KEY AUTOINCREMENT, Id TEXT, Source TEXT, Code TEXT, Name TEXT, StatusName TEXT, CustomerCode TEXT,' +
                    'imageId TEXT,' +
                    'imageType TEXT,' +
                    'imageTypeName TEXT,' +
                    'imageFileName TEXT,' +
                    'imageFileUrl TEXT,' +
                    'imageAnnexType TEXT,' +
                    'imageAnnexTypeName TEXT,' +
                    'imageorderNO TEXT,' +
                    'imageIsNew TEXT,' +
                    'imageOperatorName TEXT,' +
                    'imageOperatedTime TEXT,' +
                    'TaskNo TEXT,' +
                    'locationJD TEXT,' +
                    'locationWD TEXT,' +
                    'locationSJ TEXT,' +
                    'NotSubmit TEXT,userName TEXT)'
            });

        }
    });

    // db.executeSql({
    //     name: 'Wsdatabase',
    //     sql: 'drop table meterNoSheets'
    // }, function(ret, err){
    //     if( ret.status ){
    //         alert( JSON.stringify( ret ) );
    //     }else{
    //         alert( JSON.stringify( err ) );
    //     }
    // });

    // 水表维护表  isUpload 是否上传了 1上传了，0表示没有上传
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM meterNoSheets'
    }, function(ret, err) {
        if (ret.status) {

        } else {
            var retCREATE = db.executeSqlSync({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE meterNoSheets (id init,cloudTaskCode varchar(255),cloudTasKId varchar(255),cloudTasKThirdTaskId varchar(255),Status varchar(255),StatusName varchar(255),CustomerCode varchar(255),CustomerName varchar(255),Address varchar(255),Location varchar(255),Nature varchar(255), Caliber varchar(255),MeterType varchar(255),StampNo varchar(255),waterLon varcahr(255),waterlat varchar(255),taskClaimTime varchar(255),taskId varchar(255),isUpload int,UploadErrMsg varchar(255),userName varchar(255),isSaveLocal int) '
            }, function(ret, err) {
                // console.log(JSON.stringify(ret));
                // console.log(JSON.stringify(err));
            });

        }
    });
    // db.executeSql({
    //     name: 'Wsdatabase',
    //     sql: 'DROP TABLE meterNoImageSheets '
    // }, function(ret, err){
    //     if( ret.status ){
    //         alert( JSON.stringify( ret ) );
    //     }else{
    //         alert( JSON.stringify( err ) );
    //     }
    // });


    // 水表维护表图片
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM meterNoImageSheets'
    }, function(ret, err) {
        if (ret.status) {

        } else {
            var retCREATE = db.executeSqlSync({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE meterNoImageSheets (id init,CustomerCode varchar(255),url varchar(255),imageLon varchar(255),imageLat varchar(255),taskId varchar(255),userName varchar(255),isUpload int,isSaveLocal int)'
            }, function(ret, err) {
                // console.log(JSON.stringify(ret));
                // console.log(JSON.stringify(err));
            });

        }
    });

}
//查询手机是否开启GPS zxf 2020-04-12
function checkPhoneGPS(openSet) {
    var gpsmodel = api.require('gpsState');
    gpsmodel.gpsstate(function(ret) {
        if (ret) {
            if (ret.gps) {} else {
                api.openFrame({
                    name: 'checkOpenGPS_frm',
                    url: 'widget://html/mine/checkOpenGPS_frm.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    bounces: false,
                    bgColor: 'rgba(0,0,0,0.1)',
                });

            }
        }

    });
}
//  1分钟后查询是否开启了定位 zxf
function oneMinuteCheckGPS() {
  var getLoginInfo= $api.getStorage('getLoginInfo');
  if (getLoginInfo.tenantInfo.tenantIdentifier != "" && getLoginInfo.tenantInfo.tenantIdentifier != undefined && getLoginInfo.tenantInfo.tenantIdentifier == "cdzls") {
    return
  }
    var timeId = setInterval(function() {
        var gpsmodel = api.require('gpsState');
        gpsmodel.gpsstate(function(ret) {
            if (ret) {
                if (ret.gps) {} else {
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
                            type: 'closeApp'
                        },
                        bounces: false,
                        bgColor: 'rgba(0,0,0,0.1)',
                    });

                }
            }

        });
        clearInterval(timeId);
    }, 60000)
}

// 优化组件可能没有下载成功问题 zxf 20200708
function checkZipDownloadSuccess(data, callback) {
    var fs = api.require("fs");
    var ret = fs.existSync({
        path: 'fs://综合水务平台.zip'
    });
    if (ret.exist) {
        unarchiveToWgt('综合水务平台', function(ret) {
            callback(ret);
        });
    } else {
        downloadArchiveZip('WaterStarOne-Cloud-S9', function(ret) {
            callback(ret);
        });
    }
    var appWgtZipUrlName = '';
    switch (true) {
        case data.coding == 'WaterStarOne-MMS-S8': //表务管理
            appWgtZipUrlName = 'MeterManage';
            break;
        case data.coding == 'WaterStarOne-AM-S8': //稽核管理
            appWgtZipUrlName = 'Audit';
            break;
        case data.coding == 'WaterStarOne-MRH-S8': //抄表管家
            appWgtZipUrlName = 'MeterReading';
            break;
    }

    var ret = fs.existSync({
        path:' fs://wgt/'+appWgtZipUrlName+''
    });
    if (ret.exist) {
      callback(1);
      return
    }else{
      api.showProgress({
          style: 'default',
          animationType: 'fade',
          title: '加载中...',
          modal: true
      });
    }
    fs.exist({
        path:'fs://'+data.productName+'.zip'
    }, function(ret, err) {
        if (ret.exist) {
            unarchiveToWgt(data.productName, function(ret) {
                callback(ret);
            });
        } else {
            // 不存在
            downloadArchiveZip(data.coding, function(ret) {
                callback(ret);
            });
        }
    });
}
//zxf 20200708
function unarchiveToWgt(name, callback) { //解压zip包
    var zip = api.require("zip");
    zip.unarchive({
        file: 'fs://'+name+'.zip',
        toPath: 'fs://wgt/'
    }, function(ret, err) {
        if (ret.status) {
            api.hideProgress();
            callback(true);
        } else {
            api.hideProgress();
            callback(false);
        }
    });
}
//zxf 20200708
function downloadArchiveZip(coding, callback) {
    var zip = api.require("zip");
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var versionInformation = userLoginInformation.versionInformation; //版本信息
    for (var i = 0; i < versionInformation.length; i++) {
        if (versionInformation[i].moduleCode == coding) {
            var newpacketUrl = versionInformation[i].packetUrl.replace(/(^\s*)/g, "");
            var downloadUrl = apiUrl + newpacketUrl;
            api.download({
                url: downloadUrl,
                savePath:' fs://'+versionInformation[i].moduleName+'.zip',
                report: true,
                cache: false,
                allowResume: true
            }, function(ret, err) {
                if (ret.state == 1) {
                    //下载成功
                    unarchiveToWgt(versionInformation[i].moduleName, function(ret) {
                        callback(ret);
                    });
                }
            });
            break;
        }
    }
}


// 首页我的任务 离线数据查询 zxf
function offLineGetMyTask(searchValue, filterType, PageIndex, callback) {
    var CurentUserName = $api.getStorage('loginData').userName;
    // 分为有搜索条件和没有搜索条件
    if (PageIndex == 1) {
        PageIndex = 0;
    } else {
        PageIndex--;
    }
    if (searchValue == "") {
        if (filterType.productId != 0) {
            var sql =' SELECT * FROM myTaskSheet where productId ='+filterType.productId+' and templateId ='+filterType.typeId+' and userName ="'+CurentUserName+'"  order by bookName,orderNO,customerAddress,isSaveLocal LIMIT '+PageIndex*50+',50';
        } else {
            // 10 offset ${PageIndex*10}
            var sql = 'SELECT * FROM myTaskSheet where userName ="'+CurentUserName+'" order by bookName,orderNO,customerAddress,isSaveLocal LIMIT '+PageIndex*50+',50';
        }
    } else {
        if (filterType.productId != 0) {
            var sql = 'SELECT * FROM myTaskSheet where productId ='+filterType.productId+' and templateId ='+filterType.typeId+' and userName ="'+CurentUserName+'" and customerAddress like "%'+searchValue+'%" or bookName like "%'+searchValue+'%" or customerName like "%'+searchValue+'%" or customerCode like "%'+searchValue+'%" order by bookName ,orderNO,customerAddress,isSaveLocal LIMIT '+PageIndex*50+',50';
        } else {
            var sql = 'SELECT * FROM myTaskSheet where userName ="'+CurentUserName+'" and customerAddress like "%'+searchValue+'%" or bookName like "%'+searchValue+'%" or customerName like "%'+searchValue+'%" or customerCode like "%'+searchValue+'%" order by bookName,orderNO,customerAddress,isSaveLocal LIMIT '+PageIndex*50+',50';
        }
    }
    var db = api.require("db");
    var callbackData = {
        taskListData: [],
        noDataIsShow: true,
    }
    db.selectSql({
        name: 'Wsdatabase',
        sql: sql
    }, function(ret, err){
        api.hideProgress();
        if (ret.status) {
            var data = ret.data;
            if (ret.data.length != 0) {
                callbackData.taskListData = [];
                data.forEach(function(e) {
                    switch (true) {
                        case e.productCode == 'WaterStarOne-MMS-S8':
                            e.picType = 'biaowu';
                            break;
                        case e.productCode == 'WaterStarOne-AM-S8':
                            e.picType = 'yinxiao';
                            break;
                        case e.productCode == 'WaterStarOne-MRH-S8':
                            e.picType = 'chaobiao';
                            break;
                    }
                    if (e.isBatch == 0) {
                        e.isBatch = false;
                    }
                    if (e.isBatch == 1) {
                        e.isBatch = true;
                    }

                });
                callbackData.taskListData = data;
                callbackData.noDataIsShow = false;
                callback(callbackData);
            } else {
                callbackData.taskListData = data;
                callbackData.noDataIsShow = true;
                callback(callbackData);
            }
        }
    });
}

// 注销以及更新抄表数据 判断是否还有数据未上传 5-22 zxf
// function dataQuery(fromCb = false, callback) { //fromCb 表示不是抄表管家更新基础数据 ，true表示是更新抄表管家基础数据
function dataQuery(fromCb, callback) { //fromCb 表示不是抄表管家更新基础数据 ，true表示是更新抄表管家基础数据
    var db = api.require("db");
    var CurentUserName = $api.getStorage('loginData').userName;
    var returnRet = {
            appName: '抄表管家',
            status: true
        }
        //用户数据是否有未上传的数据  ZXBLX="2" 表示虚表 20200825
    var ret = db.selectSqlSync({
        name: 'CBtest',
        sql: 'SELECT * FROM MRM_USER_BEAN where CBBZ=1 and ZTSCCG=0 and CWXX=" " and ZXBLX!="2" and userName ="' + CurentUserName + '"'
    });
    if (ret.status) {
        if (ret.data.length > 0) {
            returnRet.appName = '抄表管家';
            callback(returnRet);
            return;
        }
    }
    //用户图片是否有未上传的数据
    var ret = db.selectSqlSync({
        name: 'CBtest',
        sql: 'select * from MRM_PHOTOS_BEAN where SFSC=0 and YHBH in (select YHBH from MRM_USER_BEAN where CBBZ=1 and ZTSCCG=1 and userName ="' + CurentUserName + '") and userName ="' + CurentUserName + '"'
    });
    if (ret.status) {
        if (ret.data.length > 0) {
            returnRet.appName = '抄表管家';
            callback(returnRet);
            return;
        }
    }
    //工单数据是否有未上传的数据
    var ret = db.selectSqlSync({
        name: 'CBtest',
        sql: 'select * from MRM_WORKORDER_BEAN where SFSC="0" and userName ="' + CurentUserName + '"'
    });
    if (ret.status) {
        if (ret.data.length > 0) {
            returnRet.appName = '抄表管家';
            callback(returnRet);
            return;
        }
    }
    //工单图片是否有未上传的数据
    var ret = db.selectSqlSync({
        name: 'CBtest',
        sql: 'select * from MRM_WORKORDERPHOTOS_BEAN where SFSC=0 and YHBH in (select YHBH from MRM_WORKORDER_BEAN where SFSC=1 and userName ="' + CurentUserName + '") and userName ="' + CurentUserName + '"'
    });
    if (ret.status) {
        if (ret.data.length > 0) {
            returnRet.appName = '抄表管家';
            callback(returnRet);
            return;
        }
    }
    // 成都抄表管家新增的表  开始  20200720 zxf
    var ret = db.selectSqlSync({
        name: 'CBtest',
        sql: 'select * from MRM_WATER_METER_USER where SFXG="1" and SFSC="0" and userName="' + CurentUserName + '"'
    });
    if (ret.status) {
        if (ret.data.length > 0) {
            returnRet.appName = '抄表管家';
            callback(returnRet);
            return;
        }
    }
    var ret = db.selectSqlSync({
        name: 'CBtest',
        sql: 'select * from MRM_WATER_METER_PHOTOS where SFSC=0 and YHBH in (select YHBH from MRM_WATER_METER_USER where SFXG=1 and SFSC=1 and userName="' + CurentUserName + '")'
    });
    if (ret.status) {
        if (ret.data.length > 0) {
            returnRet.appName = '抄表管家';
            callback(returnRet);
            return;
        }
    }
      // 成都抄表管家新增的表 结束

    if (fromCb) {
        // var ret = db.selectSqlSync({
        //     name: 'Wsdatabase',
        //     sql: 'select * from POSTING_LIST'
        // });
        // if (ret.status) {
        //     console.log(JSON.stringify(ret))
        //     if (ret.data.length > 0) {
        //       returnRet.appName ='表务管理';
        //       callback(returnRet);
        //       return ;
        //     }
        // }
        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from POSTING_IMAGE where userName ="' + CurentUserName + '" and NotSubmit ="0"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }

        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from POSTING_LIST where userName ="' + CurentUserName + '" and NotSave="1" and NotUploader="0"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }



        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from meterNoImageSheets where userName ="' + CurentUserName + '" and isUpload = 0'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }
        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from meterNoSheets where isUpload = 0 and isSaveLocal =1  and userName ="' + CurentUserName + '"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }


        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from AUDIT_TASK_LIST where userName ="' + CurentUserName + '"and isUploadAndSave ="2" and Code="41"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }
        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from AUDIT_TASK_LIST where userName ="' + CurentUserName + '"and isUploadAndSave ="2" and Code="42"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }
        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from AUDIT_TASK_LIST where userName ="' + CurentUserName + '"and isUploadAndSave ="2" and Code="2"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }

        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from AUDIT_TASK_LIST where userName ="' + CurentUserName + '"and isUploadAndSave ="2" and Code="45"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '稽核管理';
                callback(returnRet);
                return;
            }
        }
        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from AUDIT_TASK_LIST where userName ="' + CurentUserName + '"and isUploadAndSave ="2" and Code="43"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '稽核管理';
                callback(returnRet);
                return;
            }
        }

        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from Review_TASK_BASIC_LIST where userName ="' + CurentUserName + '"and isUploadAndSave="2"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }
        var ret = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'select * from Review_TASK_HANDLED_LIST where userName ="' + CurentUserName + '"and isUpload="0"'
        });
        if (ret.status) {
            if (ret.data.length > 0) {
                returnRet.appName = '表务管理';
                callback(returnRet);
                return;
            }
        }

    }
    return callback({
        status: false
    });
}
// 动态添加字段 5-26 zxf
function addNewField() {
    var db = api.require("db");
    var CurentUserName = $api.getStorage('loginData').userName;
    var addFieldArray = ['METER_PHOTO_UPLOAD', 'APPLY_TASK_IMAGES_S', 'POSTING_IMAGE ', 'POSTING_LIST', 'meterNoSheets', 'meterNoImageSheets'];
    db.openDatabase({
        name: 'Wsdatabase',
        path: 'fs://Wsdatabase/Wsdatabase.db'
    }, function(ret, err) {
        if (ret.status) {
            for (var i = 0; i < addFieldArray.length; i++) {
                (function(i) {
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: 'select userName from ' + addFieldArray[i] + ''
                    }, function(ret, err) {
                        if (ret.status) {} else {
                            db.executeSql({
                                name: 'Wsdatabase',
                                sql: "ALTER TABLE " + addFieldArray[i] + " ADD userName VARCHAR(255) DEFAULT " + CurentUserName + "",
                            }, function(ret, err) {
                                if (ret.status) {
                                    console.log(JSON.stringify(ret));
                                } else {
                                    console.log(JSON.stringify(err));
                                }
                            });
                        }
                    });
                    if (addFieldArray[i] == 'meterNoSheets') {
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: "ALTER TABLE meterNoSheets ADD isSaveLocal int DEFAULT 0",
                        }, function(ret, err) {
                            if (ret.status) {
                                console.log(JSON.stringify(ret));
                            }
                        });
                    }
                    if (addFieldArray[i] == 'meterNoImageSheets') {
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: "ALTER TABLE meterNoImageSheets ADD isUpload int DEFAULT 0",
                        }, function(ret, err) {
                            if (ret.status) {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        db.executeSql({
                            name: 'Wsdatabase',
                            sql: "ALTER TABLE meterNoImageSheets ADD isSaveLocal int DEFAULT 0",
                        }, function(ret, err) {
                            if (ret.status) {
                                console.log(JSON.stringify(ret));
                            }
                        });
                    }
                })(i);
            }
            db.executeSql({
                name: 'Wsdatabase',
                sql: "ALTER TABLE POSTING_LIST ADD NotUploader VARCHAR(255) DEFAULT 0",
            }, function(ret, err) {
                if (ret.status) {
                    console.log(JSON.stringify(ret));
                } else {
                    console.log(JSON.stringify(err));
                }
            });
        } else {
            console.log(JSON.stringify(err));
        }
    });
    db.executeSql({
        name: 'Wsdatabase',
        sql: "ALTER TABLE myTaskSheet ADD customerCode VARCHAR DEFAULT ''",
    }, function(ret, err) {
        if (ret.status) {
            console.log(JSON.stringify(ret));
        } else {
            console.log(JSON.stringify(err));
        }
    });
    db.executeSql({
        name: 'Wsdatabase',
        sql: "ALTER TABLE myTaskSheet ADD isSaveLocal INT DEFAULT 0",
    }, function(ret, err) {
        if (ret.status) {
            // console.log(JSON.stringify(ret));
        } else {
            // console.log(JSON.stringify(err));
        }
    });
    db.executeSql({
        name: 'Wsdatabase',
        sql: "ALTER TABLE Review_TASK_BASIC_LIST ADD SurveyRemark TEXT DEFAULT ''",
    }, function(ret, err) {
        if (ret.status) {
            // console.log(JSON.stringify(ret));
        } else {
            // console.log(JSON.stringify(err));
        }
    });
    var addFieldArray1 = ['MRM_DTR_BEAN', 'MRM_BOOKS_BEAN', 'MRM_USER_BEAN ', 'MRM_PERMISSION_ALL_BEAN', 'MRM_USER_PERMISSION_BEAN ', 'MRM_AREA_BEAN', 'MRM_METERSTATE_BEAN', 'MRM_DEPLOYS_BEAN', 'MRM_SHORT_MEESSAGE_BEAN', 'MRM_MEESSAGE_STORANG_BEAN', 'MRM_METER_LOCATION_BEAN', 'MRM_PHOTOS_BEAN', 'MRM_HISTORYS_BEAN', 'MRM_LOGS_BEAN', 'MRM_LOCATIONS_BEAN', 'MRM_WORKORDER_BEAN', 'MRM_WORKORDERPHOTOS_BEAN', 'MRM_ONLINE_BEAN', 'MRM_THE_MEMO_BEAN', 'MRM_THE_MEMO_BEAN2'];
    db.openDatabase({
        name: 'CBtest',
        path: 'fs://Sntsoft/Data/CBtest.db'
    }, function(ret, err) {
        if (ret.status) {
            for (var j = 0; j < addFieldArray1.length; j++) {
                (function(j) {
                    db.selectSql({
                        name: 'CBtest',
                        sql: 'select userName from ' + addFieldArray1[j] + ''
                    }, function(ret, err) {
                        if (api.systemType == "ios") {
                            var status = ret.status;
                        } else {
                            var status = err.status;
                        }
                        if (status == false) {
                            db.executeSql({
                                name: 'CBtest',
                                sql: "ALTER TABLE " + addFieldArray1[j] + " ADD userName VARCHAR(255) DEFAULT " + CurentUserName + "",
                            }, function(ret, err) {
                                if (ret.status) {
                                    console.log(JSON.stringify(ret));
                                } else {
                                    console.log(JSON.stringify(err));
                                }
                            });
                        }
                    });
                })(j);
            }
        } else {
            console.log(JSON.stringify(err));
        }
    });
}
//我的任务列表查询张贴列表本地数据还有多少未上传的 5-28 zxf
var taskListAddPostingNum = 0;

function taskListAddPostingNumber(data) {
    //  console.log(JSON.stringify(data))
    var db = api.require("db");
    var CurentUserName = $api.getStorage('loginData').userName;
    var data = data;
    if (data[taskListAddPostingNum].templateId == 4) {
        var uploadedNumber = 0,
            notUploadNumber = 0;
        var ret1 = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'SELECT * FROM POSTING_LIST where TaskNo="' + data[taskListAddPostingNum].taskCode + '" and NotUploader="0" and NotSave="1" and userName ="' + CurentUserName + '"'
        });
        if (ret1.status) {
            if (ret1.data.length > 0) {
                notUploadNumber += ret1.data.length;
                var postListData = ret1.data;
                for (var j = 0; j < postListData.length; j++) {
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: 'SELECT * FROM POSTING_IMAGE where TaskNo="' + postListData[j].TaskNo + '" and CustomerCode="' + postListData[j].CustomerCode + '" and NotSubmit="0" and userName ="' + CurentUserName + '"'
                    }, function(ret1, err) {
                        if (ret1.status) {
                            if (ret1.data.length > 0) {
                                notUploadNumber += 1;
                            }
                        }
                    });
                }
                data[taskListAddPostingNum].notUploadNumber = notUploadNumber;
            } else {
                notUploadNumber = 0;
                data[taskListAddPostingNum].notUploadNumber = notUploadNumber;
            }
        }
        var ret2 = db.selectSqlSync({
            name: 'Wsdatabase',
            sql: 'SELECT * FROM POSTING_LIST where TaskNo="' + data[taskListAddPostingNum].taskCode + '" and NotUploader="1" and NotSave="1" and userName ="' + CurentUserName + '"'
        });
        if (ret2.status) {
            if (ret2.data.length > 0) {
                uploadedNumber += ret2.data.length;
                var postListData = ret2.data;
                for (var j = 0; j < postListData.length; j++) {
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: 'SELECT * FROM POSTING_IMAGE where TaskNo="' + postListData[j].TaskNo + '" and CustomerCode="' + postListData[j].CustomerCode + '" and NotSubmit="1" and userName ="' + CurentUserName + '"'
                    }, function(ret1, err) {
                        if (ret1.status) {
                            if (ret1.data.length > 0) {
                                uploadedNumber += 1;
                            }
                        }
                    });
                }
                data[taskListAddPostingNum].uploadedNumber = uploadedNumber;
            } else {
                uploadedNumber = 0;
                data[taskListAddPostingNum].uploadedNumber = uploadedNumber;
            }
        }
    } else {
        data[taskListAddPostingNum].uploadedNumber = 0;
        data[taskListAddPostingNum].notUploadNumber = 0;
    }
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM myTaskSheet where taskCode ="' + data[taskListAddPostingNum].taskCode + '" and statusFlagText="已保存"'
    }, function(ret, err) {
        if (ret.status) {
            if (ret.data.length != 0) {
                data[taskListAddPostingNum].statusFlagText = "已保存";
            }
            if (taskListAddPostingNum == data.length - 1) {
                $api.setStorage('taskListAddPostingNumber', data);

            }
            if (taskListAddPostingNum < data.length - 1) {
                taskListAddPostingNum++;
                taskListAddPostingNumber(data);
            }

        }
    });

}

function onClearLocalDataAllcompletedData(callback) {
    var db = api.require("db");
    var CurentUserName = $api.getStorage('loginData').userName;
    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from POSTING_IMAGE where userName ="' + CurentUserName + '" and NotSubmit ="1"'
    });
    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from POSTING_LIST where userName ="' + CurentUserName + '" and NotUploader="1"'
    });

    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from meterNoImageSheets where userName ="' + CurentUserName + '" and isUpload = 1'
    });

    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from meterNoSheets where isUpload = 1 and isSaveLocal =1  and userName ="' + CurentUserName + '"'
    });
    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from AUDIT_TASK_LIST where userName ="' + CurentUserName + '"and isUploadAndSave="1"'
    });
    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from Review_TASK_BASIC_LIST where userName ="' + CurentUserName + '"and isUploadAndSave="1"'
    });
    var ret = db.selectSqlSync({
        name: 'Wsdatabase',
        sql: 'delete from Review_TASK_HANDLED_LIST where userName ="' + CurentUserName + '"and isUpload="1"'
    });
    api.sendEvent({
        name: 'clearLocalDataSuccess',
    });

}

// 获取我的任务重筛选数据 6-3 zxf
function onCommentGetClassify(callback) {
    var CurrentLocation = $api.getStorage('CurrentLocation');
    var thirdPartyAccount = $api.getStorage("jhUserName")!=undefined&&$api.getStorage("jhUserName")!=''?$api.getStorage("jhUserName"):$api.getStorage("bwUserName")!=undefined&&$api.getStorage("bwUserName")!=''?$api.getStorage("bwUserName"):'';
    var thirdPartyPassWord = $api.getStorage("jhPassWord")!=undefined&&$api.getStorage("jhPassWord")!=''?$api.getStorage("jhPassWord"):$api.getStorage("bwPassWord")!=undefined&&$api.getStorage("bwPassWord")!=''?$api.getStorage("bwPassWord"):'';
    fnGet('services/app/WorkFlow/GetClassify?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account='+thirdPartyAccount+'&PassWord='+thirdPartyPassWord, {}, false, function(ret,
        err){
        api.hideProgress();
        if (ret) {
            callback(ret);
            if (ret.success) {
                $api.setStorage('myTaskfilterData', ret.result);
            }
        }
    });
}

// 监听列表滚动到底部  zxf 20200618
function stopTouchendPropagationAfterScroll(element, callback) {
    var locked = false;
    window.addEventListener('touchmove', function(ev) { //移动页面的时候，禁止页面单击
        locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
    }, true);

    function stopTouchendPropagation(ev) {
        ev.stopPropagation();
        var scrollHeight = document.querySelector('#' + element + '').scrollHeight; // div的滚动高度
        var scrollTop = document.querySelector('#' + element + '').scrollTop; //div滚动条到顶部的距离
        var clientHeight = document.querySelector('#' + element + '').clientHeight; //div的可视地图高度
        if (scrollHeight - scrollTop <= clientHeight + 3) {
            //表示浏览器已经到达最底部
            callback(true);
        }
        window.removeEventListener('touchend', stopTouchendPropagation, true);
        locked = false;
    }
}

// 动态切换请求地址
function getApiPathAddress() {
    var getLoginInfo = $api.getStorage('getLoginInfo');
    var addressHistory = $api.getStorage('addressHistory');
    var apiUrl = 'http://' + $api.getStorage('apiUrl');
    var apipath = '';
    if (getLoginInfo != undefined) {
        if (getLoginInfo.tenantInfo.tenantIdentifier != "" && getLoginInfo.tenantInfo.tenantIdentifier == "cdzls") {
          if(addressHistory.intranetObj.url!=""){
            if (apiUrl == addressHistory.intranetObj.url) { //外网   是否需要判断当前是否启动的那个地址？？？？？
              var apipath = 'http://' + addressHistory.extranetObj.url + '/api/';
              return apipath;
            }
          }
          if(addressHistory.extranetObj.url!=""){
            if (apiUrl == addressHistory.extranetObj.url) { //外网   是否需要判断当前是否启动的那个地址？？？？？
              var apipath = 'http://' + addressHistory.intranetObj.url + '/api/';
              return apipath;
            }
          }
        } else {
            return apipath;
        }
    }
}

// 动态切换请求地址
function getApiPathAddress1() {
    var getLoginInfo = $api.getStorage('getLoginInfo');
    var addressHistory = $api.getStorage('addressHistory');
    var apipath = '';
    if (getLoginInfo != undefined) {
        if (getLoginInfo.tenantInfo.tenantIdentifier != "" && getLoginInfo.tenantInfo.tenantIdentifier == "cdzls") {
            if (api.connectionType === 'wifi') { //外网   是否需要判断当前是否启动的那个地址？？？？？
                detectNetworkAvailability(addressHistory.intranetObj.url, function(ret) {
                    if (ret) {
                        apipath = 'http://' + addressHistory.intranetObj.url + '/api/';
                        return apipath;
                    } else {
                        return apipath;
                    }
                });
            } else { //内网
                detectNetworkAvailability(addressHistory.extranetObj.url, function(ret) {
                    if (ret) {
                        apipath = 'http://' + addressHistory.extranetObj.url + '/api/';
                        return apipath;
                    } else {
                        return apipath;
                    }
                });
            }
        } else {
            return apipath;
        }
    }
}

function detectNetworkAvailability(url, callback) {
    var url = 'http://' + url + '/api/services/app/PushInterface/ConnectionTest';
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    api.ajax({
        url: url,
        method: 'post',
        timeout: 100,
        dataType: 'json',
        returnAll: false,
        headers: {
            "Content-Type": 'application/json'
        },
        data: {
            body: JSON.stringify({})
        }
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            if (ret.result && ret.success) {
                callback(true);
            }
        } else if (err) {
            callback(false);
        }
    });
}
