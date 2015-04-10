# m.coding.net 项目介绍
此项目为m.coding.net的前端代码，后端api和coding.net一致，通过跨域ajax请求 https://coding.net 域名下的api实现数据通信。实际开发过程中可能会因为本地域名导致CORS限制以至于无法获取到数据。具体解决方案可查看[这里](#cors)。项目通过Yeoman生成代码模版，并可使用Grunt来完成类似构建，开启服务器之类的任务。项目的开发基于ZeptoJS框架，并实现了类似于AngularJS的前端HTML5模式路由。具体实现请参看其[源代码](app/scripts/router.coffee)

## 项目运行
Clone项目之后，执行以下步骤commands安装dependencies：

    npm install
    bower install
    
安装完dependencies之后，以开发环境运行项目：

    grunt serve

或以产品环境运行项目（minified js，css）:

    grunt serve:dist
    
或单纯的构建项目（不运行Grunt服务器）:

    grunt build

构建后的代码将在dist目录下，可运行以下命令清楚dist文件夹：

    grunt clean
    
## 项目结构   
    .
    ├── codin-mobile
    │   ├── app：所有应用程序代码
    │   │   ├── bower_components：前端 bower dependencies
    │   │   ├── fonts：所有的字体
    │   │   ├── images：所有的图片和icons
    │   │   ├── scripts: 所有的前端js代码  
    |   │   |   ├── vendor：第三方代码库
    |   │   |   ├── controllers：控制器，对应app中的各个页面
    │   │   ├── styles：所有的样式表
    │   │   ├── views：所有的视图，对应app/controllers中的每个controller
    │   ├── dist：app构建后的代码
    │   ├── node_modules：项目dependencies，包括grunt插件和其他开发工具都在这里
    │   ├── test：测试代码

## 关于CORS<a name="cors"></a>
如果是在本地环境下运行项目，则需要修改操作系统的hosts文件来跳过CORS设置。由于目前coding后台API的CORS设置只允许m.coding.net域名下的ajax请求，所以当在本地localhost运行项目的时候，所有的ajax请求将被拒绝，导致无法获取数据。可将操作系统的域名解析hosts文件进行如下修改，让m.coding.net指向本地，然后通过浏览器访问m.coding.net来实现本地开发：

    127.0.0.1       m.coding.net
注：由于hosts文件不支持端口设置，所以上述方法只有在当grunt server是在80端口上监听时才会生效

如果不想改变grunt server的默认端口（9000），则需要通过在本地设置http代理来实现本地开发。可在本地安装nginx来实现http代理。具体安装步骤可查看[nginx官网](http://wiki.nginx.org/Install)。安装完nginx之后，在nginx.conf的server directive下输入以下配置：

    location / {
        proxy_pass http://127.0.0.1:9000;        
    }
    
即可把所有发至m.coding.net的请求，代理到127.0.0.1:9000地址上，实现本地开发。

## 关于https
如果需要在本地环境下通过https访问m.coding.net，需要在完成上述步骤之后，为nginx加入https设置。在设置nginx之前，需要通过OpenSSL工具生成密钥和自签发https服务器证书。具体步骤网上有，很容易搜到。完成上述步骤后，打开之前的nginx.conf文件，在server directive下，输入以下配置：

    listen              443 ssl;
    server_name         m.coding.net;
    ssl_certificate     certificate.pem; //这个指向之前生成的自签发证书文件
    ssl_certificate_key key.pem; //这个指向之前生成的密钥文件
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    
设置完上述步骤后，打开浏览器，输入https://m.coding.net访问本地环境下运行的m.coding.net。
注：前提是grunt server已启动并在9000端口上运行。如果浏览器提示ssl证书不认可并有风险，可跳过提示并直接访问

