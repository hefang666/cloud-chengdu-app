//var dragZoomin = new ol.interaction.DragZoom({        
//  condition: ol.events.condition.always,
//  out: true,                                      // 此处为设置拉框完成缩小
//});
//var dragZoomout = new ol.interaction.DragZoom({        
//  condition: ol.events.condition.always,
//  out: false,                                     // 此处为设置拉框完成时放大
//});
//map.addInteraction(dragZoomin);
//map.addInteraction(dragZoomout);
//dragZoomin.setActive(false);
//dragZoomout.setActive(false);
//$("#zoom_in").click(function () {                   //拖拽放大
//  dragZoomout.setActive(true);
//  dragZoomin.setActive(false);
//  dragzoomActive = true; 
//  document.getElementById("map").style.cursor="url(../images/shubiao.ico),auto";
//});
//$("#zoom_out").click(function () {                  //拖拽缩小
//  dragZoomin.setActive(true);
//  dragZoomout.setActive(false);
//  dragzoomActive = true;
//  document.getElementById("map").style.cursor="url(../images/shubiao.ico),auto";   
//});
//$("#map_move").click(function () {                  //平移   
//  dragZoomin.setActive(false);
//  dragZoomout.setActive(false);
//  $("#map").css("cursor", "move");   
//});
//$("#globe_map").click(function () {                 //全图显示
//  var view = map.getView();
//  view.setZoom(mapconfig.initialZoom);
//  view.setCenter(mapconfig.center);
//  view.setRotation(0);
//  dragZoomin.setActive(false);
//  dragZoomout.setActive(false);
//  $("#map").css("cursor", "default");
//});

var layersArray = map.getLayers();
$("#shiliang_map").click(function () {             //切换矢量底图
    layersArray.insertAt(0, vecLayer);
    map.removeLayer(imgLayer);
    map.removeLayer(terLayer);
    $("#close_backmap").prop("checked", true);
});
$("#basemap").click(function () {            //切换影像底图
	alert(1);
    layersArray.insertAt(0, imgLayer);
    map.removeLayer(vecLayer);
    map.removeLayer(terLayer);
    $("#close_backmap").prop("checked", true);
});
$("#dixing_map").click(function () {               //切换地形底图
    layersArray.insertAt(0, terLayer);
    map.removeLayer(imgLayer);
    map.removeLayer(vecLayer);
    $("#close_backmap").prop("checked", true);
});
$("#annotate").click(function () {                 //地名开关
    if (this.checked == true) {
        layersArray.insertAt(1, vecAnno);
    } else {
        map.removeLayer(vecAnno);
    }
});
//$("#default").click(function () {                  		//恢复默认
//  dragZoomin.setActive(false);				   		//关闭缩小
//  dragZoomout.setActive(false); 				   		//关闭放大
//  map.removeEventListener('click');					//移出点击事件监听
//  container.style.display = 'none';             		//处理气泡对话框
//  if(pointsource !=null){
//		pointsource.clear();								//清空点矢量要素
//  }
//  if(linesource !=null){
//		linesource.clear();									//清空线矢量要素
//  }
//	
//	//清測量模塊
//	deletetooltip();
//	map.removeEventListener('pointermove', pointerMoveHandler);
//	map.removeInteraction(draw);
//	//清除专题图查询后的模块
//	map.removeInteraction(select1);
//	map.removeInteraction(select2);
//	map.removeInteraction(select3);
//	map.removeInteraction(select4);
//	//鼠标样式恢复默认
//  $("#map").css("cursor", "default");
//  //清掉定位的图标
//  positionlabel.style.display = 'none';
//});
////刪除測量后的提示框
//function deletetooltip(){
//	var elments=document.getElementsByClassName("tooltip tooltip-static");
//	while(elments.length > 0) {
//		elments[0].parentNode.removeChild(elments[0]);
//	}	
//}
////打印
//document.getElementById('printmap').addEventListener('click', function() {
//	var mycanvas = $("#map").find("canvas")[0];
//	mycanvas.setAttribute('crossorigin', 'anonymous');
//  if(mycanvas){
//  	var image = mycanvas.toDataURL("image/jpeg");
//	    var $a = document.createElement('a');
//	    $a.setAttribute("href", image);
//	    $a.setAttribute("download", "地图");
//	    $a.click();
//  }
//  else
//  {
//  	top.sweet("操作失败！", "地图无效！", "info");
//  }
//});

