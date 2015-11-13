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
    coding.projectHomePath = function(userName, projectName, project){
        if(project){
            var url = '/u/';
            url += project.owner_user_name;
            url += '/p/';
            url += project.name;
            return url;
        }
        return '/u/'+userName+'/p/'+projectName;
    }


    // 显示主logo
    coding.showBanner = function(){
        $("#main_header").hide();
        $("#main_banner").show();
    }

    // 显示项目导航栏
    coding.showProjectBreadcrumb = function(project){
        var content = [];
        var userHomePath = '/u/'+project.owner_user_name;
        content.push("<a><img src='"+coding.assetPath(project.icon)+"' class='r-2x' style='width:22px;height:22px;margin-right:6px;'/></a>");
        content.push("<span class='text-md '><a class='text-primary' href='"+userHomePath+"'>"+project.owner_user_name+"</a></span>");
        content.push("<span class='text-md '>/</span>");
        content.push("<span class='text-md text-primary'><a class='text-primary' href='"+coding.projectHomePath(null,null,project)+"'>"+project.name+"</a></span>");
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
        "ProjectFileComment": "文件的评论",
        "Task": "任务",
        "TaskComment": "任务的评论",
        "Depot": "项目",
        "MergeRequestBean":"项目"
    };
    // 增加动态用到的一些字段, 如 target_type 的中文描述, 以及不完善的content
    coding.addActivityData = function(obj){
        obj.target_type_desc = type_desc[obj.target_type] || '';
        if(obj.target_type=='ProjectTopic'){
            if (obj.action=='comment') {
                obj.target_type_desc += ' ' + obj.project_topic.parent.title;
                obj.content = commentToText(obj.project_topic.content,true);
            } else {
                obj.content = obj.project_topic.title;
            }
        }

        if(obj.target_type=='Task'){
            obj.content = obj.task.title;
            //去掉更新任务描述，截至日期，优先级这些动态，末尾多余的“任务”两个字
            if (obj.action == "update_description" || obj.action == "update_priority" || obj.action == "update_deadline"){
                obj.target_type_desc = "";
            }
        }
        if(obj.target_type=='TaskComment'){
            obj.content = commentToText(obj.taskComment.content,true);
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

    /**
     * 把复杂 html 转换为一行文本，图片替换为 [图片]，表情替换为 [哈哈] 之类
     * @param content
     * @param limit
     * @returns {*}
     */
    var commentToText = function (content, simple_format) {
        var html = $('<span>' + content + '</span>');

        //replace image
        html.find('img').each(function () {
            var self = $(this);
            var title = self.attr('title') || '图片';
            self.replaceWith('[' + title + ']');
        });

        //replace link
        html.find('a').each(function () {
            var self = $(this);
            var html = self.text();
            if ($.trim(html)) {
                var text = html.text && html.text() || html;
                if (!simple_format) {
                    var href = self.attr('href');
                    text = ['[', text, '@@', href, ']'].join('');
                }
                self.replaceWith(text);
            } else {
                self.remove();
            }
        });

        //replace code
        html.find('code').each(function () {
            var self = $(this);
            self.replaceWith('[代码]');
        });
        html = $('<div></div>').html(html).html();

        //filter all html tag;
        html = $('<div>' + html + '</div>').text();;
        if (!simple_format) {
            //reset link tag
            var link_reg = /\[(\S+?)\@{2}(\S+?)\]/ig;
            html = html.replace(link_reg, function (m, m1, m2, index, origin) {
                if (m1 && m2) {
                    return ['<a href="', m2, '" target="_blank">', m1, '</a>'].join('');
                }
                return origin;
            });
        }
        return html;
    };

    //动态跳转逻辑部分
    coding.addActivityTargetPath = function(obj){
        if (obj.action.indexOf('delete') != -1) {
            return obj;
        }
        var targetType = obj.target_type || '';

        if (targetType == 'ProjectTopic'){
            obj.target_path = obj.action == 'comment' ? obj.project_topic.parent.path : obj.project_topic.path;
        }

        if ((targetType == 'Task') || (targetType == 'TaskComment')){
            obj.target_path = obj.task.path;
        }

        if (targetType == 'ProjectMember'){
            obj.target_path = obj.target_user.path;
        }

        if (targetType == 'ProjectFile'){
            var fileName = obj.file.name,
                filePath = obj.file.path;
            var pathComponents = filePath.split("/");
            if (pathComponents.length == 9){
                if (fileName.endsWith('txt')){
                    filePath += "/txt";
                } else if (fileName.endsWith('md')){
                    filePath += "/md"
                } else {
                    //是个文件操作，但暂时又不支持预览的，就先跳转到其父文件夹中
                    filePath = "";
                    for (var i = 1; i < 7; i++) {
                        filePath += "/" + pathComponents[i];
                    }
                }
            }
            obj.target_path = filePath;
        }

        return obj;
    }

    // Ajax GET
    coding.get = function(url, success, fail, complete, options){
        return ajax('GET', url, null, success, fail, complete, options);
    }
    coding.post = function(url, data, success, fail, complete, options){
        return ajax('POST', url, data, success, fail, complete, options);
    }
    coding.put = function(url, data, success, fail, complete, options){
        return ajax('PUT', url, data, success, fail, complete, options);
    }
    coding.delete = function(url, success, fail, complete, options){
        return ajax('DELETE', url, null, success, fail, complete, options);
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
        return $.ajax(params);
    }

    window.coding = coding;
})();
