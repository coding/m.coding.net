/**
 * Created by simonykq on 15/03/2015.
 */
var MY_PROJECT_GIT_MERGE_ROUTE = (function(){

    var ownerName,
        projectName,
        pageCount = 1,
        status = 'open';
    var type_list = {'code':'阅读代码', 'merge':'合并请求'};
    
    function loadProject(){
       var path = '/api/user/' + ownerName + '/project/' + projectName;
       var success = function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              getProjectMerge();
          }
	   };
       coding.get(path, success);
    }
    
    function getProjectMerge() {
        coding.loading();
        
        pageCount++;
        
        var path = '/api/user/'+ownerName +'/project/' + projectName + '/git/merges/'+status;
        path += '?page=' + pageCount + '&' + 'pageSize=20';
        var successed = function(data){
            if(data.data){
                assembleDOM(data.data);
            }
        }
        coding.get(path, successed, null, coding.loadingDone);

    }
    
    function assembleDOM(data){
        for(var i =0; i< data.list.length;i++){
            if(pageCount == 1 && i == 0){
                data.list[i].isFirst = true;
            }
            data.list[i].display = moment(data.list[i].created_at).fromNow();
            if(data.list[i].merge_status=='ACCEPTED'){
                data.list[i].isAccepted = true;
            } else if(data.list[i].merge_status=='REFUSED'){
                data.list[i].isRefused = true;
            } else if(data.list[i].merge_status=='CANNOTMERGE'){
                data.list[i].isCannotMerge = true;
            } else {// if(data.list[i].merge_status=='Open'){
                data.list[i].isOpen = true;
            }
        }
        var rendered = Mustache.render($('#tlist').html(), data);
        $('#tcontainer').html(rendered);
    }

    function reset(stat){
        pageCount = 0;
        status    = stat;
        var txt = $('select.status').find('option:selected').text();
        $("#status_text").text(txt);
    }

    function refresh(){
        $("#tcontainer").html('');
        getProjectMerge();
    }


    return {
        template_url: '/views/my_project_git_merge.html',
        context: ".container",
        before_enter: function(user, project, id){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            pageCount = 0;
            lastType = "merge"
            
        },
        on_enter: function(user, project, id){
            ownerName = user;
            projectName = project;

 
            var path = coding.projectHomePath(ownerName, projectName)+'/git/';
            var data = {list:[]};
            $.each(type_list, function(k,v){
               data.list.push({href:path+k,name:v,active:k==lastType});
            });

            var rendered = Mustache.render($('#theader').html(), data);
            $("nav.main-navbar").after(rendered);
            
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
