/**
 * Created by cyg on 13/10/2015.
 */
var MY_PROJECT_ATTACHMENT_PREVIEW_ROUTE = (function(){
    var fileUrl = "";
    var fileId = "";
    var fileType = "";
    var ownerName = null;
    var projectName = null;

    function requestServer(url, method, form, callback) {
        $.ajax({
            url: url,
            dataType: 'json',
            type: method,
            data: form,
            xhrFields: {
                withCredentials: true
            },
            success: callback,
            error: function(xhr, type){
                alert('Failed to load file');
            }
        });
    }

    function showPreview() {
        if (fileType != 'txt' & fileType != 'md') return;

        requestServer(fileUrl, 'GET', undefined, function(data){
            if (data.code == 0) {
                if (fileType == 'md') {
                    var previewUrl = API_DOMAIN + "/api/markdown/preview?toc=true";
                    requestServer(previewUrl, 'POST', {content: data.data.content}, function(previewData){
                        if (previewData.code == 0) {
                            data.data.content = previewData.data;
                            assembleDOM(data.data);
                        }
                    });
                } else {
                    data.data.content = "<pre style='border:0px;background-color:white;padding:0;'>" + data.data.content + "</pre>";
                    assembleDOM(data.data);
                }
            } else {
                alert('该文件不存在！');
                router.run.call(router, '/u/'+ownerName+'/p/'+projectName+'/attachment');
            }
        });
    }

    function assembleDOM(json) {
        var data = {
            isText: fileType === 'md' || fileType === 'txt',
            fileType: fileType,
            file: json.file,
            content: json.content
        };
        var rendered = Mustache.render($('#tPreview').html(), data);
        $('#tcontainer').append(rendered);
    }

    return {
        template_url: '/views/my_project_attachment_preview.html',
        context: ".container",
        before_enter: function(){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
        },
        on_enter: function(user, project, parentId, fileId, type){
            fileUrl = API_DOMAIN + '/api/user/' + user + '/project/' + project + '/files/' + fileId + '/view';
            fileId = fileId;
            fileType = type;
            ownerName = user;
            projectName = project;

            showPreview();
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            coding.showBanner();
        }
    };
})();
