//接口地址
// var apiUrl = 'http://192.168.0.205:9094/';
//仁寿数据
//var mapconfig = {
//  maxZoom: 20,                                            //最大缩放级别
//  minZoom: 3,                                             //最小缩放级别
//  initialZoom: 14,                                         //初始缩放级别
//  center: [104.1526230224237, 30.01244851052735],                                //初始中心坐标
//  extent: [104.09277725151618, 29.95085353300537, 104.21246879333135, 30.074043488049337],                //地图范围
//  dataSourceName:"仁寿",
//  pointdataSetName:"仁寿_管点",
//  linedataSetName:"仁寿_管线"
//};
//var mapurl=(window.isLocal ? window.server : "http://192.168.0.205:8090") + "/iserver/services/map-GongZuoKongJian/rest/maps/管网图";
//var layername={
//	pipepoint:'仁寿_管点@仁寿',
//	pipeline:'仁寿_管线@仁寿'
//}
//
////网络服务
//var serviceUrl = "http://192.168.0.205:8090/iserver/services/transportationAnalyst-GongZuoKongJian/rest/networkanalyst/BuildNetwork@仁寿"
////数据服务，用于编辑
//var editUrl = "http://192.168.0.205:8090/iserver/services/data-GongZuoKongJian/rest/data"

// 接口地址
 var GisUrl= $api.getStorage('GisUrl');
 var Config =$api.getStorage('Config');
var mapconfig = {
    maxZoom: Config.maxZoom,                                            //最大缩放级别
    minZoom: Config.minZoom,                                             //最小缩放级别
    initialZoom: Config.initialZoom,                                         //初始缩放级别
    center: [ Config.centerX,Config.centerY],                                //初始中心坐标
    dataSourceName:Config.dataSourceName,
    pointdataSetName: Config.pointdataSetName,
    linedataSetName:Config.linedataSetName
};
var mapurl=(window.isLocal ? window.server : ""+GisUrl+"") + Config.mapurl;
var layername={
	pipepoint:Config.pipepoint,
	pipeline:Config.pipeline
}

//网络服务
var serviceUrl = GisUrl+Config.serviceUrl;
//数据服务，用于编辑
var editUrl =  GisUrl+Config.editUrl;
