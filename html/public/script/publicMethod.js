// 获取定位
function pGetLocation(callback) {
    var bMap = api.require('bMap');
    var locationInfo = bMap.getLocation({
        accuracy: '10m',
        autoStop: true,
        filter: 1
    }, function(ret, err) {
        callback(ret, err);
    });
}

//  根据经纬度获取位置信息
// function pGetNameFromCoords(callback, options = undefined) {
function pGetNameFromCoords(callback, options) {
    var map = api.require('bMap');
    if (options != undefined) {
        map.getNameFromCoords({
            lon: options.lon,
            lat: options.lat
        }, function(ret, err) {
            if (ret.status) {
                callback(ret, err);
            }
        });
    } else {
        pGetLocation(function(ret, err) {
            map.getNameFromCoords({
                lon: ret.lon,
                lat: ret.lat
            }, function(ret, err) {
                if (ret.status) {
                    callback(ret, err);
                }
            });
        })
    }
}

// 获取图片信息
function getPicInfo(pic) {
    var imageFilter = api.require('imageFilter');
    imageFilter.getAttr({
        path: pic
    }, function(ret, err) {
        if (ret.status) {
            // alert(ret.size/1024);
            // return ret.size/1024;
            // alert( JSON.stringify( ret ) );
        } else {
            // alert( JSON.stringify( err ) );
        }
    });
}
// 拍照与获取图片
// function pGetPicture(options = undefined, callback) {
function pGetPicture(options, callback) {
    var type = 'camera';
    var fs = api.require("fs");
    switch (true) {
        case options == null:
            type = 'camera';
            break;
        case options != null && options.type != undefined:
            type = options.type;
            break;
        default:
            type = 'camera';
            break;
    }
    var waterMark = options && options.waterMark ? options.waterMark : false;
    if (type == 'camera') {
        api.getPicture({
            sourceType: 'camera',
            mediaValue: 'pic',
            saveToPhotoAlbum: false,
            // groupName: options.from =='cb'?'综合水务平台抄表原图':'综合水务平台原图'
        }, function(ret, err) {
            if (err) {
                alert("拍照失败！请重试");
                return false;
            }
            if (ret.data) {
                var lists = [];
                // 压缩图片后 再添加
                var oldPath = ret.data;
                // 测试直接把图片保存到fs文件中，这边便于代码操作  zxf 20200824
                fs.moveTo({
                    oldPath: oldPath,
                    newPath: options.from == 'cb' ? (api.fsDir + '/meterReadingPicture') : (api.fsDir + '/Pictures')
                }, function(ret1, err1) {
                    if (ret1.status) {
                        var fileName = options.from == 'cb' ? 'meterReadingPicture' : 'Pictures';
                        var picUrl = api.fsDir + '/' + fileName + '/' + ret.data.substring(ret.data.lastIndexOf('/') + 1, ret.data.length);

                        var lists = [];
                        lists.push({
                            path: picUrl
                        });
                        if (waterMark) {
                            var markOptions = options;
                            markOptions.data = lists;
                            pAddwaterMark(markOptions, function(ret2) {
                                callback(ret2, err);
                            });
                        } else {
                            ret.imgList = [];
                            ret.imgList.push(ret.data);
                            ret.status = true;
                            callback(ret, err);
                        }
                    } else {
                        alert("拍照失败！请重试");
                        return false;
                    }
                });

            } else {
                ret.status = false;
                callback(ret, err);
            }
        });
    } else if (type == 'pic') {
        var UIAlbumBrowser = api.require('UIAlbumBrowser');
        UIAlbumBrowser.open({
            max: options.maxPictures != undefined ? options.maxPictures : 9,
            type: 'image',
            styles: {
                bg: '#fff',
                mark: {
                    icon: '',
                    position: 'bottom_left',
                    size: 20
                },
                nav: {
                    bg: 'rgba(0,0,0,0.6)',
                    titleColor: '#fff',
                    titleSize: 18,
                    cancelColor: '#fff',
                    cancelSize: 16,
                    finishColor: '#fff',
                    finishSize: 16
                }
            },
            rotation: true
        }, function(ret, err) {
            if (err) {
                alert("拍照失败！请重试");
                return false;
            }

            if (ret.eventType == "confirm") {
                var lists = ret.list;
                var paths = [];

                // 测试直接把图片保存到fs文件中，这边便于代码操作  zxf 20200824
                lists.forEach(function(item, index) {
                    var url = api.systemType == 'ios' ? item.thumbPath : item.path;
                    fs.copyTo({
                        oldPath: url,
                        newPath: options.from == 'cb' ? '' + api.fsDir + '/meterReadingPicture' : '' + api.fsDir + '/Pictures'
                    }, function(ret1, err1) {
                        if (ret1.status) {
                            var fileName = options.from == 'cb' ? 'meterReadingPicture' : 'Pictures';
                            var picUrl = '' + api.fsDir + '/' + fileName + '/' + url.substring(url.lastIndexOf('/') + 1, url.length);
                            paths.push({
                                path: picUrl
                            });
                            if (index == lists.length - 1) {
                                if (waterMark) {
                                    var markOptions = options;
                                    markOptions.data = paths;
                                    pAddwaterMark(markOptions, function(ret2) {
                                        callback(ret2, err);
                                    });
                                } else {
                                    ret.status = true;
                                    ret.imgList = [];
                                    lists.forEach(function(item1) {
                                        ret.imgList.push(api.systemType == 'ios' ? item1.thumbPath : item1.path);
                                    });
                                    callback(ret, err);
                                }
                            }
                        } else {
                            alert("拍照失败！请重试");
                            return false;
                        }
                    });
                });
            } else {
                ret.status = false;
                callback(ret, err);
            }


        });
    } else if (type == 'video' || type == 'RecordingVideo') {
        api.getPicture({
            sourceType: type == 'video' ? 'library' : 'camera',
            mediaValue: 'video',
            saveToPhotoAlbum: true
        }, function(ret, err) {
            if (err) {
                alert("失败！请重试");
                return false;
            }
            if (ret.data != "") {
                ret.status = true;
                callback(ret, err);
            } else {
                ret.status = false;
                callback(ret, err);
            }
        });
    }

}
// 添加水印
function pAddwaterMark(options, callback) {
    var pictureNumber = 0;
    var imgList = [];
    var data = options.data;
    var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var waterMarkNumber = Object.keys(options.waterMarkData);
    var waterMarkJson = {
        "oldimgurl": "",
        "newimgurl": "",
        "newimgwidth": "1200", //1000
        "fontnum": 0,
    };
    for (var n = 0; n < waterMarkNumber.length; n++) {
        var number = 100 + n * 50
            // var number = n;
            // if (number == 0) {
            //     number = 100;
            // } else {
            //     number = 100 + (n * 50);
            // }
        waterMarkJson["font" + n + "x"] = "50";
        waterMarkJson["font" + n + "y"] = number;
        if (options.waterMarkData[waterMarkNumber[n]].length !== 0) {
            waterMarkJson.fontnum++;
            if (n == 0) {
                waterMarkJson["font" + n + "words"] = '户号:' + options.waterMarkData[waterMarkNumber[n]] + '  时间:' + time + '';
            } else {
                waterMarkJson["font" + n + "words"] = '类型:' + options.waterMarkData[waterMarkNumber[n]] + '';
            }
            waterMarkJson["font" + n + "size"] = "40";
            waterMarkJson["font" + n + "color"] = "#FF0000";
            waterMarkJson["font" + n + "style"] = "宋体";
        }

    }
    if (waterMarkJson.fontnum != 0) {
        for (var i = 0; i < data.length; i++) {
            var path = data[i].path;
            mobilePrintInply(waterMarkJson, path, function(currentPath) {
                imgList.push(currentPath);
                if (imgList.length == data.length) {
                    callback({
                        msg: '成功',
                        status: true,
                        imgList: imgList
                    })
                }
            })
        }
    }

}

// 添加水印  如果添加水印成功则
function mobilePrintInply(waterMarkJson, path, callback) {
    var mobilePrint = api.require('mobilePrint');
    waterMarkJson.oldimgurl = path;
    waterMarkJson.newimgurl = path;
    // alert("添加水印开始");console.log(JSON.stringify(waterMarkJson));
    // var pictureWatermark = api.require('pictureWatermark');
    //
    // var newDirArr = waterMarkJson.newimgurl.split("/");
    // newDirArr.pop();
    // var newDirStr = newDirArr.join("/");
    // console.log(newDirStr);
    // var param = {
    //     imagePath: waterMarkJson.oldimgurl,
    //     // markPath: waterMarkJson.newimgurl,
    //     savePath: newDirStr,
    //     // margin: {
    //     //     x: 180,
    //     //     y: 180
    //     // },
    //     margin: {
    //         x: 10,
    //         y: 100
    //     },
    //     position:{
    //         type: 1,
    //         x: 100,
    //         y: 200
    //     },
    //     markType: 0,
    //     textAttr: {
    //         text: waterMarkJson.font0words,
    //         size: waterMarkJson.font0size,
    //         color: waterMarkJson.font0color,
    //         alpha: 255,
    //         rotation: 0,
    //         font: "",
    //         backgroundColor: "#00ff00",
    //         backgroundColorAlpha: 0,
    //     },
    // };
    // var uzmodulemarkdemo = api.require('waterImageMark');
    // uzmodulemarkdemo.addMark(param, function(ret, err){
    //         // alert("添加水印结束");
    //         if (ret) {
    //             var fs = api.require('fs');
    //             fs.rename({
    //               oldPath: ret.data,
    //               newPath: waterMarkJson.newimgurl
    //             }, function(ret, err) {
    //               if (ret.status) {
    //                   console.log(JSON.stringify(ret));
    //                   callback(waterMarkJson.newimgurl);
    //               } else {
    //                   callback(ret.data);
    //               }
    //             });
    //
    //         }else {
    //             callback(path)
    //         }
    //         console.log(JSON.stringify(ret));
    // });



    mobilePrint.imgPrint(waterMarkJson, function(ret) {
        // alert("添加水印结束");
        // console.log(JSON.stringify(ret));
        if (ret.status) {
            getYSPic(ret.imgurl)
        } else {
            getYSPic(path)
        }
        // 压缩 水印图片
        function getYSPic(oldPath){
          // alert(oldPath);
          // 获取到压缩的大小
          var picSize = parseInt($api.getStorage("cameraScale"));
          picSize = picSize ? picSize:500;
          // picSize = 150
          // alert(picSize);

          var imageFilter = api.require('imageFilter');
          var pathArr=oldPath.split("/");
          var newPath=pathArr[pathArr.length-1];
          // alert(newPath);
          pathArr.pop();
          var newOld=pathArr.join("/");
          // 判断压缩尺寸大小 小了就不压缩
          imageFilter.getAttr({
              path: oldPath
          }, function(ret, err) {
              if (ret.status) {
                  // alert(ret.size);
                  // alert(ret.size/1024);
                  var oldSize = ret.size / 1024;
                  if (oldSize > picSize) {
                      $api.toast('开始压缩图片');
                      // var quality = Math.round(oldSize/500)*0.1;alert(quality);
                      if (oldSize < 1500) {
                          quality = 0.9
                      } else if (oldSize < 2000) {
                          quality = 0.8
                      } else if (oldSize < 2500) {
                          quality = 0.7
                      } else if (oldSize < 3000) {
                          quality = 0.6
                      } else if (oldSize < 4000) {
                          quality = 0.5
                      } else {
                          quality = 0.4
                      }

                      quality=(picSize/500)*quality;
                      quality=quality>1?0.95:quality;

                      imageFilter.compress({
                          img: oldPath,
                          quality: quality,
                          save: {
                              album: false,
                              imgPath: newOld,
                              imgName: newPath,
                          }
                      }, function(ret3, err) {
                          if (err) {
                              $api.toast('压缩不成功');
                          }
                          if (ret3.status) {
                              $api.toast('压缩成功');

                          } else {
                              $api.toast('压缩不成功');
                          }
                          // getPicInfo(oldPath);
                          callback(oldPath)
                      });

                  } else {
                      // $api.toast('不压缩图片');
                      callback(oldPath)
                  }

              }else{
                callback(oldPath)
              }
          });

        }
    });
}

// 图片预览
function pBrowserPicture(index, data) {
    api.openWin({
        name: 'pictureBrowser',
        url: 'widget://html/pictureBrowser.html',
        pageParam: {
            images: data,
            index: index
        },
        animation: {
            type: "fade", //动画类型（详见动画类型常量）
            duration: 300 //动画过渡时间，默认300毫秒
        }
    });
}

function pBrowserVideo(url) { //视频播放
    api.openVideo({
        url: url
    });
}

// function pGetLocationGPS(setGPS = false, callback = undefined) { //判断是否开启了gps
function pGetLocationGPS(setGPS, callback) { //判断是否开启了gps
    var gpsmodel = api.require('gpsState');
    if (!setGPS) {
        gpsmodel.gpsstate(function(ret) {
            callback(ret);
        });
    } else {
        if (api.systemType == 'android') {
            gpsmodel.opengps();
        }
        if (api.systemType == 'ios') {
            var setJumpNew = api.require('setJumpNew');
            setJumpNew.open();
        }
    }

}

function pFsCopyFiles(oldPath, newPath, callback) { //复制文件到fs文件中
    var fs = api.require("fs");
    fs.copyTo({
        oldPath: oldPath,
        newPath: newPath
    }, function(ret, err) {
        callback(ret, err);
    });
}

function pNavigationAppIsExist(callback) {
    var navigator = api.require('navigator');
    var arrays = ['bMap', 'aMap', 'gMap'];
    var callArrays = [];
    var number = 0;
    for (var i = 0; i < arrays.length; i++) {
        navigator.installed({
            target: arrays[i]
        }, function(ret, err) {
            number++;
            if (ret.status) {
                callArrays.push(arrays[i]);
            }
            if (number == arrays.length) {
                if (callArrays.length == 0) {
                    var ret = {
                        status: false,
                        data: []
                    };
                } else {
                    var ret = {
                        status: true,
                        data: callArrays
                    };
                }
                callback(ret);
            }
        });
    }

}

//调用导航，手动选择使用的导航地图
function pNavigation(options) {
    pNavigationAppIsExist(function(ret) {
        if (ret.status) {
            var data = ret.data;
            var buttons = [];
            var buttonsIndex = [];
            data.forEach(function(item, index) {
                switch (true) {
                    case item == 'bMap':
                        buttons.push('百度地图');
                        break;
                    case item == 'aMap':
                        buttons.push('高德地图');
                        break;
                    case item == 'gMap':
                        buttons.push('谷歌地图');
                        break;
                }
            });
            if (api.systemType == 'ios') {
                buttons.push('苹果地图');
            }
            api.actionSheet({
                buttons: buttons
            }, function(ret, err) {
                var index = ret.buttonIndex;
                if (index <= buttons.length) {
                    var name = buttons[index - 1];
                    switch (true) {
                        case name == "百度地图":
                            options.mapType = 'bMap';
                            pMapNavigation(options);
                            break;
                        case name == "高德地图":
                            options.mapType = 'aMap';
                            pMapNavigation(options);
                            break;
                        case name == "谷歌地图":
                            options.mapType = 'gMap';
                            pMapNavigation(options);
                            break;
                        case name == "苹果地图":
                            options.mapType = 'appleMap';
                            pMapNavigation(options);
                            break;
                    }
                }
            });
        } else {
            api.toast({
                msg: '请先安装第三方地图，例如百度地图,高德地图等',
                duration: 2000,
                location: 'top'
            });

        }
    })
}

// 打开地图导航
function pMapNavigation(options) {
    var options = options;
    if (options.endLon == undefined || options.endLon == '') {
        api.toast({
            msg: '终点坐标不能为空',
            duration: 2000,
            location: 'top'
        });
        return
    }
    if (options.endAddreesName == "") {
        pGetNameFromCoords(function(ret, err) {
            if (ret.status) {
                options.endAddreesName = ret.address;
            } else {
                options.endAddreesName = "";
            }
        }, {
            lon: options.endLon,
            lat: options.endLat
        })
    }
    if (options.startLon == undefined || options.startLon == "") {
        pGetNameFromCoords(function(ret, err) {
            if (ret.status) {
                options.startLon = ret.lon;
                options.startLat = ret.lat;
                options.startAddreesName = ret.address;
                pOpenMapnavigation(options);
            } else {
                api.toast({
                    msg: '当前位置定位失败',
                    duration: 2000,
                    location: 'top'
                });
                return
            }
        })
    } else {
        pOpenMapnavigation(options);
    }
}

function pOpenMapnavigation(options) {
    var navigator = api.require('navigator');
    var start = { // 起点信息.
        lon: options.startLon, // 经度.
        lat: options.startLat, // 纬度.
        name: options.startAddreesName
    }
    var end = { // 起点信息.
        lon: options.endLon, // 经度.
        lat: options.endLat, // 纬度.
        name: options.endAddreesName
    }
    if (options.mapType != 'appleMap') {
        navigator.installed({
            target: options.mapType
        }, function(ret, err) {
            if (ret.status) {
                switch (true) {
                    case options.mapType == "bMap":
                        //百度地图导航
                        navigator.bMapNavigation({
                            start: start,
                            end: end,
                            mode: 'driving'
                        });
                        break;
                    case options.mapType == "aMap":
                        // 高德地图导航
                        navigator.aMapPath({
                            start: start,
                            end: end,
                            mode: 'driving',
                        });
                        break;
                    case options.mapType == "gMap":
                        var newStart = JSON.parse(JSON.stringify(start).replace(/name/g, 'addr'));
                        var newEnd = JSON.parse(JSON.stringify(end).replace(/name/g, 'addr'));
                        navigator.gMapNavigation({
                            start: newStart,
                            end: newEnd,
                            mode: 'driving'
                        });
                        break;
                }
            } else {
                switch (true) {
                    case options.mapType == "bMap":
                        var mapName = '百度';
                        break;
                    case options.mapType == "aMap":
                        var mapName = '高德';
                        break;
                    case options.mapType == "gMap":
                        var mapName = '谷歌';
                        break;
                }
                api.toast({
                    msg: '当前手机未安装' + mapName + '地图，无法进行' + mapName + '地图导航',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        });
    } else {
        // 苹果自身导航
        navigator.appleNavigation({
            start: start,
            end: end,
            mode: 'driving'
        });
    }
}
