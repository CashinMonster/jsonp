function toUrl(url,data){
	data._ = new Date().getTime();

	var arr = [];

	for (var i in data){
		var str = i+"="+data[i];
		arr.push(str);
	}

	url = url+"?"+arr.join("&");
	return url;
}

function fnJsonp(url,data,succFn,jsonp){

	var rand = String(Math.random());

	var fnName ="cai"+new Date().getTime()+"_"+rand.replace(".","");
	//window代表全局
	window[fnName] = succFn;

	//拼路径
	data[jsonp] = fnName;

	var api = toUrl(url,data);

	var s1 = document.createElement("script");
	s1.src = api;

	document.getElementsByTagName("head")[0].appendChild(s1);

	document.getElementsByTagName("head")[0].removeChild(s1);
}

function fnAjax(obj){
	var data = obj.data||{};
	var succFn = obj.success||false;
	var failFn = obj.failFn||false;
	var jsonp = obj.jsonp||"callback";
	if (obj.dataType=="jsonp"){

		fnJsonp(obj.url,data,succFn,jsonp);
		return;
	}
	var sendType = obj.sendType||"get";
	
	var url = toUrl(obj.url,data);

	//1.有个手机
	if (window.XMLHttpRequest){
		//现代
		var ajax = new XMLHttpRequest();
	}else{
		//ie的
		var ajax = new ActiveXObject("Msxml2.XMLHTTP");//ie下的ajax处理
	}


	//2.拨号
	if (sendType=="get"){
		//get
		ajax.open("get",url,true);
		ajax.send(null);
	}else{
		//post
		var urlArr = url.split("?");
		ajax.open("post",urlArr[0],true);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		//3.发送
		ajax.send(urlArr[1]);
	}
	
	//4.检测状态
	ajax.onreadystatechange = function (){
		//发送的状态
		if (ajax.readyState==4){

			if (ajax.status>=200&&ajax.status<=207||ajax.status==304){

				// alert();
				if (succFn){
					succFn(ajax.responseText);
				}
			}else{

				if (failFn){
					failFn(ajax.status);
				}
			}
		}
	}
}



