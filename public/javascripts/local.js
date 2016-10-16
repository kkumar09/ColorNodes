var colornodeApp=angular.module("ColorNodeApp", ["ngRoute"]);
var pUrl = "ws://localhost:8000/";
var websocket = new WebSocket(pUrl);
var NodesData = "";
/*websocket.onmessage = function(evt) { 
	NodesData = evt.data;
 };*/

colornodeApp.config(function($routeProvider){
	$routeProvider.when("/circles", {
		templateUrl: "templates/circles.htm",
		controller: "CircleController"
	}).when("/default", {
		templateUrl: "templates/default.htm"
	}).otherwise({
		templateUrl: "templates/default.htm"
	});
});

colornodeApp.controller("ColorNodeController",["$scope","$location","$rootScope", function($scope,$location,$rootScope){
	$scope.showPage = function(viewName) {
		if (viewName == 'circles') {
		  		$location.url("/circles");	
		}else if(viewName == 'logout'){
			$location.url("/default");
		}
	};
	$scope.SelectColor = function(color){
		$rootScope.color = color;
		$(".profileColor").css("background-color",color);
	};
	$scope.CreateNode = function(){
		$scope.name = $(".name").val();
		if($scope.name==""||$scope.name==null){
			$(".errorMsg").show();
			setTimeout(function(){$(".errorMsg").hide();},2000);
		}else if($scope.name.length>8){
			$(".errorMsg").show();
			setTimeout(function(){$(".errorMsg").hide();},2000);
		}else{
			$(".errorMsg").hide();
			$scope.uid = guid();
			$scope.userData = {
				"uid":$scope.uid,
				"name":$scope.name,
				"color":$rootScope.color
			};
			sessionStorage.setItem('currentUser',$scope.uid);

			setTimeout(function(){websocket.send( "create:"+$scope.uid+":"+$scope.name+":"+$rootScope.color)},2000);
			$location.url("/circles");
			function guid() {
			    return Math.random().toString(36).substr(2, 9);
			}	
		}
	};
}]);

colornodeApp.controller("CircleController",["$scope","$location","$http","$rootScope", function($scope,$location,$http,$rootScope){
		/*var btn = $("<div></div>").addClass("Btn").text("Button").css("border","2px solid");
		$(".nodes").append(btn);
		$(".Btn").on("click",function(){
			setTimeout(function(){websocket.send( "update:"+$scope.uid+":"+$scope.name+":"+$rootScope.color+":100:200")},2000);
		})*/
		websocket.onmessage = function(evt) { 
			NodesData = evt.data;
			$scope.GetData();
		 };
	$(".loader").show();		
	$scope.GetData = function(){
		//var str ='{{"uid":"7jqvy200z","name":"udayan","color":"red","x":"100","y":"200"},{"uid":"q1apj14xg","name":"chandu","color":"green","x":"0","y":"0"}}';
		setTimeout(function(){
			$(".loader").hide();
			if(!NodesData==""){
				var str = NodesData;
				//alert(str);
				var result = str.substring(1, str.length-1);
				result = '{"ColorNodes":['+result+']}';
				//alert(result);
		
				var ColorNodes = JSON.parse(result);
				console.log(ColorNodes);
				$scope.userid = sessionStorage.getItem('currentUser');
				$(".nodes").html("");
		    	for(var i=0;i<ColorNodes.ColorNodes.length;i++){
		    		var node = $("<div></div>").addClass("node").addClass("obstacle").attr("id",ColorNodes.ColorNodes[i].uid);
					var left = parseInt(ColorNodes.ColorNodes[i].y);
					var top = parseInt(ColorNodes.ColorNodes[i].x); 
		    		node.css({
		    			"background-color":ColorNodes.ColorNodes[i].color,
		    			"left":left+"px",
		    			"top" :top+"px"
		    		});
		    		var TextEle = $("<div></div>").addClass("uname").text(ColorNodes.ColorNodes[i].name);
		    		node.append(TextEle);
		    		$(".nodes").append(node);
		    	}
				$("#"+$scope.userid).css("border","5px solid black");
		    	$("#"+$scope.userid).draggable({
		    		obstacle: ".obstacle",
    				preventCollision: true,
					containment: $('#container'),
					start:function(event, ui){
				        $(this).removeClass("obstacle");
				    },
				    drag:function(event, ui){
				         //this function will be called after drag started each time you move your mouse
				    },
				    stop:function(event, ui){
				        	$(this).addClass("obstacle");
		    				var position = $(this).position();
		    				var leftPos = position.left;
		    				var topPos = position.top;
							
		    				websocket.send("update:"+$scope.uid+":"+$scope.name+":"+$rootScope.color+":"+topPos+":"+leftPos);
							//alert('fuck')
				    }
				});
			}else{
				$scope.GetData();
			}
		
		},1000);
	}
}]);