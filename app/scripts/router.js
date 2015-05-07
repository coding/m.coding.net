(function() {
  var History, last_route,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  window.Routy || (window.Routy = {});

  History = window.History;

  last_route = {};

  Routy.Router = (function() {
    Router.prototype.actions = [];

    function Router(context, state_changers_selector, context_selector, event) {
      this.state_changers_selector = state_changers_selector;
      this.event = event;
      context || (context = '');
      if (context !== '') {
        if (context[0] === '/') {
          context = context.substr(1);
        }
        if (context.substr(-1) === '/') {
          context = context.substr(0, context.length - 1);
        }
      }
      this.context = context;
      this.state_changers_selector || (this.state_changers_selector = 'a');
      context_selector || (context_selector = document);
      this.context_selector = $(context_selector);
      this.event || (this.event = 'click');
      this.attach();
    }

    Router.prototype.apply_context = function(url) {
      if (url !== '') {
        if (url[0] !== '/') {
          url = this.context + url;
        } else {
          url = this.context + url;
        }
      } else {
        url = this.context + '/';
      }
      return url;
    };

    Router.prototype.attach = function() {
      var router,
        _this = this;
      router = this;
      $(window).load(function(e) {
        return router.run.call(router, window.location.pathname);
      });
      this.context_selector.on(this.event, this.state_changers_selector, function(e) {
        var href;
        href = $(this).attr('href') || $(this).children('a').attr('href') || '';
        if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0 || href === '') {

        } else {
          e.preventDefault();
          if (href != null) {
            return router.run.call(router, href, e.type);
          }
        }
      });
      return $(window).bind('popstate', function(e) {
        return router.run.call(router, e.state['state']);
      });
    };

    Router.prototype.go = function(url, title, data) {
      var hash;
      hash = data || {};
      hash['state'] = url;
      return window.history.pushState(hash, title || document.title, url);
    };

    Router.prototype.register = function(uri, route) {
      var after, before, context, enter, events, exit, new_route, resolve, template_url;
      template_url = route.template_url;
      events = route.events || this.event.split(' ');
      context = route.context;
      resolve = route.resolve;
      before = route.before_enter;
      enter = route.on_enter;
      after = route.after_enter;
      exit = route.on_exit;
      new_route = new Routy.Action(uri, template_url, events, $(context), this, resolve, before, enter, after, exit);
      return this.actions.push(new_route);
    };

    Router.prototype.rootRegister = function(route) {
      return this.register('/', route);
    };

    Router.prototype.run = function(uri, event) {
      var _this = this;
      return $.ajax({
        url: API_DOMAIN + '/api/current_user',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      }).done(function(data) {
        if (data.data) {
          if (!_this.current_user) {
            _this.current_user = data.data;
            return _this.updateDOM(_this.current_user);
          }
        }
      }).fail(function() {
        return alert('Failed to load current user');
      }).always(function() {
        var action, match, regex, route, _i, _j, _len, _len1, _ref, _ref1;
        _ref = _this.actions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          if (!event || (event && (__indexOf.call(action.events, event) >= 0))) {
            _ref1 = action.route;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              route = _ref1[_j];
              regex = (_this.pathRegExp(route, {})).regexp;
              match = uri.match(regex);
              if (match != null) {
                _this.go(uri);
                match.shift();
                return action.call.apply(action, match);
              }
            }
          }
        }
        return _this.run('/');
      });
    };

    Router.prototype.updateDOM = function(current_user) {
      var $user, template;
      $('#navigator a.login').removeClass('btn-success').removeClass('login').removeAttr('href').addClass('btn-danger').addClass('logout').text('退出登录').click(function(e) {
        return $.ajax({
          url: API_DOMAIN + '/api/logout',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          }
        }).done(function() {
          return location.reload();
        }).fail(function() {
          return alert('Failed to logout');
        });
      });
      $('#navigator a.register').hide();
      template = '<li>\
                        <a class="items" href="#">\
                            <img class="current_user" src="#" height="22" width="22" />\
                            <span></span>\
                            <img class="right_arrow" src="/images/static/right_arrow.png" height="20" width="20" />\
                        </a>\
                    </li>';
      $user = $(template);
      $user.find('a.items').attr('href', '/user/' + current_user['global_key']);
      $user.find('img.current_user').attr('src', current_user['avatar']);
      $user.find('span').text(current_user['name']);
      return $('li.divider').before($user);
    };

    Router.prototype.pathRegExp = function(path, opts) {
      var insensitive, keys, ret;
      insensitive = opts.caseInsensitiveMatch;
      ret = {
        originalPath: path,
        regexp: path
      };
      keys = ret.keys = [];
      path = path.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
        var optional, star;
        optional = (option === "?" ? option : null);
        star = (option === "*" ? option : null);
        keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || "";
        return "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (star && "(.+?)" || "([^/]+)") + (optional || "") + ")" + (optional || "");
      }).replace(/([\/$\*])/g, "\\$1");
      ret.regexp = new RegExp("^" + path + "$", (insensitive ? "i" : ""));
      return ret;
    };

    return Router;

  })();

  Routy.Action = (function() {
    Action.prototype.route = [];

    Action.prototype.context = $("body");

    Action.prototype.template_url = null;

    Action.prototype.template = null;

    Action.prototype.callback = null;

    Action.prototype.resolve = null;

    Action.prototype.before_callback = null;

    Action.prototype.after_callback = null;

    Action.prototype.condition = null;

    Action.prototype.on_exit_callback = null;

    Action.prototype.events = [];

    function Action(routes, template_url, events, context, router, resolve, before_callback, callback, after_callback, on_exit_callback) {
      var arr, route, _i, _len;
      this.template_url = template_url;
      this.events = events;
      this.context = context;
      this.router = router;
      this.resolve = resolve;
      this.before_callback = before_callback;
      this.callback = callback;
      this.after_callback = after_callback;
      this.on_exit_callback = on_exit_callback;
      if (typeof routes === 'string') {
        routes = routes.split(', ');
      }
      arr = [];
      this.events = this.events || [];
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        route = this.router.apply_context(route);
        arr.push(route);
      }
      this.route = arr;
    }

    Action.prototype.call = function() {
      var args, result,
        _this = this;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = true;
      if (this.condition) {
        result = this.condition.apply(this, args);
      }
      if (!result) {
        false;
      }
      if (this.resolve) {
        return this.resolve.apply(this, args).then(function(data) {
          if (data.data) {
            args.push(data.data);
            return _this.cacheTemplate(args);
          } else {
            return _this.cacheTemplate(args);
          }
        }, function() {
          return alert('Failed to resolve promise');
        }).then(function(data) {
          return _this.digest(data);
        });
      } else {
        return this.cacheTemplate(args).then(function(data) {
          return _this.digest(data);
        });
      }
    };

    Action.prototype.cacheTemplate = function(data) {
      var deferred,
        _this = this;
      deferred = $.Deferred();
      if (this.template) {
        deferred.resolve(data);
      } else {
        $.get(this.template_url, function(template) {
          _this.template = template;
          return deferred.resolve(data);
        });
      }
      return deferred.promise();
    };

    Action.prototype.digest = function(args) {
      if (last_route.on_exit_callback != null) {
        last_route.on_exit_callback.apply(this, args);
      }
      if (this.before_callback) {
        this.before_callback.apply(this, args);
      }
      this.context.html(this.template);
      this.callback.apply(this, args);
      if (this.after_callback) {
        this.after_callback.apply(this, args);
      }
      return last_route = this;
    };

    return Action;

  })();

}).call(this);
