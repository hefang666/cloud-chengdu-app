//初始化超图
var layer = new ol.layer.Tile({
	source: new ol.source.TileSuperMapRest({
		url: mapurl,
		crossOrigin: 'anonymous',                     //打印有跨域
		wrapX: true
	}),
	projection: 'EPSG:4326'
});
//初始化天地图
var baseLayers = ["vec_w", "img_w", "ter_w"];
var vecLayer = getBaseLayer("地图", baseLayers[0]);
var imgLayer = getBaseLayer("影像", baseLayers[1]);
var terLayer = getBaseLayer("地形", baseLayers[2]);
var vecAnno = getAnnoLayer("地图标注", "cva_w", true);
function getBaseLayer(layername, layer) {
	return new ol.layer.Tile({
		title: layername,
		source: new ol.source.XYZ({
			crossOrigin: 'anonymous',				//打印有跨域
			url: "http://t4.tianditu.com/DataServer?T=" + layer + "&x={x}&y={y}&l={z}&tk=7ab767e38fe3d9c04f144a091cff214f"
		})
	});
};

function getAnnoLayer(layername, layer, visiable) {
	return new ol.layer.Tile({
		title: layername,
		source: new ol.source.XYZ({
			crossOrigin: 'anonymous',				//打印有跨域
			url: "http://t4.tianditu.com/DataServer?T=" + layer + "&x={x}&y={y}&l={z}&tk=7ab767e38fe3d9c04f144a091cff214f"
		})
	});
};
//初始化一个点矢量图层
var pointsource = new ol.source.Vector({
	wrapX: false
});
var pointvector = new ol.layer.Vector({
	source: pointsource
});
//初始化点样式
var pointstyle = new ol.style.Style({
	fill: new ol.style.Fill({
		color: 'rgba(255, 255, 255, 0.2)'
	}),
	stroke: new ol.style.Stroke({
		color: '#ffcc33',
		width: 2
	}),
	image: new ol.style.Icon({
		src: '../images/markerbig.png',
		scale:0.7
	})
});
//初始化一个线矢量图层
var linesource = new ol.source.Vector({
	wrapX: false
});
var linevector = new ol.layer.Vector({
	source: linesource
});
//初始化线样式
var lineStyle = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: 'rgba(214, 75 ,131, 1)',
		width: 3
	}),
	fill: new ol.style.Fill({
		color: 'rgba(255, 0, 0, 0.1)'
	})
});
//全局绘制
var draw,interaction;
//定位
var positionlabel=document.getElementById('anchor');
var anchor = new ol.Overlay({
 element: positionlabel,
 autoPan: true,
 positioning: 'bottom-center'
});
//前后视图
window.app = {};
var app = window.app;
var if_mouse = true;
var now_view = -1;
var view_list = [];
app.lastViewControl = function(opt_options) {
	var options = opt_options || {};
	var button = document.createElement('button');
	button.innerHTML = '<';
	button.title = '前视图';
	var this_ = this;
	var handleLastView = function() {
		if_mouse = false;
		if (now_view - 1 < 0) now_view = 0;
		else now_view = now_view - 1;
		var temp_view = view_list[now_view];
		map.getView().animate({
			center: temp_view['Center'],
			zoom: temp_view['zoom'],
			duration: 500
		});
	}
	button.addEventListener('click', handleLastView, false);
	button.addEventListener('touchstart', handleLastView, false);
	var element = document.getElementById('viewdiv');
	element.appendChild(button);
	ol.control.Control.call(this, {
		element: element,
		target: options.target
	});
}
app.nextViewControl = function(opt_options) {
	var options = opt_options || {};
	var button = document.createElement('button');
	button.innerHTML = '>';
	button.title = '后视图';
	var this_ = this;
	var handleNextView = function() {
		if_mouse = false;
		if(now_view + 1 >= view_list.length) now_view = now_view;
		else now_view = now_view + 1;
		var temp_view = view_list[now_view];
		map.getView().animate({
			center: temp_view['Center'],
			zoom: temp_view['zoom'],
			duration: 500
		});
	}
	button.addEventListener('click', handleNextView, false);
	button.addEventListener('touchstart', handleNextView, false);
	var element = document.getElementById('viewdiv');
	element.appendChild(button);
	ol.control.Control.call(this, {
		element: element,
		target: options.target
	});
}
ol.inherits(app.lastViewControl, ol.control.Control);
ol.inherits(app.nextViewControl, ol.control.Control);
//初始地图
var map = new ol.Map({
	target: 'map',
	overlays: [anchor],
	controls: ol.control.defaults({
		attribution: false
	}).extend([new app.lastViewControl(),new app.nextViewControl()]),
	view: new ol.View({
		center: mapconfig.center,
		maxZoom: mapconfig.maxZoom,
		minZoom: mapconfig.minZoom,
		zoom: mapconfig.initialZoom,
		projection: 'EPSG:4326'
	})
});
//地图添加图层
map.addLayer(vecLayer);       //天地图底图
map.addLayer(vecAnno);				//天地图注记
map.addLayer(layer);				  //添加超图管网服务图层
map.addLayer(pointvector);            //添加点矢量地图，用于地图上的绘制点等
//添加鹰眼控件
map.addControl(new ol.control.OverviewMap({
	className: 'ol-overviewmap ol-custom-overviewmap',
 view: new ol.View({
     projection: 'EPSG:4326'
 })
}));
//前后视图
function onMoveEnd(evt) {
	if(if_mouse) {
		var new_list = [];
		temp = now_view;
		if(view_list.length > 1) {
			for (var i = 0;i < temp+1; i++) {
				new_list.push(view_list[i]);
			}
			now_view++;
			new_list.push({'zoom': map.getView().getZoom(), 'Center': map.getView().getCenter()});
			view_list = new_list;
		} else {
			view_list.push({'zoom': map.getView().getZoom(), 'Center': map.getView().getCenter()});
			now_view++;
		}
	} else {
		if_mouse = true;
	}
}
map.on('moveend', onMoveEnd);
