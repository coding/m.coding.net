(function() {
  var History, last_route,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  window.Routy || (window.Routy = {});

  History = window.History;

  last_route = {};

  Routy.Router = (function() {
    Router.prototype.actions = [];

    Router.prototype["default"] = null;

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
      var router;
      router = this;
      $(window).load(function(e) {
        return router.run.call(router, '/');
      });
      this.context_selector.on(this.event, this.state_changers_selector, function(e) {
        var href;
        e.preventDefault();
        href = $(this).attr('href') || $(this).children('a').attr('href');
        return router.run.call(router, href, e.type);
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
      var after, before, context, enter, events, exit, new_route, template_url;
      template_url = route.template_url;
      events = route.events || this.event.split(' ');
      context = route.context;
      before = route.before_enter;
      enter = route.on_enter;
      after = route.after_enter;
      exit = route.on_exit;
      new_route = new Routy.Action(uri, template_url, events, $(context), this, before, enter, after, exit);
      if (route["default"]) {
        this["default"] = uri;
      }
      return this.actions.push(new_route);
    };

    Router.prototype.rootRegister = function(template, callback) {
      return this.register('', template, callback);
    };

    Router.prototype.run = function(uri, event) {
      var action, match, regex, route, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        if (!event || (event && (__indexOf.call(action.events, event) >= 0))) {
          _ref1 = action.route;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            route = _ref1[_j];
            regex = (this.pathRegExp(route, {})).regexp;
            match = uri.match(regex);
            if (match != null) {
              this.go(uri);
              match.shift();
              return action.call.apply(action, match);
            }
          }
        }
      }
      if (this["default"]) {
        return this.run(this["default"]);
      }
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

    Action.prototype.before_callback = null;

    Action.prototype.after_callback = null;

    Action.prototype.condition = null;

    Action.prototype.on_exit_callback = null;

    Action.prototype.events = [];

    function Action(routes, template_url, events, context, router, before_callback, callback, after_callback, on_exit_callback) {
      var arr, route, _i, _len;
      this.template_url = template_url;
      this.events = events;
      this.context = context;
      this.router = router;
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
      console.log(this.route);
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
      if (!this.template) {
        return $.get(this.template_url, function(template) {
          _this.template = template;
          return _this.digest(args);
        });
      } else {
        return this.digest(args);
      }
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
