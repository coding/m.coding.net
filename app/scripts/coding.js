// 代码中有大量通用代码.
// 公用的写到这里吧...
(function(){
	var coding = {};
	
	var defaultLoadingButtonId = '#load_more';
	var defaultLoadingText = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...';
	var defaultLoadingDoneText = '加载更多';
	
	// 开始加载事件
	// 一般修改加载按钮内容
	coding.loading = function(){
		$(defaultLoadingButtonId).html(defaultLoadingText);
	};
	
	//　默认加载完成后的complate事件
	// 一般为修改loading按钮内容
	coding.loadingDone = function(){
		$(defaultLoadingButtonId).text(defaultLoadingDoneText);
	};
	
	// 用户私有项目主页地址
	// 因项目中用的到地方太多, 所以在此统一返回, 方便以后修改.
	coding.projectHomePath = function(userName, projectName, data){
		return '/i/'+userName+'/p/'+projectName;
	}
	
	// 显示主logo
	coding.showBanner = function(){
		$("#main_header").hide();
		$("#main_banner").show();
	}
	
	// 显示项目导航栏
	coding.showProjectBreadcrumb = function(project){
		var content = [];
		var userHomePath = '/u/projects';
		content.push("<a><img src='"+coding.assetPath(project.icon)+"' class='r-2x' style='width:22px;height:22px;margin-right:6px;'/></a>");
		content.push("<span class='text-md '><a class='text-primary' href='"+userHomePath+"'>"+project.owner_user_name+"</a></span>");
		content.push("<span class='text-md '>/</span>");
		content.push("<span class='text-md text-primary'><a class='text-primary' href='"+coding.projectHomePath(project.owner_user_name, project.name)+"'>"+project.name+"</a></span>");
		$("#main_banner").hide();
		$("#main_header").html(content.join("\n")).css('display', 'inline-block');
	}
	
	coding.assetPath = function(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }
	coding.truncateText = function(text, length){
        return text.length < length ? text : text.substr(0,length) + '...';
    }
	var type_desc = {
        "Project": "项目",
        "ProjectTopic": "讨论",
        "ProjectMember": "项目成员",
        "ProjectFile": "文件",
        "Task": "任务",
		"Depot": "项目",
		"MergeRequestBean":"项目"
    };
	// 增加动态用到的一些字段, 如 target_type 的中文描述, 以及不完善的content
	coding.addActivityData = function(obj){
		obj.target_type_desc = type_desc[obj.target_type] || '';
        if(obj.target_type=='ProjectTopic' && obj.action=='comment'){
            obj.target_type_desc += ' ' + obj.project_topic.parent.title;
            obj.content = obj.project_topic.content;
        }
        if(obj.target_type=='ProjectTopic' && obj.action=='create'){
            obj.content = obj.project_topic.title;
        }
        if(obj.target_type=='Task'){
            obj.content = obj.task.title;
        }
        if(obj.target_type=='TaskComment'){
            obj.content = obj.taskComment.content;
        }
        if(obj.target_type == 'Depot'){
            obj.target_type_desc += ' 分支'+obj.ref;
            if(obj.commits && obj.commits.length){
                obj.content = obj.user.name + ': ['+obj.commits[0].sha.substring(0,10)+']' + obj.commits[0].short_message ; 
            }
        }
		if(obj.target_type == 'MergeRequestBean'){
			obj.target_type_desc += obj.depot.name + '的Merge Request';
			obj.content = obj.merge_request_title;
		}
		return obj;
	}
	
	// Ajax GET
	coding.get = function(url, success, fail, complete, options){
		ajax('GET', url, null, success, fail, complete, options);
	}
	coding.post = function(url, data, success, fail, complete, options){
		ajax('POST', url, data, success, fail, complete, options);
	}	
	coding.put = function(url, data, success, fail, complete, options){
		ajax('PUT', url, data, success, fail, complete, options);
	}
	coding.delete = function(url, success, fail, complete, options){
		ajax('DELETE', url, null, success, fail, complete, options);
	}
	
	var ajax = function(method, url, data, success, fail, complete, options){
		if(url.substr(0,1) === '/'){
			url = API_DOMAIN + url;
		}
		fail = typeof(fail) == 'function' ? fail : function(){alert('Failed to load data')};
		var params = {
            url: url,
			type: method,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
				if(typeof(success) === 'function'){
					success(data);
				}
            },
            error: function(xhr, type){
                fail();
            },
		    complete: function(){
				if(typeof(complete) === 'function'){
					complete();
				}
		    }
        };		
		if(data){
			params['data'] = data;
		}
		if($.isPlainObject(options)){
			$.each(options, function(k,v){
				params[k] = v;
			});
		}
		$.ajax(params);
		
	}
	
	window.coding = coding;
})();