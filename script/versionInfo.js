1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
373
374
375
376
377
378
379
380
381
382
383
384
385
386
387
388
389
390
391
392
393
394
395
396
397
398
399
400
401
402
403
404
405
406
407
408
409
410
411
412
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
469
470
471
472
473
474
475
476
477
478
479
480
481
482
483
484
485
486
487
488
489
490
491
492
493
494
495
496
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
547
548
549
550
551
552
553
554
555
556
557
558
559
560
561
562
563
564
565
566
567
568
569
570
571
572
573
574
575
576
577
578
579
580
581
582
583
584
585
586
587
588
589
590
591
592
593
594
595
596
597
598
599
600
601
602
603
604
605
606
607
608
609
610
611
612
613
614
615
616
617
618
619
620
621
622
623
624
625
626
627
628
629
630
631
632
633
634
635
636
637
638
639
640
641
642
643
644
645
646
647
648
649
650
651
652
653
654
655
656
657
658
659
660
661
662
663
664
665
666
667
668
669
670
671
672
673
674
675
676
677
678
679
680
681
682
683
684
685
686
687
688
689
690
691
692
693
694
695
696
697
698
699
700
701
702
703
704
705
706
707
708
709
710
711
712
713
714
715
716
717
718
719
720
721
722
723
724
725
726
727
728
729
730
731
732
733
734
735
736
737
738
739
740
741
742
743
744
745
746
747
748
749
750
751
752
753
754
755
756
757
758
759
760
761
762
763
764
765
766
767
768
769
770
771
772
773
774
775
776
777
778
779
780
781
782
783
784
785
786
787
788
789
790
791
792
793
794
795
796
797
798
799
800
801
802
803
804
805
806
807
808
809
810
811
812
813
814
815
816
817
818
819
820
821
822
823
824
825
826
827
828
829
830
831
832
833
834
835
836
837
838
839
840
841
842
843
844
845
846
847
848
849
850
851
852
853
854
855
856
857
858
859
860
861
862
863
864
865
866
867
868
869
870
871
872
873
874
875
876
877
878
879
880
881
882
883
884
885
886
887
888
889
890
891
892
893
894
895
896
897
898
899
900
901
902
903
904
905
906
907
908
909
910
911
912
913
914
915
916
917
918
919
920
921
922
923
924
925
926
927
928
929
930
931
932
933
934
935
936
937
938
939
940
941
942
943
944
945
946
947
948
949
950
951
952
953
954
955
956
957
958
959
960
961
962
963
964
965
966
967
968
969
970
971
972
973
974
975
976
977
978
979
980
981
982
983
984
985
986
987
988
989
990
991
992
993
994
995
996
997
998
999
1000
1001
1002
1003
1004
1005
1006
1007
1008
1009
1010
1011
1012
1013
1014
1015
1016
1017
1018
1019
1020
1021
1022
1023
1024
1025
1026
1027
1028
1029
1030
1031
1032
1033
1034
1035
1036
1037
1038
1039
1040
1041
1042
1043
1044
1045
1046
1047
1048
1049
1050
1051
1052
1053
1054
1055
1056
1057
1058
1059
1060
1061
1062
1063
1064
1065
1066
1067
var versionCurentUserName = $api.getStorage('loginData') != undefined ? $api.getStorage('loginData').userName : ""; //全局变量 （当前登录用户账号）
var versionNumbersIndex = 0; //数组下标  用于添加或者更新时用
var apiUrl = 'http://' + $api.getStorage('apiUrl'); //当前使用的ip地址
var remarkNumber = 0; //更新成功提示更新的内容 ( 用于有新的更新包的时候)
function createVersionInfoSheets() { // 创建版本更新表  （zxf 20200622 10:00）
    var db = api.require("db");
    // db.executeSql({
    //     name: 'Wsdatabase',
    //     sql: 'drop table VersionInfoSheets'
    // }, function(ret, err){
    //     if( ret.status ){
    //         alert( JSON.stringify( ret ) );
    //     }else{
    //         alert( JSON.stringify( err ) );
    //     }
    // });
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM VersionInfoSheets'
    }, function(ret, err) {
        if (!ret.status) { //没有改表，创建表
            db.executeSql({
                name: 'Wsdatabase',
                sql: 'CREATE TABLE VersionInfoSheets(Id int,sort int,versionNo int,newVersionNo int,tenantId int,isHasNewVersion int,moduleCode varchar(255), moduleName varchar(255), packetUrl varchar(255),creationTime varchar(255),creatorUserId varchar(255),creatorUserName varchar(255),lanApiUrl varchar(255),netApiUrl varchar(255),remark varchar(255),tenantName varchar(255),newPackageUrl varchar(255),userName varchar(255))'
            }, function(ret, err) {
                // console.log(JSON.stringify(ret));
                // console.log(JSON.stringify(err));
                if (ret.status) {
                    //  console.log( JSON.stringify( ret ) );
                }
            });
        }
    });
}
// apk 更新 20201009 开始
// 版本信息接口（判断云台是否有更新）
function CheckAppVsersionByTeantId() {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var getLoginInfo = $api.getStorage('getLoginInfo');
    if (getLoginInfo != undefined) { //判断用户是否登录
        fnPost('services/app/AppVersionService/CheckAppVsersionByTeantId', {
            body: JSON.stringify({
                "tenantId": getLoginInfo.tenantInfo.tenantId
            })
        }, 'application/json', true, false, function(ret, err) {
            api.hideProgress();
            if (ret && ret.success) {
              var appVersion = api.appVersion;
              appVersion = transVersion(appVersion);
              console.log(appVersion);
                var callbackResult = ret.result;
                var userLoginInformation = $api.getStorage('userLoginInformation'); //用户信息
                // 云平台数据
                var cloudData;
                // 先判断云平台是否有更新
                for (var i = 0; i < callbackResult.length; i++) {
                  if (callbackResult[i].moduleCode == 'WaterStarOne-Cloud-S9-APP') {
                    cloudData = callbackResult[i];
                    break;
                  }
                }
                // exit();
                console.log(JSON.stringify(cloudData));
                var db = api.require("db");
                if (appVersion == cloudData.versionNo) {
                  // 当前app版本号等于线上的版本号，代表没有新的版本，更新本地数据库，开始判断app内部是否有更新
                  db.executeSql({
                      name: 'Wsdatabase',
                      sql: ' UPDATE VersionInfoSheets SET versionNo = '+cloudData.versionNo+',packetUrl ="'+cloudData.packetUrl+'",newVersionNo = 0,isHasNewVersion ="0",newPackageUrl = "" WHERE  moduleCode = "'+cloudData.moduleCode+'" and userName = "'+versionCurentUserName+'"'
                  }, function(ret, err) {
                    console.log(JSON.stringify(ret));
                      if (ret.status) {
                        CheckAppVsersionByInfo();
                      }
                  });
                } else {
                  // 去判断有没有更新
                  db.selectSql({
                      name: 'Wsdatabase',
                      sql: 'SELECT * FROM VersionInfoSheets where moduleCode = "'+ cloudData.moduleCode +'"and userName="'+versionCurentUserName+'"'
                  }, function(ret, err) {
                    // exit();
                    console.log(JSON.stringify(ret.data));
                      if (ret.status) {
                        // exit();
                        // console.log(ret.data.length);
                          if (ret.data.length == 0) { //判断数据是否存在  存在则更新数据，不存在，则添加数据
                            // console.log('不存在数据');
                              // insertDataToVersionInfoSheets(curentData, newVersionData);
                              db.executeSql({
                                  name: 'Wsdatabase',
                                  // sql: `INSERT INTO VersionInfoSheets (Id,sort,versionNo,newVersionNo,tenantId,isHasNewVersion,moduleCode,moduleName, packetUrl,creationTime,creatorUserId,creatorUserName,lanApiUrl,netApiUrl,remark,tenantName,newPackageUrl,userName) VALUES (${curentData.id},${curentData.sort},${curentData.versionNo},0,${curentData.tenantId},0,"${curentData.moduleCode}","${curentData.moduleName}","${curentData.packetUrl}","${curentData.creationTime}","${curentData.creatorUserId}","${curentData.creatorUserName}","${curentData.lanApiUrl}","${curentData.netApiUrl}","${curentData.remark}","${curentData.tenantName}","","${versionCurentUserName}")`
                                  sql: 'INSERT INTO VersionInfoSheets (Id,sort,versionNo,newVersionNo,tenantId,isHasNewVersion,moduleCode,moduleName, packetUrl,creationTime,creatorUserId,creatorUserName,lanApiUrl,netApiUrl,remark,tenantName,newPackageUrl,userName) VALUES (' + cloudData.id + ',' + cloudData.sort + ',' + cloudData.versionNo + ',0,' + cloudData.tenantId + ',0,"' + cloudData.moduleCode + '","' + cloudData.moduleName + '","' + cloudData.packetUrl + '","' + cloudData.creationTime +
                                  '","' + cloudData.creatorUserId + '","' + cloudData.creatorUserName + '","' + cloudData.lanApiUrl + '","' + cloudData.netApiUrl + '","' + cloudData.remark + '","' + cloudData.tenantName + '","","' + versionCurentUserName +'")'
                              }, function(rets, err) {
                                console.log(JSON.stringify(ret));
                                if (rets.status) {
                                  // 插入成功,下载压缩包
                                  downLoadZipData(cloudData, false);
                                }
                              })
                          } else {
                            // console.log('存在数据');
                            db.selectSql({
                                name: 'Wsdatabase',
                                sql:' SELECT * FROM VersionInfoSheets WHERE moduleCode = "' + cloudData.moduleCode + '" and versionNo = ' + cloudData.versionNo+' and packetUrl = "' + cloudData.packetUrl + '" and userName="'+versionCurentUserName+'"'
                            }, function(rets, err) {
                              console.log(JSON.stringify(ret));
                              if (rets.status) {
                                if (rets.data.length == 0) {
                                  // console.log('有新版本');
                                  // 不存在数据,更新数据
                                  db.executeSql({
                                      name: 'Wsdatabase',
                                      // sql: `UPDATE  VersionInfoSheets SET Id = ${curentData.id},sort = ${curentData.sort},newVersionNo = ${curentData.versionNo},tenantId = ${curentData.tenantId},isHasNewVersion = "1",creationTime = '${curentData.creationTime}',creatorUserId = '${curentData.creatorUserId}',creatorUserName = '${curentData.creatorUserName}',lanApiUrl = '${curentData.lanApiUrl}',netApiUrl = '${curentData.netApiUrl}',remark = '${curentData.remark}',tenantName = '${curentData.tenantName}',newPackageUrl = '${curentData.packetUrl}' WHERE moduleCode = '${curentData.moduleCode}' and userName = '${versionCurentUserName}'`
                                      sql:' UPDATE  VersionInfoSheets SET Id = '+cloudData.id+',sort = '+cloudData.sort+',newVersionNo = '+cloudData.versionNo+',tenantId = '+cloudData.tenantId+',isHasNewVersion = "1",creationTime = "'+cloudData.creationTime+'",creatorUserId = "'+cloudData.creatorUserId+'",creatorUserName = "'+cloudData.creatorUserName+'",lanApiUrl = "'+cloudData.lanApiUrl+'",netApiUrl = "'+cloudData.netApiUrl+'",remark = "'+cloudData.remark+'",tenantName = "'+cloudData.tenantName+'",newPackageUrl = "'+cloudData.packetUrl
                                      +'" WHERE moduleCode = "'+cloudData.moduleCode+'" and userName = "'+versionCurentUserName+'"'
                                  }, function(ret1, err) {
                                    console.log(JSON.stringify(ret1));
                                    if (ret1.status) {
                                      // 更新成功，提示有新版本
                                      db.selectSql({
                                          name: 'Wsdatabase',
                                          // sql: ' SELECT * FROM VersionInfoSheets '
                                          sql: ' SELECT * FROM VersionInfoSheets WHERE moduleCode = "' + cloudData.moduleCode + '" and isHasNewVersion = "1" and newVersionNo = "' + cloudData.versionNo + '" and userName="'+versionCurentUserName+'"'
                                      }, function(ret2, err) {
                                        // console.log('--------------------')
                                        console.log(JSON.stringify(ret2));
                                        if (ret2.status) {
                                          if (ret2.data != 0) {
                                            var data = ret2.data[0];
                                            // exit();
                                            api.openFrame({
                                                name: 'updateVersion_frame',
                                                url: 'widget://html/work/updateVersion_frame.html',
                                                rect: {
                                                    x: 0,
                                                    y: 0,
                                                    w: 'auto',
                                                    h: 'auto'
                                                },
                                                bounces: false,
                                                pageParam: {
                                                    type: 'cloudUpdate',
                                                    data: data
                                                },
                                                bgColor: 'rgba(0,0,0,0.1)',
                                            });
                                          }
                                        }
                                        // console.log(JSON.stringify(err));
                                      })
                                    }
                                  })
                                } else {
                                  // console.log('没有新版本');
                                  // 没有新版本，判断内部有没有更新
                                  CheckAppVsersionByInfo();
                                }
                              }
                            })
                          }
                      }
                  });
                }
            } else {
                api.toast({
                    msg: '网络无法连接，请检查网络配置',
                    duration: 2000,
                    location: 'top'
                });
            }
        });
    }
}

// 版本号转换（00.01.73->1.73）
function transVersion(data) {
  if (data != '') {
    var newVersion = ''
    for (var i = 0; i < data.length; i++) {
      if (data[i] == '0' || data[i] == '.') {
        newVersion =  data.substr(i+1);
      } else {
         break;
      }
    }
    return newVersion;
  }
}

// 下载云平台压缩包的相应数据处理
function downLoadZipData(data,isUpdate) {
  console.log(JSON.stringify(data));
  // 处理下载地址
  var moduleName = data.moduleName.replace(/(^\s*)/g, "");
  if (isUpdate) {
      if (data.newPackageUrl != "") {
          var packetUrl = data.newPackageUrl.replace(/(^\s*)/g, "");
      }
  } else {
      if (data.packetUrl != "") {
          var packetUrl = data.packetUrl.replace(/(^\s*)/g, "");
      }
  }
  var downloadUrl = apiUrl + packetUrl;
  // 判断文件是否存在
  var fs = api.require('fs'); //引用fs模块
  fs.exist({
      path: ''+api.fsDir+'/'+moduleName+'.zip'
  }, function(ret, err) {
    console.log(JSON.stringify(ret));
      if (ret.exist) {
          // 文件存在,并且有新的版本，则更新
          removeFilesToLocal(data);
          downLoadZip(moduleName, downloadUrl);

      } else {
          // 文件不存在，下载
          if (packetUrl != '' && downloadUrl != '') {
              downLoadZip(moduleName, downloadUrl);
          }
      }
    })
}

// 下载云平台的压缩包
// 下载云平台的压缩包
function downLoadZip(moduleName, downloadUrl) {
  var zip = api.require("zip");
  var db = api.require("db");
  adilog('下载安装包','下载中');
  api.download({
      url: downloadUrl,
      savePath:'fs://'+moduleName+'.zip',
      report: true,
      cache: false,
      allowResume: true
  }, function(ret, err) {
      if (ret.state == 1) {
        var UIActionProgress = api.require('UIActionProgress');
        UIActionProgress.setData({
            data: {
                title: '正在解压',
                msg: '解压中',
                value: 50
            }
        });
        // 下载成功，解压
        zip.unarchive({
            file: 'fs://'+moduleName+'.zip',
            password: '',
            toPath: 'fs://wgt/'
        }, function(ret1, err1) {
            if (ret1.status) {
              var fs = api.require("fs");
              UIActionProgress.setData({
                  data: {
                      title: '解压完成',
                      msg: '马上安装',
                      value: 100
                  }
              });
              UIActionProgress.close();
              // fs.readDir({
              //     path: 'fs://wgt/cloudApp'
              // }, function(ret2, err2) {
              //   console.log(JSON.stringify(ret2));
              //   console.log(JSON.stringify(err2));
              //     if (ret2.exist) {
              //         // 文件存在,并且有新的版本，则更新
              //
              //     } else {
              //         // 文件不存在，下载
              //     }
              //   })

              // 为后续可能出现高低版本预留判断
              var type = 'hight';
              if (type == 'hight') {
                type = 'WaterStarOne-Cloud-S9-APP'
              } else {
                type = 'WaterStarOne-Cloud-S9-APP-low'
              }
                fs.exist({
                    path: 'fs://wgt/cloudApp/' + type + '.apk'
                }, function(ret2, err2) {
                    if (ret2.exist) {
                        // apk包存在，安装
                        var savePath = 'fs://wgt/cloudApp/' + type + '.apk';
                        api.installApp({
                          appUri : savePath
                        });

                    } else {
                        // 文件不存在，下载
                    }
                  })
            }
          })
      }
  })
}
// apk 结束

// 版本信息接口
function CheckAppVsersionByInfo() {
    var userLoginInformation = $api.getStorage('userLoginInformation');
     var getLoginInfo = $api.getStorage('getLoginInfo');
    if (getLoginInfo != undefined) { //判断用户是否登录
        fnPost('services/app/AppVersionService/CheckAppVsersionByTeantId', {
            body: JSON.stringify({
                "tenantId": getLoginInfo.tenantInfo.tenantId
            })
        }, 'application/json', true, false, function(ret, err) {
            api.hideProgress();
            if (ret && ret.success) {
                var callbackResult = ret.result;
                var userLoginInformation = $api.getStorage('userLoginInformation'); //用户信息
                var appList = [],
                    resultList = [],
                    sumNumber = 0;
                    // console.log(JSON.stringify(userLoginInformation));
                if (userLoginInformation.appList != undefined && userLoginInformation.appList != null) {
                    appList = userLoginInformation.appList[0].applications;
                }
                if (appList == null) {
                    for (var j = 0; j < callbackResult.length; j++) {
                        if (callbackResult[j].moduleCode == 'WaterStarOne-Cloud-S9') {
                            resultList.push(callbackResult[j]);
                            break;
                        }
                    }
                    dataHasBeenAdded(resultList); //判断数据是否已添加
                    return
                }
                for (var i = 0; i < callbackResult.length; i++) {
                    sumNumber++;
                    var number = 0;
                    for (var j = 0; j < appList.length; j++) {
                        if (callbackResult[i].moduleCode == 'WaterStarOne-Cloud-S9') {
                            number++;
                            break;
                        }
                        if (appList[j].coding == callbackResult[i].moduleCode) {
                            number++;
                            break;
                        }
                    }
                    if (number != 0) {
                        resultList.push(callbackResult[i]);
                    }
                    if (sumNumber == callbackResult.length) {
                        dataHasBeenAdded(resultList); //判断数据是否已添加
                    }
                }
            } else {
                api.toast({
                    msg: '网络无法连接，请检查网络配置',
                    duration: 2000,
                    location: 'top'
                });

            }
        });
    }

}

//判断数据是否已添加
function dataHasBeenAdded(newVersionData) {
    var db = api.require("db");
    if (newVersionData.length == 0) {
        return
    }
    if (versionNumbersIndex == newVersionData.length) {
        return
    }
    var curentData = newVersionData[versionNumbersIndex];
    db.selectSql({
        name: 'Wsdatabase',
        sql: 'SELECT * FROM VersionInfoSheets where moduleCode = "'+ curentData.moduleCode +'"and userName="'+versionCurentUserName+'"'
    }, function(ret, err) {
        if (ret.status) {
            if (ret.data.length == 0) { //判断数据是否存在  存在则更新数据，不存在，则添加数据
                insertDataToVersionInfoSheets(curentData, newVersionData);
            } else {
                updateDataToVersionInfoSheets(curentData, newVersionData);
            }
        }
    });
}

//插入数据到版本信息表中  newVersionNo新的版本号默认为 0 ，isHasNewVersion 是否有新的版本 默认为 0 表示没有  newPackageUrl 新的版本路径 默认为空
function insertDataToVersionInfoSheets(curentData, newVersionData) {
    // 添加数据到本地 （第一次下载数据，新的包名，下载路径，版本号都为最新版本，修改是否有新的版本表示，后面下载数据）
    var db = api.require("db");
    // console.log(JSON.stringify(curentData));
    db.executeSql({
        name: 'Wsdatabase',
        // sql: `INSERT INTO VersionInfoSheets (Id,sort,versionNo,newVersionNo,tenantId,isHasNewVersion,moduleCode,moduleName, packetUrl,creationTime,creatorUserId,creatorUserName,lanApiUrl,netApiUrl,remark,tenantName,newPackageUrl,userName) VALUES (${curentData.id},${curentData.sort},${curentData.versionNo},0,${curentData.tenantId},0,"${curentData.moduleCode}","${curentData.moduleName}","${curentData.packetUrl}","${curentData.creationTime}","${curentData.creatorUserId}","${curentData.creatorUserName}","${curentData.lanApiUrl}","${curentData.netApiUrl}","${curentData.remark}","${curentData.tenantName}","","${versionCurentUserName}")`
        sql: 'INSERT INTO VersionInfoSheets (Id,sort,versionNo,newVersionNo,tenantId,isHasNewVersion,moduleCode,moduleName, packetUrl,creationTime,creatorUserId,creatorUserName,lanApiUrl,netApiUrl,remark,tenantName,newPackageUrl,userName) VALUES (' + curentData.id + ',' + curentData.sort + ',' + curentData.versionNo + ',0,' + curentData.tenantId + ',0,"' + curentData.moduleCode + '","' + curentData.moduleName + '","' + curentData.packetUrl + '","' + curentData.creationTime +
        '","' + curentData.creatorUserId + '","' + curentData.creatorUserName + '","' + curentData.lanApiUrl + '","' + curentData.netApiUrl + '","' + curentData.remark + '","' + curentData.tenantName + '","","' + versionCurentUserName +'")'
    }, function(ret, err) {
      // console.log(JSON.stringify(ret));
      // console.log(JSON.stringify(err));
        if (ret.status) {
              addOrUpdateDataFinish(newVersionData);

        }
    });
}

//更新数据到版本信息表中
function updateDataToVersionInfoSheets(curentData, newVersionData) {
    // 先判断是否有新的版本，没有则不更新
    var db = api.require("db");
    db.selectSql({
        name: 'Wsdatabase',
        sql:' SELECT * FROM VersionInfoSheets WHERE moduleCode = "'+curentData.moduleCode+'" and versionNo = '+curentData.versionNo+' and packetUrl = "'+curentData.packetUrl+'" and userName="'+versionCurentUserName+'"'
    }, function(ret, err) {
      // console.log(JSON.stringify(ret));
      // console.log(JSON.stringify(err));
        if (ret.status) {
            if (ret.data.length == 0) { //表示有新的版本 （当前最新的数据和表里面的数据不一样，则表示有新的版本）
                db.executeSql({
                    name: 'Wsdatabase',
                    // sql: `UPDATE  VersionInfoSheets SET Id = ${curentData.id},sort = ${curentData.sort},newVersionNo = ${curentData.versionNo},tenantId = ${curentData.tenantId},isHasNewVersion = "1",creationTime = '${curentData.creationTime}',creatorUserId = '${curentData.creatorUserId}',creatorUserName = '${curentData.creatorUserName}',lanApiUrl = '${curentData.lanApiUrl}',netApiUrl = '${curentData.netApiUrl}',remark = '${curentData.remark}',tenantName = '${curentData.tenantName}',newPackageUrl = '${curentData.packetUrl}' WHERE moduleCode = '${curentData.moduleCode}' and userName = '${versionCurentUserName}'`
                    sql:' UPDATE  VersionInfoSheets SET Id = '+curentData.id+',sort = '+curentData.sort+',newVersionNo = '+curentData.versionNo+',tenantId = '+curentData.tenantId+',isHasNewVersion = "1",creationTime = "'+curentData.creationTime+'",creatorUserId = "'+curentData.creatorUserId+'",creatorUserName = "'+curentData.creatorUserName+'",lanApiUrl = "'+curentData.lanApiUrl+'",netApiUrl = "'+curentData.netApiUrl+'",remark = "'+curentData.remark+'",tenantName = "'+curentData.tenantName+'",newPackageUrl = "'+curentData.packetUrl
                    +'" WHERE moduleCode = "'+curentData.moduleCode+'" and userName = "'+versionCurentUserName+'"'
                }, function(ret, err) {
                  // console.log(JSON.stringify(ret));
                  // console.log(JSON.stringify(err));
                    if (ret) {
                      addOrUpdateDataFinish(newVersionData);
                    }
                });
            } else {
                // 当前没有新的版本
                addOrUpdateDataFinish(newVersionData);
            }
        }
    });
}

//判断新增或者更新是否完成
function addOrUpdateDataFinish(newVersionData) {
    var db = api.require("db");
    versionNumbersIndex++;
    if (versionNumbersIndex == newVersionData.length) {
      versionNumbersIndex = 0;
        //  下载数据   数据添加到本地完成后， 下载数据 （下载完成后，判断本地数据是否下载成功，没有成功，则重新下载）
        db.selectSql({
            name: 'Wsdatabase',
            sql: 'SELECT * FROM VersionInfoSheets where userName="'+versionCurentUserName+'"'
        }, function(ret, err) {
            if (ret.status) {
                if (ret.data.length > 0) {
                    // 判断是否有新的版本
                    db.selectSql({
                        name: 'Wsdatabase',
                        sql: 'SELECT * FROM VersionInfoSheets where isHasNewVersion = "1" and moduleCode != "WaterStarOne-Cloud-S9" and moduleCode != "WaterStarOne-Cloud-S9-APP" and userName="'+versionCurentUserName+'"'
                    }, function(ret1, err) {
                        if (ret1.status) {
                            if (ret1.data.length > 0) {
                                api.openFrame({
                                    name: 'updateVersion_frame',
                                    url: 'widget://html/work/updateVersion_frame.html',
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
                              // downDataToLocalZip(false);
                            } else {
                              db.selectSql({
                                  name: 'Wsdatabase',
                                  sql: 'SELECT * FROM VersionInfoSheets where isHasNewVersion = "1" and moduleCode == "WaterStarOne-Cloud-S9" and userName="'+versionCurentUserName+'"'
                              }, function(ret1, err) {
                                  if (ret1.status) {
                                      if (ret1.data.length > 0) {
                                          downDataToLocalZip("null");
                                      } else {

                                        downDataToLocalZip(null);
                                      }
                                  }
                              });

                            }
                        }
                    });
                }
            }
        });

    } else {
        dataHasBeenAdded(newVersionData);
    }
}

//修改当前登录用户名
function updateVersionSheetsUserName() {
    var db = api.require("db");
}
//切换用户的时候，删除表里面的数据 （由于用户名不好确定，如何来确定当前用户的版本？？？？？）

// 进度条
function adilog(title, msg) {
    var UIActionProgress = api.require('UIActionProgress');
    UIActionProgress.open({
        maskBg: 'rgba(0,0,0,0.5)',
        styles: {
            h: 150,
            bg: '#fff',
            title: {
                size: 18,
                color: '#000',
                marginT: 10
            },
            msg: {
                size: 15,
                color: '#000',
                marginT: 10
            },
            lable: {
                size: 15,
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
        data: {
            title: title,
            msg: msg,
            value: 0
        }
    }, function(ret) {

    });
}

//进度条
function updateAdilogData(title, msg, value) {
    var UIActionProgress = api.require('UIActionProgress');
    UIActionProgress.setData({
        data: {
            title: title,
            msg: msg,
            value: value
        }
    });
}

// 下载数据到本地
function downDataToLocalZip(type) {
  var db = api.require("db");
    // 当前登录人员有应用列表
    var sql = 'SELECT * FROM VersionInfoSheets where userName="'+versionCurentUserName+'" and moduleCode != "WaterStarOne-Cloud-S9-APP"';
    if(type !==null){
      sql = 'SELECT * FROM VersionInfoSheets where isHasNewVersion="1" and userName="'+versionCurentUserName+'" and moduleCode != "WaterStarOne-Cloud-S9-APP"';
    }
    // type 返回 update后 弹出进度条
    if(type == 'update'){
      adilog("更新安装包中","请稍后...");
    }
    console.log('搜索');
    console.log(sql);
    db.selectSql({
        name: 'Wsdatabase',
        sql: sql
    }, function(ret, err) {
        if (ret.status) {
          // console.log(JSON.stringify(ret));
            if (ret.data.length > 0) {
            downDataToLocalZipData(ret.data,type!=null?true:false);
          }
        }
    });
}


function downDataToLocalZipData(data,isUpdate){
  var fs = api.require('fs'); //引用fs模块
  var versionInformation = data;
  var numberNo = 0;
  for (var i = 0; i < versionInformation.length; i++) {
      (function(i) {
        if(versionInformation[i].isHasNewVersion == "0") return
          numberNo++;
          var moduleName = versionInformation[i].moduleName.replace(/(^\s*)/g, "");
          if (isUpdate) {
              if (versionInformation[i].newPackageUrl != "") {
                  var packetUrl = versionInformation[i].newPackageUrl.replace(/(^\s*)/g, "");
              }
          } else {
              if (versionInformation[i].packetUrl != "") {
                  var packetUrl = versionInformation[i].packetUrl.replace(/(^\s*)/g, "");
              }
          }
          // if(moduleName == "综合水务平台APP") continu
          // console.log(moduleName);
          var downloadUrl = apiUrl + packetUrl;
          // 判断文件是否存在
          fs.exist({
              path: ''+api.fsDir+'/'+moduleName+'.zip'
          }, function(ret, err) {
              if (ret.exist) {
                  // 文件存在,并且有新的版本，则更新
                  if (isUpdate) {
                      removeFilesToLocal(versionInformation[i]);
                      downLoadZipToLocal(moduleName, downloadUrl, versionInformation[i], versionInformation, isUpdate);
                  }else{
                      firstLoginHasZip(versionInformation[i],function(rep){
                        if(!rep){
                          removeFilesToLocal(versionInformation[i]);
                          deleteLocalWgt(app);
                          downLoadZipToLocal(moduleName, downloadUrl, versionInformation[i], versionInformation, isUpdate);
                        }else{




                        }
                      })
                  }
              } else {
                  // 文件不存在，下载
                  if (packetUrl != '' && downloadUrl != '') {
                      downLoadZipToLocal(moduleName, downloadUrl, versionInformation[i], versionInformation, isUpdate);
                  }
              }
          });
      })(i);
  }
}

function firstLoginHasZip(singleVersionInformation,callback){ //第一次登陆有zip包的时候
  // 判断文件里面的版本信息
  switch (true) {
      case singleVersionInformation.moduleCode == "WaterStarOne-MRH-S8":
          var wgtName = "MeterReading"
          break;
      case singleVersionInformation.moduleCode == "WaterStarOne-MMS-S8":
          var wgtName = "MeterManage"
          break;
      case singleVersionInformation.moduleCode == "WaterStarOne-AM-S8":
          var wgtName = "Audit"
          break;
      case singleVersionInformation.moduleCode == "WaterStarOne-Cloud-S9":
              var wgtName = "public"
              break;
  }
  var fs = api.require('fs');
  fs.exist({
      path: ''+api.fsDir+'/wgt'
  }, function(ret, err) {
      if (ret.exist) {
          // 文件存在,并且有新的版本，则更新
          fs.open({
              path: ''+api.fsDir+'wgt/' + wgtName + '/version.txt',
              flags: 'read_write'
          }, function(ret, err) {
              if (ret.status) {
                  fs.read({
                      fd: ret.fd,
                      offset: 0,
                      length: 0
                  }, function(ret1, err1) {
                      if (ret.status) {
                        if(ret1.data == ""){
                          return false
                        }
                        var version = ret1.data.substring(ret1.data.lastIndexOf(':')+1,ret1.data.length);
                         if(version == singleVersionInformation.newVersionNo){
                           callback(true);
                         }else{
                          callback(false);
                         }
                      } else {
                        callback(false);

                      }
                  });
              } else {

              callback(false);

              }
          });


      } else {
   console.log('wgt 不存在 ')


      }
  });
}

// 下载数据到本地
// function downLoadZipToLocal(moduleName, downloadUrl, singleVersionInformation, versionInformation, isUpdate = false) {
function downLoadZipToLocal(moduleName, downloadUrl, singleVersionInformation, versionInformation, isUpdate) {
    var zip = api.require("zip");
    var db = api.require("db");
    var singleVersionInformation = singleVersionInformation;
    api.download({
        url: downloadUrl,
        savePath:'fs://'+moduleName+'.zip',
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
      // alert(JSON.stringify(ret))
        if(isUpdate){
          updateAdilogData("更新安装包中", "请稍后...", 50);

        }
        if (ret.state == 1) {
            //下载成功 后解压
            zip.unarchive({
                file: 'fs://'+moduleName+'.zip',
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret1, err1) {
                if (ret1.status) {
                    remarkNumber++;
// 判断文件里面的版本信息
switch (true) {
    case singleVersionInformation.moduleCode == "WaterStarOne-MRH-S8":
        var wgtName = "MeterReading"
        break;
    case singleVersionInformation.moduleCode == "WaterStarOne-MMS-S8":
        var wgtName = "MeterManage"
        break;
    case singleVersionInformation.moduleCode == "WaterStarOne-AM-S8":
        var wgtName = "Audit"
        break;
    case singleVersionInformation.moduleCode == "WaterStarOne-Cloud-S9":
          var wgtName = "public"
          break;
}
var fs = api.require('fs');
fs.open({
    path: 'fs://wgt/' + wgtName + '/version.txt',
    flags: 'read_write'
}, function(ret, err) {
    if (ret.status) {
        fs.read({
            fd: ret.fd,
            offset: 0,
            length: 0
        }, function(ret1, err1) {
            if (ret.status) {
              if(ret1.data == ""){
                return false
              }
              var version = ret1.data.substring(ret1.data.lastIndexOf(':')+1,ret1.data.length);
              var newVersionNo = Number(singleVersionInformation.newVersionNo)
              if((Number(version) == newVersionNo) || (newVersionNo == 0 && isUpdate == false)){
                 if (isUpdate) {
                   // var sql = `UPDATE VersionInfoSheets SET versionNo = ${singleVersionInformation.newVersionNo},packetUrl = '${singleVersionInformation.newPackageUrl}' WHERE  moduleCode = '${singleVersionInformation.moduleCode}' and isHasNewVersion = "1"`;
                   var sql = 'UPDATE VersionInfoSheets SET versionNo = '+singleVersionInformation.newVersionNo+',packetUrl ="'+singleVersionInformation.newPackageUrl+'" WHERE  moduleCode = "'+singleVersionInformation.moduleCode+'" and isHasNewVersion = "1" and userName = "'+versionCurentUserName+'"';
                      if(singleVersionInformation.moduleCode == 'WaterStarOne-Cloud-S9'){
                        sql ='UPDATE VersionInfoSheets SET versionNo = '+singleVersionInformation.newVersionNo+',packetUrl ="'+singleVersionInformation.newPackageUrl+'",newVersionNo = 0,isHasNewVersion ="0",newPackageUrl = "" WHERE  moduleCode = "'+singleVersionInformation.moduleCode+'" and userName = "'+versionCurentUserName+'"';  //综合水务平台更新
                      }
                     db.executeSql({
                         name: 'Wsdatabase',
                         sql: sql
                     }, function(ret, err) {
                         if (ret) {

                         }
                     });
                     if (remarkNumber == versionInformation.length) { //更新下载完成后，提示更新的内容
                       if(isUpdate == true){
                         db.selectSql({
                             name: 'Wsdatabase',
                             sql: 'SELECT * FROM VersionInfoSheets where isHasNewVersion = "1" and remark!="" and userName = "'+versionCurentUserName+'"'
                         }, function(ret, err) {
                             if (ret.status) {
                                 if (ret.data.length > 0) {
                                   updateAdilogData("更新安装包中", "请稍后...", 100);
                                   var UIActionProgress = api.require('UIActionProgress');
                                   UIActionProgress.close();
                                     api.openFrame({
                                         name: 'delete_frame',
                                         url: 'widget://html/delete_frame.html',
                                         rect: {
                                             x: 0,
                                             y: 0,
                                             w: 'auto',
                                             h: 'auto'
                                         },
                                         bounces: false,
                                         pageParam: {
                                             type: 'all'
                                         },
                                         bgColor: 'rgba(0,0,0,0.1)',
                                     });
                                 }else{
                                   db.executeSql({
                                       name: 'Wsdatabase',
                                       sql: 'UPDATE  VersionInfoSheets SET newVersionNo = 0,isHasNewVersion ="0",newPackageUrl = "" WHERE  isHasNewVersion = "1"'
                                   }, function(ret, err) {
                                       if (ret) {
                                       }
                                   });
                                 }
                                //  alert("1")
                                //  checkPhoneGPS(false);
                             }
                         });
                       }else{
                         db.executeSql({
                             name: 'Wsdatabase',
                             sql: 'UPDATE  VersionInfoSheets SET newVersionNo = 0,isHasNewVersion ="0",newPackageUrl = "" WHERE  isHasNewVersion = "1"'
                         }, function(ret, err) {
                             if (ret) {
                             }
                         });
                        //  checkPhoneGPS(false);
                       }

                     }
                 }
               }else{
                 var UIActionProgress = api.require('UIActionProgress');
                 UIActionProgress.close();
              //  版本文件里面和版本不相等，说明更新文件有问题，给出提示
              api.toast({
                  msg: '更新失败,请刷新页面重新更新!',
                  duration: 2000,
                  location: 'bottom'
              });
              api.closeFrame({
                  name: 'updateVersion_frame'
              });
               }
            } else {
              // alert("2")
              console.log("文件不存在");
            }
        });
    } else {
      // alert("1");
      // var UIActionProgress = api.require('UIActionProgress');
      // UIActionProgress.close();
      // vant.Dialog.alert({
      //     title: '提示',
      //     message: '更新失败，若需更新版本，请到我的-设置-关于版本中更新版本',
      // }).then(function() {
      //   api.closeFrame({
      //       name: 'updateVersion_frame'
      //   });
      // });
        console.log("文件不存在");
    }
});


                }
            });
        } else if (ret.state == 2) {
          var UIActionProgress = api.require('UIActionProgress');
          UIActionProgress.close();
          vant.Dialog.alert({
              title: '提示',
              message: '当前网络环境不好，若需更新版本，请到我的-设置-关于版本中更新版本',
          }).then(function() {
            api.closeFrame({
                name: 'updateVersion_frame'
            });
          });
            // UIActionProgress.setData({
            //     data: {
            //         title: '正在为您下载更新资源包',
            //         value: ret.percent
            //     }
            // });

        }else{
          // if(api.connectionType == 'none'){
          //   var UIActionProgress = api.require('UIActionProgress');
          //   UIActionProgress.close();
          //   vant.Dialog.alert({
          //       title: '提示',
          //       message: '当前网络环境不好，若需更新版本，请到我的-设置-关于版本中更新版本',
          //   }).then(function() {
          //     api.closeFrame({
          //         name: 'updateVersion_frame'
          //     });
          //   });
          // }
            // UIActionProgress.setData({
            //     data: {
            //         title: '正在为您下载更新资源包',
            //         value: ret.percent
            //     }
            // });

        }
    });
}

// 删除指定的本地zip包
function removeFilesToLocal(data) {
    var fs = api.require("fs");
    data.productName = data.moduleName;
    deleteLocalWgt(data);
    fs.remove({
        path: 'fs://'+data.moduleName+'.zip'
    }, function(ret, err) {
        if (ret.status) {}
    });
}

// 删除本地fs//wgt里面相应的数据
function deleteLocalWgt(app) {
    var wgtName = '';
    var fs = api.require("fs");
    switch (true) {
        case app.coding == "WaterStarOne-MRH-S8" || app.moduleCode == "WaterStarOne-MRH-S8" :
            wgtName = "MeterReading"
            break;
        case app.coding == "WaterStarOne-MMS-S8" || app.moduleCode == "WaterStarOne-MMS-S8" :
            wgtName = "MeterManage"
            break;
        case app.coding == "WaterStarOne-AM-S8" || app.moduleCode ==  "WaterStarOne-AM-S8":
            wgtName = "Audit"
            break;
        case app.coding == "WaterStarOne-Cloud-S9" || app.moduleCode == "WaterStarOne-Cloud-S9" :
                wgtName = "public"
            break;
    }
    if (wgtName != '') {
        fs.remove({
            path:'fs://wgt/'+wgtName+''
        }, function(ret, err) {
            if (ret.status) {}
        });
    }
}

//单个应用更新
// 下载设置-关于版本中单个应用更新
function singleAppUpdate(datas, isUpdate, callback) {
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块
    var db = api.require("db");
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
    });
    var moduleName = datas.moduleName.replace(/(^\s*)/g, "");
    if (isUpdate) {
        if (datas.newPackageUrl != "") {
            var packetUrl = datas.newPackageUrl.replace(/(^\s*)/g, "");
        }
    } else {
        if (datas.packetUrl != "") {
            var packetUrl = datas.packetUrl.replace(/(^\s*)/g, "");
        }
    }
    var downloadUrl = apiUrl + packetUrl;

    api.download({
        url: downloadUrl,
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
                  var sql = 'UPDATE VersionInfoSheets SET versionNo = '+datas.newVersionNo+',packetUrl ="'+datas.newPackageUrl+'" WHERE  moduleCode = "'+datas.moduleCode+'" and isHasNewVersion = "1"  and userName = "'+versionCurentUserName+'"';
                  db.executeSql({
                      name: 'Wsdatabase',
                      sql: sql
                  }, function(ret, err) {
                      if (ret) {
                        callback(true);
                        UIActionProgress.close();
                      }
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
function fndecompressionZip(){ //解压压缩包
  var fs = api.require("fs");
  var zip = api.require("zip");
  fs.readDir({
   path: api.fsDir
}, function(ret, err) {
   if (ret.status) {
       var data =[] ;
       ret.data.forEach(function(item,index){
         if(item.indexOf('.zip')!==-1){ //包含
           zip.unarchive({
               file: ''+api.fsDir+'/'+item+'',
               password: '',
               toPath: 'fs://wgt/'
           }, function(ret, err) {
           });
         }
       })
   }
});
}
