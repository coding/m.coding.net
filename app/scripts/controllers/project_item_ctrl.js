var PROJECT_ITEM_ROUTE = (function(){

    var projectData,
        ownerName,
        projectName;

    function loadProject(){

        var path = '/api/user/' + ownerName + '/project/' + projectName;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    projectData = data.data;
                    $('.row').html(createProjectDOM(projectData));
                }else{
                    alert('Failed to load project');
                }
            },
            error: function(xhr, type){
                alert('Failed to load project');
            }
        });
    }

    function loadReadme(){
        var path = '/api/user/' + ownerName + '/project/' + projectName + '/git/tree/master';

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    var readme = data.data['readme']['preview'];
                    $('#project_readme > .panel-body').html(readme);
                }else{
                    alert('Failed to load README file');
                }
            },
            error: function(xhr, type){
                alert('Failed to load README file');
            },
            complete: function(){
                $('span.loading').remove();
            }
        })
    }

    function createProjectDOM(pro){
        var template =  '<div class="col-xs-6">' +
                            '<p class="description">' +
                            '</p>' +
                            '<span class="updated_at">最后更新于</span>' +
                        '</div>' +
                        '<div class="col-xs-6">' +
                            '<ul class="pager" style="margin: 0">' +
                             '<li><a href="#" style="width:100%;"><img src="/images/static/read.png" height="20" width="25" /> 代码阅读</a></li>' +
                            '</ul>' +
                        '</div>',
            ele      = $(template);

        ele.find('p.description').text(pro['description']);
        //TODO: add time info using moment.js
        ele.find('.pager a').attr('href',pro['project_path'] + '/tree');

        return ele;
    }


    return {
        template_url: '/views/project_item.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){

            var path =  '/u/' + user + '/p/' +  project;
            //set up the page information in the banner
            $('title').text(user + '/' + project);
            //and those extra items in nav menu
            var nav_extra = '<li class="nav-divider"></li>' +
                            '<li><a href="#">项目主页</a></li>' +
                            '<li><a href="#">阅读代码</a></li>' +
                            '<li><a href="#">合并请求</a></li>' +
                            '<li><a href="#">项目讨论</a></li>',
                ele       = $(nav_extra);
            ele.eq(1).find('a').attr('href', path + '/git');
            ele.eq(2).find('a').attr('href', path + '/tree' );

            //active the current active item
            ele.eq(1).addClass('active');
            //add all extra items
            $("#navigator").append(ele);

            //add the project header
            var project_header = '<div class="page-header project_header">' +
                                    '<p class="text-center"></p>' +
                                '</div>';
            ele = $(project_header);
            ele.find('p').text(project);

            $("nav.navbar").after(ele);

        },
        on_enter: function(user, project){

            ownerName = user;
            projectName = project;

            loadProject();
            loadReadme();

        },
        on_exit: function(user, project){
            //clean up the nav menu
            $('title').text('');

            $('#navigator').find('li').removeClass('active');
            $('#navigator > li').slice(-5).remove();
            $('.project_header').remove();
        }
    }
})();
