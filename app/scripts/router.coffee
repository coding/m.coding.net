window.Routy or = {}
History = window.History

# The router, used to manage and store the actions
class Routy.Router

    # List of registered actions
    actions: []

    # Generate the router to a specific routing context
    # @state_changers_selector: String containing the selector of the elements that will trigger the pushState event
    # 	default: 'a' (all links)
    # context_selector: String containing the selector of the container of the elements that will trigger the pushState event
    #	default: 'document' (will search inside the document)
    constructor: (context, @state_changers_selector, context_selector)->

        # Let's clean the context variable
        context or = ''

        if context != ''
            if context[0] == '/'
                context = context.substr 1

            if context.substr(-1) == '/'
                context = context.substr 0, context.length-1

        @context = context

        @state_changers_selector or = 'a'

        context_selector or = document

        @context_selector = $ context_selector

        @attach()

    # Apply the current context to the specified url
    apply_context: (url)->
        if url != ''
            if url[0] != '/'
                url = @context + url
            else
                url = @context + url
        else
            url = @context + '/'

        url

    # Listen for clicks in the elements that will trigger the pushState event
    attach: ->
        # 'cause "this" will be replaced with the clicked element
        router = @

        # go to the route page by default
        $(window).load (e) ->
            router.go '/', @title
            router.run.apply router

        @context_selector.on 'click', @state_changers_selector, (e)->
            console.log(e);
            router.go @href, @title
            router.run.apply router

        # Create an anonymous function to call the router.run method so we can
        # pass the router as "this" variable
#        History.bind window, 'statechange', ->
#            console.log 'state changed!'
#            router.run.apply router

    # Redirect (using pushState) to a specific page
    go: (url, title, data)->
        window.history.pushState data or {}, title or document.title, url

    # Register a new action
    register: (route, template, callback) ->
        url = template.url
        context = template.context
        @actions.push new Routy.Action route, callback, url, $(context), @

    # delegate to register method
    rootRegister: (template, callback) ->
        @register('', template, callback)

    run: ->
        uri = window.location.pathname

        for action in @actions
            for route in action.route
                regex = (@pathRegExp route, {}).regexp
                match = uri.match(regex)
                console.log(route, uri)
                if match?
                    match.shift()
                    return action.call(match...)

    # Checks if the route matches with the current uri
    pathRegExp: (path, opts) ->
        insensitive = opts.caseInsensitiveMatch
        ret =
            originalPath: path
            regexp: path

        keys = ret.keys = []
        path = path.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, (_, slash, key, option) ->
            optional = (if option is "?" then option else null)
            star = (if option is "*" then option else null)
            keys.push
                name: key
                optional: !!optional

            slash = slash or ""
            "" + ((if optional then "" else slash)) + "(?:" + ((if optional then slash else "")) + (star and "(.+?)" or "([^/]+)") + (optional or "") + ")" + (optional or "")
        ).replace(/([\/$\*])/g, "\\$1")
        ret.regexp = new RegExp("^" + path + "$", (if insensitive then "i" else ""))
        ret





# Class representing an action
class Routy.Action

    # Routes this action with handle
    route: []

    #the context where template should override to
    context: $("body")
    # template of the route
    template_url: null
    # The callback to execute
    callback: null

    # Callback to execute before the action
    before_callback: null

    # Callback to execute after the action
    after_callback: null

    # Condition to execute the action
    condition: null

    # Create a new action
    constructor: (routes, @callback, @template_url, @context, @router)->
        # so you can call it like: new Routy.Action(['/', 'home'], callback)
        # or: new Routy.Action('/, home', callback);
        routes = routes.split ', ' if typeof routes == 'string'

        arr = []

        for route in routes
            route = @router.apply_context route

            arr.push route

        @route = arr

        console.log @route

    # Call the action passing arguments to it
    call: (args...)->
        # for now we can call the action
        result = true

        # call the condition
        if @condition
            result = @condition.apply @, args

        # if it returned false when can't call the action
        false if ! result

        context = @context

        $.get @template_url, (template) =>
            context.html(template)

            # if we defined a callback to execute before the action
            if @before_callback
                # execute it passing the same arguments as the action
                @before_callback.apply @, args


            # call the action callback and fetch the contents of it
            @callback.apply @, args

            # if we defined some callback to execute after the main one
            if @after_callback
                # call it passing the returned content
                @after_callback.apply @, args


    # Set a callback to execute before the action
    before: (@before_callback)->
        @

    # Set a callback to execute after the action
    after: (@after_callback)->
        @

    # Set a required condition to execute the action
    when: (@condition)->
        @
