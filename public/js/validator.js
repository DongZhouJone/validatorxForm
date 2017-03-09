(function(global, factory) {

	if (typeof module === "object" && typeof module.exports === "object") {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory(global, true) :
			function(w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
				return factory(w);
			};
	} else {
		factory(global);
	}

	// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window) {


	var doc = window.document;
	var vali = function(opts){
		return new vali.prototype.init(opts);
	}

	var json =  {type: 1, check: false}

	vali.prototype = {
		constructor: vali,
		init:function(opts){	//初始化
			//检查参数与外接库接口
			if(typeof opts == 'undefined') return this;
			var _this = this,form = $(opts.form);
			var type=opts.checkType;
		//	console.log(checkType)	success
		//	console.log(json.check)
			if(!form) return false;
			this.form = form;
			this.formCheckList = this.form.querySelectorAll( "input,select,textarea" );
			//自定义正则
			this.detialPatternList = {
				name : {
					pattern:"[\u4E00-\u9FA5]{2,5}",
					tipText : "用户名格式错误"
				},
				password:{
					pattern:"^[a-zA-Z0-9\_\-\~\!\%\*\@\#\$\&\.\(\)\[\]\{\}\<\>\?\\\/\]{3,20}$",
					tipText : "密码格式错误"
				},
				email:{
					pattern:"\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\.\\w+([-.]\\w+)*",
					tipText : "邮箱格式错误"
				},
				zipcode: {
					pattern: "^[0-9]\d{5}$",
					tipText : "邮政编码错误"
				} 

			};


			this.setForm();	//重置表单
			this.setInputPattern();	//查询所有表单自带验证
		},

		setForm : function(){
			var that = this;
			this.form.setAttribute( "novalidate",true );
			
			this.form.onsubmit = function(){
				return that.checkAll();
			}
		},

		setInputPattern : function(){
			var formCheckList = this.formCheckList;
			for( var i=0; i<formCheckList.length; i++ ){
				var type = formCheckList[i].name;
				if( this.detialPatternList[type] ){
					console.log()
					if( !formCheckList[i].getAttribute( "pattern") ){
						formCheckList[i].setAttribute( "pattern",this.detialPatternList[type].pattern );
						formCheckList[i].setAttribute( "tiptext",this.detialPatternList[type].tipText );
					}
					
				}
				var span = document.createElement("span")
				span.className = "tip";

				formCheckList[i].parentNode.appendChild( span )
			}
		},

		/**
		 * [check 验证方法]
		 * @param  {[dom]} item [验证的项]
		 * @return {[boolean]}      [布尔值是否正确]
		 */
		check : function( item ){
			var required = item.getAttribute( "required" );
				console.log(required)
			//console.log( required ) 
			if( required != null ){
				if( item.value != "" ){
					if( item.checkValidity() ){
						return {
							type : 1,
							check : true
						};
					}else{
						return {
							type : 2,
							check : false
						};
					}
				}else{
					return {
						type : 1,
						check : false
					};
				}
				
			}else{

				if( item.value == "" ) {
					return {
						type : 1,
						check : true
					};
				}else{
					return {
						type : 2,
						check : item.checkValidity()
					}
				}
				
				
			}
		},

		checkAll : function(){
			var formCheckList = this.formCheckList;
			var checkFlg = true;
			for( var i=0; i<formCheckList.length; i++ ){
				var checkJSON = this.check( formCheckList[i] );
				//console.log( checkJSON )
				
				if( !checkJSON.check ){
					this.checkTip( formCheckList[i],checkJSON.type )
					checkFlg = false;
				}else{
					formCheckList[i].parentNode.querySelector(".tip").innerText="√";
				}
			}
			return checkFlg;
		},
		/**
		 * 
		 * 验证提示
		 * @param  {[dom]} item [错误的input]
		 * @param  {[number]} type [错误类型1：为空验证；2：格式错误]
		 * @return {[type]}      [description]
		 */
		checkTip : function( item,type ){

			if( type == 1 ){
				item.parentNode.querySelector(".tip").innerText = item.getAttribute("required");
			}else if( type == 2 ){
				item.parentNode.querySelector(".tip").innerText = item.getAttribute("tiptext");
			}

		}
	}

	vali.prototype.init.prototype = vali.prototype;
	window.vali = vali;
	/**********************自定义函数工具方法**************************/
	function $(id){
		return typeof id == 'string' ? document.getElementById(id) : id;
	};
	function $$(oClass,parent,nodename){
		var i=0,len=0,re=[],els;
		nodename = nodename || '*';
		parent = parent || doc;
		els = parent.getElementsByTagName(nodename);
		for(len=els.length;i<len;i++){
			if(hasClass(els[i],oClass)) re.push(els[i]);
		};
		return re;
	};
	function isFunction(obj){
		return typeof obj == 'function';
	};
	function trim(str){
		return str.replace(/^\s+|\s+$/,'').replace(/\s+/,' ');
	};
	function preventDefault(e){
		e = e || window.event;
		if(e.preventDefault){
			e.preventDefault();
		}else{
			e.returnValue = false;
		};
	};
	function hasClass(el,oClass){
		oClass  = ' '+ oClass + ' ';
		return (' '+el.className + ' ').indexOf(oClass) > -1 ? true : false;
	};
	function addClass(el,oClass){
		var C = trim(oClass).split(' '),eClass = el.className,i=0,len=C.length;
		for(;i<len;i++){
			if(!hasClass(el,C[i])){
				eClass+=' '+C[i];
			};
		};
		el.className = trim(eClass);
	};
	function removeClass(el,oClass){
		var C = trim(oClass).split(' '),eClass = el.className,i=0,len=C.length;
		for(;i<len;i++){
			if(hasClass(el,C[i])){
				eClass = eClass.replace(C[i],'');
			};
		};
		el.className = trim(eClass);
	};
	function createXhr(){
		if(typeof XMLHttpRequest != 'undefined'){
			return new XMLHttpRequest();
		}else{
			var xhr = null;
			try{
				xhr = new ActiveXObject('MSXML2.XmlHttp.6.0');
				return xhr;
			}catch(e){
				try{
					xhr  = new ActiveXObject('MSXML2.XmlHttp.3.0');
					return xhr;
				}catch(e){
					throw Error('cannot create XMLHttp object!');
				};
			};
		};
	};
	function ajax(opts){
		var set = extend({
			url:'',
			data:'',
			type:'GET',
			timeout:5000,
			onbeforerequest:function(){},
			onsuccess:function(){},
			onnotmodified:function(){},
			onfailure:function(){}
		},opts||{});
		var xhr = createXhr();
		if((set.type).toUpperCase() == 'GET'){
			if(set.data){
				set.url += (set.url.indexOf('?') >= 0 ? '&' : '?') + set.data;
				set.data = null;
			};
			if(set.noCache){
				set.url+=(set.url.indexOf('?') >= 0 ? '&' : '?')+'t='+(+new Date());
			};
		};
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >= 200 && xhr.status < 300){
					set.onsuccess.call(xhr);
				}else if(xhr.status == 304){
					set.onnotmodified.call(xhr);
				}else{
					set.onfailure.call(xhr);
				};
			};
		};
		xhr.open(set.type,set.url);
		if((set.type).toUpperCase() == 'POST'){
			xhr.setRequestHeader('content-Type','application/x-www-form-urlencoded');
		}
		set.onbeforerequest();
		if(set.timeout){
			setTimeout(function(){
				xhr.onreadystatechange = function(){};
				xhr.abort();
				set.onfailure();
			},set.timeout);
		};
		xhr.send(set.data);
	};
	
	function encodeNameAndValue(sName,sValue){
		return encodeURIComponent(sName)+'='+encodeURIComponent(sValue);
	};
	//序列化表单
	function serializeForm(form){
		var oForm = $(form),els = oForm.elements,len=els.length,i=0;
		var re = [];
		for(;i<len;i++){
			var el = els[i];
			switch(el.type){
				case 'select-one' :
				case 'select-multipe':
					 for(var j=0,l=el.options.length;j<l;j++){
					 	var opt = el.options[j];
						if(opt.selected){
							var v = '';
							if(opt.hasAttribute){
								v = opt.hasAttribute('value') ? opt.value : opt.text;
							}else{
								v = opt.attributes['value'].specified ? opt.value : opt.text;
							};
							re.push(encodeNameAndValue(el.name,v));
						}
					 };
					 break;
				case undefined :
				case 'fieldset' :
				case 'button' :
				case 'submit' :
				case 'reset' :
				case 'file' :
					 break;
				case 'checkbox' :
				case 'radio' :
					 if(!el.checked){
					 	break;
					 };
				default :
					 re.push(encodeNameAndValue(el.name,el.value));
					 break;
			};
		};
		return re.join('&');
	};
	//以ajax的形式提交表单
	function ajaxForm(form,onsuccess){
		ajax({
			type:form.method,
			url:form.action,
			data:serializeForm(form),
			onsuccess:onsuccess
		});
	};
	function hide(el){
		el && (el.style.display = 'none');
	};
	function show(el){
		el && (el.style.cssText = 'inline-block;*display:inline;*zoom:1;');
	};
	function extend(target,source){
		for(var key in source){
			target[key] = source[key];
		};
		return target;
	};
	function addEvent(el,type,fn){
		if(typeof el.addEventListener != 'undefined'){
			el.addEventListener(type,fn,false);
		}else if(typeof el.attachEvent != 'undefined'){
			el.attachEvent('on'+type,fn);
		}else{
			el['on'+type] = fn;
		};
	};
	function removeEvent(el,type,fn){
		if(typeof el.removeEventListener != 'undefined'){
			el.removeEventListener(type,fn,false);
		}else if(typeof el.detachEvent != 'undefined'){
			el.detachEvent('on'+type,fn);
		}else{
			el['on'+type] = null;
		};
	};
	function fireEvent(el,type){
	    if(typeof document.createEventObject == 'object'){
	        return el.fireEvent('on'+type);
	    }else{
	        var e = document.createEvent('HTMLEvents');
	        e.initEvent(type,true,true);
	        return !el.dispatchEvent(e);
	    };
	};

}));