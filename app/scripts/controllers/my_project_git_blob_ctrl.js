/**
 * Created by simonykq on 15/03/2015.
 */
var MY_PROJECT_GIT_BLOB_ROUTE = (function(){

    var ownerName,
        projectName,
        pageCount = 1,
        status = 'open';
    var lastType = 'code';
    var commit = 'master';
    var treePath = '';       
    var type_list = {'home':'项目介绍','code':'阅读代码', 'merge':'合并请求'};
    
    function loadProject(){
       var path = '/api/user/' + ownerName + '/project/' + projectName;
       var success = function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              getProjectBlob();
          }
	   };
       coding.get(path, success);
    }
    
    function getProjectBlob() {
        
        pageCount++;
        
        var path = '/api/user/'+ownerName +'/project/' + projectName + '/git/blob/' + commit +'/'+treePath;;

        var successed = function(data){
            if(data.data){
                assembleDOM(data.data);
            }
        }
        coding.get(path, successed);

    }
    
    function assembleDOM(data){
        var file = data['file'];
        if(file.mode==='file'){
            var source   = file.data,
                language = file.lang,
                result = hljs.getLanguage(language) ? hljs.highlight(language, source) : hljs.highlightAuto(source),
                code   = result.value,
                line = 1;
                code = code.replace(/^/gm, function() {
                    return '<span class="line-number-position">&#x200b;<span class="line-number">' + line++ + '</span></span>';
                });
                $('code.hljs').html(code);
        }else{

            var path = file.path,
                asset_path = API_DOMAIN + '/u/' + ownerName + '/p/' + projectName + '/git/raw/' + commit + '/' + treePath;

            $('pre').replaceWith('<div class="text-center"><img width="300" src=' + asset_path + '></div>');
        
        }
    }

    function reset(stat){
        pageCount = 0;
        status    = stat;
    }

    function refresh(){
        $("#tcontainer").html('');
        getProjectMerge();
    }


    return {
        template_url: '/views/my_project_git_blob.html',
        context: ".container",
        before_enter: function(user, project, id){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            pageCount = 0;
            lastType = "code"
            
        },
        on_enter: function(user, project, commit, path){
            ownerName = user;
            projectName = project;
            lastType = 'code';
            commit = commit;
            treePath = treePath = (path || '').replace(/%2F/g,'/');
 
            var path = coding.projectHomePath(ownerName, projectName)+'/git/';
            var data = {list:[]};
            $.each(type_list, function(k,v){
               data.list.push({href:path+k,name:v,active:k==lastType});
            });

            // var rendered = Mustache.render($('#theader').html(), data);
            // $("nav.main-navbar").after(rendered);
            
            loadProject();
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadFolders();
            });
            
            $('select.status').on('change',function(e){
                e.preventDefault();
                reset($(this).val());
                refresh();
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            coding.showBanner();
        }
    }
   
})();
