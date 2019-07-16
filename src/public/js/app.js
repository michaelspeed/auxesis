function animateScrollTo(t) {
    "use strict";
    var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
        i = {speed: 500, minDuration: 250, maxDuration: 3e3, cancelOnUserAction: !0}, n = {};
    Object.keys(i).forEach(function (t) {
        n[t] = e[t] ? e[t] : i[t]
    });
    var r = window.scrollY || document.documentElement.scrollTop,
        s = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - window.innerHeight;
    t > s && (t = s);
    var o = t - r;
    if (0 !== o) {
        var a = Math.abs(Math.round(o / 1e3 * n.speed));
        a < n.minDuration ? a = n.minDuration : a > n.maxDuration && (a = n.maxDuration);
        var l = Date.now(), h = null, u = null;
        n.cancelOnUserAction ? (u = function (t) {
            cancelAnimationFrame(h)
        }, window.addEventListener("keydown", u)) : (u = function (t) {
            t.preventDefault()
        }, window.addEventListener("scroll", u)), window.addEventListener("wheel", u), window.addEventListener("touchstart", u);
        var c = function e() {
            var i = Date.now() - l, s = i / a - 1, c = s * s * s + 1, d = Math.round(r + o * c);
            i < a && d !== t ? (window.scrollTo(0, d), h = requestAnimationFrame(e)) : (window.scrollTo(0, t), cancelAnimationFrame(h), window.removeEventListener("wheel", u), window.removeEventListener("touchstart", u), n.cancelOnUserAction ? window.removeEventListener("keydown", u) : window.removeEventListener("scroll", u))
        };
        h = requestAnimationFrame(c)
    }
}

!function (t) {
    "use strict";

    function e(t) {
        return new RegExp("(^|\\s+)" + t + "(\\s+|$)")
    }

    function i(t, e) {
        (n(t, e) ? s : r)(t, e)
    }

    var n, r, s;
    "classList" in document.documentElement ? (n = function (t, e) {
        return t.classList.contains(e)
    }, r = function (t, e) {
        t.classList.add(e)
    }, s = function (t, e) {
        t.classList.remove(e)
    }) : (n = function (t, i) {
        return e(i).test(t.className)
    }, r = function (t, e) {
        n(t, e) || (t.className = t.className + " " + e)
    }, s = function (t, i) {
        t.className = t.className.replace(e(i), " ")
    });
    var o = {hasClass: n, addClass: r, removeClass: s, toggleClass: i, has: n, add: r, remove: s, toggle: i};
    "function" == typeof define && define.amd ? define(o) : "object" == typeof exports ? module.exports = o : t.classie = o
}(window), function () {
    "use strict";

    function t(n) {
        if (!n) throw new Error("No options passed to Waypoint constructor");
        if (!n.element) throw new Error("No element option passed to Waypoint constructor");
        if (!n.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, n), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = n.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
    }

    var e = 0, i = {};
    t.prototype.queueTrigger = function (t) {
        this.group.queueTrigger(this, t)
    }, t.prototype.trigger = function (t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, t.prototype.destroy = function () {
        this.context.remove(this), this.group.remove(this), delete i[this.key]
    }, t.prototype.disable = function () {
        return this.enabled = !1, this
    }, t.prototype.enable = function () {
        return this.context.refresh(), this.enabled = !0, this
    }, t.prototype.next = function () {
        return this.group.next(this)
    }, t.prototype.previous = function () {
        return this.group.previous(this)
    }, t.invokeAll = function (t) {
        var e = [];
        for (var n in i) e.push(i[n]);
        for (var r = 0, s = e.length; r < s; r++) e[r][t]()
    }, t.destroyAll = function () {
        t.invokeAll("destroy")
    }, t.disableAll = function () {
        t.invokeAll("disable")
    }, t.enableAll = function () {
        t.Context.refreshAll();
        for (var e in i) i[e].enabled = !0;
        return this
    }, t.refreshAll = function () {
        t.Context.refreshAll()
    }, t.viewportHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight
    }, t.viewportWidth = function () {
        return document.documentElement.clientWidth
    }, t.adapters = [], t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, t.offsetAliases = {
        "bottom-in-view": function () {
            return this.context.innerHeight() - this.adapter.outerHeight()
        }, "right-in-view": function () {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = t
}(), function () {
    "use strict";

    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function e(t) {
        this.element = t, this.Adapter = r.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, n[t.waypointContextKey] = this, i += 1, r.windowContext || (r.windowContext = !0, r.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }

    var i = 0, n = {}, r = window.Waypoint, s = window.onload;
    e.prototype.add = function (t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, e.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical), i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"), delete n[this.key])
    }, e.prototype.createThrottledResizeHandler = function () {
        function t() {
            e.handleResize(), e.didResize = !1
        }

        var e = this;
        this.adapter.on("resize.waypoints", function () {
            e.didResize || (e.didResize = !0, r.requestAnimationFrame(t))
        })
    }, e.prototype.createThrottledScrollHandler = function () {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }

        var e = this;
        this.adapter.on("scroll.waypoints", function () {
            e.didScroll && !r.isTouch || (e.didScroll = !0, r.requestAnimationFrame(t))
        })
    }, e.prototype.handleResize = function () {
        r.Context.refreshAll()
    }, e.prototype.handleScroll = function () {
        var t = {}, e = {
            horizontal: {
                newScroll: this.adapter.scrollLeft(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left"
            },
            vertical: {
                newScroll: this.adapter.scrollTop(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up"
            }
        };
        for (var i in e) {
            var n = e[i], r = n.newScroll > n.oldScroll, s = r ? n.forward : n.backward;
            for (var o in this.waypoints[i]) {
                var a = this.waypoints[i][o];
                if (null !== a.triggerPoint) {
                    var l = n.oldScroll < a.triggerPoint, h = n.newScroll >= a.triggerPoint, u = l && h, c = !l && !h;
                    (u || c) && (a.queueTrigger(s), t[a.group.id] = a.group)
                }
            }
        }
        for (var d in t) t[d].flushTriggers();
        this.oldScroll = {x: e.horizontal.newScroll, y: e.vertical.newScroll}
    }, e.prototype.innerHeight = function () {
        return this.element == this.element.window ? r.viewportHeight() : this.adapter.innerHeight()
    }, e.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, e.prototype.innerWidth = function () {
        return this.element == this.element.window ? r.viewportWidth() : this.adapter.innerWidth()
    }, e.prototype.destroy = function () {
        var t = [];
        for (var e in this.waypoints) for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var n = 0, r = t.length; n < r; n++) t[n].destroy()
    }, e.prototype.refresh = function () {
        var t, e = this.element == this.element.window, i = e ? void 0 : this.adapter.offset(), n = {};
        this.handleScroll(), t = {
            horizontal: {
                contextOffset: e ? 0 : i.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : i.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var s in t) {
            var o = t[s];
            for (var a in this.waypoints[s]) {
                var l, h, u, c, d, f = this.waypoints[s][a], p = f.options.offset, g = f.triggerPoint, m = 0,
                    v = null == g;
                f.element !== f.element.window && (m = f.adapter.offset()[o.offsetProp]), "function" == typeof p ? p = p.apply(f) : "string" == typeof p && (p = parseFloat(p), f.options.offset.indexOf("%") > -1 && (p = Math.ceil(o.contextDimension * p / 100))), l = o.contextScroll - o.contextOffset, f.triggerPoint = Math.floor(m + l - p), h = g < o.oldScroll, u = f.triggerPoint >= o.oldScroll, c = h && u, d = !h && !u, !v && c ? (f.queueTrigger(o.backward), n[f.group.id] = f.group) : !v && d ? (f.queueTrigger(o.forward), n[f.group.id] = f.group) : v && o.oldScroll >= f.triggerPoint && (f.queueTrigger(o.forward), n[f.group.id] = f.group)
            }
        }
        return r.requestAnimationFrame(function () {
            for (var t in n) n[t].flushTriggers()
        }), this
    }, e.findOrCreateByElement = function (t) {
        return e.findByElement(t) || new e(t)
    }, e.refreshAll = function () {
        for (var t in n) n[t].refresh()
    }, e.findByElement = function (t) {
        return n[t.waypointContextKey]
    }, window.onload = function () {
        s && s(), e.refreshAll()
    }, r.requestAnimationFrame = function (e) {
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t).call(window, e)
    }, r.Context = e
}(), function () {
    "use strict";

    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function i(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), n[this.axis][this.name] = this
    }

    var n = {vertical: {}, horizontal: {}}, r = window.Waypoint;
    i.prototype.add = function (t) {
        this.waypoints.push(t)
    }, i.prototype.clearTriggerQueues = function () {
        this.triggerQueues = {up: [], down: [], left: [], right: []}
    }, i.prototype.flushTriggers = function () {
        for (var i in this.triggerQueues) {
            var n = this.triggerQueues[i], r = "up" === i || "left" === i;
            n.sort(r ? e : t);
            for (var s = 0, o = n.length; s < o; s += 1) {
                var a = n[s];
                (a.options.continuous || s === n.length - 1) && a.trigger([i])
            }
        }
        this.clearTriggerQueues()
    }, i.prototype.next = function (e) {
        this.waypoints.sort(t);
        var i = r.Adapter.inArray(e, this.waypoints);
        return i === this.waypoints.length - 1 ? null : this.waypoints[i + 1]
    }, i.prototype.previous = function (e) {
        this.waypoints.sort(t);
        var i = r.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null
    }, i.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t)
    }, i.prototype.remove = function (t) {
        var e = r.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    }, i.prototype.first = function () {
        return this.waypoints[0]
    }, i.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1]
    }, i.findOrCreate = function (t) {
        return n[t.axis][t.name] || new i(t)
    }, r.Group = i
}(), function () {
    "use strict";

    function t(t) {
        return t === t.window
    }

    function e(e) {
        return t(e) ? e : e.defaultView
    }

    function i(t) {
        this.element = t, this.handlers = {}
    }

    var n = window.Waypoint;
    i.prototype.innerHeight = function () {
        return t(this.element) ? this.element.innerHeight : this.element.clientHeight
    }, i.prototype.innerWidth = function () {
        return t(this.element) ? this.element.innerWidth : this.element.clientWidth
    }, i.prototype.off = function (t, e) {
        function i(t, e, i) {
            for (var n = 0, r = e.length - 1; n < r; n++) {
                var s = e[n];
                i && i !== s || t.removeEventListener(s)
            }
        }

        var n = t.split("."), r = n[0], s = n[1], o = this.element;
        if (s && this.handlers[s] && r) i(o, this.handlers[s][r], e), this.handlers[s][r] = []; else if (r) for (var a in this.handlers) i(o, this.handlers[a][r] || [], e), this.handlers[a][r] = []; else if (s && this.handlers[s]) {
            for (var l in this.handlers[s]) i(o, this.handlers[s][l], e);
            this.handlers[s] = {}
        }
    }, i.prototype.offset = function () {
        if (!this.element.ownerDocument) return null;
        var t = this.element.ownerDocument.documentElement, i = e(this.element.ownerDocument), n = {top: 0, left: 0};
        return this.element.getBoundingClientRect && (n = this.element.getBoundingClientRect()), {
            top: n.top + i.pageYOffset - t.clientTop,
            left: n.left + i.pageXOffset - t.clientLeft
        }
    }, i.prototype.on = function (t, e) {
        var i = t.split("."), n = i[0], r = i[1] || "__default", s = this.handlers[r] = this.handlers[r] || {};
        (s[n] = s[n] || []).push(e), this.element.addEventListener(n, e)
    }, i.prototype.outerHeight = function (e) {
        var i, n = this.innerHeight();
        return e && !t(this.element) && (i = window.getComputedStyle(this.element), n += parseInt(i.marginTop, 10), n += parseInt(i.marginBottom, 10)), n
    }, i.prototype.outerWidth = function (e) {
        var i, n = this.innerWidth();
        return e && !t(this.element) && (i = window.getComputedStyle(this.element), n += parseInt(i.marginLeft, 10), n += parseInt(i.marginRight, 10)), n
    }, i.prototype.scrollLeft = function () {
        var t = e(this.element);
        return t ? t.pageXOffset : this.element.scrollLeft
    }, i.prototype.scrollTop = function () {
        var t = e(this.element);
        return t ? t.pageYOffset : this.element.scrollTop
    }, i.extend = function () {
        for (var t = Array.prototype.slice.call(arguments), e = 1, i = t.length; e < i; e++) !function (t, e) {
            if ("object" == typeof t && "object" == typeof e) for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
        }(t[0], t[e]);
        return t[0]
    }, i.inArray = function (t, e, i) {
        return null == e ? -1 : e.indexOf(t, i)
    }, i.isEmptyObject = function (t) {
        for (var e in t) return !1;
        return !0
    }, n.adapters.push({name: "noframework", Adapter: i}), n.Adapter = i
}();
var paper = function (t, e) {
    t = t || require("./node/self.js");
    var i = t.window, n = t.document, r = new function () {
        function t(t, e, r, s, o) {
            function h(n, h) {
                "string" == typeof (h = h || (h = a(e, n)) && (h.get ? h : h.value)) && "#" === h[0] && (h = t[h.substring(1)] || h);
                var c, d = "function" == typeof h, f = h, p = o || d && !h.base ? h && h.get ? n in t : t[n] : null;
                o && p || (d && p && (h.base = p), d && !1 !== s && (c = n.match(/^([gs]et|is)(([A-Z])(.*))$/)) && (u[c[3].toLowerCase() + c[4]] = c[2]), f && !d && f.get && "function" == typeof f.get && i.isPlainObject(f) || (f = {
                    value: f,
                    writable: !0
                }), (a(t, n) || {configurable: !0}).configurable && (f.configurable = !0, f.enumerable = null != r ? r : !c), l(t, n, f))
            }

            var u = {};
            if (e) {
                for (var c in e) e.hasOwnProperty(c) && !n.test(c) && h(c);
                for (var c in u) {
                    var d = u[c], f = t["set" + d], p = t["get" + d] || f && t["is" + d];
                    !p || !0 !== s && 0 !== p.length || h(c, {get: p, set: f})
                }
            }
            return t
        }

        function i() {
            for (var t = 0, e = arguments.length; t < e; t++) {
                var i = arguments[t];
                i && c(this, i)
            }
            return this
        }

        var n = /^(statics|enumerable|beans|preserve)$/, r = [], s = r.slice, o = Object.create,
            a = Object.getOwnPropertyDescriptor, l = Object.defineProperty, h = r.forEach || function (t, e) {
                for (var i = 0, n = this.length; i < n; i++) t.call(e, this[i], i, this)
            }, u = function (t, e) {
                for (var i in this) this.hasOwnProperty(i) && t.call(e, this[i], i, this)
            }, c = Object.assign || function (t) {
                for (var e = 1, i = arguments.length; e < i; e++) {
                    var n = arguments[e];
                    for (var r in n) n.hasOwnProperty(r) && (t[r] = n[r])
                }
                return t
            }, d = function (t, e, i) {
                if (t) {
                    var n = a(t, "length");
                    (n && "number" == typeof n.value ? h : u).call(t, e, i = i || t)
                }
                return i
            };
        return t(i, {
            inject: function (e) {
                if (e) {
                    var i = !0 === e.statics ? e : e.statics, n = e.beans, r = e.preserve;
                    i !== e && t(this.prototype, e, e.enumerable, n, r), t(this, i, null, n, r)
                }
                for (var s = 1, o = arguments.length; s < o; s++) this.inject(arguments[s]);
                return this
            }, extend: function () {
                for (var e, i, n, r = this, s = 0, a = arguments.length; s < a && (!e || !i); s++) n = arguments[s], e = e || n.initialize, i = i || n.prototype;
                return e = e || function () {
                    r.apply(this, arguments)
                }, i = e.prototype = i || o(this.prototype), l(i, "constructor", {
                    value: e,
                    writable: !0,
                    configurable: !0
                }), t(e, this), arguments.length && this.inject.apply(e, arguments), e.base = r, e
            }
        }).inject({
            enumerable: !1, initialize: i, set: i, inject: function () {
                for (var e = 0, i = arguments.length; e < i; e++) {
                    var n = arguments[e];
                    n && t(this, n, n.enumerable, n.beans, n.preserve)
                }
                return this
            }, extend: function () {
                var t = o(this);
                return t.inject.apply(t, arguments)
            }, each: function (t, e) {
                return d(this, t, e)
            }, clone: function () {
                return new this.constructor(this)
            }, statics: {
                set: c, each: d, create: o, define: l, describe: a, clone: function (t) {
                    return c(new t.constructor, t)
                }, isPlainObject: function (t) {
                    var e = null != t && t.constructor;
                    return e && (e === Object || e === i || "Object" === e.name)
                }, pick: function (t, i) {
                    return t !== e ? t : i
                }, slice: function (t, e, i) {
                    return s.call(t, e, i)
                }
            }
        })
    };
    "undefined" != typeof module && (module.exports = r), r.inject({
        enumerable: !1, toString: function () {
            return null != this._id ? (this._class || "Object") + (this._name ? " '" + this._name + "'" : " @" + this._id) : "{ " + r.each(this, function (t, e) {
                if (!/^_/.test(e)) {
                    var i = typeof t;
                    this.push(e + ": " + ("number" === i ? l.instance.number(t) : "string" === i ? "'" + t + "'" : t))
                }
            }, []).join(", ") + " }"
        }, getClassName: function () {
            return this._class || ""
        }, importJSON: function (t) {
            return r.importJSON(t, this)
        }, exportJSON: function (t) {
            return r.exportJSON(this, t)
        }, toJSON: function () {
            return r.serialize(this)
        }, set: function (t, e) {
            return t && r.filter(this, t, e, this._prioritize), this
        }
    }, {
        beans: !1, statics: {
            exports: {}, extend: function t() {
                var e = t.base.apply(this, arguments), i = e.prototype._class;
                return i && !r.exports[i] && (r.exports[i] = e), e
            }, equals: function (t, e) {
                if (t === e) return !0;
                if (t && t.equals) return t.equals(e);
                if (e && e.equals) return e.equals(t);
                if (t && e && "object" == typeof t && "object" == typeof e) {
                    if (Array.isArray(t) && Array.isArray(e)) {
                        var i = t.length;
                        if (i !== e.length) return !1;
                        for (; i--;) if (!r.equals(t[i], e[i])) return !1
                    } else {
                        var n = Object.keys(t), i = n.length;
                        if (i !== Object.keys(e).length) return !1;
                        for (; i--;) {
                            var s = n[i];
                            if (!e.hasOwnProperty(s) || !r.equals(t[s], e[s])) return !1
                        }
                    }
                    return !0
                }
                return !1
            }, read: function (t, i, n, s) {
                if (this === r) {
                    var o = this.peek(t, i);
                    return t.__index++, o
                }
                var a = this.prototype, l = a._readIndex, h = i || l && t.__index || 0, u = t.length, c = t[h];
                if (s = s || u - h, c instanceof this || n && n.readNull && null == c && s <= 1) return l && (t.__index = h + 1), c && n && n.clone ? c.clone() : c;
                if (c = r.create(a), l && (c.__read = !0), c = c.initialize.apply(c, h > 0 || h + s < u ? r.slice(t, h, h + s) : t) || c, l) {
                    t.__index = h + c.__read;
                    var d = c.__filtered;
                    d && (t.__filtered = d, c.__filtered = e), c.__read = e
                }
                return c
            }, peek: function (t, e) {
                return t[t.__index = e || t.__index || 0]
            }, remain: function (t) {
                return t.length - (t.__index || 0)
            }, readList: function (t, e, i, n) {
                for (var r, s = [], o = e || 0, a = n ? o + n : t.length, l = o; l < a; l++) s.push(Array.isArray(r = t[l]) ? this.read(r, 0, i) : this.read(t, l, i, 1));
                return s
            }, readNamed: function (t, i, n, s, o) {
                var a = this.getNamed(t, i), l = a !== e;
                if (l) {
                    var h = t.__filtered;
                    h || (h = t.__filtered = r.create(t[0]), h.__unfiltered = t[0]), h[i] = e
                }
                var u = l ? [a] : t;
                return this.read(u, n, s, o)
            }, getNamed: function (t, i) {
                var n = t[0];
                if (t._hasObject === e && (t._hasObject = 1 === t.length && r.isPlainObject(n)), t._hasObject) return i ? n[i] : t.__filtered || n
            }, hasNamed: function (t, e) {
                return !!this.getNamed(t, e)
            }, filter: function (t, i, n, r) {
                function s(r) {
                    if (!(n && r in n || o && r in o)) {
                        var s = i[r];
                        s !== e && (t[r] = s)
                    }
                }

                var o;
                if (r) {
                    for (var a, l = {}, h = 0, u = r.length; h < u; h++) (a = r[h]) in i && (s(a), l[a] = !0);
                    o = l
                }
                return Object.keys(i.__unfiltered || i).forEach(s), t
            }, isPlainValue: function (t, e) {
                return r.isPlainObject(t) || Array.isArray(t) || e && "string" == typeof t
            }, serialize: function (t, e, i, n) {
                e = e || {};
                var s, o = !n;
                if (o && (e.formatter = new l(e.precision), n = {
                    length: 0,
                    definitions: {},
                    references: {},
                    add: function (t, e) {
                        var i = "#" + t._id, n = this.references[i];
                        if (!n) {
                            this.length++;
                            var r = e.call(t), s = t._class;
                            s && r[0] !== s && r.unshift(s), this.definitions[i] = r, n = this.references[i] = [i]
                        }
                        return n
                    }
                }), t && t._serialize) {
                    s = t._serialize(e, n);
                    var a = t._class;
                    !a || t._compactSerialize || !o && i || s[0] === a || s.unshift(a)
                } else if (Array.isArray(t)) {
                    s = [];
                    for (var h = 0, u = t.length; h < u; h++) s[h] = r.serialize(t[h], e, i, n)
                } else if (r.isPlainObject(t)) {
                    s = {};
                    for (var c = Object.keys(t), h = 0, u = c.length; h < u; h++) {
                        var d = c[h];
                        s[d] = r.serialize(t[d], e, i, n)
                    }
                } else s = "number" == typeof t ? e.formatter.number(t, e.precision) : t;
                return o && n.length > 0 ? [["dictionary", n.definitions], s] : s
            }, deserialize: function (t, e, i, n, s) {
                var o = t, a = !i, l = a && t && t.length && "dictionary" === t[0][0];
                if (i = i || {}, Array.isArray(t)) {
                    var h = t[0], u = "dictionary" === h;
                    if (1 == t.length && /^#/.test(h)) return i.dictionary[h];
                    h = r.exports[h], o = [];
                    for (var c = h ? 1 : 0, d = t.length; c < d; c++) o.push(r.deserialize(t[c], e, i, u, l));
                    if (h) {
                        var f = o;
                        e ? o = e(h, f, a || s) : (o = r.create(h.prototype), h.apply(o, f))
                    }
                } else if (r.isPlainObject(t)) {
                    o = {}, n && (i.dictionary = o);
                    for (var p in t) o[p] = r.deserialize(t[p], e, i)
                }
                return l ? o[1] : o
            }, exportJSON: function (t, e) {
                var i = r.serialize(t, e);
                return e && 0 == e.asString ? i : JSON.stringify(i)
            }, importJSON: function (t, e) {
                return r.deserialize("string" == typeof t ? JSON.parse(t) : t, function (t, i, n) {
                    var s = n && e && e.constructor === t, o = s ? e : r.create(t.prototype);
                    if (1 === i.length && o instanceof w && (s || !(o instanceof b))) {
                        var a = i[0];
                        r.isPlainObject(a) && (a.insert = !1)
                    }
                    return (s ? o.set : t).apply(o, i), s && (e = null), o
                })
            }, splice: function (t, i, n, r) {
                var s = i && i.length, o = n === e;
                (n = o ? t.length : n) > t.length && (n = t.length);
                for (var a = 0; a < s; a++) i[a]._index = n + a;
                if (o) return t.push.apply(t, i), [];
                var l = [n, r];
                i && l.push.apply(l, i);
                for (var h = t.splice.apply(t, l), a = 0, u = h.length; a < u; a++) h[a]._index = e;
                for (var a = n + s, u = t.length; a < u; a++) t[a]._index = a;
                return h
            }, capitalize: function (t) {
                return t.replace(/\b[a-z]/g, function (t) {
                    return t.toUpperCase()
                })
            }, camelize: function (t) {
                return t.replace(/-(.)/g, function (t, e) {
                    return e.toUpperCase()
                })
            }, hyphenate: function (t) {
                return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            }
        }
    });
    var s = {
        on: function (t, e) {
            if ("string" != typeof t) r.each(t, function (t, e) {
                this.on(e, t)
            }, this); else {
                var i = this._eventTypes, n = i && i[t], s = this._callbacks = this._callbacks || {};
                s = s[t] = s[t] || [], -1 === s.indexOf(e) && (s.push(e), n && n.install && 1 === s.length && n.install.call(this, t))
            }
            return this
        }, off: function (t, e) {
            if ("string" != typeof t) return void r.each(t, function (t, e) {
                this.off(e, t)
            }, this);
            var i, n = this._eventTypes, s = n && n[t], o = this._callbacks && this._callbacks[t];
            return o && (!e || -1 !== (i = o.indexOf(e)) && 1 === o.length ? (s && s.uninstall && s.uninstall.call(this, t), delete this._callbacks[t]) : -1 !== i && o.splice(i, 1)), this
        }, once: function (t, e) {
            return this.on(t, function () {
                e.apply(this, arguments), this.off(t, e)
            })
        }, emit: function (t, e) {
            var i = this._callbacks && this._callbacks[t];
            if (!i) return !1;
            var n = r.slice(arguments, 1), s = e && e.target && !e.currentTarget;
            i = i.slice(), s && (e.currentTarget = this);
            for (var o = 0, a = i.length; o < a; o++) if (0 == i[o].apply(this, n)) {
                e && e.stop && e.stop();
                break
            }
            return s && delete e.currentTarget, !0
        }, responds: function (t) {
            return !(!this._callbacks || !this._callbacks[t])
        }, attach: "#on", detach: "#off", fire: "#emit", _installEvents: function (t) {
            var e = this._eventTypes, i = this._callbacks, n = t ? "install" : "uninstall";
            if (e) for (var r in i) if (i[r].length > 0) {
                var s = e[r], o = s && s[n];
                o && o.call(this, r)
            }
        }, statics: {
            inject: function t(e) {
                var i = e._events;
                if (i) {
                    var n = {};
                    r.each(i, function (t, i) {
                        var s = "string" == typeof t, o = s ? t : i, a = r.capitalize(o),
                            l = o.substring(2).toLowerCase();
                        n[l] = s ? {} : t, o = "_" + o, e["get" + a] = function () {
                            return this[o]
                        }, e["set" + a] = function (t) {
                            var e = this[o];
                            e && this.off(l, e), t && this.on(l, t), this[o] = t
                        }
                    }), e._eventTypes = n
                }
                return t.base.apply(this, arguments)
            }
        }
    }, o = r.extend({
        _class: "PaperScope", initialize: function e() {
            paper = this, this.settings = new r({
                applyMatrix: !0,
                insertItems: !0,
                handleSize: 4,
                hitTolerance: 0
            }), this.project = null, this.projects = [], this.tools = [], this._id = e._id++, e._scopes[this._id] = this;
            var i = e.prototype;
            if (!this.support) {
                var n = tt.getContext(1, 1) || {};
                i.support = {
                    nativeDash: "setLineDash" in n || "mozDash" in n,
                    nativeBlendModes: et.nativeModes
                }, tt.release(n)
            }
            if (!this.agent) {
                var s = t.navigator.userAgent.toLowerCase(),
                    o = (/(darwin|win|mac|linux|freebsd|sunos)/.exec(s) || [])[0], a = "darwin" === o ? "mac" : o,
                    l = i.agent = i.browser = {platform: a};
                a && (l[a] = !0), s.replace(/(opera|chrome|safari|webkit|firefox|msie|trident|atom|node)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:v?([.\d]+))?/g, function (t, e, i, n, r) {
                    if (!l.chrome) {
                        var s = "opera" === e ? n : /^(node|trident)$/.test(e) ? r : i;
                        l.version = s, l.versionNumber = parseFloat(s), e = "trident" === e ? "msie" : e, l.name = e, l[e] = !0
                    }
                }), l.chrome && delete l.webkit, l.atom && delete l.chrome
            }
        }, version: "0.11.5", getView: function () {
            var t = this.project;
            return t && t._view
        }, getPaper: function () {
            return this
        }, execute: function (t, e) {
            paper.PaperScript.execute(t, this, e), U.updateFocus()
        }, install: function (t) {
            var e = this;
            r.each(["project", "view", "tool"], function (i) {
                r.define(t, i, {
                    configurable: !0, get: function () {
                        return e[i]
                    }
                })
            });
            for (var i in this) !/^_/.test(i) && this[i] && (t[i] = this[i])
        }, setup: function (t) {
            return paper = this, this.project = new y(t), this
        }, createCanvas: function (t, e) {
            return tt.getCanvas(t, e)
        }, activate: function () {
            paper = this
        }, clear: function () {
            for (var t = this.projects, e = this.tools, i = t.length - 1; i >= 0; i--) t[i].remove();
            for (var i = e.length - 1; i >= 0; i--) e[i].remove()
        }, remove: function () {
            this.clear(), delete o._scopes[this._id]
        }, statics: new function () {
            function t(t) {
                return t += "Attribute", function (e, i) {
                    return e[t](i) || e[t]("data-paper-" + i)
                }
            }

            return {
                _scopes: {}, _id: 0, get: function (t) {
                    return this._scopes[t] || null
                }, getAttribute: t("get"), hasAttribute: t("has")
            }
        }
    }), a = r.extend(s, {
        initialize: function (t) {
            this._scope = paper, this._index = this._scope[this._list].push(this) - 1, !t && this._scope[this._reference] || this.activate()
        }, activate: function () {
            if (!this._scope) return !1;
            var t = this._scope[this._reference];
            return t && t !== this && t.emit("deactivate"), this._scope[this._reference] = this, this.emit("activate", t), !0
        }, isActive: function () {
            return this._scope[this._reference] === this
        }, remove: function () {
            return null != this._index && (r.splice(this._scope[this._list], null, this._index, 1), this._scope[this._reference] == this && (this._scope[this._reference] = null), this._scope = null, !0)
        }, getView: function () {
            return this._scope.getView()
        }
    }), l = r.extend({
        initialize: function (t) {
            this.precision = r.pick(t, 5), this.multiplier = Math.pow(10, this.precision)
        }, number: function (t) {
            return this.precision < 16 ? Math.round(t * this.multiplier) / this.multiplier : t
        }, pair: function (t, e, i) {
            return this.number(t) + (i || ",") + this.number(e)
        }, point: function (t, e) {
            return this.number(t.x) + (e || ",") + this.number(t.y)
        }, size: function (t, e) {
            return this.number(t.width) + (e || ",") + this.number(t.height)
        }, rectangle: function (t, e) {
            return this.point(t, e) + (e || ",") + this.size(t, e)
        }
    });
    l.instance = new l;
    var h = new function () {
        function t(t, e, i) {
            return t < e ? e : t > i ? i : t
        }

        function e(t, e, i) {
            function n(t) {
                var e = 134217729 * t, i = t - e, n = i + e;
                return [n, t - n]
            }

            var r = e * e - t * i, o = e * e + t * i;
            if (3 * s(r) < o) {
                var a = n(t), l = n(e), h = n(i), u = e * e, c = l[0] * l[0] - u + 2 * l[0] * l[1] + l[1] * l[1],
                    d = t * i;
                r = u - d + (c - (a[0] * h[0] - d + a[0] * h[1] + a[1] * h[0] + a[1] * h[1]))
            }
            return r
        }

        function i() {
            var t = Math.max.apply(Math, arguments);
            return t && (t < 1e-8 || t > 1e8) ? a(2, -Math.round(l(t))) : 0
        }

        var n = [[.5773502691896257], [0, .7745966692414834], [.33998104358485626, .8611363115940526], [0, .5384693101056831, .906179845938664], [.2386191860831969, .6612093864662645, .932469514203152], [0, .4058451513773972, .7415311855993945, .9491079123427585], [.1834346424956498, .525532409916329, .7966664774136267, .9602898564975363], [0, .3242534234038089, .6133714327005904, .8360311073266358, .9681602395076261], [.14887433898163122, .4333953941292472, .6794095682990244, .8650633666889845, .9739065285171717], [0, .26954315595234496, .5190961292068118, .7301520055740494, .8870625997680953, .978228658146057], [.1252334085114689, .3678314989981802, .5873179542866175, .7699026741943047, .9041172563704749, .9815606342467192], [0, .2304583159551348, .44849275103644687, .6423493394403402, .8015780907333099, .9175983992229779, .9841830547185881], [.10805494870734367, .31911236892788974, .5152486363581541, .6872929048116855, .827201315069765, .9284348836635735, .9862838086968123], [0, .20119409399743451, .3941513470775634, .5709721726085388, .7244177313601701, .8482065834104272, .937273392400706, .9879925180204854], [.09501250983763744, .2816035507792589, .45801677765722737, .6178762444026438, .755404408355003, .8656312023878318, .9445750230732326, .9894009349916499]],
            r = [[1], [.8888888888888888, .5555555555555556], [.6521451548625461, .34785484513745385], [.5688888888888889, .47862867049936647, .23692688505618908], [.46791393457269104, .3607615730481386, .17132449237917036], [.4179591836734694, .3818300505051189, .27970539148927664, .1294849661688697], [.362683783378362, .31370664587788727, .22238103445337448, .10122853629037626], [.3302393550012598, .31234707704000286, .26061069640293544, .1806481606948574, .08127438836157441], [.29552422471475287, .26926671930999635, .21908636251598204, .1494513491505806, .06667134430868814], [.2729250867779006, .26280454451024665, .23319376459199048, .18629021092773426, .1255803694649046, .05566856711617366], [.24914704581340277, .2334925365383548, .20316742672306592, .16007832854334622, .10693932599531843, .04717533638651183], [.2325515532308739, .22628318026289723, .2078160475368885, .17814598076194574, .13887351021978725, .09212149983772845, .04048400476531588], [.2152638534631578, .2051984637212956, .18553839747793782, .15720316715819355, .12151857068790319, .08015808715976021, .03511946033175186], [.2025782419255613, .19843148532711158, .1861610000155622, .16626920581699392, .13957067792615432, .10715922046717194, .07036604748810812, .03075324199611727], [.1894506104550685, .18260341504492358, .16915651939500254, .14959598881657674, .12462897125553388, .09515851168249279, .062253523938647894, .027152459411754096]],
            s = Math.abs, o = Math.sqrt, a = Math.pow, l = Math.log2 || function (t) {
                return Math.log(t) * Math.LOG2E
            };
        return {
            EPSILON: 1e-12,
            MACHINE_EPSILON: 1.12e-16,
            CURVETIME_EPSILON: 1e-8,
            GEOMETRIC_EPSILON: 1e-7,
            TRIGONOMETRIC_EPSILON: 1e-8,
            KAPPA: 4 * (o(2) - 1) / 3,
            isZero: function (t) {
                return t >= -1e-12 && t <= 1e-12
            },
            clamp: t,
            integrate: function (t, e, i, s) {
                for (var o = n[s - 2], a = r[s - 2], l = .5 * (i - e), h = l + e, u = 0, c = s + 1 >> 1, d = 1 & s ? a[u++] * t(h) : 0; u < c;) {
                    var f = l * o[u];
                    d += a[u++] * (t(h + f) + t(h - f))
                }
                return l * d
            },
            findRoot: function (e, i, n, r, o, a, l) {
                for (var h = 0; h < a; h++) {
                    var u = e(n), c = u / i(n), d = n - c;
                    if (s(c) < l) {
                        n = d;
                        break
                    }
                    u > 0 ? (o = n, n = d <= r ? .5 * (r + o) : d) : (r = n, n = d >= o ? .5 * (r + o) : d)
                }
                return t(n, r, o)
            },
            solveQuadratic: function (n, r, a, l, h, u) {
                var c, d = 1 / 0;
                if (s(n) < 1e-12) {
                    if (s(r) < 1e-12) return s(a) < 1e-12 ? -1 : 0;
                    c = -a / r
                } else {
                    r *= -.5;
                    var f = e(n, r, a);
                    if (f && s(f) < 1.12e-16) {
                        var p = i(s(n), s(r), s(a));
                        p && (n *= p, r *= p, a *= p, f = e(n, r, a))
                    }
                    if (f >= -1.12e-16) {
                        var g = f < 0 ? 0 : o(f), m = r + (r < 0 ? -g : g);
                        0 === m ? (c = a / n, d = -c) : (c = m / n, d = a / m)
                    }
                }
                var v = 0, _ = null == h, y = h - 1e-12, w = u + 1e-12;
                return isFinite(c) && (_ || c > y && c < w) && (l[v++] = _ ? c : t(c, h, u)), d !== c && isFinite(d) && (_ || d > y && d < w) && (l[v++] = _ ? d : t(d, h, u)), v
            },
            solveCubic: function (e, n, r, l, u, c, d) {
                function f(t) {
                    p = t;
                    var i = e * p;
                    g = i + n, m = g * p + r, v = (i + g) * p + m, _ = m * p + l
                }

                var p, g, m, v, _, y = i(s(e), s(n), s(r), s(l));
                if (y && (e *= y, n *= y, r *= y, l *= y), s(e) < 1e-12) e = n, g = r, m = l, p = 1 / 0; else if (s(l) < 1e-12) g = n, m = r, p = 0; else {
                    f(-n / e / 3);
                    var w = _ / e, x = a(s(w), 1 / 3), b = w < 0 ? -1 : 1, C = -v / e,
                        S = C > 0 ? 1.324717957244746 * Math.max(x, o(C)) : x, T = p - b * S;
                    if (T !== p) {
                        do {
                            f(T), T = 0 === v ? p : p - _ / v / (1 + 1.12e-16)
                        } while (b * T > b * p);
                        s(e) * p * p > s(l / p) && (m = -l / p, g = (m - r) / p)
                    }
                }
                var E = h.solveQuadratic(e, g, m, u, c, d), k = null == c;
                return isFinite(p) && (0 === E || E > 0 && p !== u[0] && p !== u[1]) && (k || p > c - 1e-12 && p < d + 1e-12) && (u[E++] = k ? p : t(p, c, d)), E
            }
        }
    }, u = {
        _id: 1, _pools: {}, get: function (t) {
            if (t) {
                var e = this._pools[t];
                return e || (e = this._pools[t] = {_id: 1}), e._id++
            }
            return this._id++
        }
    }, c = r.extend({
        _class: "Point", _readIndex: !0, initialize: function (t, e) {
            var i = typeof t, n = this.__read, r = 0;
            if ("number" === i) {
                var s = "number" == typeof e;
                this._set(t, s ? e : t), n && (r = s ? 2 : 1)
            } else if ("undefined" === i || null === t) this._set(0, 0), n && (r = null === t ? 1 : 0); else {
                var o = "string" === i ? t.split(/[\s,]+/) || [] : t;
                r = 1, Array.isArray(o) ? this._set(+o[0], +(o.length > 1 ? o[1] : o[0])) : "x" in o ? this._set(o.x || 0, o.y || 0) : "width" in o ? this._set(o.width || 0, o.height || 0) : "angle" in o ? (this._set(o.length || 0, 0), this.setAngle(o.angle || 0)) : (this._set(0, 0), r = 0)
            }
            return n && (this.__read = r), this
        }, set: "#initialize", _set: function (t, e) {
            return this.x = t, this.y = e, this
        }, equals: function (t) {
            return this === t || t && (this.x === t.x && this.y === t.y || Array.isArray(t) && this.x === t[0] && this.y === t[1]) || !1
        }, clone: function () {
            return new c(this.x, this.y)
        }, toString: function () {
            var t = l.instance;
            return "{ x: " + t.number(this.x) + ", y: " + t.number(this.y) + " }"
        }, _serialize: function (t) {
            var e = t.formatter;
            return [e.number(this.x), e.number(this.y)]
        }, getLength: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        }, setLength: function (t) {
            if (this.isZero()) {
                var e = this._angle || 0;
                this._set(Math.cos(e) * t, Math.sin(e) * t)
            } else {
                var i = t / this.getLength();
                h.isZero(i) && this.getAngle(), this._set(this.x * i, this.y * i)
            }
        }, getAngle: function () {
            return 180 * this.getAngleInRadians.apply(this, arguments) / Math.PI
        }, setAngle: function (t) {
            this.setAngleInRadians.call(this, t * Math.PI / 180)
        }, getAngleInDegrees: "#getAngle", setAngleInDegrees: "#setAngle", getAngleInRadians: function () {
            if (arguments.length) {
                var t = c.read(arguments), e = this.getLength() * t.getLength();
                if (h.isZero(e)) return NaN;
                var i = this.dot(t) / e;
                return Math.acos(i < -1 ? -1 : i > 1 ? 1 : i)
            }
            return this.isZero() ? this._angle || 0 : this._angle = Math.atan2(this.y, this.x)
        }, setAngleInRadians: function (t) {
            if (this._angle = t, !this.isZero()) {
                var e = this.getLength();
                this._set(Math.cos(t) * e, Math.sin(t) * e)
            }
        }, getQuadrant: function () {
            return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3
        }
    }, {
        beans: !1, getDirectedAngle: function () {
            var t = c.read(arguments);
            return 180 * Math.atan2(this.cross(t), this.dot(t)) / Math.PI
        }, getDistance: function () {
            var t = c.read(arguments), e = t.x - this.x, i = t.y - this.y, n = e * e + i * i;
            return r.read(arguments) ? n : Math.sqrt(n)
        }, normalize: function (t) {
            t === e && (t = 1);
            var i = this.getLength(), n = 0 !== i ? t / i : 0, r = new c(this.x * n, this.y * n);
            return n >= 0 && (r._angle = this._angle), r
        }, rotate: function (t, e) {
            if (0 === t) return this.clone();
            t = t * Math.PI / 180;
            var i = e ? this.subtract(e) : this, n = Math.sin(t), r = Math.cos(t);
            return i = new c(i.x * r - i.y * n, i.x * n + i.y * r), e ? i.add(e) : i
        }, transform: function (t) {
            return t ? t._transformPoint(this) : this
        }, add: function () {
            var t = c.read(arguments);
            return new c(this.x + t.x, this.y + t.y)
        }, subtract: function () {
            var t = c.read(arguments);
            return new c(this.x - t.x, this.y - t.y)
        }, multiply: function () {
            var t = c.read(arguments);
            return new c(this.x * t.x, this.y * t.y)
        }, divide: function () {
            var t = c.read(arguments);
            return new c(this.x / t.x, this.y / t.y)
        },
        modulo: function () {
            var t = c.read(arguments);
            return new c(this.x % t.x, this.y % t.y)
        }, negate: function () {
            return new c(-this.x, -this.y)
        }, isInside: function () {
            return g.read(arguments).contains(this)
        }, isClose: function () {
            var t = c.read(arguments), e = r.read(arguments);
            return this.getDistance(t) <= e
        }, isCollinear: function () {
            var t = c.read(arguments);
            return c.isCollinear(this.x, this.y, t.x, t.y)
        }, isColinear: "#isCollinear", isOrthogonal: function () {
            var t = c.read(arguments);
            return c.isOrthogonal(this.x, this.y, t.x, t.y)
        }, isZero: function () {
            var t = h.isZero;
            return t(this.x) && t(this.y)
        }, isNaN: function () {
            return isNaN(this.x) || isNaN(this.y)
        }, isInQuadrant: function (t) {
            return this.x * (t > 1 && t < 4 ? -1 : 1) >= 0 && this.y * (t > 2 ? -1 : 1) >= 0
        }, dot: function () {
            var t = c.read(arguments);
            return this.x * t.x + this.y * t.y
        }, cross: function () {
            var t = c.read(arguments);
            return this.x * t.y - this.y * t.x
        }, project: function () {
            var t = c.read(arguments), e = t.isZero() ? 0 : this.dot(t) / t.dot(t);
            return new c(t.x * e, t.y * e)
        }, statics: {
            min: function () {
                var t = c.read(arguments), e = c.read(arguments);
                return new c(Math.min(t.x, e.x), Math.min(t.y, e.y))
            }, max: function () {
                var t = c.read(arguments), e = c.read(arguments);
                return new c(Math.max(t.x, e.x), Math.max(t.y, e.y))
            }, random: function () {
                return new c(Math.random(), Math.random())
            }, isCollinear: function (t, e, i, n) {
                return Math.abs(t * n - e * i) <= 1e-8 * Math.sqrt((t * t + e * e) * (i * i + n * n))
            }, isOrthogonal: function (t, e, i, n) {
                return Math.abs(t * i + e * n) <= 1e-8 * Math.sqrt((t * t + e * e) * (i * i + n * n))
            }
        }
    }, r.each(["round", "ceil", "floor", "abs"], function (t) {
        var e = Math[t];
        this[t] = function () {
            return new c(e(this.x), e(this.y))
        }
    }, {})), d = c.extend({
        initialize: function (t, e, i, n) {
            this._x = t, this._y = e, this._owner = i, this._setter = n
        }, _set: function (t, e, i) {
            return this._x = t, this._y = e, i || this._owner[this._setter](this), this
        }, getX: function () {
            return this._x
        }, setX: function (t) {
            this._x = t, this._owner[this._setter](this)
        }, getY: function () {
            return this._y
        }, setY: function (t) {
            this._y = t, this._owner[this._setter](this)
        }, isSelected: function () {
            return !!(this._owner._selection & this._getSelection())
        }, setSelected: function (t) {
            this._owner._changeSelection(this._getSelection(), t)
        }, _getSelection: function () {
            return "setPosition" === this._setter ? 4 : 0
        }
    }), f = r.extend({
        _class: "Size", _readIndex: !0, initialize: function (t, e) {
            var i = typeof t, n = this.__read, r = 0;
            if ("number" === i) {
                var s = "number" == typeof e;
                this._set(t, s ? e : t), n && (r = s ? 2 : 1)
            } else if ("undefined" === i || null === t) this._set(0, 0), n && (r = null === t ? 1 : 0); else {
                var o = "string" === i ? t.split(/[\s,]+/) || [] : t;
                r = 1, Array.isArray(o) ? this._set(+o[0], +(o.length > 1 ? o[1] : o[0])) : "width" in o ? this._set(o.width || 0, o.height || 0) : "x" in o ? this._set(o.x || 0, o.y || 0) : (this._set(0, 0), r = 0)
            }
            return n && (this.__read = r), this
        }, set: "#initialize", _set: function (t, e) {
            return this.width = t, this.height = e, this
        }, equals: function (t) {
            return t === this || t && (this.width === t.width && this.height === t.height || Array.isArray(t) && this.width === t[0] && this.height === t[1]) || !1
        }, clone: function () {
            return new f(this.width, this.height)
        }, toString: function () {
            var t = l.instance;
            return "{ width: " + t.number(this.width) + ", height: " + t.number(this.height) + " }"
        }, _serialize: function (t) {
            var e = t.formatter;
            return [e.number(this.width), e.number(this.height)]
        }, add: function () {
            var t = f.read(arguments);
            return new f(this.width + t.width, this.height + t.height)
        }, subtract: function () {
            var t = f.read(arguments);
            return new f(this.width - t.width, this.height - t.height)
        }, multiply: function () {
            var t = f.read(arguments);
            return new f(this.width * t.width, this.height * t.height)
        }, divide: function () {
            var t = f.read(arguments);
            return new f(this.width / t.width, this.height / t.height)
        }, modulo: function () {
            var t = f.read(arguments);
            return new f(this.width % t.width, this.height % t.height)
        }, negate: function () {
            return new f(-this.width, -this.height)
        }, isZero: function () {
            var t = h.isZero;
            return t(this.width) && t(this.height)
        }, isNaN: function () {
            return isNaN(this.width) || isNaN(this.height)
        }, statics: {
            min: function (t, e) {
                return new f(Math.min(t.width, e.width), Math.min(t.height, e.height))
            }, max: function (t, e) {
                return new f(Math.max(t.width, e.width), Math.max(t.height, e.height))
            }, random: function () {
                return new f(Math.random(), Math.random())
            }
        }
    }, r.each(["round", "ceil", "floor", "abs"], function (t) {
        var e = Math[t];
        this[t] = function () {
            return new f(e(this.width), e(this.height))
        }
    }, {})), p = f.extend({
        initialize: function (t, e, i, n) {
            this._width = t, this._height = e, this._owner = i, this._setter = n
        }, _set: function (t, e, i) {
            return this._width = t, this._height = e, i || this._owner[this._setter](this), this
        }, getWidth: function () {
            return this._width
        }, setWidth: function (t) {
            this._width = t, this._owner[this._setter](this)
        }, getHeight: function () {
            return this._height
        }, setHeight: function (t) {
            this._height = t, this._owner[this._setter](this)
        }
    }), g = r.extend({
        _class: "Rectangle", _readIndex: !0, beans: !0, initialize: function (t, i, n, s) {
            var o, a = typeof t;
            if ("number" === a ? (this._set(t, i, n, s), o = 4) : "undefined" === a || null === t ? (this._set(0, 0, 0, 0), o = null === t ? 1 : 0) : 1 === arguments.length && (Array.isArray(t) ? (this._set.apply(this, t), o = 1) : t.x !== e || t.width !== e ? (this._set(t.x || 0, t.y || 0, t.width || 0, t.height || 0), o = 1) : t.from === e && t.to === e && (this._set(0, 0, 0, 0), r.filter(this, t), o = 1)), o === e) {
                var l, h, u = c.readNamed(arguments, "from"), d = r.peek(arguments), p = u.x, g = u.y;
                if (d && d.x !== e || r.hasNamed(arguments, "to")) {
                    var m = c.readNamed(arguments, "to");
                    l = m.x - p, h = m.y - g, l < 0 && (p = m.x, l = -l), h < 0 && (g = m.y, h = -h)
                } else {
                    var v = f.read(arguments);
                    l = v.width, h = v.height
                }
                this._set(p, g, l, h), o = arguments.__index;
                var _ = arguments.__filtered;
                _ && (this.__filtered = _)
            }
            return this.__read && (this.__read = o), this
        }, set: "#initialize", _set: function (t, e, i, n) {
            return this.x = t, this.y = e, this.width = i, this.height = n, this
        }, clone: function () {
            return new g(this.x, this.y, this.width, this.height)
        }, equals: function (t) {
            var e = r.isPlainValue(t) ? g.read(arguments) : t;
            return e === this || e && this.x === e.x && this.y === e.y && this.width === e.width && this.height === e.height || !1
        }, toString: function () {
            var t = l.instance;
            return "{ x: " + t.number(this.x) + ", y: " + t.number(this.y) + ", width: " + t.number(this.width) + ", height: " + t.number(this.height) + " }"
        }, _serialize: function (t) {
            var e = t.formatter;
            return [e.number(this.x), e.number(this.y), e.number(this.width), e.number(this.height)]
        }, getPoint: function (t) {
            return new (t ? c : d)(this.x, this.y, this, "setPoint")
        }, setPoint: function () {
            var t = c.read(arguments);
            this.x = t.x, this.y = t.y
        }, getSize: function (t) {
            return new (t ? f : p)(this.width, this.height, this, "setSize")
        }, _fw: 1, _fh: 1, setSize: function () {
            var t = f.read(arguments), e = this._sx, i = this._sy, n = t.width, r = t.height;
            e && (this.x += (this.width - n) * e), i && (this.y += (this.height - r) * i), this.width = n, this.height = r, this._fw = this._fh = 1
        }, getLeft: function () {
            return this.x
        }, setLeft: function (t) {
            if (!this._fw) {
                var e = t - this.x;
                this.width -= .5 === this._sx ? 2 * e : e
            }
            this.x = t, this._sx = this._fw = 0
        }, getTop: function () {
            return this.y
        }, setTop: function (t) {
            if (!this._fh) {
                var e = t - this.y;
                this.height -= .5 === this._sy ? 2 * e : e
            }
            this.y = t, this._sy = this._fh = 0
        }, getRight: function () {
            return this.x + this.width
        }, setRight: function (t) {
            if (!this._fw) {
                var e = t - this.x;
                this.width = .5 === this._sx ? 2 * e : e
            }
            this.x = t - this.width, this._sx = 1, this._fw = 0
        }, getBottom: function () {
            return this.y + this.height
        }, setBottom: function (t) {
            if (!this._fh) {
                var e = t - this.y;
                this.height = .5 === this._sy ? 2 * e : e
            }
            this.y = t - this.height, this._sy = 1, this._fh = 0
        }, getCenterX: function () {
            return this.x + this.width / 2
        }, setCenterX: function (t) {
            this._fw || .5 === this._sx ? this.x = t - this.width / 2 : (this._sx && (this.x += 2 * (t - this.x) * this._sx), this.width = 2 * (t - this.x)), this._sx = .5, this._fw = 0
        }, getCenterY: function () {
            return this.y + this.height / 2
        }, setCenterY: function (t) {
            this._fh || .5 === this._sy ? this.y = t - this.height / 2 : (this._sy && (this.y += 2 * (t - this.y) * this._sy), this.height = 2 * (t - this.y)), this._sy = .5, this._fh = 0
        }, getCenter: function (t) {
            return new (t ? c : d)(this.getCenterX(), this.getCenterY(), this, "setCenter")
        }, setCenter: function () {
            var t = c.read(arguments);
            return this.setCenterX(t.x), this.setCenterY(t.y), this
        }, getArea: function () {
            return this.width * this.height
        }, isEmpty: function () {
            return 0 === this.width || 0 === this.height
        }, contains: function (t) {
            return t && t.width !== e || 4 === (Array.isArray(t) ? t : arguments).length ? this._containsRectangle(g.read(arguments)) : this._containsPoint(c.read(arguments))
        }, _containsPoint: function (t) {
            var e = t.x, i = t.y;
            return e >= this.x && i >= this.y && e <= this.x + this.width && i <= this.y + this.height
        }, _containsRectangle: function (t) {
            var e = t.x, i = t.y;
            return e >= this.x && i >= this.y && e + t.width <= this.x + this.width && i + t.height <= this.y + this.height
        }, intersects: function () {
            var t = g.read(arguments), e = r.read(arguments) || 0;
            return t.x + t.width > this.x - e && t.y + t.height > this.y - e && t.x < this.x + this.width + e && t.y < this.y + this.height + e
        }, intersect: function () {
            var t = g.read(arguments), e = Math.max(this.x, t.x), i = Math.max(this.y, t.y),
                n = Math.min(this.x + this.width, t.x + t.width), r = Math.min(this.y + this.height, t.y + t.height);
            return new g(e, i, n - e, r - i)
        }, unite: function () {
            var t = g.read(arguments), e = Math.min(this.x, t.x), i = Math.min(this.y, t.y),
                n = Math.max(this.x + this.width, t.x + t.width), r = Math.max(this.y + this.height, t.y + t.height);
            return new g(e, i, n - e, r - i)
        }, include: function () {
            var t = c.read(arguments), e = Math.min(this.x, t.x), i = Math.min(this.y, t.y),
                n = Math.max(this.x + this.width, t.x), r = Math.max(this.y + this.height, t.y);
            return new g(e, i, n - e, r - i)
        }, expand: function () {
            var t = f.read(arguments), e = t.width, i = t.height;
            return new g(this.x - e / 2, this.y - i / 2, this.width + e, this.height + i)
        }, scale: function (t, i) {
            return this.expand(this.width * t - this.width, this.height * (i === e ? t : i) - this.height)
        }
    }, r.each([["Top", "Left"], ["Top", "Right"], ["Bottom", "Left"], ["Bottom", "Right"], ["Left", "Center"], ["Top", "Center"], ["Right", "Center"], ["Bottom", "Center"]], function (t, e) {
        var i = t.join(""), n = /^[RL]/.test(i);
        e >= 4 && (t[1] += n ? "Y" : "X");
        var r = t[n ? 0 : 1], s = t[n ? 1 : 0], o = "get" + r, a = "get" + s, l = "set" + r, h = "set" + s,
            u = "get" + i, f = "set" + i;
        this[u] = function (t) {
            return new (t ? c : d)(this[o](), this[a](), this, f)
        }, this[f] = function () {
            var t = c.read(arguments);
            this[l](t.x), this[h](t.y)
        }
    }, {beans: !0})), m = g.extend({
        initialize: function (t, e, i, n, r, s) {
            this._set(t, e, i, n, !0), this._owner = r, this._setter = s
        }, _set: function (t, e, i, n, r) {
            return this._x = t, this._y = e, this._width = i, this._height = n, r || this._owner[this._setter](this), this
        }
    }, new function () {
        var t = g.prototype;
        return r.each(["x", "y", "width", "height"], function (t) {
            var e = r.capitalize(t), i = "_" + t;
            this["get" + e] = function () {
                return this[i]
            }, this["set" + e] = function (t) {
                this[i] = t, this._dontNotify || this._owner[this._setter](this)
            }
        }, r.each(["Point", "Size", "Center", "Left", "Top", "Right", "Bottom", "CenterX", "CenterY", "TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], function (e) {
            var i = "set" + e;
            this[i] = function () {
                this._dontNotify = !0, t[i].apply(this, arguments), this._dontNotify = !1, this._owner[this._setter](this)
            }
        }, {
            isSelected: function () {
                return !!(2 & this._owner._selection)
            }, setSelected: function (t) {
                var e = this._owner;
                e._changeSelection && e._changeSelection(2, t)
            }
        }))
    }), v = r.extend({
        _class: "Matrix", initialize: function t(e, i) {
            var n = arguments.length, r = !0;
            if (n >= 6 ? this._set.apply(this, arguments) : 1 === n || 2 === n ? e instanceof t ? this._set(e._a, e._b, e._c, e._d, e._tx, e._ty, i) : Array.isArray(e) ? this._set.apply(this, i ? e.concat([i]) : e) : r = !1 : n ? r = !1 : this.reset(), !r) throw new Error("Unsupported matrix parameters");
            return this
        }, set: "#initialize", _set: function (t, e, i, n, r, s, o) {
            return this._a = t, this._b = e, this._c = i, this._d = n, this._tx = r, this._ty = s, o || this._changed(), this
        }, _serialize: function (t, e) {
            return r.serialize(this.getValues(), t, !0, e)
        }, _changed: function () {
            var t = this._owner;
            t && (t._applyMatrix ? t.transform(null, !0) : t._changed(9))
        }, clone: function () {
            return new v(this._a, this._b, this._c, this._d, this._tx, this._ty)
        }, equals: function (t) {
            return t === this || t && this._a === t._a && this._b === t._b && this._c === t._c && this._d === t._d && this._tx === t._tx && this._ty === t._ty
        }, toString: function () {
            var t = l.instance;
            return "[[" + [t.number(this._a), t.number(this._c), t.number(this._tx)].join(", ") + "], [" + [t.number(this._b), t.number(this._d), t.number(this._ty)].join(", ") + "]]"
        }, reset: function (t) {
            return this._a = this._d = 1, this._b = this._c = this._tx = this._ty = 0, t || this._changed(), this
        }, apply: function (t, e) {
            var i = this._owner;
            return !!i && (i.transform(null, !0, r.pick(t, !0), e), this.isIdentity())
        }, translate: function () {
            var t = c.read(arguments), e = t.x, i = t.y;
            return this._tx += e * this._a + i * this._c, this._ty += e * this._b + i * this._d, this._changed(), this
        }, scale: function () {
            var t = c.read(arguments), e = c.read(arguments, 0, {readNull: !0});
            return e && this.translate(e), this._a *= t.x, this._b *= t.x, this._c *= t.y, this._d *= t.y, e && this.translate(e.negate()), this._changed(), this
        }, rotate: function (t) {
            t *= Math.PI / 180;
            var e = c.read(arguments, 1), i = e.x, n = e.y, r = Math.cos(t), s = Math.sin(t), o = i - i * r + n * s,
                a = n - i * s - n * r, l = this._a, h = this._b, u = this._c, d = this._d;
            return this._a = r * l + s * u, this._b = r * h + s * d, this._c = -s * l + r * u, this._d = -s * h + r * d, this._tx += o * l + a * u, this._ty += o * h + a * d, this._changed(), this
        }, shear: function () {
            var t = c.read(arguments), e = c.read(arguments, 0, {readNull: !0});
            e && this.translate(e);
            var i = this._a, n = this._b;
            return this._a += t.y * this._c, this._b += t.y * this._d, this._c += t.x * i, this._d += t.x * n, e && this.translate(e.negate()), this._changed(), this
        }, skew: function () {
            var t = c.read(arguments), e = c.read(arguments, 0, {readNull: !0}), i = Math.PI / 180,
                n = new c(Math.tan(t.x * i), Math.tan(t.y * i));
            return this.shear(n, e)
        }, append: function (t, e) {
            if (t) {
                var i = this._a, n = this._b, r = this._c, s = this._d, o = t._a, a = t._c, l = t._b, h = t._d,
                    u = t._tx, c = t._ty;
                this._a = o * i + l * r, this._c = a * i + h * r, this._b = o * n + l * s, this._d = a * n + h * s, this._tx += u * i + c * r, this._ty += u * n + c * s, e || this._changed()
            }
            return this
        }, prepend: function (t, e) {
            if (t) {
                var i = this._a, n = this._b, r = this._c, s = this._d, o = this._tx, a = this._ty, l = t._a, h = t._c,
                    u = t._b, c = t._d, d = t._tx, f = t._ty;
                this._a = l * i + h * n, this._c = l * r + h * s, this._b = u * i + c * n, this._d = u * r + c * s, this._tx = l * o + h * a + d, this._ty = u * o + c * a + f, e || this._changed()
            }
            return this
        }, appended: function (t) {
            return this.clone().append(t)
        }, prepended: function (t) {
            return this.clone().prepend(t)
        }, invert: function () {
            var t = this._a, e = this._b, i = this._c, n = this._d, r = this._tx, s = this._ty, o = t * n - e * i,
                a = null;
            return o && !isNaN(o) && isFinite(r) && isFinite(s) && (this._a = n / o, this._b = -e / o, this._c = -i / o, this._d = t / o, this._tx = (i * s - n * r) / o, this._ty = (e * r - t * s) / o, a = this), a
        }, inverted: function () {
            return this.clone().invert()
        }, concatenate: "#append", preConcatenate: "#prepend", chain: "#appended", _shiftless: function () {
            return new v(this._a, this._b, this._c, this._d, 0, 0)
        }, _orNullIfIdentity: function () {
            return this.isIdentity() ? null : this
        }, isIdentity: function () {
            return 1 === this._a && 0 === this._b && 0 === this._c && 1 === this._d && 0 === this._tx && 0 === this._ty
        }, isInvertible: function () {
            var t = this._a * this._d - this._c * this._b;
            return t && !isNaN(t) && isFinite(this._tx) && isFinite(this._ty)
        }, isSingular: function () {
            return !this.isInvertible()
        }, transform: function (t, e, i) {
            return arguments.length < 3 ? this._transformPoint(c.read(arguments)) : this._transformCoordinates(t, e, i)
        }, _transformPoint: function (t, e, i) {
            var n = t.x, r = t.y;
            return e || (e = new c), e._set(n * this._a + r * this._c + this._tx, n * this._b + r * this._d + this._ty, i)
        }, _transformCoordinates: function (t, e, i) {
            for (var n = 0, r = 2 * i; n < r; n += 2) {
                var s = t[n], o = t[n + 1];
                e[n] = s * this._a + o * this._c + this._tx, e[n + 1] = s * this._b + o * this._d + this._ty
            }
            return e
        }, _transformCorners: function (t) {
            var e = t.x, i = t.y, n = e + t.width, r = i + t.height, s = [e, i, n, i, n, r, e, r];
            return this._transformCoordinates(s, s, 4)
        }, _transformBounds: function (t, e, i) {
            for (var n = this._transformCorners(t), r = n.slice(0, 2), s = r.slice(), o = 2; o < 8; o++) {
                var a = n[o], l = 1 & o;
                a < r[l] ? r[l] = a : a > s[l] && (s[l] = a)
            }
            return e || (e = new g), e._set(r[0], r[1], s[0] - r[0], s[1] - r[1], i)
        }, inverseTransform: function () {
            return this._inverseTransform(c.read(arguments))
        }, _inverseTransform: function (t, e, i) {
            var n = this._a, r = this._b, s = this._c, o = this._d, a = this._tx, l = this._ty, h = n * o - r * s,
                u = null;
            if (h && !isNaN(h) && isFinite(a) && isFinite(l)) {
                var d = t.x - this._tx, f = t.y - this._ty;
                e || (e = new c), u = e._set((d * o - f * s) / h, (f * n - d * r) / h, i)
            }
            return u
        }, decompose: function () {
            var t, e, i, n = this._a, r = this._b, s = this._c, o = this._d, a = n * o - r * s, l = Math.sqrt,
                h = Math.atan2, u = 180 / Math.PI;
            if (0 !== n || 0 !== r) {
                var d = l(n * n + r * r);
                t = Math.acos(n / d) * (r > 0 ? 1 : -1), e = [d, a / d], i = [h(n * s + r * o, d * d), 0]
            } else if (0 !== s || 0 !== o) {
                var f = l(s * s + o * o);
                t = Math.asin(s / f) * (o > 0 ? 1 : -1), e = [a / f, f], i = [0, h(n * s + r * o, f * f)]
            } else t = 0, i = e = [0, 0];
            return {
                translation: this.getTranslation(),
                rotation: t * u,
                scaling: new c(e),
                skewing: new c(i[0] * u, i[1] * u)
            }
        }, getValues: function () {
            return [this._a, this._b, this._c, this._d, this._tx, this._ty]
        }, getTranslation: function () {
            return new c(this._tx, this._ty)
        }, getScaling: function () {
            return (this.decompose() || {}).scaling
        }, getRotation: function () {
            return (this.decompose() || {}).rotation
        }, applyToContext: function (t) {
            this.isIdentity() || t.transform(this._a, this._b, this._c, this._d, this._tx, this._ty)
        }
    }, r.each(["a", "b", "c", "d", "tx", "ty"], function (t) {
        var e = r.capitalize(t), i = "_" + t;
        this["get" + e] = function () {
            return this[i]
        }, this["set" + e] = function (t) {
            this[i] = t, this._changed()
        }
    }, {})), _ = r.extend({
        _class: "Line", initialize: function (t, e, i, n, r) {
            var s = !1;
            arguments.length >= 4 ? (this._px = t, this._py = e, this._vx = i, this._vy = n, s = r) : (this._px = t.x, this._py = t.y, this._vx = e.x, this._vy = e.y, s = i), s || (this._vx -= this._px, this._vy -= this._py)
        }, getPoint: function () {
            return new c(this._px, this._py)
        }, getVector: function () {
            return new c(this._vx, this._vy)
        }, getLength: function () {
            return this.getVector().getLength()
        }, intersect: function (t, e) {
            return _.intersect(this._px, this._py, this._vx, this._vy, t._px, t._py, t._vx, t._vy, !0, e)
        }, getSide: function (t, e) {
            return _.getSide(this._px, this._py, this._vx, this._vy, t.x, t.y, !0, e)
        }, getDistance: function (t) {
            return Math.abs(this.getSignedDistance(t))
        }, getSignedDistance: function (t) {
            return _.getSignedDistance(this._px, this._py, this._vx, this._vy, t.x, t.y, !0)
        }, isCollinear: function (t) {
            return c.isCollinear(this._vx, this._vy, t._vx, t._vy)
        }, isOrthogonal: function (t) {
            return c.isOrthogonal(this._vx, this._vy, t._vx, t._vy)
        }, statics: {
            intersect: function (t, e, i, n, r, s, o, a, l, u) {
                l || (i -= t, n -= e, o -= r, a -= s);
                var d = i * a - n * o;
                if (!h.isZero(d)) {
                    var f = t - r, p = e - s, g = (o * p - a * f) / d, m = (i * p - n * f) / d;
                    if (u || -1e-12 < g && g < 1 + 1e-12 && -1e-12 < m && m < 1 + 1e-12) return u || (g = g <= 0 ? 0 : g >= 1 ? 1 : g), new c(t + g * i, e + g * n)
                }
            }, getSide: function (t, e, i, n, r, s, o, a) {
                o || (i -= t, n -= e);
                var l = r - t, u = s - e, c = l * n - u * i;
                return !a && h.isZero(c) && (c = (l * i + l * i) / (i * i + n * n)) >= 0 && c <= 1 && (c = 0), c < 0 ? -1 : c > 0 ? 1 : 0
            }, getSignedDistance: function (t, e, i, n, r, s, o) {
                return o || (i -= t, n -= e), 0 === i ? n > 0 ? r - t : t - r : 0 === n ? i < 0 ? s - e : e - s : ((r - t) * n - (s - e) * i) / Math.sqrt(i * i + n * n)
            }, getDistance: function (t, e, i, n, r, s, o) {
                return Math.abs(_.getSignedDistance(t, e, i, n, r, s, o))
            }
        }
    }), y = a.extend({
        _class: "Project", _list: "projects", _reference: "project", _compactSerialize: !0, initialize: function (t) {
            a.call(this, !0), this._children = [], this._namedChildren = {}, this._activeLayer = null, this._currentStyle = new j(null, null, this), this._view = U.create(this, t || tt.getCanvas(1, 1)), this._selectionItems = {}, this._selectionCount = 0, this._updateVersion = 0
        }, _serialize: function (t, e) {
            return r.serialize(this._children, t, !0, e)
        }, _changed: function (t, e) {
            if (1 & t) {
                var i = this._view;
                i && (i._needsUpdate = !0, !i._requested && i._autoUpdate && i.requestUpdate())
            }
            var n = this._changes;
            if (n && e) {
                var r = this._changesById, s = e._id, o = r[s];
                o ? o.flags |= t : n.push(r[s] = {item: e, flags: t})
            }
        }, clear: function () {
            for (var t = this._children, e = t.length - 1; e >= 0; e--) t[e].remove()
        }, isEmpty: function () {
            return !this._children.length
        }, remove: function t() {
            return !!t.base.call(this) && (this._view && this._view.remove(), !0)
        }, getView: function () {
            return this._view
        }, getCurrentStyle: function () {
            return this._currentStyle
        }, setCurrentStyle: function (t) {
            this._currentStyle.set(t)
        }, getIndex: function () {
            return this._index
        }, getOptions: function () {
            return this._scope.settings
        }, getLayers: function () {
            return this._children
        }, getActiveLayer: function () {
            return this._activeLayer || new b({project: this, insert: !0})
        }, getSymbolDefinitions: function () {
            var t = [], e = {};
            return this.getItems({
                class: T, match: function (i) {
                    var n = i._definition, r = n._id;
                    return e[r] || (e[r] = !0, t.push(n)), !1
                }
            }), t
        }, getSymbols: "getSymbolDefinitions", getSelectedItems: function () {
            var t = this._selectionItems, e = [];
            for (var i in t) {
                var n = t[i], r = n._selection;
                1 & r && n.isInserted() ? e.push(n) : r || this._updateSelection(n)
            }
            return e
        }, _updateSelection: function (t) {
            var e = t._id, i = this._selectionItems;
            t._selection ? i[e] !== t && (this._selectionCount++, i[e] = t) : i[e] === t && (this._selectionCount--, delete i[e])
        }, selectAll: function () {
            for (var t = this._children, e = 0, i = t.length; e < i; e++) t[e].setFullySelected(!0)
        }, deselectAll: function () {
            var t = this._selectionItems;
            for (var e in t) t[e].setFullySelected(!1)
        }, addLayer: function (t) {
            return this.insertLayer(e, t)
        }, insertLayer: function (t, e) {
            if (e instanceof b) {
                e._remove(!1, !0), r.splice(this._children, [e], t, 0), e._setProject(this, !0);
                var i = e._name;
                i && e.setName(i), this._changes && e._changed(5), this._activeLayer || (this._activeLayer = e)
            } else e = null;
            return e
        }, _insertItem: function (t, i, n) {
            return i = this.insertLayer(t, i) || (this._activeLayer || this._insertItem(e, new b(w.NO_INSERT), !0)).insertChild(t, i), n && i.activate && i.activate(), i
        }, getItems: function (t) {
            return w._getItems(this, t)
        }, getItem: function (t) {
            return w._getItems(this, t, null, null, !0)[0] || null
        }, importJSON: function (t) {
            this.activate();
            var e = this._activeLayer;
            return r.importJSON(t, e && e.isEmpty() && e)
        }, removeOn: function (t) {
            var e = this._removeSets;
            if (e) {
                "mouseup" === t && (e.mousedrag = null);
                var i = e[t];
                if (i) {
                    for (var n in i) {
                        var r = i[n];
                        for (var s in e) {
                            var o = e[s];
                            o && o != i && delete o[r._id]
                        }
                        r.remove()
                    }
                    e[t] = null
                }
            }
        }, draw: function (t, e, i) {
            this._updateVersion++, t.save(), e.applyToContext(t);
            for (var n = this._children, s = new r({
                offset: new c(0, 0),
                pixelRatio: i,
                viewMatrix: e.isIdentity() ? null : e,
                matrices: [new v],
                updateMatrix: !0
            }), o = 0, a = n.length; o < a; o++) n[o].draw(t, s);
            if (t.restore(), this._selectionCount > 0) {
                t.save(), t.strokeWidth = 1;
                var l = this._selectionItems, h = this._scope.settings.handleSize, u = this._updateVersion;
                for (var d in l) l[d]._drawSelection(t, e, h, l, u);
                t.restore()
            }
        }
    }), w = r.extend(s, {
        statics: {
            extend: function t(e) {
                return e._serializeFields && (e._serializeFields = r.set({}, this.prototype._serializeFields, e._serializeFields)), t.base.apply(this, arguments)
            }, NO_INSERT: {insert: !1}
        },
        _class: "Item",
        _name: null,
        _applyMatrix: !0,
        _canApplyMatrix: !0,
        _canScaleStroke: !1,
        _pivot: null,
        _visible: !0,
        _blendMode: "normal",
        _opacity: 1,
        _locked: !1,
        _guide: !1,
        _clipMask: !1,
        _selection: 0,
        _selectBounds: !0,
        _selectChildren: !1,
        _serializeFields: {
            name: null,
            applyMatrix: null,
            matrix: new v,
            pivot: null,
            visible: !0,
            blendMode: "normal",
            opacity: 1,
            locked: !1,
            guide: !1,
            clipMask: !1,
            selected: !1,
            data: {}
        },
        _prioritize: ["applyMatrix"]
    }, new function () {
        var t = ["onMouseDown", "onMouseUp", "onMouseDrag", "onClick", "onDoubleClick", "onMouseMove", "onMouseEnter", "onMouseLeave"];
        return r.each(t, function (t) {
            this._events[t] = {
                install: function (t) {
                    this.getView()._countItemEvent(t, 1)
                }, uninstall: function (t) {
                    this.getView()._countItemEvent(t, -1)
                }
            }
        }, {
            _events: {
                onFrame: {
                    install: function () {
                        this.getView()._animateItem(this, !0)
                    }, uninstall: function () {
                        this.getView()._animateItem(this, !1)
                    }
                }, onLoad: {}, onError: {}
            }, statics: {_itemHandlers: t}
        })
    }, {
        initialize: function () {
        }, _initialize: function (t, i) {
            var n = t && r.isPlainObject(t), s = n && !0 === t.internal, o = this._matrix = new v,
                a = n && t.project || paper.project, l = paper.settings;
            return this._id = s ? null : u.get(), this._parent = this._index = null, this._applyMatrix = this._canApplyMatrix && l.applyMatrix, i && o.translate(i), o._owner = this, this._style = new j(a._currentStyle, this, a), s || n && 0 == t.insert || !l.insertItems && (!n || !0 !== t.insert) ? this._setProject(a) : (n && t.parent || a)._insertItem(e, this, !0), n && t !== w.NO_INSERT && this.set(t, {
                internal: !0,
                insert: !0,
                project: !0,
                parent: !0
            }), n
        }, _serialize: function (t, e) {
            function i(i) {
                for (var o in i) {
                    var a = s[o];
                    r.equals(a, "leading" === o ? 1.2 * i.fontSize : i[o]) || (n[o] = r.serialize(a, t, "data" !== o, e))
                }
            }

            var n = {}, s = this;
            return i(this._serializeFields), this instanceof x || i(this._style._defaults), [this._class, n]
        }, _changed: function (t) {
            var i = this._symbol, n = this._parent || i, r = this._project;
            8 & t && (this._bounds = this._position = this._decomposed = this._globalMatrix = e), n && 40 & t && w._clearBoundsCache(n), 2 & t && w._clearBoundsCache(this), r && r._changed(t, this), i && i._changed(t)
        }, getId: function () {
            return this._id
        }, getName: function () {
            return this._name
        }, setName: function (t) {
            if (this._name && this._removeNamed(), t === +t + "") throw new Error("Names consisting only of numbers are not supported.");
            var i = this._getOwner();
            if (t && i) {
                var n = i._children, r = i._namedChildren;
                (r[t] = r[t] || []).push(this), t in n || (n[t] = this)
            }
            this._name = t || e, this._changed(128)
        }, getStyle: function () {
            return this._style
        }, setStyle: function (t) {
            this.getStyle().set(t)
        }
    }, r.each(["locked", "visible", "blendMode", "opacity", "guide"], function (t) {
        var e = r.capitalize(t), i = "_" + t, n = {locked: 128, visible: 137};
        this["get" + e] = function () {
            return this[i]
        }, this["set" + e] = function (e) {
            e != this[i] && (this[i] = e, this._changed(n[t] || 129))
        }
    }, {}), {
        beans: !0, getSelection: function () {
            return this._selection
        }, setSelection: function (t) {
            if (t !== this._selection) {
                this._selection = t;
                var e = this._project;
                e && (e._updateSelection(this), this._changed(129))
            }
        }, _changeSelection: function (t, e) {
            var i = this._selection;
            this.setSelection(e ? i | t : i & ~t)
        }, isSelected: function () {
            if (this._selectChildren) for (var t = this._children, e = 0, i = t.length; e < i; e++) if (t[e].isSelected()) return !0;
            return !!(1 & this._selection)
        }, setSelected: function (t) {
            if (this._selectChildren) for (var e = this._children, i = 0, n = e.length; i < n; i++) e[i].setSelected(t);
            this._changeSelection(1, t)
        }, isFullySelected: function () {
            var t = this._children, e = !!(1 & this._selection);
            if (t && e) {
                for (var i = 0, n = t.length; i < n; i++) if (!t[i].isFullySelected()) return !1;
                return !0
            }
            return e
        }, setFullySelected: function (t) {
            var e = this._children;
            if (e) for (var i = 0, n = e.length; i < n; i++) e[i].setFullySelected(t);
            this._changeSelection(1, t)
        }, isClipMask: function () {
            return this._clipMask
        }, setClipMask: function (t) {
            this._clipMask != (t = !!t) && (this._clipMask = t, t && (this.setFillColor(null), this.setStrokeColor(null)), this._changed(129), this._parent && this._parent._changed(1024))
        }, getData: function () {
            return this._data || (this._data = {}), this._data
        }, setData: function (t) {
            this._data = t
        }, getPosition: function (t) {
            var e = this._position, i = t ? c : d;
            if (!e) {
                var n = this._pivot;
                e = this._position = n ? this._matrix._transformPoint(n) : this.getBounds().getCenter(!0)
            }
            return new i(e.x, e.y, this, "setPosition")
        }, setPosition: function () {
            this.translate(c.read(arguments).subtract(this.getPosition(!0)))
        }, getPivot: function () {
            var t = this._pivot;
            return t ? new d(t.x, t.y, this, "setPivot") : null
        }, setPivot: function () {
            this._pivot = c.read(arguments, 0, {clone: !0, readNull: !0}), this._position = e
        }
    }, r.each({
        getStrokeBounds: {stroke: !0},
        getHandleBounds: {handle: !0},
        getInternalBounds: {internal: !0}
    }, function (t, e) {
        this[e] = function (e) {
            return this.getBounds(e, t)
        }
    }, {
        beans: !0, getBounds: function (t, e) {
            var i = e || t instanceof v, n = r.set({}, i ? e : t, this._boundsOptions);
            n.stroke && !this.getStrokeScaling() || (n.cacheItem = this);
            var s = this._getCachedBounds(i && t, n).rect;
            return arguments.length ? s : new m(s.x, s.y, s.width, s.height, this, "setBounds")
        }, setBounds: function () {
            var t = g.read(arguments), e = this.getBounds(), i = this._matrix, n = new v, r = t.getCenter();
            n.translate(r), t.width == e.width && t.height == e.height || (i.isInvertible() || (i.set(i._backup || (new v).translate(i.getTranslation())), e = this.getBounds()), n.scale(0 !== e.width ? t.width / e.width : 0, 0 !== e.height ? t.height / e.height : 0)), r = e.getCenter(), n.translate(-r.x, -r.y), this.transform(n)
        }, _getBounds: function (t, e) {
            var i = this._children;
            return i && i.length ? (w._updateBoundsCache(this, e.cacheItem), w._getBounds(i, t, e)) : new g
        }, _getBoundsCacheKey: function (t, e) {
            return [t.stroke ? 1 : 0, t.handle ? 1 : 0, e ? 1 : 0].join("")
        }, _getCachedBounds: function (t, e, i) {
            t = t && t._orNullIfIdentity();
            var n = e.internal && !i, r = e.cacheItem, s = n ? null : this._matrix._orNullIfIdentity(),
                o = r && (!t || t.equals(s)) && this._getBoundsCacheKey(e, n), a = this._bounds;
            if (w._updateBoundsCache(this._parent || this._symbol, r), o && a && o in a) {
                var l = a[o];
                return {rect: l.rect.clone(), nonscaling: l.nonscaling}
            }
            var h = this._getBounds(t || s, e), u = h.rect || h, c = this._style,
                d = h.nonscaling || c.hasStroke() && !c.getStrokeScaling();
            if (o) {
                a || (this._bounds = a = {});
                var l = a[o] = {rect: u.clone(), nonscaling: d, internal: n}
            }
            return {rect: u, nonscaling: d}
        }, _getStrokeMatrix: function (t, e) {
            var i = this.getStrokeScaling() ? null : e && e.internal ? this : this._parent || this._symbol && this._symbol._item,
                n = i ? i.getViewMatrix().invert() : t;
            return n && n._shiftless()
        }, statics: {
            _updateBoundsCache: function (t, e) {
                if (t && e) {
                    var i = e._id, n = t._boundsCache = t._boundsCache || {ids: {}, list: []};
                    n.ids[i] || (n.list.push(e), n.ids[i] = e)
                }
            }, _clearBoundsCache: function (t) {
                var i = t._boundsCache;
                if (i) {
                    t._bounds = t._position = t._boundsCache = e;
                    for (var n = 0, r = i.list, s = r.length; n < s; n++) {
                        var o = r[n];
                        o !== t && (o._bounds = o._position = e, o._boundsCache && w._clearBoundsCache(o))
                    }
                }
            }, _getBounds: function (t, e, i) {
                var n = 1 / 0, r = -n, s = n, o = r, a = !1;
                i = i || {};
                for (var l = 0, h = t.length; l < h; l++) {
                    var u = t[l];
                    if (u._visible && !u.isEmpty()) {
                        var c = u._getCachedBounds(e && e.appended(u._matrix), i, !0), d = c.rect;
                        n = Math.min(d.x, n), s = Math.min(d.y, s), r = Math.max(d.x + d.width, r), o = Math.max(d.y + d.height, o), c.nonscaling && (a = !0)
                    }
                }
                return {rect: isFinite(n) ? new g(n, s, r - n, o - s) : new g, nonscaling: a}
            }
        }
    }), {
        beans: !0, _decompose: function () {
            return this._applyMatrix ? null : this._decomposed || (this._decomposed = this._matrix.decompose())
        }, getRotation: function () {
            var t = this._decompose();
            return t ? t.rotation : 0
        }, setRotation: function (t) {
            var e = this.getRotation();
            if (null != e && null != t) {
                var i = this._decomposed;
                this.rotate(t - e), i && (i.rotation = t, this._decomposed = i)
            }
        }, getScaling: function () {
            var t = this._decompose(), e = t && t.scaling;
            return new d(e ? e.x : 1, e ? e.y : 1, this, "setScaling")
        }, setScaling: function () {
            var t = this.getScaling(), e = c.read(arguments, 0, {clone: !0, readNull: !0});
            if (t && e && !t.equals(e)) {
                var i = this.getRotation(), n = this._decomposed, r = new v, s = this.getPosition(!0);
                r.translate(s), i && r.rotate(i), r.scale(e.x / t.x, e.y / t.y), i && r.rotate(-i), r.translate(s.negate()), this.transform(r), n && (n.scaling = e, this._decomposed = n)
            }
        }, getMatrix: function () {
            return this._matrix
        }, setMatrix: function () {
            var t = this._matrix;
            t.initialize.apply(t, arguments)
        }, getGlobalMatrix: function (t) {
            var e = this._globalMatrix, i = this._project._updateVersion;
            if (e && e._updateVersion !== i && (e = null), !e) {
                e = this._globalMatrix = this._matrix.clone();
                var n = this._parent;
                n && e.prepend(n.getGlobalMatrix(!0)), e._updateVersion = i
            }
            return t ? e : e.clone()
        }, getViewMatrix: function () {
            return this.getGlobalMatrix().prepend(this.getView()._matrix)
        }, getApplyMatrix: function () {
            return this._applyMatrix
        }, setApplyMatrix: function (t) {
            (this._applyMatrix = this._canApplyMatrix && !!t) && this.transform(null, !0)
        }, getTransformContent: "#getApplyMatrix", setTransformContent: "#setApplyMatrix"
    }, {
        getProject: function () {
            return this._project
        }, _setProject: function (t, e) {
            if (this._project !== t) {
                this._project && this._installEvents(!1), this._project = t;
                for (var i = this._children, n = 0, r = i && i.length; n < r; n++) i[n]._setProject(t);
                e = !0
            }
            e && this._installEvents(!0)
        }, getView: function () {
            return this._project._view
        }, _installEvents: function t(e) {
            t.base.call(this, e);
            for (var i = this._children, n = 0, r = i && i.length; n < r; n++) i[n]._installEvents(e)
        }, getLayer: function () {
            for (var t = this; t = t._parent;) if (t instanceof b) return t;
            return null
        }, getParent: function () {
            return this._parent
        }, setParent: function (t) {
            return t.addChild(this)
        }, _getOwner: "#getParent", getChildren: function () {
            return this._children
        }, setChildren: function (t) {
            this.removeChildren(), this.addChildren(t)
        }, getFirstChild: function () {
            return this._children && this._children[0] || null
        }, getLastChild: function () {
            return this._children && this._children[this._children.length - 1] || null
        }, getNextSibling: function () {
            var t = this._getOwner();
            return t && t._children[this._index + 1] || null
        }, getPreviousSibling: function () {
            var t = this._getOwner();
            return t && t._children[this._index - 1] || null
        }, getIndex: function () {
            return this._index
        }, equals: function (t) {
            return t === this || t && this._class === t._class && this._style.equals(t._style) && this._matrix.equals(t._matrix) && this._locked === t._locked && this._visible === t._visible && this._blendMode === t._blendMode && this._opacity === t._opacity && this._clipMask === t._clipMask && this._guide === t._guide && this._equals(t) || !1
        }, _equals: function (t) {
            return r.equals(this._children, t._children)
        }, clone: function (t) {
            var i = new this.constructor(w.NO_INSERT), n = this._children,
                s = r.pick(t ? t.insert : e, t === e || !0 === t), o = r.pick(t ? t.deep : e, !0);
            n && i.copyAttributes(this), n && !o || i.copyContent(this), n || i.copyAttributes(this), s && i.insertAbove(this);
            var a = this._name, l = this._parent;
            if (a && l) {
                for (var n = l._children, h = a, u = 1; n[a];) a = h + " " + u++;
                a !== h && i.setName(a)
            }
            return i
        }, copyContent: function (t) {
            for (var e = t._children, i = 0, n = e && e.length; i < n; i++) this.addChild(e[i].clone(!1), !0)
        }, copyAttributes: function (t, e) {
            this.setStyle(t._style);
            for (var i = ["_locked", "_visible", "_blendMode", "_opacity", "_clipMask", "_guide"], n = 0, s = i.length; n < s; n++) {
                var o = i[n]
                ;t.hasOwnProperty(o) && (this[o] = t[o])
            }
            e || this._matrix.set(t._matrix, !0), this.setApplyMatrix(t._applyMatrix), this.setPivot(t._pivot), this.setSelection(t._selection);
            var a = t._data, l = t._name;
            this._data = a ? r.clone(a) : null, l && this.setName(l)
        }, rasterize: function (t, i) {
            var n = this.getStrokeBounds(), s = (t || this.getView().getResolution()) / 72, o = n.getTopLeft().floor(),
                a = n.getBottomRight().ceil(), l = new f(a.subtract(o)), h = new S(w.NO_INSERT);
            if (!l.isZero()) {
                var u = tt.getCanvas(l.multiply(s)), c = u.getContext("2d"), d = (new v).scale(s).translate(o.negate());
                c.save(), d.applyToContext(c), this.draw(c, new r({matrices: [d]})), c.restore(), h.setCanvas(u)
            }
            return h.transform((new v).translate(o.add(l.divide(2))).scale(1 / s)), (i === e || i) && h.insertAbove(this), h
        }, contains: function () {
            return !!this._contains(this._matrix._inverseTransform(c.read(arguments)))
        }, _contains: function (t) {
            var e = this._children;
            if (e) {
                for (var i = e.length - 1; i >= 0; i--) if (e[i].contains(t)) return !0;
                return !1
            }
            return t.isInside(this.getInternalBounds())
        }, isInside: function () {
            return g.read(arguments).contains(this.getBounds())
        }, _asPathItem: function () {
            return new O.Rectangle({rectangle: this.getInternalBounds(), matrix: this._matrix, insert: !1})
        }, intersects: function (t, e) {
            return t instanceof w && this._asPathItem().getIntersections(t._asPathItem(), null, e, !0).length > 0
        }
    }, new function () {
        function t() {
            return this._hitTest(c.read(arguments), k.getOptions(arguments))
        }

        function e() {
            var t = c.read(arguments), e = k.getOptions(arguments), i = [];
            return this._hitTest(t, r.set({all: i}, e)), i
        }

        function i(t, e, i, n) {
            var r = this._children;
            if (r) for (var s = r.length - 1; s >= 0; s--) {
                var o = r[s], a = o !== n && o._hitTest(t, e, i);
                if (a && !e.all) return a
            }
            return null
        }

        return y.inject({hitTest: t, hitTestAll: e, _hitTest: i}), {hitTest: t, hitTestAll: e, _hitTestChildren: i}
    }, {
        _hitTest: function (t, e, i) {
            function n(t) {
                return t && p && !p(t) && (t = null), t && e.all && e.all.push(t), t
            }

            function s(e, i) {
                var n = i ? u["get" + i]() : g.getPosition();
                if (t.subtract(n).divide(h).length <= 1) return new k(e, g, {name: i ? r.hyphenate(i) : e, point: n})
            }

            if (this._locked || !this._visible || this._guide && !e.guides || this.isEmpty()) return null;
            var o = this._matrix, a = i ? i.appended(o) : this.getGlobalMatrix().prepend(this.getView()._matrix),
                l = Math.max(e.tolerance, 1e-12),
                h = e._tolerancePadding = new f(O._getStrokePadding(l, o._shiftless().invert()));
            if (!(t = o._inverseTransform(t)) || !this._children && !this.getBounds({
                internal: !0,
                stroke: !0,
                handle: !0
            }).expand(h.multiply(2))._containsPoint(t)) return null;
            var u, c,
                d = !(e.guides && !this._guide || e.selected && !this.isSelected() || e.type && e.type !== r.hyphenate(this._class) || e.class && !(this instanceof e.class)),
                p = e.match, g = this, m = e.position, v = e.center, _ = e.bounds;
            if (d && this._parent && (m || v || _)) {
                if ((v || _) && (u = this.getInternalBounds()), !(c = m && s("position") || v && s("center", "Center")) && _) for (var y = ["TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], w = 0; w < 8 && !c; w++) c = s("bounds", y[w]);
                c = n(c)
            }
            return c || (c = this._hitTestChildren(t, e, a) || d && n(this._hitTestSelf(t, e, a, this.getStrokeScaling() ? null : a._shiftless().invert())) || null), c && c.point && (c.point = o.transform(c.point)), c
        }, _hitTestSelf: function (t, e) {
            if (e.fill && this.hasFill() && this._contains(t)) return new k("fill", this)
        }, matches: function (t, e) {
            function i(t, e) {
                for (var n in t) if (t.hasOwnProperty(n)) {
                    var s = t[n], o = e[n];
                    if (r.isPlainObject(s) && r.isPlainObject(o)) {
                        if (!i(s, o)) return !1
                    } else if (!r.equals(s, o)) return !1
                }
                return !0
            }

            var n = typeof t;
            if ("object" === n) {
                for (var s in t) if (t.hasOwnProperty(s) && !this.matches(s, t[s])) return !1;
                return !0
            }
            if ("function" === n) return t(this);
            if ("match" === t) return e(this);
            var o = /^(empty|editable)$/.test(t) ? this["is" + r.capitalize(t)]() : "type" === t ? r.hyphenate(this._class) : this[t];
            if ("class" === t) {
                if ("function" == typeof e) return this instanceof e;
                o = this._class
            }
            if ("function" == typeof e) return !!e(o);
            if (e) {
                if (e.test) return e.test(o);
                if (r.isPlainObject(e)) return i(e, o)
            }
            return r.equals(o, e)
        }, getItems: function (t) {
            return w._getItems(this, t, this._matrix)
        }, getItem: function (t) {
            return w._getItems(this, t, this._matrix, null, !0)[0] || null
        }, statics: {
            _getItems: function t(e, i, n, s, o) {
                if (!s) {
                    var a = "object" == typeof i && i, l = a && a.overlapping, h = a && a.inside, u = l || h,
                        c = u && g.read([u]);
                    s = {
                        items: [],
                        recursive: a && !1 !== a.recursive,
                        inside: !!h,
                        overlapping: !!l,
                        rect: c,
                        path: l && new O.Rectangle({rectangle: c, insert: !1})
                    }, a && (i = r.filter({}, i, {recursive: !0, inside: !0, overlapping: !0}))
                }
                var d = e._children, f = s.items, c = s.rect;
                n = c && (n || new v);
                for (var p = 0, m = d && d.length; p < m; p++) {
                    var _ = d[p], y = n && n.appended(_._matrix), w = !0;
                    if (c) {
                        var u = _.getBounds(y);
                        if (!c.intersects(u)) continue;
                        c.contains(u) || s.overlapping && (u.contains(c) || s.path.intersects(_, y)) || (w = !1)
                    }
                    if (w && _.matches(i) && (f.push(_), o)) break;
                    if (!1 !== s.recursive && t(_, i, y, s, o), o && f.length > 0) break
                }
                return f
            }
        }
    }, {
        importJSON: function (t) {
            var e = r.importJSON(t, this);
            return e !== this ? this.addChild(e) : e
        }, addChild: function (t) {
            return this.insertChild(e, t)
        }, insertChild: function (t, e) {
            var i = e ? this.insertChildren(t, [e]) : null;
            return i && i[0]
        }, addChildren: function (t) {
            return this.insertChildren(this._children.length, t)
        }, insertChildren: function (t, e) {
            var i = this._children;
            if (i && e && e.length > 0) {
                e = r.slice(e);
                for (var n = {}, s = e.length - 1; s >= 0; s--) {
                    var o = e[s], a = o && o._id;
                    !o || n[a] ? e.splice(s, 1) : (o._remove(!1, !0), n[a] = !0)
                }
                r.splice(i, e, t, 0);
                for (var l = this._project, h = l._changes, s = 0, u = e.length; s < u; s++) {
                    var o = e[s], c = o._name;
                    o._parent = this, o._setProject(l, !0), c && o.setName(c), h && o._changed(5)
                }
                this._changed(11)
            } else e = null;
            return e
        }, _insertItem: "#insertChild", _insertAt: function (t, e) {
            var i = t && t._getOwner(), n = t !== this && i ? this : null;
            return n && (n._remove(!1, !0), i._insertItem(t._index + e, n)), n
        }, insertAbove: function (t) {
            return this._insertAt(t, 1)
        }, insertBelow: function (t) {
            return this._insertAt(t, 0)
        }, sendToBack: function () {
            var t = this._getOwner();
            return t ? t._insertItem(0, this) : null
        }, bringToFront: function () {
            var t = this._getOwner();
            return t ? t._insertItem(e, this) : null
        }, appendTop: "#addChild", appendBottom: function (t) {
            return this.insertChild(0, t)
        }, moveAbove: "#insertAbove", moveBelow: "#insertBelow", addTo: function (t) {
            return t._insertItem(e, this)
        }, copyTo: function (t) {
            return this.clone(!1).addTo(t)
        }, reduce: function (t) {
            var e = this._children;
            if (e && 1 === e.length) {
                var i = e[0].reduce(t);
                return this._parent ? (i.insertAbove(this), this.remove()) : i.remove(), i
            }
            return this
        }, _removeNamed: function () {
            var t = this._getOwner();
            if (t) {
                var e = t._children, i = t._namedChildren, n = this._name, r = i[n], s = r ? r.indexOf(this) : -1;
                -1 !== s && (e[n] == this && delete e[n], r.splice(s, 1), r.length ? e[n] = r[0] : delete i[n])
            }
        }, _remove: function (t, e) {
            var i = this._getOwner(), n = this._project, s = this._index;
            return !!i && (this._name && this._removeNamed(), null != s && (n._activeLayer === this && (n._activeLayer = this.getNextSibling() || this.getPreviousSibling()), r.splice(i._children, null, s, 1)), this._installEvents(!1), t && n._changes && this._changed(5), e && i._changed(11, this), this._parent = null, !0)
        }, remove: function () {
            return this._remove(!0, !0)
        }, replaceWith: function (t) {
            var e = t && t.insertBelow(this);
            return e && this.remove(), e
        }, removeChildren: function (t, e) {
            if (!this._children) return null;
            t = t || 0, e = r.pick(e, this._children.length);
            for (var i = r.splice(this._children, null, t, e - t), n = i.length - 1; n >= 0; n--) i[n]._remove(!0, !1);
            return i.length > 0 && this._changed(11), i
        }, clear: "#removeChildren", reverseChildren: function () {
            if (this._children) {
                this._children.reverse();
                for (var t = 0, e = this._children.length; t < e; t++) this._children[t]._index = t;
                this._changed(11)
            }
        }, isEmpty: function () {
            var t = this._children;
            return !t || !t.length
        }, isEditable: function () {
            for (var t = this; t;) {
                if (!t._visible || t._locked) return !1;
                t = t._parent
            }
            return !0
        }, hasFill: function () {
            return this.getStyle().hasFill()
        }, hasStroke: function () {
            return this.getStyle().hasStroke()
        }, hasShadow: function () {
            return this.getStyle().hasShadow()
        }, _getOrder: function (t) {
            function e(t) {
                var e = [];
                do {
                    e.unshift(t)
                } while (t = t._parent);
                return e
            }

            for (var i = e(this), n = e(t), r = 0, s = Math.min(i.length, n.length); r < s; r++) if (i[r] != n[r]) return i[r]._index < n[r]._index ? 1 : -1;
            return 0
        }, hasChildren: function () {
            return this._children && this._children.length > 0
        }, isInserted: function () {
            return !!this._parent && this._parent.isInserted()
        }, isAbove: function (t) {
            return -1 === this._getOrder(t)
        }, isBelow: function (t) {
            return 1 === this._getOrder(t)
        }, isParent: function (t) {
            return this._parent === t
        }, isChild: function (t) {
            return t && t._parent === this
        }, isDescendant: function (t) {
            for (var e = this; e = e._parent;) if (e === t) return !0;
            return !1
        }, isAncestor: function (t) {
            return !!t && t.isDescendant(this)
        }, isSibling: function (t) {
            return this._parent === t._parent
        }, isGroupedWith: function (t) {
            for (var e = this._parent; e;) {
                if (e._parent && /^(Group|Layer|CompoundPath)$/.test(e._class) && t.isDescendant(e)) return !0;
                e = e._parent
            }
            return !1
        }
    }, r.each(["rotate", "scale", "shear", "skew"], function (t) {
        var e = "rotate" === t;
        this[t] = function () {
            var i = (e ? r : c).read(arguments), n = c.read(arguments, 0, {readNull: !0});
            return this.transform((new v)[t](i, n || this.getPosition(!0)))
        }
    }, {
        translate: function () {
            var t = new v;
            return this.transform(t.translate.apply(t, arguments))
        }, transform: function (t, e, i, n) {
            var r = this._matrix, s = t && !t.isIdentity(),
                o = (e || this._applyMatrix) && (!r.isIdentity() || s || e && i && this._children);
            if (!s && !o) return this;
            if (s) {
                !t.isInvertible() && r.isInvertible() && (r._backup = r.getValues()), r.prepend(t, !0);
                var a = this._style, l = a.getFillColor(!0), h = a.getStrokeColor(!0);
                l && l.transform(t), h && h.transform(t)
            }
            if (o && (o = this._transformContent(r, i, n))) {
                var u = this._pivot;
                u && r._transformPoint(u, u, !0), r.reset(!0), n && this._canApplyMatrix && (this._applyMatrix = !0)
            }
            var c = this._bounds, d = this._position;
            (s || o) && this._changed(9);
            var f = s && c && t.decompose();
            if (f && f.skewing.isZero() && f.rotation % 90 == 0) {
                for (var p in c) {
                    var g = c[p];
                    if (g.nonscaling) delete c[p]; else if (o || !g.internal) {
                        var m = g.rect;
                        t._transformBounds(m, m)
                    }
                }
                this._bounds = c;
                var v = c[this._getBoundsCacheKey(this._boundsOptions || {})];
                v && (this._position = v.rect.getCenter(!0))
            } else s && d && this._pivot && (this._position = t._transformPoint(d, d));
            return this
        }, _transformContent: function (t, e, i) {
            var n = this._children;
            if (n) {
                for (var r = 0, s = n.length; r < s; r++) n[r].transform(t, !0, e, i);
                return !0
            }
        }, globalToLocal: function () {
            return this.getGlobalMatrix(!0)._inverseTransform(c.read(arguments))
        }, localToGlobal: function () {
            return this.getGlobalMatrix(!0)._transformPoint(c.read(arguments))
        }, parentToLocal: function () {
            return this._matrix._inverseTransform(c.read(arguments))
        }, localToParent: function () {
            return this._matrix._transformPoint(c.read(arguments))
        }, fitBounds: function (t, e) {
            t = g.read(arguments);
            var i = this.getBounds(), n = i.height / i.width, r = t.height / t.width,
                s = (e ? n > r : n < r) ? t.width / i.width : t.height / i.height,
                o = new g(new c, new f(i.width * s, i.height * s));
            o.setCenter(t.getCenter()), this.setBounds(o)
        }
    }), {
        _setStyles: function (t, e, i) {
            var n = this._style, r = this._matrix;
            if (n.hasFill() && (t.fillStyle = n.getFillColor().toCanvasStyle(t, r)), n.hasStroke()) {
                t.strokeStyle = n.getStrokeColor().toCanvasStyle(t, r), t.lineWidth = n.getStrokeWidth();
                var s = n.getStrokeJoin(), o = n.getStrokeCap(), a = n.getMiterLimit();
                if (s && (t.lineJoin = s), o && (t.lineCap = o), a && (t.miterLimit = a), paper.support.nativeDash) {
                    var l = n.getDashArray(), h = n.getDashOffset();
                    l && l.length && ("setLineDash" in t ? (t.setLineDash(l), t.lineDashOffset = h) : (t.mozDash = l, t.mozDashOffset = h))
                }
            }
            if (n.hasShadow()) {
                var u = e.pixelRatio || 1, d = i._shiftless().prepend((new v).scale(u, u)),
                    f = d.transform(new c(n.getShadowBlur(), 0)), p = d.transform(this.getShadowOffset());
                t.shadowColor = n.getShadowColor().toCanvasStyle(t), t.shadowBlur = f.getLength(), t.shadowOffsetX = p.x, t.shadowOffsetY = p.y
            }
        }, draw: function (t, e, i) {
            var n = this._updateVersion = this._project._updateVersion;
            if (this._visible && 0 !== this._opacity) {
                var r = e.matrices, s = e.viewMatrix, o = this._matrix, a = r[r.length - 1].appended(o);
                if (a.isInvertible()) {
                    s = s ? s.appended(a) : a, r.push(a), e.updateMatrix && (a._updateVersion = n, this._globalMatrix = a);
                    var l, h, u, c = this._blendMode, d = this._opacity, f = "normal" === c, p = et.nativeModes[c],
                        g = f && 1 === d || e.dontStart || e.clip || (p || f && d < 1) && this._canComposite(),
                        m = e.pixelRatio || 1;
                    if (!g) {
                        var v = this.getStrokeBounds(s);
                        if (!v.width || !v.height) return;
                        u = e.offset, h = e.offset = v.getTopLeft().floor(), l = t, t = tt.getContext(v.getSize().ceil().add(1).multiply(m)), 1 !== m && t.scale(m, m)
                    }
                    t.save();
                    var _ = i ? i.appended(o) : this._canScaleStroke && !this.getStrokeScaling(!0) && s,
                        y = !g && e.clipItem, w = !_ || y;
                    if (g ? (t.globalAlpha = d, p && (t.globalCompositeOperation = c)) : w && t.translate(-h.x, -h.y), w && (g ? o : s).applyToContext(t), y && e.clipItem.draw(t, e.extend({clip: !0})), _) {
                        t.setTransform(m, 0, 0, m, 0, 0);
                        var x = e.offset;
                        x && t.translate(-x.x, -x.y)
                    }
                    this._draw(t, e, s, _), t.restore(), r.pop(), e.clip && !e.dontFinish && t.clip(), g || (et.process(c, t, l, d, h.subtract(u).multiply(m)), tt.release(t), e.offset = u)
                }
            }
        }, _isUpdated: function (t) {
            var e = this._parent;
            if (e instanceof L) return e._isUpdated(t);
            var i = this._updateVersion === t;
            return !i && e && e._visible && e._isUpdated(t) && (this._updateVersion = t, i = !0), i
        }, _drawSelection: function (t, e, i, n, r) {
            var s = this._selection, o = 1 & s, a = 2 & s || o && this._selectBounds, l = 4 & s;
            if (this._drawSelected || (o = !1), (o || a || l) && this._isUpdated(r)) {
                var h, u = this.getSelectedColor(!0) || (h = this.getLayer()) && h.getSelectedColor(!0),
                    c = e.appended(this.getGlobalMatrix(!0)), d = i / 2;
                if (t.strokeStyle = t.fillStyle = u ? u.toCanvasStyle(t) : "#009dec", o && this._drawSelected(t, c, n), l) {
                    var f = this.getPosition(!0), p = f.x, g = f.y;
                    t.beginPath(), t.arc(p, g, d, 0, 2 * Math.PI, !0), t.stroke();
                    for (var m = [[0, -1], [1, 0], [0, 1], [-1, 0]], v = d, _ = i + 1, y = 0; y < 4; y++) {
                        var w = m[y], x = w[0], b = w[1];
                        t.moveTo(p + x * v, g + b * v), t.lineTo(p + x * _, g + b * _), t.stroke()
                    }
                }
                if (a) {
                    var C = c._transformCorners(this.getInternalBounds());
                    t.beginPath();
                    for (var y = 0; y < 8; y++) t[y ? "lineTo" : "moveTo"](C[y], C[++y]);
                    t.closePath(), t.stroke();
                    for (var y = 0; y < 8; y++) t.fillRect(C[y] - d, C[++y] - d, i, i)
                }
            }
        }, _canComposite: function () {
            return !1
        }
    }, r.each(["down", "drag", "up", "move"], function (t) {
        this["removeOn" + r.capitalize(t)] = function () {
            var e = {};
            return e[t] = !0, this.removeOn(e)
        }
    }, {
        removeOn: function (t) {
            for (var e in t) if (t[e]) {
                var i = "mouse" + e, n = this._project, r = n._removeSets = n._removeSets || {};
                r[i] = r[i] || {}, r[i][this._id] = this
            }
            return this
        }
    })), x = w.extend({
        _class: "Group",
        _selectBounds: !1,
        _selectChildren: !0,
        _serializeFields: {children: []},
        initialize: function (t) {
            this._children = [], this._namedChildren = {}, this._initialize(t) || this.addChildren(Array.isArray(t) ? t : arguments)
        },
        _changed: function t(i) {
            t.base.call(this, i), 1026 & i && (this._clipItem = e)
        },
        _getClipItem: function () {
            var t = this._clipItem;
            if (t === e) {
                t = null;
                for (var i = this._children, n = 0, r = i.length; n < r; n++) if (i[n]._clipMask) {
                    t = i[n];
                    break
                }
                this._clipItem = t
            }
            return t
        },
        isClipped: function () {
            return !!this._getClipItem()
        },
        setClipped: function (t) {
            var e = this.getFirstChild();
            e && e.setClipMask(t)
        },
        _getBounds: function t(e, i) {
            var n = this._getClipItem();
            return n ? n._getCachedBounds(e && e.appended(n._matrix), r.set({}, i, {stroke: !1})) : t.base.call(this, e, i)
        },
        _hitTestChildren: function t(e, i, n) {
            var r = this._getClipItem();
            return (!r || r.contains(e)) && t.base.call(this, e, i, n, r)
        },
        _draw: function (t, e) {
            var i = e.clip, n = !i && this._getClipItem();
            e = e.extend({
                clipItem: n,
                clip: !1
            }), i ? (t.beginPath(), e.dontStart = e.dontFinish = !0) : n && n.draw(t, e.extend({clip: !0}));
            for (var r = this._children, s = 0, o = r.length; s < o; s++) {
                var a = r[s];
                a !== n && a.draw(t, e)
            }
        }
    }), b = x.extend({
        _class: "Layer", initialize: function () {
            x.apply(this, arguments)
        }, _getOwner: function () {
            return this._parent || null != this._index && this._project
        }, isInserted: function t() {
            return this._parent ? t.base.call(this) : null != this._index
        }, activate: function () {
            this._project._activeLayer = this
        }, _hitTestSelf: function () {
        }
    }), C = w.extend({
        _class: "Shape",
        _applyMatrix: !1,
        _canApplyMatrix: !1,
        _canScaleStroke: !0,
        _serializeFields: {type: null, size: null, radius: null},
        initialize: function (t, e) {
            this._initialize(t, e)
        },
        _equals: function (t) {
            return this._type === t._type && this._size.equals(t._size) && r.equals(this._radius, t._radius)
        },
        copyContent: function (t) {
            this.setType(t._type), this.setSize(t._size), this.setRadius(t._radius)
        },
        getType: function () {
            return this._type
        },
        setType: function (t) {
            this._type = t
        },
        getShape: "#getType",
        setShape: "#setType",
        getSize: function () {
            var t = this._size;
            return new p(t.width, t.height, this, "setSize")
        },
        setSize: function () {
            var t = f.read(arguments);
            if (this._size) {
                if (!this._size.equals(t)) {
                    var e = this._type, i = t.width, n = t.height;
                    "rectangle" === e ? this._radius.set(f.min(this._radius, t.divide(2))) : "circle" === e ? (i = n = (i + n) / 2, this._radius = i / 2) : "ellipse" === e && this._radius._set(i / 2, n / 2), this._size._set(i, n), this._changed(9)
                }
            } else this._size = t.clone()
        },
        getRadius: function () {
            var t = this._radius;
            return "circle" === this._type ? t : new p(t.width, t.height, this, "setRadius")
        },
        setRadius: function (t) {
            var e = this._type;
            if ("circle" === e) {
                if (t === this._radius) return;
                var i = 2 * t;
                this._radius = t, this._size._set(i, i)
            } else if (t = f.read(arguments), this._radius) {
                if (this._radius.equals(t)) return;
                if (this._radius.set(t), "rectangle" === e) {
                    var i = f.max(this._size, t.multiply(2));
                    this._size.set(i)
                } else "ellipse" === e && this._size._set(2 * t.width, 2 * t.height)
            } else this._radius = t.clone();
            this._changed(9)
        },
        isEmpty: function () {
            return !1
        },
        toPath: function (t) {
            var i = new (O[r.capitalize(this._type)])({
                center: new c,
                size: this._size,
                radius: this._radius,
                insert: !1
            });
            return i.copyAttributes(this), paper.settings.applyMatrix && i.setApplyMatrix(!0), (t === e || t) && i.insertAbove(this), i
        },
        toShape: "#clone",
        _asPathItem: function () {
            return this.toPath(!1)
        },
        _draw: function (t, e, i, n) {
            var r = this._style, s = r.hasFill(), o = r.hasStroke(), a = e.dontFinish || e.clip, l = !n;
            if (s || o || a) {
                var h = this._type, u = this._radius, c = "circle" === h;
                if (e.dontStart || t.beginPath(), l && c) t.arc(0, 0, u, 0, 2 * Math.PI, !0); else {
                    var d = c ? u : u.width, f = c ? u : u.height, p = this._size, g = p.width, m = p.height;
                    if (l && "rectangle" === h && 0 === d && 0 === f) t.rect(-g / 2, -m / 2, g, m); else {
                        var v = g / 2, _ = m / 2, y = .44771525016920644, w = d * y, x = f * y,
                            b = [-v, -_ + f, -v, -_ + x, -v + w, -_, -v + d, -_, v - d, -_, v - w, -_, v, -_ + x, v, -_ + f, v, _ - f, v, _ - x, v - w, _, v - d, _, -v + d, _, -v + w, _, -v, _ - x, -v, _ - f];
                        n && n.transform(b, b, 32), t.moveTo(b[0], b[1]), t.bezierCurveTo(b[2], b[3], b[4], b[5], b[6], b[7]), v !== d && t.lineTo(b[8], b[9]), t.bezierCurveTo(b[10], b[11], b[12], b[13], b[14], b[15]), _ !== f && t.lineTo(b[16], b[17]), t.bezierCurveTo(b[18], b[19], b[20], b[21], b[22], b[23]), v !== d && t.lineTo(b[24], b[25]), t.bezierCurveTo(b[26], b[27], b[28], b[29], b[30], b[31])
                    }
                }
                t.closePath()
            }
            a || !s && !o || (this._setStyles(t, e, i), s && (t.fill(r.getFillRule()), t.shadowColor = "rgba(0,0,0,0)"), o && t.stroke())
        },
        _canComposite: function () {
            return !(this.hasFill() && this.hasStroke())
        },
        _getBounds: function (t, e) {
            var i = new g(this._size).setCenter(0, 0), n = this._style,
                r = e.stroke && n.hasStroke() && n.getStrokeWidth();
            return t && (i = t._transformBounds(i)), r ? i.expand(O._getStrokePadding(r, this._getStrokeMatrix(t, e))) : i
        }
    }, new function () {
        function t(t, e, i) {
            var n = t._radius;
            if (!n.isZero()) for (var r = t._size.divide(2), s = 1; s <= 4; s++) {
                var o = new c(s > 1 && s < 4 ? -1 : 1, s > 2 ? -1 : 1), a = o.multiply(r),
                    l = a.subtract(o.multiply(n)), h = new g(i ? a.add(o.multiply(i)) : a, l);
                if (h.contains(e)) return {point: l, quadrant: s}
            }
        }

        function e(t, e, i, n) {
            var r = t.divide(e);
            return (!n || r.isInQuadrant(n)) && r.subtract(r.normalize()).multiply(e).divide(i).length <= 1
        }

        return {
            _contains: function e(i) {
                if ("rectangle" === this._type) {
                    var n = t(this, i);
                    return n ? i.subtract(n.point).divide(this._radius).getLength() <= 1 : e.base.call(this, i)
                }
                return i.divide(this.size).getLength() <= .5
            }, _hitTestSelf: function i(n, r, s, o) {
                var a = !1, l = this._style, h = r.stroke && l.hasStroke(), u = r.fill && l.hasFill();
                if (h || u) {
                    var c = this._type, d = this._radius, f = h ? l.getStrokeWidth() / 2 : 0,
                        p = r._tolerancePadding.add(O._getStrokePadding(f, !l.getStrokeScaling() && o));
                    if ("rectangle" === c) {
                        var m = p.multiply(2), v = t(this, n, m);
                        if (v) a = e(n.subtract(v.point), d, p, v.quadrant); else {
                            var _ = new g(this._size).setCenter(0, 0), y = _.expand(m), w = _.expand(m.negate());
                            a = y._containsPoint(n) && !w._containsPoint(n)
                        }
                    } else a = e(n, d, p)
                }
                return a ? new k(h ? "stroke" : "fill", this) : i.base.apply(this, arguments)
            }
        }
    }, {
        statics: new function () {
            function t(t, e, i, n, s) {
                var o = new C(r.getNamed(s), e);
                return o._type = t, o._size = i, o._radius = n, o
            }

            return {
                Circle: function () {
                    var e = c.readNamed(arguments, "center"), i = r.readNamed(arguments, "radius");
                    return t("circle", e, new f(2 * i), i, arguments)
                }, Rectangle: function () {
                    var e = g.readNamed(arguments, "rectangle"),
                        i = f.min(f.readNamed(arguments, "radius"), e.getSize(!0).divide(2));
                    return t("rectangle", e.getCenter(!0), e.getSize(!0), i, arguments)
                }, Ellipse: function () {
                    var e = C._readEllipse(arguments), i = e.radius;
                    return t("ellipse", e.center, i.multiply(2), i, arguments)
                }, _readEllipse: function (t) {
                    var e, i;
                    if (r.hasNamed(t, "radius")) e = c.readNamed(t, "center"), i = f.readNamed(t, "radius"); else {
                        var n = g.readNamed(t, "rectangle");
                        e = n.getCenter(!0), i = n.getSize(!0).divide(2)
                    }
                    return {center: e, radius: i}
                }
            }
        }
    }), S = w.extend({
        _class: "Raster",
        _applyMatrix: !1,
        _canApplyMatrix: !1,
        _boundsOptions: {stroke: !1, handle: !1},
        _serializeFields: {crossOrigin: null, source: null},
        _prioritize: ["crossOrigin"],
        initialize: function (t, i) {
            if (!this._initialize(t, i !== e && c.read(arguments, 1))) {
                var r = "string" == typeof t ? n.getElementById(t) : t;
                r ? this.setImage(r) : this.setSource(t)
            }
            this._size || (this._size = new f, this._loaded = !1)
        },
        _equals: function (t) {
            return this.getSource() === t.getSource()
        },
        copyContent: function (t) {
            var e = t._image, i = t._canvas;
            if (e) this._setImage(e); else if (i) {
                var n = tt.getCanvas(t._size);
                n.getContext("2d").drawImage(i, 0, 0), this._setImage(n)
            }
            this._crossOrigin = t._crossOrigin
        },
        getSize: function () {
            var t = this._size;
            return new p(t ? t.width : 0, t ? t.height : 0, this, "setSize")
        },
        setSize: function () {
            var t = f.read(arguments);
            if (!t.equals(this._size)) if (t.width > 0 && t.height > 0) {
                var e = this.getElement();
                this._setImage(tt.getCanvas(t)), e && this.getContext(!0).drawImage(e, 0, 0, t.width, t.height)
            } else this._canvas && tt.release(this._canvas), this._size = t.clone()
        },
        getWidth: function () {
            return this._size ? this._size.width : 0
        },
        setWidth: function (t) {
            this.setSize(t, this.getHeight())
        },
        getHeight: function () {
            return this._size ? this._size.height : 0
        },
        setHeight: function (t) {
            this.setSize(this.getWidth(), t)
        },
        getLoaded: function () {
            return this._loaded
        },
        isEmpty: function () {
            var t = this._size;
            return !t || 0 === t.width && 0 === t.height
        },
        getResolution: function () {
            var t = this._matrix, e = new c(0, 0).transform(t), i = new c(1, 0).transform(t).subtract(e),
                n = new c(0, 1).transform(t).subtract(e);
            return new f(72 / i.getLength(), 72 / n.getLength())
        },
        getPpi: "#getResolution",
        getImage: function () {
            return this._image
        },
        setImage: function (t) {
            function e(t) {
                var e = i.getView(), n = t && t.type || "load";
                e && i.responds(n) && (paper = e._scope, i.emit(n, new X(t)))
            }

            var i = this;
            this._setImage(t), this._loaded ? setTimeout(e, 0) : t && V.add(t, {
                load: function (n) {
                    i._setImage(t), e(n)
                }, error: e
            })
        },
        _setImage: function (t) {
            this._canvas && tt.release(this._canvas), t && t.getContext ? (this._image = null, this._canvas = t, this._loaded = !0) : (this._image = t, this._canvas = null, this._loaded = !!(t && t.src && t.complete)), this._size = new f(t ? t.naturalWidth || t.width : 0, t ? t.naturalHeight || t.height : 0), this._context = null, this._changed(521)
        },
        getCanvas: function () {
            if (!this._canvas) {
                var t = tt.getContext(this._size);
                try {
                    this._image && t.drawImage(this._image, 0, 0), this._canvas = t.canvas
                } catch (e) {
                    tt.release(t)
                }
            }
            return this._canvas
        },
        setCanvas: "#setImage",
        getContext: function (t) {
            return this._context || (this._context = this.getCanvas().getContext("2d")), t && (this._image = null, this._changed(513)), this._context
        },
        setContext: function (t) {
            this._context = t
        },
        getSource: function () {
            var t = this._image;
            return t && t.src || this.toDataURL()
        },
        setSource: function (e) {
            var i = new t.Image, n = this._crossOrigin;
            n && (i.crossOrigin = n), i.src = e, this.setImage(i)
        },
        getCrossOrigin: function () {
            var t = this._image;
            return t && t.crossOrigin || this._crossOrigin || ""
        },
        setCrossOrigin: function (t) {
            this._crossOrigin = t;
            var e = this._image;
            e && (e.crossOrigin = t)
        },
        getElement: function () {
            return this._canvas || this._loaded && this._image
        }
    }, {
        beans: !1, getSubCanvas: function () {
            var t = g.read(arguments), e = tt.getContext(t.getSize());
            return e.drawImage(this.getCanvas(), t.x, t.y, t.width, t.height, 0, 0, t.width, t.height), e.canvas
        }, getSubRaster: function () {
            var t = g.read(arguments), e = new S(w.NO_INSERT);
            return e._setImage(this.getSubCanvas(t)), e.translate(t.getCenter().subtract(this.getSize().divide(2))), e._matrix.prepend(this._matrix), e.insertAbove(this), e
        }, toDataURL: function () {
            var t = this._image, e = t && t.src;
            if (/^data:/.test(e)) return e;
            var i = this.getCanvas();
            return i ? i.toDataURL.apply(i, arguments) : null
        }, drawImage: function (t) {
            var e = c.read(arguments, 1);
            this.getContext(!0).drawImage(t, e.x, e.y)
        }, getAverageColor: function (t) {
            var e, i;
            if (t ? t instanceof M ? (i = t, e = t.getBounds()) : "object" == typeof t && ("width" in t ? e = new g(t) : "x" in t && (e = new g(t.x - .5, t.y - .5, 1, 1))) : e = this.getBounds(), !e) return null;
            var n = Math.min(e.width, 32), s = Math.min(e.height, 32), o = S._sampleContext;
            o ? o.clearRect(0, 0, 33, 33) : o = S._sampleContext = tt.getContext(new f(32)), o.save();
            var a = (new v).scale(n / e.width, s / e.height).translate(-e.x, -e.y);
            a.applyToContext(o), i && i.draw(o, new r({clip: !0, matrices: [a]})), this._matrix.applyToContext(o);
            var l = this.getElement(), h = this._size;
            l && o.drawImage(l, -h.width / 2, -h.height / 2), o.restore();
            for (var u = o.getImageData(.5, .5, Math.ceil(n), Math.ceil(s)).data, c = [0, 0, 0], d = 0, p = 0, m = u.length; p < m; p += 4) {
                var _ = u[p + 3];
                d += _, _ /= 255, c[0] += u[p] * _, c[1] += u[p + 1] * _, c[2] += u[p + 2] * _
            }
            for (var p = 0; p < 3; p++) c[p] /= d;
            return d ? R.read(c) : null
        }, getPixel: function () {
            var t = c.read(arguments), e = this.getContext().getImageData(t.x, t.y, 1, 1).data;
            return new R("rgb", [e[0] / 255, e[1] / 255, e[2] / 255], e[3] / 255)
        }, setPixel: function () {
            var t = c.read(arguments), e = R.read(arguments), i = e._convert("rgb"), n = e._alpha,
                r = this.getContext(!0), s = r.createImageData(1, 1), o = s.data;
            o[0] = 255 * i[0], o[1] = 255 * i[1], o[2] = 255 * i[2], o[3] = null != n ? 255 * n : 255, r.putImageData(s, t.x, t.y)
        }, createImageData: function () {
            var t = f.read(arguments);
            return this.getContext().createImageData(t.width, t.height)
        }, getImageData: function () {
            var t = g.read(arguments);
            return t.isEmpty() && (t = new g(this._size)), this.getContext().getImageData(t.x, t.y, t.width, t.height)
        }, setImageData: function (t) {
            var e = c.read(arguments, 1);
            this.getContext(!0).putImageData(t, e.x, e.y)
        }, _getBounds: function (t, e) {
            var i = new g(this._size).setCenter(0, 0);
            return t ? t._transformBounds(i) : i
        }, _hitTestSelf: function (t) {
            if (this._contains(t)) {
                var e = this;
                return new k("pixel", e, {
                    offset: t.add(e._size.divide(2)).round(), color: {
                        get: function () {
                            return e.getPixel(this.offset)
                        }
                    }
                })
            }
        }, _draw: function (t) {
            var e = this.getElement();
            e && (t.globalAlpha = this._opacity, t.drawImage(e, -this._size.width / 2, -this._size.height / 2))
        }, _canComposite: function () {
            return !0
        }
    }), T = w.extend({
        _class: "SymbolItem",
        _applyMatrix: !1,
        _canApplyMatrix: !1,
        _boundsOptions: {stroke: !0},
        _serializeFields: {symbol: null},
        initialize: function (t, i) {
            this._initialize(t, i !== e && c.read(arguments, 1)) || this.setDefinition(t instanceof E ? t : new E(t))
        },
        _equals: function (t) {
            return this._definition === t._definition
        },
        copyContent: function (t) {
            this.setDefinition(t._definition)
        },
        getDefinition: function () {
            return this._definition
        },
        setDefinition: function (t) {
            this._definition = t, this._changed(9)
        },
        getSymbol: "#getDefinition",
        setSymbol: "#setDefinition",
        isEmpty: function () {
            return this._definition._item.isEmpty()
        },
        _getBounds: function (t, e) {
            var i = this._definition._item;
            return i._getCachedBounds(i._matrix.prepended(t), e)
        },
        _hitTestSelf: function (t, e, i) {
            var n = this._definition._item._hitTest(t, e, i);
            return n && (n.item = this), n
        },
        _draw: function (t, e) {
            this._definition._item.draw(t, e)
        }
    }), E = r.extend({
        _class: "SymbolDefinition", initialize: function (t, e) {
            this._id = u.get(), this.project = paper.project, t && this.setItem(t, e)
        }, _serialize: function (t, e) {
            return e.add(this, function () {
                return r.serialize([this._class, this._item], t, !1, e)
            })
        }, _changed: function (t) {
            8 & t && w._clearBoundsCache(this), 1 & t && this.project._changed(t)
        }, getItem: function () {
            return this._item
        }, setItem: function (t, e) {
            t._symbol && (t = t.clone()), this._item && (this._item._symbol = null), this._item = t, t.remove(), t.setSelected(!1), e || t.setPosition(new c), t._symbol = this, this._changed(9)
        }, getDefinition: "#getItem", setDefinition: "#setItem", place: function (t) {
            return new T(this, t)
        }, clone: function () {
            return new E(this._item.clone(!1))
        }, equals: function (t) {
            return t === this || t && this._item.equals(t._item) || !1
        }
    }), k = r.extend({
        _class: "HitResult", initialize: function (t, e, i) {
            this.type = t, this.item = e, i && this.inject(i)
        }, statics: {
            getOptions: function (t) {
                var e = t && r.read(t);
                return r.set({
                    type: null,
                    tolerance: paper.settings.hitTolerance,
                    fill: !e,
                    stroke: !e,
                    segments: !e,
                    handles: !1,
                    ends: !1,
                    position: !1,
                    center: !1,
                    bounds: !1,
                    guides: !1,
                    selected: !1
                }, e)
            }
        }
    }), P = r.extend({
        _class: "Segment", beans: !0, _selection: 0, initialize: function (t, i, n, r, s, o) {
            var a, l, h, u, c = arguments.length;
            c > 0 && (null == t || "object" == typeof t ? 1 === c && t && "point" in t ? (a = t.point, l = t.handleIn, h = t.handleOut, u = t.selection) : (a = t, l = i, h = n, u = r) : (a = [t, i], l = n !== e ? [n, r] : null, h = s !== e ? [s, o] : null)), new A(a, this, "_point"), new A(l, this, "_handleIn"), new A(h, this, "_handleOut"), u && this.setSelection(u)
        }, _serialize: function (t, e) {
            var i = this._point, n = this._selection,
                s = n || this.hasHandles() ? [i, this._handleIn, this._handleOut] : i;
            return n && s.push(n), r.serialize(s, t, !0, e)
        }, _changed: function (t) {
            var e = this._path;
            if (e) {
                var i, n = e._curves, r = this._index;
                n && (t && t !== this._point && t !== this._handleIn || !(i = r > 0 ? n[r - 1] : e._closed ? n[n.length - 1] : null) || i._changed(), t && t !== this._point && t !== this._handleOut || !(i = n[r]) || i._changed()), e._changed(25)
            }
        }, getPoint: function () {
            return this._point
        }, setPoint: function () {
            this._point.set(c.read(arguments))
        }, getHandleIn: function () {
            return this._handleIn
        }, setHandleIn: function () {
            this._handleIn.set(c.read(arguments))
        }, getHandleOut: function () {
            return this._handleOut
        }, setHandleOut: function () {
            this._handleOut.set(c.read(arguments))
        }, hasHandles: function () {
            return !this._handleIn.isZero() || !this._handleOut.isZero()
        }, isSmooth: function () {
            var t = this._handleIn, e = this._handleOut;
            return !t.isZero() && !e.isZero() && t.isCollinear(e)
        }, clearHandles: function () {
            this._handleIn._set(0, 0), this._handleOut._set(0, 0)
        }, getSelection: function () {
            return this._selection
        }, setSelection: function (t) {
            var e = this._selection, i = this._path;
            this._selection = t = t || 0, i && t !== e && (i._updateSelection(this, e, t), i._changed(129))
        }, _changeSelection: function (t, e) {
            var i = this._selection;
            this.setSelection(e ? i | t : i & ~t)
        }, isSelected: function () {
            return !!(7 & this._selection)
        }, setSelected: function (t) {
            this._changeSelection(7, t)
        }, getIndex: function () {
            return this._index !== e ? this._index : null
        }, getPath: function () {
            return this._path || null
        }, getCurve: function () {
            var t = this._path, e = this._index;
            return t ? (e > 0 && !t._closed && e === t._segments.length - 1 && e--, t.getCurves()[e] || null) : null
        }, getLocation: function () {
            var t = this.getCurve();
            return t ? new I(t, this === t._segment1 ? 0 : 1) : null
        }, getNext: function () {
            var t = this._path && this._path._segments;
            return t && (t[this._index + 1] || this._path._closed && t[0]) || null
        }, smooth: function (t, i, n) {
            var r = t || {}, s = r.type, o = r.factor, a = this.getPrevious(), l = this.getNext(),
                h = (a || this)._point, u = this._point, d = (l || this)._point, f = h.getDistance(u),
                p = u.getDistance(d);
            if (s && "catmull-rom" !== s) {
                if ("geometric" !== s) throw new Error("Smoothing method '" + s + "' not supported.");
                if (a && l) {
                    var g = h.subtract(d), m = o === e ? .4 : o, v = m * f / (f + p);
                    i || this.setHandleIn(g.multiply(v)), n || this.setHandleOut(g.multiply(v - m))
                }
            } else {
                var _ = o === e ? .5 : o, y = Math.pow(f, _), w = y * y, x = Math.pow(p, _), b = x * x;
                if (!i && a) {
                    var C = 2 * b + 3 * x * y + w, S = 3 * x * (x + y);
                    this.setHandleIn(0 !== S ? new c((b * h._x + C * u._x - w * d._x) / S - u._x, (b * h._y + C * u._y - w * d._y) / S - u._y) : new c)
                }
                if (!n && l) {
                    var C = 2 * w + 3 * y * x + b, S = 3 * y * (y + x);
                    this.setHandleOut(0 !== S ? new c((w * d._x + C * u._x - b * h._x) / S - u._x, (w * d._y + C * u._y - b * h._y) / S - u._y) : new c)
                }
            }
        }, getPrevious: function () {
            var t = this._path && this._path._segments;
            return t && (t[this._index - 1] || this._path._closed && t[t.length - 1]) || null
        }, isFirst: function () {
            return !this._index
        }, isLast: function () {
            var t = this._path;
            return t && this._index === t._segments.length - 1 || !1
        }, reverse: function () {
            var t = this._handleIn, e = this._handleOut, i = t.clone();
            t.set(e), e.set(i)
        }, reversed: function () {
            return new P(this._point, this._handleOut, this._handleIn)
        }, remove: function () {
            return !!this._path && !!this._path.removeSegment(this._index)
        }, clone: function () {
            return new P(this._point, this._handleIn, this._handleOut)
        }, equals: function (t) {
            return t === this || t && this._class === t._class && this._point.equals(t._point) && this._handleIn.equals(t._handleIn) && this._handleOut.equals(t._handleOut) || !1
        }, toString: function () {
            var t = ["point: " + this._point];
            return this._handleIn.isZero() || t.push("handleIn: " + this._handleIn), this._handleOut.isZero() || t.push("handleOut: " + this._handleOut), "{ " + t.join(", ") + " }"
        }, transform: function (t) {
            this._transformCoordinates(t, new Array(6), !0), this._changed()
        }, interpolate: function (t, e, i) {
            var n = 1 - i, r = i, s = t._point, o = e._point, a = t._handleIn, l = e._handleIn, h = e._handleOut,
                u = t._handleOut
            ;this._point._set(n * s._x + r * o._x, n * s._y + r * o._y, !0), this._handleIn._set(n * a._x + r * l._x, n * a._y + r * l._y, !0), this._handleOut._set(n * u._x + r * h._x, n * u._y + r * h._y, !0), this._changed()
        }, _transformCoordinates: function (t, e, i) {
            var n = this._point, r = i && this._handleIn.isZero() ? null : this._handleIn,
                s = i && this._handleOut.isZero() ? null : this._handleOut, o = n._x, a = n._y, l = 2;
            return e[0] = o, e[1] = a, r && (e[l++] = r._x + o, e[l++] = r._y + a), s && (e[l++] = s._x + o, e[l++] = s._y + a), t && (t._transformCoordinates(e, e, l / 2), o = e[0], a = e[1], i ? (n._x = o, n._y = a, l = 2, r && (r._x = e[l++] - o, r._y = e[l++] - a), s && (s._x = e[l++] - o, s._y = e[l++] - a)) : (r || (e[l++] = o, e[l++] = a), s || (e[l++] = o, e[l++] = a))), e
        }
    }), A = c.extend({
        initialize: function (t, i, n) {
            var r, s, o;
            if (t) if ((r = t[0]) !== e) s = t[1]; else {
                var a = t;
                (r = a.x) === e && (a = c.read(arguments), r = a.x), s = a.y, o = a.selected
            } else r = s = 0;
            this._x = r, this._y = s, this._owner = i, i[n] = this, o && this.setSelected(!0)
        }, _set: function (t, e) {
            return this._x = t, this._y = e, this._owner._changed(this), this
        }, getX: function () {
            return this._x
        }, setX: function (t) {
            this._x = t, this._owner._changed(this)
        }, getY: function () {
            return this._y
        }, setY: function (t) {
            this._y = t, this._owner._changed(this)
        }, isZero: function () {
            var t = h.isZero;
            return t(this._x) && t(this._y)
        }, isSelected: function () {
            return !!(this._owner._selection & this._getSelection())
        }, setSelected: function (t) {
            this._owner._changeSelection(this._getSelection(), t)
        }, _getSelection: function () {
            var t = this._owner;
            return this === t._point ? 1 : this === t._handleIn ? 2 : this === t._handleOut ? 4 : 0
        }
    }), z = r.extend({
        _class: "Curve", beans: !0, initialize: function (t, e, i, n, r, s, o, a) {
            var l, h, u, c, d, f, p = arguments.length;
            3 === p ? (this._path = t, l = e, h = i) : p ? 1 === p ? "segment1" in t ? (l = new P(t.segment1), h = new P(t.segment2)) : "point1" in t ? (u = t.point1, d = t.handle1, f = t.handle2, c = t.point2) : Array.isArray(t) && (u = [t[0], t[1]], c = [t[6], t[7]], d = [t[2] - t[0], t[3] - t[1]], f = [t[4] - t[6], t[5] - t[7]]) : 2 === p ? (l = new P(t), h = new P(e)) : 4 === p ? (u = t, d = e, f = i, c = n) : 8 === p && (u = [t, e], c = [o, a], d = [i - t, n - e], f = [r - o, s - a]) : (l = new P, h = new P), this._segment1 = l || new P(u, null, d), this._segment2 = h || new P(c, f, null)
        }, _serialize: function (t, e) {
            return r.serialize(this.hasHandles() ? [this.getPoint1(), this.getHandle1(), this.getHandle2(), this.getPoint2()] : [this.getPoint1(), this.getPoint2()], t, !0, e)
        }, _changed: function () {
            this._length = this._bounds = e
        }, clone: function () {
            return new z(this._segment1, this._segment2)
        }, toString: function () {
            var t = ["point1: " + this._segment1._point];
            return this._segment1._handleOut.isZero() || t.push("handle1: " + this._segment1._handleOut), this._segment2._handleIn.isZero() || t.push("handle2: " + this._segment2._handleIn), t.push("point2: " + this._segment2._point), "{ " + t.join(", ") + " }"
        }, classify: function () {
            return z.classify(this.getValues())
        }, remove: function () {
            var t = !1;
            if (this._path) {
                var e = this._segment2, i = e._handleOut;
                t = e.remove(), t && this._segment1._handleOut.set(i)
            }
            return t
        }, getPoint1: function () {
            return this._segment1._point
        }, setPoint1: function () {
            this._segment1._point.set(c.read(arguments))
        }, getPoint2: function () {
            return this._segment2._point
        }, setPoint2: function () {
            this._segment2._point.set(c.read(arguments))
        }, getHandle1: function () {
            return this._segment1._handleOut
        }, setHandle1: function () {
            this._segment1._handleOut.set(c.read(arguments))
        }, getHandle2: function () {
            return this._segment2._handleIn
        }, setHandle2: function () {
            this._segment2._handleIn.set(c.read(arguments))
        }, getSegment1: function () {
            return this._segment1
        }, getSegment2: function () {
            return this._segment2
        }, getPath: function () {
            return this._path
        }, getIndex: function () {
            return this._segment1._index
        }, getNext: function () {
            var t = this._path && this._path._curves;
            return t && (t[this._segment1._index + 1] || this._path._closed && t[0]) || null
        }, getPrevious: function () {
            var t = this._path && this._path._curves;
            return t && (t[this._segment1._index - 1] || this._path._closed && t[t.length - 1]) || null
        }, isFirst: function () {
            return !this._segment1._index
        }, isLast: function () {
            var t = this._path;
            return t && this._segment1._index === t._curves.length - 1 || !1
        }, isSelected: function () {
            return this.getPoint1().isSelected() && this.getHandle1().isSelected() && this.getHandle2().isSelected() && this.getPoint2().isSelected()
        }, setSelected: function (t) {
            this.getPoint1().setSelected(t), this.getHandle1().setSelected(t), this.getHandle2().setSelected(t), this.getPoint2().setSelected(t)
        }, getValues: function (t) {
            return z.getValues(this._segment1, this._segment2, t)
        }, getPoints: function () {
            for (var t = this.getValues(), e = [], i = 0; i < 8; i += 2) e.push(new c(t[i], t[i + 1]));
            return e
        }
    }, {
        getLength: function () {
            return null == this._length && (this._length = z.getLength(this.getValues(), 0, 1)), this._length
        }, getArea: function () {
            return z.getArea(this.getValues())
        }, getLine: function () {
            return new _(this._segment1._point, this._segment2._point)
        }, getPart: function (t, e) {
            return new z(z.getPart(this.getValues(), t, e))
        }, getPartLength: function (t, e) {
            return z.getLength(this.getValues(), t, e)
        }, divideAt: function (t) {
            return this.divideAtTime(t && t.curve === this ? t.time : this.getTimeAt(t))
        }, divideAtTime: function (t, e) {
            var i = null;
            if (t >= 1e-8 && t <= 1 - 1e-8) {
                var n = z.subdivide(this.getValues(), t), r = n[0], s = n[1], o = e || this.hasHandles(),
                    a = this._segment1, l = this._segment2, h = this._path;
                o && (a._handleOut._set(r[2] - r[0], r[3] - r[1]), l._handleIn._set(s[4] - s[6], s[5] - s[7]));
                var u = r[6], d = r[7],
                    f = new P(new c(u, d), o && new c(r[4] - u, r[5] - d), o && new c(s[2] - u, s[3] - d));
                h ? (h.insert(a._index + 1, f), i = this.getNext()) : (this._segment2 = f, this._changed(), i = new z(f, l))
            }
            return i
        }, splitAt: function (t) {
            var e = this._path;
            return e ? e.splitAt(t) : null
        }, splitAtTime: function (t) {
            return this.splitAt(this.getLocationAtTime(t))
        }, divide: function (t, i) {
            return this.divideAtTime(t === e ? .5 : i ? t : this.getTimeAt(t))
        }, split: function (t, i) {
            return this.splitAtTime(t === e ? .5 : i ? t : this.getTimeAt(t))
        }, reversed: function () {
            return new z(this._segment2.reversed(), this._segment1.reversed())
        }, clearHandles: function () {
            this._segment1._handleOut._set(0, 0), this._segment2._handleIn._set(0, 0)
        }, statics: {
            getValues: function (t, e, i, n) {
                var r = t._point, s = t._handleOut, o = e._handleIn, a = e._point, l = r.x, h = r.y, u = a.x, c = a.y,
                    d = n ? [l, h, l, h, u, c, u, c] : [l, h, l + s._x, h + s._y, u + o._x, c + o._y, u, c];
                return i && i._transformCoordinates(d, d, 4), d
            }, subdivide: function (t, i) {
                var n = t[0], r = t[1], s = t[2], o = t[3], a = t[4], l = t[5], h = t[6], u = t[7];
                i === e && (i = .5);
                var c = 1 - i, d = c * n + i * s, f = c * r + i * o, p = c * s + i * a, g = c * o + i * l,
                    m = c * a + i * h, v = c * l + i * u, _ = c * d + i * p, y = c * f + i * g, w = c * p + i * m,
                    x = c * g + i * v, b = c * _ + i * w, C = c * y + i * x;
                return [[n, r, d, f, _, y, b, C], [b, C, w, x, m, v, h, u]]
            }, getMonoCurves: function (t, e) {
                var i = [], n = e ? 0 : 1, r = t[n + 0], s = t[n + 2], o = t[n + 4], a = t[n + 6];
                if (r >= s == s >= o && s >= o == o >= a || z.isStraight(t)) i.push(t); else {
                    var l = 3 * (s - o) - r + a, u = 2 * (r + o) - 4 * s, c = s - r, d = [],
                        f = h.solveQuadratic(l, u, c, d, 1e-8, 1 - 1e-8);
                    if (f) {
                        d.sort();
                        var p = d[0], g = z.subdivide(t, p);
                        i.push(g[0]), f > 1 && (p = (d[1] - p) / (1 - p), g = z.subdivide(g[1], p), i.push(g[0])), i.push(g[1])
                    } else i.push(t)
                }
                return i
            }, solveCubic: function (t, e, i, n, r, s) {
                var o = t[e], a = t[e + 2], l = t[e + 4], u = t[e + 6], c = 0;
                if (!(o < i && u < i && a < i && l < i || o > i && u > i && a > i && l > i)) {
                    var d = 3 * (a - o), f = 3 * (l - a) - d, p = u - o - d - f;
                    c = h.solveCubic(p, f, d, o - i, n, r, s)
                }
                return c
            }, getTimeOf: function (t, e) {
                var i = new c(t[0], t[1]), n = new c(t[6], t[7]);
                if (null === (e.isClose(i, 1e-12) ? 0 : e.isClose(n, 1e-12) ? 1 : null)) for (var r = [e.x, e.y], s = [], o = 0; o < 2; o++) for (var a = z.solveCubic(t, o, r[o], s, 0, 1), l = 0; l < a; l++) {
                    var h = s[l];
                    if (e.isClose(z.getPoint(t, h), 1e-7)) return h
                }
                return e.isClose(i, 1e-7) ? 0 : e.isClose(n, 1e-7) ? 1 : null
            }, getNearestTime: function (t, e) {
                function i(i) {
                    if (i >= 0 && i <= 1) {
                        var n = e.getDistance(z.getPoint(t, i), !0);
                        if (n < d) return d = n, f = i, !0
                    }
                }

                if (z.isStraight(t)) {
                    var n = t[0], r = t[1], s = t[6], o = t[7], a = s - n, l = o - r, h = a * a + l * l;
                    if (0 === h) return 0;
                    var u = ((e.x - n) * a + (e.y - r) * l) / h;
                    return u < 1e-12 ? 0 : u > .999999999999 ? 1 : z.getTimeOf(t, new c(n + u * a, r + u * l))
                }
                for (var d = 1 / 0, f = 0, p = 0; p <= 100; p++) i(p / 100);
                for (var g = .005; g > 1e-8;) i(f - g) || i(f + g) || (g /= 2);
                return f
            }, getPart: function (t, e, i) {
                var n = e > i;
                if (n) {
                    var r = e;
                    e = i, i = r
                }
                return e > 0 && (t = z.subdivide(t, e)[1]), i < 1 && (t = z.subdivide(t, (i - e) / (1 - e))[0]), n ? [t[6], t[7], t[4], t[5], t[2], t[3], t[0], t[1]] : t
            }, isFlatEnough: function (t, e) {
                var i = t[0], n = t[1], r = t[2], s = t[3], o = t[4], a = t[5], l = t[6], h = t[7],
                    u = 3 * r - 2 * i - l, c = 3 * s - 2 * n - h, d = 3 * o - 2 * l - i, f = 3 * a - 2 * h - n;
                return Math.max(u * u, d * d) + Math.max(c * c, f * f) <= 16 * e * e
            }, getArea: function (t) {
                var e = t[0], i = t[1], n = t[2], r = t[3], s = t[4], o = t[5], a = t[6], l = t[7];
                return 3 * ((l - i) * (n + s) - (a - e) * (r + o) + r * (e - s) - n * (i - o) + l * (s + e / 3) - a * (o + i / 3)) / 20
            }, getBounds: function (t) {
                for (var e = t.slice(0, 2), i = e.slice(), n = [0, 0], r = 0; r < 2; r++) z._addBounds(t[r], t[r + 2], t[r + 4], t[r + 6], r, 0, e, i, n);
                return new g(e[0], e[1], i[0] - e[0], i[1] - e[1])
            }, _addBounds: function (t, e, i, n, r, s, o, a, l) {
                function u(t, e) {
                    var i = t - e, n = t + e;
                    i < o[r] && (o[r] = i), n > a[r] && (a[r] = n)
                }

                s /= 2;
                var c = o[r] - s, d = a[r] + s;
                if (t < c || e < c || i < c || n < c || t > d || e > d || i > d || n > d) if (e < t != e < n && i < t != i < n) u(t, s), u(n, s); else {
                    var f = 3 * (e - i) - t + n, p = 2 * (t + i) - 4 * e, g = e - t, m = h.solveQuadratic(f, p, g, l);
                    u(n, 0);
                    for (var v = 0; v < m; v++) {
                        var _ = l[v], y = 1 - _;
                        1e-8 <= _ && _ <= 1 - 1e-8 && u(y * y * y * t + 3 * y * y * _ * e + 3 * y * _ * _ * i + _ * _ * _ * n, s)
                    }
                }
            }
        }
    }, r.each(["getBounds", "getStrokeBounds", "getHandleBounds"], function (t) {
        this[t] = function () {
            this._bounds || (this._bounds = {});
            var e = this._bounds[t];
            return e || (e = this._bounds[t] = O[t]([this._segment1, this._segment2], !1, this._path)), e.clone()
        }
    }, {}), r.each({
        isStraight: function (t, e, i, n) {
            if (e.isZero() && i.isZero()) return !0;
            var r = n.subtract(t);
            if (r.isZero()) return !1;
            if (r.isCollinear(e) && r.isCollinear(i)) {
                var s = new _(t, n);
                if (s.getDistance(t.add(e)) < 1e-7 && s.getDistance(n.add(i)) < 1e-7) {
                    var o = r.dot(r), a = r.dot(e) / o, l = r.dot(i) / o;
                    return a >= 0 && a <= 1 && l <= 0 && l >= -1
                }
            }
            return !1
        }, isLinear: function (t, e, i, n) {
            var r = n.subtract(t).divide(3);
            return e.equals(r) && i.negate().equals(r)
        }
    }, function (t, e) {
        this[e] = function (e) {
            var i = this._segment1, n = this._segment2;
            return t(i._point, i._handleOut, n._handleIn, n._point, e)
        }, this.statics[e] = function (e, i) {
            var n = e[0], r = e[1], s = e[6], o = e[7];
            return t(new c(n, r), new c(e[2] - n, e[3] - r), new c(e[4] - s, e[5] - o), new c(s, o), i)
        }
    }, {
        statics: {}, hasHandles: function () {
            return !this._segment1._handleOut.isZero() || !this._segment2._handleIn.isZero()
        }, hasLength: function (t) {
            return (!this.getPoint1().equals(this.getPoint2()) || this.hasHandles()) && this.getLength() > (t || 0)
        }, isCollinear: function (t) {
            return t && this.isStraight() && t.isStraight() && this.getLine().isCollinear(t.getLine())
        }, isHorizontal: function () {
            return this.isStraight() && Math.abs(this.getTangentAtTime(.5).y) < 1e-8
        }, isVertical: function () {
            return this.isStraight() && Math.abs(this.getTangentAtTime(.5).x) < 1e-8
        }
    }), {
        beans: !1, getLocationAt: function (t, e) {
            return this.getLocationAtTime(e ? t : this.getTimeAt(t))
        }, getLocationAtTime: function (t) {
            return null != t && t >= 0 && t <= 1 ? new I(this, t) : null
        }, getTimeAt: function (t, e) {
            return z.getTimeAt(this.getValues(), t, e)
        }, getParameterAt: "#getTimeAt", getOffsetAtTime: function (t) {
            return this.getPartLength(0, t)
        }, getLocationOf: function () {
            return this.getLocationAtTime(this.getTimeOf(c.read(arguments)))
        }, getOffsetOf: function () {
            var t = this.getLocationOf.apply(this, arguments);
            return t ? t.getOffset() : null
        }, getTimeOf: function () {
            return z.getTimeOf(this.getValues(), c.read(arguments))
        }, getParameterOf: "#getTimeOf", getNearestLocation: function () {
            var t = c.read(arguments), e = this.getValues(), i = z.getNearestTime(e, t), n = z.getPoint(e, i);
            return new I(this, i, n, null, t.getDistance(n))
        }, getNearestPoint: function () {
            var t = this.getNearestLocation.apply(this, arguments);
            return t ? t.getPoint() : t
        }
    }, new function () {
        var t = ["getPoint", "getTangent", "getNormal", "getWeightedTangent", "getWeightedNormal", "getCurvature"];
        return r.each(t, function (t) {
            this[t + "At"] = function (e, i) {
                var n = this.getValues();
                return z[t](n, i ? e : z.getTimeAt(n, e))
            }, this[t + "AtTime"] = function (e) {
                return z[t](this.getValues(), e)
            }
        }, {statics: {_evaluateMethods: t}})
    }, new function () {
        function t(t) {
            var e = t[0], i = t[1], n = t[2], r = t[3], s = t[4], o = t[5], a = t[6], l = t[7],
                h = 9 * (n - s) + 3 * (a - e), u = 6 * (e + s) - 12 * n, c = 3 * (n - e), d = 9 * (r - o) + 3 * (l - i),
                f = 6 * (i + o) - 12 * r, p = 3 * (r - i);
            return function (t) {
                var e = (h * t + u) * t + c, i = (d * t + f) * t + p;
                return Math.sqrt(e * e + i * i)
            }
        }

        function i(t, e) {
            return Math.max(2, Math.min(16, Math.ceil(32 * Math.abs(e - t))))
        }

        function n(t, e, i, n) {
            if (null == e || e < 0 || e > 1) return null;
            var r = t[0], s = t[1], o = t[2], a = t[3], l = t[4], u = t[5], d = t[6], f = t[7], p = h.isZero;
            p(o - r) && p(a - s) && (o = r, a = s), p(l - d) && p(u - f) && (l = d, u = f);
            var g, m, v = 3 * (o - r), _ = 3 * (l - o) - v, y = d - r - v - _, w = 3 * (a - s), x = 3 * (u - a) - w,
                b = f - s - w - x;
            if (0 === i) g = 0 === e ? r : 1 === e ? d : ((y * e + _) * e + v) * e + r, m = 0 === e ? s : 1 === e ? f : ((b * e + x) * e + w) * e + s; else {
                if (e < 1e-8 ? (g = v, m = w) : e > 1 - 1e-8 ? (g = 3 * (d - l), m = 3 * (f - u)) : (g = (3 * y * e + 2 * _) * e + v, m = (3 * b * e + 2 * x) * e + w), n) {
                    0 === g && 0 === m && (e < 1e-8 || e > 1 - 1e-8) && (g = l - o, m = u - a);
                    var C = Math.sqrt(g * g + m * m);
                    C && (g /= C, m /= C)
                }
                if (3 === i) {
                    var l = 6 * y * e + 2 * _, u = 6 * b * e + 2 * x, S = Math.pow(g * g + m * m, 1.5);
                    g = 0 !== S ? (g * u - m * l) / S : 0, m = 0
                }
            }
            return 2 === i ? new c(m, -g) : new c(g, m)
        }

        return {
            statics: {
                classify: function (t) {
                    function i(t, i, n) {
                        var r = i !== e, s = r && i > 0 && i < 1, o = r && n > 0 && n < 1;
                        return !r || (s || o) && ("loop" !== t || s && o) || (t = "arch", s = o = !1), {
                            type: t,
                            roots: s || o ? s && o ? i < n ? [i, n] : [n, i] : [s ? i : n] : null
                        }
                    }

                    var n = t[0], r = t[1], s = t[2], o = t[3], a = t[4], l = t[5], u = t[6], c = t[7],
                        d = n * (c - l) + r * (a - u) + u * l - c * a, f = s * (r - c) + o * (u - n) + n * c - r * u,
                        p = a * (o - r) + l * (n - s) + s * r - o * n, g = 3 * p, m = g - f, v = m - f + d,
                        _ = Math.sqrt(v * v + m * m + g * g), y = 0 !== _ ? 1 / _ : 0, w = h.isZero;
                    if (v *= y, m *= y, g *= y, w(v)) return w(m) ? i(w(g) ? "line" : "quadratic") : i("serpentine", g / (3 * m));
                    var x = 3 * m * m - 4 * v * g;
                    if (w(x)) return i("cusp", m / (2 * v));
                    var b = x > 0 ? Math.sqrt(x / 3) : Math.sqrt(-x), C = 2 * v;
                    return i(x > 0 ? "serpentine" : "loop", (m + b) / C, (m - b) / C)
                }, getLength: function (n, r, s, o) {
                    if (r === e && (r = 0), s === e && (s = 1), z.isStraight(n)) {
                        var a = n;
                        s < 1 && (a = z.subdivide(a, s)[0], r /= s), r > 0 && (a = z.subdivide(a, r)[1]);
                        var l = a[6] - a[0], u = a[7] - a[1];
                        return Math.sqrt(l * l + u * u)
                    }
                    return h.integrate(o || t(n), r, s, i(r, s))
                }, getTimeAt: function (n, r, s) {
                    function o(t) {
                        return m += h.integrate(d, s, t, i(s, t)), s = t, m - r
                    }

                    if (s === e && (s = r < 0 ? 1 : 0), 0 === r) return s;
                    var a = Math.abs, l = r > 0, u = l ? s : 0, c = l ? 1 : s, d = t(n), f = z.getLength(n, u, c, d),
                        p = a(r) - f;
                    if (a(p) < 1e-12) return l ? c : u;
                    if (p > 1e-12) return null;
                    var g = r / f, m = 0;
                    return h.findRoot(o, d, s + g, u, c, 32, 1e-12)
                }, getPoint: function (t, e) {
                    return n(t, e, 0, !1)
                }, getTangent: function (t, e) {
                    return n(t, e, 1, !0)
                }, getWeightedTangent: function (t, e) {
                    return n(t, e, 1, !1)
                }, getNormal: function (t, e) {
                    return n(t, e, 2, !0)
                }, getWeightedNormal: function (t, e) {
                    return n(t, e, 2, !1)
                }, getCurvature: function (t, e) {
                    return n(t, e, 3, !1).x
                }, getPeaks: function (t) {
                    var e = t[0], i = t[1], n = t[2], r = t[3], s = t[4], o = t[5], a = t[6], l = t[7],
                        u = 3 * n - e - 3 * s + a, c = 3 * e - 6 * n + 3 * s, d = -3 * e + 3 * n,
                        f = 3 * r - i - 3 * o + l, p = 3 * i - 6 * r + 3 * o, g = -3 * i + 3 * r, m = [];
                    return h.solveCubic(9 * (u * u + f * f), 9 * (u * c + p * f), 2 * (c * c + p * p) + 3 * (d * u + g * f), d * c + p * g, m, 1e-8, 1 - 1e-8), m.sort()
                }
            }
        }
    }, new function () {
        function t(t, e, i, n, r, s, o) {
            var a = !o && i.getPrevious() === r, l = !o && i !== r && i.getNext() === r;
            if (null !== n && n >= (a ? 1e-8 : 0) && n <= (l ? 1 - 1e-8 : 1) && null !== s && s >= (l ? 1e-8 : 0) && s <= (a ? 1 - 1e-8 : 1)) {
                var h = new I(i, n, null, o), u = new I(r, s, null, o);
                h._intersection = u, u._intersection = h, e && !e(h) || I.insert(t, h, !0)
            }
        }

        function e(r, s, o, a, l, h, u, c, d, f, p, g, m) {
            if (++d >= 4096 || ++c >= 40) return d;
            var v, y, w = s[0], x = s[1], b = s[6], C = s[7], S = _.getSignedDistance, T = S(w, x, b, C, s[2], s[3]),
                E = S(w, x, b, C, s[4], s[5]), k = T * E > 0 ? .75 : 4 / 9, P = k * Math.min(0, T, E),
                A = k * Math.max(0, T, E), I = S(w, x, b, C, r[0], r[1]), M = S(w, x, b, C, r[2], r[3]),
                O = S(w, x, b, C, r[4], r[5]), L = S(w, x, b, C, r[6], r[7]), N = i(I, M, O, L), F = N[0], D = N[1];
            if (0 === T && 0 === E && 0 === I && 0 === M && 0 === O && 0 === L || null == (v = n(F, D, P, A)) || null == (y = n(F.reverse(), D.reverse(), P, A))) return d;
            var q = f + (p - f) * v, R = f + (p - f) * y;
            if (Math.max(m - g, R - q) < 1e-9) {
                var H = (q + R) / 2, B = (g + m) / 2;
                t(l, h, u ? a : o, u ? B : H, u ? o : a, u ? H : B)
            } else if (r = z.getPart(r, v, y), y - v > .8) if (R - q > m - g) {
                var j = z.subdivide(r, .5), H = (q + R) / 2;
                d = e(s, j[0], a, o, l, h, !u, c, d, g, m, q, H), d = e(s, j[1], a, o, l, h, !u, c, d, g, m, H, R)
            } else {
                var j = z.subdivide(s, .5), B = (g + m) / 2;
                d = e(j[0], r, a, o, l, h, !u, c, d, g, B, q, R), d = e(j[1], r, a, o, l, h, !u, c, d, B, m, q, R)
            } else d = m - g >= 1e-9 ? e(s, r, a, o, l, h, !u, c, d, g, m, q, R) : e(r, s, o, a, l, h, u, c, d, q, R, g, m);
            return d
        }

        function i(t, e, i, n) {
            var r, s = [0, t], o = [1 / 3, e], a = [2 / 3, i], l = [1, n], h = e - (2 * t + n) / 3,
                u = i - (t + 2 * n) / 3;
            if (h * u < 0) r = [[s, o, l], [s, a, l]]; else {
                var c = h / u;
                r = [c >= 2 ? [s, o, l] : c <= .5 ? [s, a, l] : [s, o, a, l], [s, l]]
            }
            return (h || u) < 0 ? r.reverse() : r
        }

        function n(t, e, i, n) {
            return t[0][1] < i ? r(t, !0, i) : e[0][1] > n ? r(e, !1, n) : t[0][0]
        }

        function r(t, e, i) {
            for (var n = t[0][0], r = t[0][1], s = 1, o = t.length; s < o; s++) {
                var a = t[s][0], l = t[s][1];
                if (e ? l >= i : l <= i) return l === i ? a : n + (i - r) * (a - n) / (l - r);
                n = a, r = l
            }
            return null
        }

        function s(t, e, i, n, r) {
            var s = h.isZero;
            if (s(n) && s(r)) {
                var o = z.getTimeOf(t, new c(e, i));
                return null === o ? [] : [o]
            }
            for (var a = Math.atan2(-r, n), l = Math.sin(a), u = Math.cos(a), d = [], f = [], p = 0; p < 8; p += 2) {
                var g = t[p] - e, m = t[p + 1] - i;
                d.push(g * u - m * l, g * l + m * u)
            }
            return z.solveCubic(d, 1, 0, f, 0, 1), f
        }

        function o(e, i, n, r, o, a, l) {
            for (var h = i[0], u = i[1], c = i[6], d = i[7], f = s(e, h, u, c - h, d - u), p = 0, g = f.length; p < g; p++) {
                var m = f[p], v = z.getPoint(e, m), _ = z.getTimeOf(i, v);
                null !== _ && t(o, a, l ? r : n, l ? _ : m, l ? n : r, l ? m : _)
            }
        }

        function a(e, i, n, r, s, o) {
            var a = _.intersect(e[0], e[1], e[6], e[7], i[0], i[1], i[6], i[7]);
            a && t(s, o, n, z.getTimeOf(e, a), r, z.getTimeOf(i, a))
        }

        function l(i, n, r, s, l, h) {
            var u = Math.min, d = Math.max;
            if (d(i[0], i[2], i[4], i[6]) + 1e-12 > u(n[0], n[2], n[4], n[6]) && u(i[0], i[2], i[4], i[6]) - 1e-12 < d(n[0], n[2], n[4], n[6]) && d(i[1], i[3], i[5], i[7]) + 1e-12 > u(n[1], n[3], n[5], n[7]) && u(i[1], i[3], i[5], i[7]) - 1e-12 < d(n[1], n[3], n[5], n[7])) {
                var p = f(i, n);
                if (p) for (var g = 0; g < 2; g++) {
                    var m = p[g];
                    t(l, h, r, m[0], s, m[1], !0)
                } else {
                    var v = z.isStraight(i), _ = z.isStraight(n), y = v && _, w = v && !_, x = l.length;
                    if ((y ? a : v || _ ? o : e)(w ? n : i, w ? i : n, w ? s : r, w ? r : s, l, h, w, 0, 0, 0, 1, 0, 1), !y || l.length === x) for (var g = 0; g < 4; g++) {
                        var b = g >> 1, C = 1 & g, S = 6 * b, T = 6 * C, E = new c(i[S], i[S + 1]),
                            k = new c(n[T], n[T + 1]);
                        E.isClose(k, 1e-12) && t(l, h, r, b, s, C)
                    }
                }
            }
            return l
        }

        function u(e, i, n, r) {
            var s = z.classify(e);
            if ("loop" === s.type) {
                var o = s.roots;
                t(n, r, i, o[0], i, o[1])
            }
            return n
        }

        function d(t, e, i, n, r, s) {
            var o = !e;
            o && (e = t);
            for (var a, h, c = t.length, d = e.length, f = [], p = [], g = 0; g < d; g++) f[g] = e[g].getValues(r);
            for (var g = 0; g < c; g++) {
                var m = t[g], v = o ? f[g] : m.getValues(n), _ = m.getPath();
                _ !== h && (h = _, a = [], p.push(a)), o && u(v, m, a, i);
                for (var y = o ? g + 1 : 0; y < d; y++) {
                    if (s && a.length) return a;
                    l(v, f[y], m, e[y], a, i)
                }
            }
            a = [];
            for (var g = 0, w = p.length; g < w; g++) a.push.apply(a, p[g]);
            return a
        }

        function f(t, e) {
            function i(t) {
                var e = t[6] - t[0], i = t[7] - t[1];
                return e * e + i * i
            }

            var n = Math.abs, r = _.getDistance, s = z.isStraight(t), o = z.isStraight(e), a = s && o, l = i(t) < i(e),
                h = l ? e : t, u = l ? t : e, d = h[0], f = h[1], p = h[6] - d, g = h[7] - f;
            if (r(d, f, p, g, u[0], u[1], !0) < 1e-7 && r(d, f, p, g, u[6], u[7], !0) < 1e-7) !a && r(d, f, p, g, h[2], h[3], !0) < 1e-7 && r(d, f, p, g, h[4], h[5], !0) < 1e-7 && r(d, f, p, g, u[2], u[3], !0) < 1e-7 && r(d, f, p, g, u[4], u[5], !0) < 1e-7 && (s = o = a = !0); else if (a) return null;
            if (s ^ o) return null;
            for (var m = [t, e], v = [], y = 0; y < 4 && v.length < 2; y++) {
                var w = 1 & y, x = 1 ^ w, b = y >> 1, C = z.getTimeOf(m[w], new c(m[x][b ? 6 : 0], m[x][b ? 7 : 1]));
                if (null != C) {
                    var S = w ? [b, C] : [C, b];
                    (!v.length || n(S[0] - v[0][0]) > 1e-8 && n(S[1] - v[0][1]) > 1e-8) && v.push(S)
                }
                if (y > 2 && !v.length) break
            }
            if (2 !== v.length) v = null; else if (!a) {
                var T = z.getPart(t, v[0][0], v[1][0]), E = z.getPart(e, v[0][1], v[1][1]);
                (n(E[2] - T[2]) > 1e-7 || n(E[3] - T[3]) > 1e-7 || n(E[4] - T[4]) > 1e-7 || n(E[5] - T[5]) > 1e-7) && (v = null)
            }
            return v
        }

        return {
            getIntersections: function (t) {
                var e = this.getValues(), i = t && t !== this && t.getValues();
                return i ? l(e, i, this, t, []) : u(e, this, [])
            }, statics: {getOverlaps: f, getIntersections: d, getCurveLineIntersections: s}
        }
    }), I = r.extend({
        _class: "CurveLocation", initialize: function (t, e, i, n, r) {
            if (e >= .99999999) {
                var s = t.getNext();
                s && (e = 0, t = s)
            }
            this._setCurve(t), this._time = e, this._point = i || t.getPointAtTime(e), this._overlap = n, this._distance = r, this._intersection = this._next = this._previous = null
        }, _setCurve: function (t) {
            var e = t._path;
            this._path = e, this._version = e ? e._version : 0, this._curve = t, this._segment = null, this._segment1 = t._segment1, this._segment2 = t._segment2
        }, _setSegment: function (t) {
            this._setCurve(t.getCurve()), this._segment = t, this._time = t === this._segment1 ? 0 : 1, this._point = t._point.clone()
        }, getSegment: function () {
            var t = this._segment;
            if (!t) {
                var e = this.getCurve(), i = this.getTime();
                0 === i ? t = e._segment1 : 1 === i ? t = e._segment2 : null != i && (t = e.getPartLength(0, i) < e.getPartLength(i, 1) ? e._segment1 : e._segment2), this._segment = t
            }
            return t
        }, getCurve: function () {
            function t(t) {
                var e = t && t.getCurve();
                if (e && null != (i._time = e.getTimeOf(i._point))) return i._setCurve(e), e
            }

            var e = this._path, i = this;
            return e && e._version !== this._version && (this._time = this._offset = this._curveOffset = this._curve = null), this._curve || t(this._segment) || t(this._segment1) || t(this._segment2.getPrevious())
        }, getPath: function () {
            var t = this.getCurve();
            return t && t._path
        }, getIndex: function () {
            var t = this.getCurve();
            return t && t.getIndex()
        }, getTime: function () {
            var t = this.getCurve(), e = this._time;
            return t && null == e ? this._time = t.getTimeOf(this._point) : e
        }, getParameter: "#getTime", getPoint: function () {
            return this._point
        }, getOffset: function () {
            var t = this._offset;
            if (null == t) {
                t = 0;
                var e = this.getPath(), i = this.getIndex();
                if (e && null != i) for (var n = e.getCurves(), r = 0; r < i; r++) t += n[r].getLength();
                this._offset = t += this.getCurveOffset()
            }
            return t
        }, getCurveOffset: function () {
            var t = this._curveOffset;
            if (null == t) {
                var e = this.getCurve(), i = this.getTime();
                this._curveOffset = t = null != i && e && e.getPartLength(0, i)
            }
            return t
        }, getIntersection: function () {
            return this._intersection
        }, getDistance: function () {
            return this._distance
        }, divide: function () {
            var t = this.getCurve(), e = t && t.divideAtTime(this.getTime());
            return e && this._setSegment(e._segment1), e
        }, split: function () {
            var t = this.getCurve(), e = t._path, i = t && t.splitAtTime(this.getTime());
            return i && this._setSegment(e.getLastSegment()), i
        }, equals: function (t, e) {
            var i = this === t;
            if (!i && t instanceof I) {
                var n = this.getCurve(), r = t.getCurve(), s = n._path;
                if (s === r._path) {
                    var o = Math.abs, a = o(this.getOffset() - t.getOffset()), l = !e && this._intersection,
                        h = !e && t._intersection;
                    i = (a < 1e-7 || s && o(s.getLength() - a) < 1e-7) && (!l && !h || l && h && l.equals(h, !0))
                }
            }
            return i
        }, toString: function () {
            var t = [], e = this.getPoint(), i = l.instance;
            e && t.push("point: " + e);
            var n = this.getIndex();
            null != n && t.push("index: " + n);
            var r = this.getTime();
            return null != r && t.push("time: " + i.number(r)), null != this._distance && t.push("distance: " + i.number(this._distance)), "{ " + t.join(", ") + " }"
        }, isTouching: function () {
            var t = this._intersection;
            if (t && this.getTangent().isCollinear(t.getTangent())) {
                var e = this.getCurve(), i = t.getCurve();
                return !(e.isStraight() && i.isStraight() && e.getLine().intersect(i.getLine()))
            }
            return !1
        }, isCrossing: function () {
            function t(t, e) {
                var i = t.getValues(), n = z.classify(i).roots || z.getPeaks(i), r = n.length,
                    s = e && r > 1 ? n[r - 1] : r > 0 ? n[0] : .5;
                c.push(z.getLength(i, e ? s : 0, e ? 1 : s) / 2)
            }

            function e(t, e, i) {
                return e < i ? t > e && t < i : t > e || t < i
            }

            var i = this._intersection;
            if (!i) return !1;
            var n = this.getTime(), r = i.getTime(), s = n >= 1e-8 && n <= 1 - 1e-8, o = r >= 1e-8 && r <= 1 - 1e-8;
            if (s && o) return !this.isTouching();
            var a = this.getCurve(), l = n < 1e-8 ? a.getPrevious() : a, h = i.getCurve(),
                u = r < 1e-8 ? h.getPrevious() : h;
            if (n > 1 - 1e-8 && (a = a.getNext()), r > 1 - 1e-8 && (h = h.getNext()), !(l && a && u && h)) return !1;
            var c = [];
            s || (t(l, !0), t(a, !1)), o || (t(u, !0), t(h, !1));
            var d = this.getPoint(), f = Math.min.apply(Math, c),
                p = s ? a.getTangentAtTime(n) : a.getPointAt(f).subtract(d),
                g = s ? p.negate() : l.getPointAt(-f).subtract(d),
                m = o ? h.getTangentAtTime(r) : h.getPointAt(f).subtract(d),
                v = o ? m.negate() : u.getPointAt(-f).subtract(d), _ = g.getAngle(), y = p.getAngle(), w = v.getAngle(),
                x = m.getAngle();
            return !!(s ? e(_, w, x) ^ e(y, w, x) && e(_, x, w) ^ e(y, x, w) : e(w, _, y) ^ e(x, _, y) && e(w, y, _) ^ e(x, y, _))
        }, hasOverlap: function () {
            return !!this._overlap
        }
    }, r.each(z._evaluateMethods, function (t) {
        var e = t + "At";
        this[t] = function () {
            var t = this.getCurve(), i = this.getTime();
            return null != i && t && t[e](i, !0)
        }
    }, {preserve: !0}), new function () {
        function t(t, e, i) {
            function n(i, n) {
                for (var s = i + n; s >= -1 && s <= r; s += n) {
                    var o = t[(s % r + r) % r];
                    if (!e.getPoint().isClose(o.getPoint(), 1e-7)) break;
                    if (e.equals(o)) return o
                }
                return null
            }

            for (var r = t.length, s = 0, o = r - 1; s <= o;) {
                var a, l = s + o >>> 1, h = t[l];
                if (i && (a = e.equals(h) ? h : n(l, -1) || n(l, 1))) return e._overlap && (a._overlap = a._intersection._overlap = !0), a;
                var u = e.getPath(), c = h.getPath();
                (u !== c ? u._id - c._id : e.getIndex() + e.getTime() - (h.getIndex() + h.getTime())) < 0 ? o = l - 1 : s = l + 1
            }
            return t.splice(s, 0, e), e
        }

        return {
            statics: {
                insert: t, expand: function (e) {
                    for (var i = e.slice(), n = e.length - 1; n >= 0; n--) t(i, e[n]._intersection, !1);
                    return i
                }
            }
        }
    }), M = w.extend({
        _class: "PathItem", _selectBounds: !1, _canScaleStroke: !0, beans: !0, initialize: function () {
        }, statics: {
            create: function (t) {
                var e, i, n;
                if (r.isPlainObject(t) ? (i = t.segments, e = t.pathData) : Array.isArray(t) ? i = t : "string" == typeof t && (e = t), i) {
                    var s = i[0];
                    n = s && Array.isArray(s[0])
                } else e && (n = (e.match(/m/gi) || []).length > 1 || /z\s*\S+/i.test(e));
                return new (n ? L : O)(t)
            }
        }, _asPathItem: function () {
            return this
        }, isClockwise: function () {
            return this.getArea() >= 0
        }, setClockwise: function (t) {
            this.isClockwise() != (t = !!t) && this.reverse()
        }, setPathData: function (t) {
            function e(t, e) {
                var i = +n[t];
                return a && (i += l[e]), i
            }

            function i(t) {
                return new c(e(t, "x"), e(t + 1, "y"))
            }

            var n, r, s, o = t && t.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/gi), a = !1, l = new c, h = new c;
            this.clear();
            for (var u = 0, d = o && o.length; u < d; u++) {
                var p = o[u], g = p[0], m = g.toLowerCase();
                n = p.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
                var v = n && n.length;
                switch (a = g === m, "z" !== r || /[mz]/.test(m) || this.moveTo(l), m) {
                    case"m":
                    case"l":
                        for (var _ = "m" === m, y = 0; y < v; y += 2) this[_ ? "moveTo" : "lineTo"](l = i(y)), _ && (h = l, _ = !1);
                        s = l;
                        break;
                    case"h":
                    case"v":
                        var w = "h" === m ? "x" : "y";
                        l = l.clone();
                        for (var y = 0; y < v; y++) l[w] = e(y, w), this.lineTo(l);
                        s = l;
                        break;
                    case"c":
                        for (var y = 0; y < v; y += 6) this.cubicCurveTo(i(y), s = i(y + 2), l = i(y + 4));
                        break;
                    case"s":
                        for (var y = 0; y < v; y += 4) this.cubicCurveTo(/[cs]/.test(r) ? l.multiply(2).subtract(s) : l, s = i(y), l = i(y + 2)), r = m;
                        break;
                    case"q":
                        for (var y = 0; y < v; y += 4) this.quadraticCurveTo(s = i(y), l = i(y + 2));
                        break;
                    case"t":
                        for (var y = 0; y < v; y += 2) this.quadraticCurveTo(s = /[qt]/.test(r) ? l.multiply(2).subtract(s) : l, l = i(y)), r = m;
                        break;
                    case"a":
                        for (var y = 0; y < v; y += 7) this.arcTo(l = i(y + 5), new f(+n[y], +n[y + 1]), +n[y + 2], +n[y + 4], +n[y + 3]);
                        break;
                    case"z":
                        this.closePath(1e-12), l = h
                }
                r = m
            }
        }, _canComposite: function () {
            return !(this.hasFill() && this.hasStroke())
        }, _contains: function (t) {
            var e = t.isInside(this.getBounds({internal: !0, handle: !0})) ? this._getWinding(t) : {};
            return e.onPath || !!("evenodd" === this.getFillRule() ? 1 & e.windingL || 1 & e.windingR : e.winding)
        }, getIntersections: function (t, e, i, n) {
            var r = this === t || !t, s = this._matrix._orNullIfIdentity(),
                o = r ? s : (i || t._matrix)._orNullIfIdentity();
            return r || this.getBounds(s).intersects(t.getBounds(o), 1e-12) ? z.getIntersections(this.getCurves(), !r && t.getCurves(), e, s, o, n) : []
        }, getCrossings: function (t) {
            return this.getIntersections(t, function (t) {
                return t.hasOverlap() || t.isCrossing()
            })
        }, getNearestLocation: function () {
            for (var t = c.read(arguments), e = this.getCurves(), i = 1 / 0, n = null, r = 0, s = e.length; r < s; r++) {
                var o = e[r].getNearestLocation(t);
                o._distance < i && (i = o._distance, n = o)
            }
            return n
        }, getNearestPoint: function () {
            var t = this.getNearestLocation.apply(this, arguments);
            return t ? t.getPoint() : t
        }, interpolate: function (t, e, i) {
            var n = !this._children, r = n ? "_segments" : "_children", s = t[r], o = e[r], a = this[r];
            if (!s || !o || s.length !== o.length) throw new Error("Invalid operands in interpolate() call: " + t + ", " + e);
            var l = a.length, h = o.length;
            if (l < h) for (var u = n ? P : O, c = l; c < h; c++) this.add(new u); else l > h && this[n ? "removeSegments" : "removeChildren"](h, l);
            for (var c = 0; c < h; c++) a[c].interpolate(s[c], o[c], i);
            n && (this.setClosed(t._closed), this._changed(9))
        }, compare: function (t) {
            var e = !1;
            if (t) {
                var i = this._children || [this], n = t._children ? t._children.slice() : [t], r = i.length,
                    s = n.length, o = [], a = 0;
                e = !0;
                for (var l = r - 1; l >= 0 && e; l--) {
                    var h = i[l];
                    e = !1;
                    for (var u = s - 1; u >= 0 && !e; u--) h.compare(n[u]) && (o[u] || (o[u] = !0, a++), e = !0)
                }
                e = e && a === s
            }
            return e
        }
    }), O = M.extend({
        _class: "Path", _serializeFields: {segments: [], closed: !1}, initialize: function (t) {
            this._closed = !1, this._segments = [], this._version = 0;
            var i = Array.isArray(t) ? "object" == typeof t[0] ? t : arguments : !t || t.size !== e || t.x === e && t.point === e ? null : arguments;
            i && i.length > 0 ? this.setSegments(i) : (this._curves = e, this._segmentSelection = 0, i || "string" != typeof t || (this.setPathData(t), t = null)), this._initialize(!i && t)
        }, _equals: function (t) {
            return this._closed === t._closed && r.equals(this._segments, t._segments)
        }, copyContent: function (t) {
            this.setSegments(t._segments), this._closed = t._closed
        }, _changed: function t(i) {
            if (t.base.call(this, i), 8 & i) {
                if (this._length = this._area = e, 16 & i) this._version++; else if (this._curves) for (var n = 0, r = this._curves.length; n < r; n++) this._curves[n]._changed()
            } else 32 & i && (this._bounds = e)
        }, getStyle: function () {
            var t = this._parent;
            return (t instanceof L ? t : this)._style
        }, getSegments: function () {
            return this._segments
        }, setSegments: function (t) {
            var i = this.isFullySelected(), n = t && t.length;
            if (this._segments.length = 0, this._segmentSelection = 0, this._curves = e, n) {
                var r = t[n - 1];
                "boolean" == typeof r && (this.setClosed(r), n--), this._add(P.readList(t, 0, {}, n))
            }
            i && this.setFullySelected(!0)
        }, getFirstSegment: function () {
            return this._segments[0]
        }, getLastSegment: function () {
            return this._segments[this._segments.length - 1]
        }, getCurves: function () {
            var t = this._curves, e = this._segments;
            if (!t) {
                var i = this._countCurves();
                t = this._curves = new Array(i);
                for (var n = 0; n < i; n++) t[n] = new z(this, e[n], e[n + 1] || e[0])
            }
            return t
        }, getFirstCurve: function () {
            return this.getCurves()[0]
        }, getLastCurve: function () {
            var t = this.getCurves();
            return t[t.length - 1]
        }, isClosed: function () {
            return this._closed
        }, setClosed: function (t) {
            if (this._closed != (t = !!t)) {
                if (this._closed = t, this._curves) {
                    var e = this._curves.length = this._countCurves();
                    t && (this._curves[e - 1] = new z(this, this._segments[e - 1], this._segments[0]))
                }
                this._changed(25)
            }
        }
    }, {
        beans: !0, getPathData: function (t, e) {
            function i(e, i) {
                if (e._transformCoordinates(t, g), n = g[0], r = g[1], m) v.push("M" + p.pair(n, r)), m = !1; else if (a = g[2], h = g[3], a === n && h === r && u === s && c === o) {
                    if (!i) {
                        var l = n - s, d = r - o;
                        v.push(0 === l ? "v" + p.number(d) : 0 === d ? "h" + p.number(l) : "l" + p.pair(l, d))
                    }
                } else v.push("c" + p.pair(u - s, c - o) + " " + p.pair(a - s, h - o) + " " + p.pair(n - s, r - o));
                s = n, o = r, u = g[4], c = g[5]
            }

            var n, r, s, o, a, h, u, c, d = this._segments, f = d.length, p = new l(e), g = new Array(6), m = !0,
                v = [];
            if (!f) return "";
            for (var _ = 0; _ < f; _++) i(d[_]);
            return this._closed && f > 0 && (i(d[0], !0), v.push("z")), v.join("")
        }, isEmpty: function () {
            return !this._segments.length
        }, _transformContent: function (t) {
            for (var e = this._segments, i = new Array(6), n = 0, r = e.length; n < r; n++) e[n]._transformCoordinates(t, i, !0);
            return !0
        }, _add: function (t, e) {
            for (var i = this._segments, n = this._curves, r = t.length, s = null == e, e = s ? i.length : e, o = 0; o < r; o++) {
                var a = t[o];
                a._path && (a = t[o] = a.clone()), a._path = this, a._index = e + o, a._selection && this._updateSelection(a, 0, a._selection)
            }
            if (s) i.push.apply(i, t); else {
                i.splice.apply(i, [e, 0].concat(t));
                for (var o = e + r, l = i.length; o < l; o++) i[o]._index = o
            }
            if (n) {
                var h = this._countCurves(), u = e > 0 && e + r - 1 === h ? e - 1 : e, c = u, d = Math.min(u + r, h);
                t._curves && (n.splice.apply(n, [u, 0].concat(t._curves)), c += t._curves.length);
                for (var o = c; o < d; o++) n.splice(o, 0, new z(this, null, null));
                this._adjustCurves(u, d)
            }
            return this._changed(25), t
        }, _adjustCurves: function (t, e) {
            for (var i, n = this._segments, r = this._curves, s = t; s < e; s++) i = r[s], i._path = this, i._segment1 = n[s], i._segment2 = n[s + 1] || n[0], i._changed();
            (i = r[this._closed && !t ? n.length - 1 : t - 1]) && (i._segment2 = n[t] || n[0], i._changed()), (i = r[e]) && (i._segment1 = n[e], i._changed())
        }, _countCurves: function () {
            var t = this._segments.length;
            return !this._closed && t > 0 ? t - 1 : t
        }, add: function (t) {
            return arguments.length > 1 && "number" != typeof t ? this._add(P.readList(arguments)) : this._add([P.read(arguments)])[0]
        }, insert: function (t, e) {
            return arguments.length > 2 && "number" != typeof e ? this._add(P.readList(arguments, 1), t) : this._add([P.read(arguments, 1)], t)[0]
        }, addSegment: function () {
            return this._add([P.read(arguments)])[0]
        }, insertSegment: function (t) {
            return this._add([P.read(arguments, 1)], t)[0]
        }, addSegments: function (t) {
            return this._add(P.readList(t))
        }, insertSegments: function (t, e) {
            return this._add(P.readList(e), t)
        }, removeSegment: function (t) {
            return this.removeSegments(t, t + 1)[0] || null
        }, removeSegments: function (t, e, i) {
            t = t || 0, e = r.pick(e, this._segments.length);
            var n = this._segments, s = this._curves, o = n.length, a = n.splice(t, e - t), l = a.length;
            if (!l) return a;
            for (var h = 0; h < l; h++) {
                var u = a[h];
                u._selection && this._updateSelection(u, u._selection, 0), u._index = u._path = null
            }
            for (var h = t, c = n.length; h < c; h++) n[h]._index = h;
            if (s) {
                for (var d = t > 0 && e === o + (this._closed ? 1 : 0) ? t - 1 : t, s = s.splice(d, l), h = s.length - 1; h >= 0; h--) s[h]._path = null;
                i && (a._curves = s.slice(1)), this._adjustCurves(d, d)
            }
            return this._changed(25), a
        }, clear: "#removeSegments", hasHandles: function () {
            for (var t = this._segments, e = 0, i = t.length; e < i; e++) if (t[e].hasHandles()) return !0;
            return !1
        }, clearHandles: function () {
            for (var t = this._segments, e = 0, i = t.length; e < i; e++) t[e].clearHandles()
        }, getLength: function () {
            if (null == this._length) {
                for (var t = this.getCurves(), e = 0, i = 0, n = t.length; i < n; i++) e += t[i].getLength();
                this._length = e
            }
            return this._length
        }, getArea: function () {
            var t = this._area;
            if (null == t) {
                var e = this._segments, i = this._closed;
                t = 0;
                for (var n = 0, r = e.length; n < r; n++) {
                    var s = n + 1 === r;
                    t += z.getArea(z.getValues(e[n], e[s ? 0 : n + 1], null, s && !i))
                }
                this._area = t
            }
            return t
        }, isFullySelected: function () {
            var t = this._segments.length;
            return this.isSelected() && t > 0 && this._segmentSelection === 7 * t
        }, setFullySelected: function (t) {
            t && this._selectSegments(!0), this.setSelected(t)
        }, setSelection: function t(e) {
            1 & e || this._selectSegments(!1), t.base.call(this, e)
        }, _selectSegments: function (t) {
            var e = this._segments, i = e.length, n = t ? 7 : 0;
            this._segmentSelection = n * i;
            for (var r = 0; r < i; r++) e[r]._selection = n
        }, _updateSelection: function (t, e, i) {
            t._selection = i, (this._segmentSelection += i - e) > 0 && this.setSelected(!0)
        }, divideAt: function (t) {
            var e, i = this.getLocationAt(t);
            return i && (e = i.getCurve().divideAt(i.getCurveOffset())) ? e._segment1 : null
        }, splitAt: function (t) {
            var e = this.getLocationAt(t), i = e && e.index, n = e && e.time;
            n > 1 - 1e-8 && (i++, n = 0);
            var r = this.getCurves();
            if (i >= 0 && i < r.length) {
                n >= 1e-8 && r[i++].divideAtTime(n);
                var s, o = this.removeSegments(i, this._segments.length, !0);
                return this._closed ? (this.setClosed(!1), s = this) : (s = new O(w.NO_INSERT), s.insertAbove(this), s.copyAttributes(this)), s._add(o, 0), this.addSegment(o[0]), s
            }
            return null
        }, split: function (t, i) {
            var n, r = i === e ? t : (n = this.getCurves()[t]) && n.getLocationAtTime(i);
            return null != r ? this.splitAt(r) : null
        }, join: function (t, e) {
            var i = e || 0;
            if (t && t !== this) {
                var n = t._segments, r = this.getLastSegment(), s = t.getLastSegment();
                if (!s) return this;
                r && r._point.isClose(s._point, i) && t.reverse();
                var o = t.getFirstSegment();
                if (r && r._point.isClose(o._point, i)) r.setHandleOut(o._handleOut), this._add(n.slice(1)); else {
                    var a = this.getFirstSegment();
                    a && a._point.isClose(o._point, i) && t.reverse(), s = t.getLastSegment(), a && a._point.isClose(s._point, i) ? (a.setHandleIn(s._handleIn), this._add(n.slice(0, n.length - 1), 0)) : this._add(n.slice())
                }
                t._closed && this._add([n[0]]), t.remove()
            }
            var l = this.getFirstSegment(), h = this.getLastSegment();
            return l !== h && l._point.isClose(h._point, i) && (l.setHandleIn(h._handleIn), h.remove(), this.setClosed(!0)), this
        }, reduce: function (t) {
            for (var e = this.getCurves(), i = t && t.simplify, n = i ? 1e-7 : 0, r = e.length - 1; r >= 0; r--) {
                var s = e[r];
                !s.hasHandles() && (!s.hasLength(n) || i && s.isCollinear(s.getNext())) && s.remove()
            }
            return this
        }, reverse: function () {
            this._segments.reverse();
            for (var t = 0, e = this._segments.length; t < e; t++) {
                var i = this._segments[t], n = i._handleIn;
                i._handleIn = i._handleOut, i._handleOut = n, i._index = t
            }
            this._curves = null, this._changed(9)
        }, flatten: function (t) {
            for (var e = new N(this, t || .25, 256, !0), i = e.parts, n = i.length, r = [], s = 0; s < n; s++) r.push(new P(i[s].curve.slice(0, 2)));
            !this._closed && n > 0 && r.push(new P(i[n - 1].curve.slice(6))), this.setSegments(r)
        }, simplify: function (t) {
            var e = new F(this).fit(t || 2.5);
            return e && this.setSegments(e), !!e
        }, smooth: function (t) {
            function i(t, e) {
                var i = t && t.index;
                if (null != i) {
                    var r = t.path;
                    if (r && r !== n) throw new Error(t._class + " " + i + " of " + r + " is not part of " + n);
                    e && t instanceof z && i++
                } else i = "number" == typeof t ? t : e;
                return Math.min(i < 0 && l ? i % a : i < 0 ? i + a : i, a - 1)
            }

            var n = this, r = t || {}, s = r.type || "asymmetric", o = this._segments, a = o.length, l = this._closed,
                h = l && r.from === e && r.to === e, u = i(r.from, 0), c = i(r.to, a - 1);
            if (u > c) if (l) u -= a; else {
                var d = u;
                u = c, c = d
            }
            if (/^(?:asymmetric|continuous)$/.test(s)) {
                var f = "asymmetric" === s, p = Math.min, g = c - u + 1, m = g - 1, v = h ? p(g, 4) : 1, _ = v, y = v,
                    w = [];
                if (l || (_ = p(1, u), y = p(1, a - c - 1)), (m += _ + y) <= 1) return;
                for (var x = 0, b = u - _; x <= m; x++, b++) w[x] = o[(b < 0 ? b + a : b) % a]._point;
                for (var C = w[0]._x + 2 * w[1]._x, S = w[0]._y + 2 * w[1]._y, T = 2, E = m - 1, k = [C], P = [S], A = [T], I = [], M = [], x = 1; x < m; x++) {
                    var O = x < E, L = O ? 1 : f ? 1 : 2, N = O ? 4 : f ? 2 : 7, F = O ? 4 : f ? 3 : 8,
                        D = O ? 2 : f ? 0 : 1, q = L / T;
                    T = A[x] = N - q, C = k[x] = F * w[x]._x + D * w[x + 1]._x - q * C, S = P[x] = F * w[x]._y + D * w[x + 1]._y - q * S
                }
                I[E] = k[E] / A[E], M[E] = P[E] / A[E];
                for (var x = m - 2; x >= 0; x--) I[x] = (k[x] - I[x + 1]) / A[x], M[x] = (P[x] - M[x + 1]) / A[x];
                I[m] = (3 * w[m]._x - I[E]) / 2, M[m] = (3 * w[m]._y - M[E]) / 2;
                for (var x = _, R = m - y, b = u; x <= R; x++, b++) {
                    var H = o[b < 0 ? b + a : b], B = H._point, j = I[x] - B._x, W = M[x] - B._y;
                    (h || x < R) && H.setHandleOut(j, W), (h || x > _) && H.setHandleIn(-j, -W)
                }
            } else for (var x = u; x <= c; x++) o[x < 0 ? x + a : x].smooth(r, !h && x === u, !h && x === c)
        }, toShape: function (t) {
            function i(t, e) {
                var i = u[t], n = i.getNext(), r = u[e], s = r.getNext();
                return i._handleOut.isZero() && n._handleIn.isZero() && r._handleOut.isZero() && s._handleIn.isZero() && n._point.subtract(i._point).isCollinear(s._point.subtract(r._point))
            }

            function n(t) {
                var e = u[t], i = e.getNext(), n = e._handleOut, r = i._handleIn;
                if (n.isOrthogonal(r)) {
                    var s = e._point, o = i._point, a = new _(s, n, !0).intersect(new _(o, r, !0), !0);
                    return a && h.isZero(n.getLength() / a.subtract(s).getLength() - .5522847498307936) && h.isZero(r.getLength() / a.subtract(o).getLength() - .5522847498307936)
                }
                return !1
            }

            function r(t, e) {
                return u[t]._point.getDistance(u[e]._point)
            }

            if (!this._closed) return null;
            var s, o, a, l, u = this._segments;
            if (!this.hasHandles() && 4 === u.length && i(0, 2) && i(1, 3) && function (t) {
                var e = u[t], i = e.getPrevious(), n = e.getNext();
                return i._handleOut.isZero() && e._handleIn.isZero() && e._handleOut.isZero() && n._handleIn.isZero() && e._point.subtract(i._point).isOrthogonal(n._point.subtract(e._point))
            }(1) ? (s = C.Rectangle, o = new f(r(0, 3), r(0, 1)), l = u[1]._point.add(u[2]._point).divide(2)) : 8 === u.length && n(0) && n(2) && n(4) && n(6) && i(1, 5) && i(3, 7) ? (s = C.Rectangle, o = new f(r(1, 6), r(0, 3)), a = o.subtract(new f(r(0, 7), r(1, 2))).divide(2), l = u[3]._point.add(u[4]._point).divide(2)) : 4 === u.length && n(0) && n(1) && n(2) && n(3) && (h.isZero(r(0, 2) - r(1, 3)) ? (s = C.Circle, a = r(0, 2) / 2) : (s = C.Ellipse, a = new f(r(2, 0) / 2, r(3, 1) / 2)), l = u[1]._point), s) {
                var c = this.getPosition(!0), d = new s({center: c, size: o, radius: a, insert: !1});
                return d.copyAttributes(this, !0), d._matrix.prepend(this._matrix), d.rotate(l.subtract(c).getAngle() + 90), (t === e || t) && d.insertAbove(this), d
            }
            return null
        }, toPath: "#clone", compare: function t(e) {
            if (!e || e instanceof L) return t.base.call(this, e);
            var i = this.getCurves(), n = e.getCurves(), r = i.length, s = n.length;
            if (!r || !s) return r == s;
            for (var o, a, l = i[0].getValues(), h = [], u = 0, c = 0, d = 0; d < s; d++) {
                var f = n[d].getValues();
                h.push(f);
                var p = z.getOverlaps(l, f);
                if (p) {
                    o = !d && p[0][0] > 0 ? s - 1 : d, a = p[0][1];
                    break
                }
            }
            for (var g, m = Math.abs, f = h[o]; l && f;) {
                var p = z.getOverlaps(l, f);
                if (p) {
                    if (m(p[0][0] - c) < 1e-8) {
                        c = p[1][0], 1 === c && (l = ++u < r ? i[u].getValues() : null, c = 0);
                        var v = p[0][1];
                        if (m(v - a) < 1e-8) {
                            if (g || (g = [o, v]), a = p[1][1], 1 === a && (++o >= s && (o = 0), f = h[o] || n[o].getValues(), a = 0), !l) return g[0] === o && g[1] === a;
                            continue
                        }
                    }
                }
                break
            }
            return !1
        }, _hitTestSelf: function (t, e, i, n) {
            function r(e, i) {
                return t.subtract(e).divide(i).length <= 1
            }

            function s(t, i, n) {
                if (!e.selected || i.isSelected()) {
                    var s = t._point;
                    if (i !== s && (i = i.add(s)), r(i, x)) return new k(n, g, {segment: t, point: i})
                }
            }

            function o(t, i) {
                return (i || e.segments) && s(t, t._point, "segment") || !i && e.handles && (s(t, t._handleIn, "handle-in") || s(t, t._handleOut, "handle-out"))
            }

            function a(t) {
                d.add(t)
            }

            function l(e) {
                var i = y || e._index > 0 && e._index < _ - 1;
                if ("round" === (i ? h : u)) return r(e._point, x);
                if (d = new O({
                    internal: !0,
                    closed: !0
                }), i ? e.isSmooth() || O._addBevelJoin(e, h, T, c, null, n, a, !0) : "square" === u && O._addSquareCap(e, u, T, null, n, a, !0), !d.isEmpty()) {
                    var s;
                    return d.contains(t) || (s = d.getNearestLocation(t)) && r(s.getPoint(), w)
                }
            }

            var h, u, c, d, f, p, g = this, m = this.getStyle(), v = this._segments, _ = v.length, y = this._closed,
                w = e._tolerancePadding, x = w, b = e.stroke && m.hasStroke(), C = e.fill && m.hasFill(), S = e.curves,
                T = b ? m.getStrokeWidth() / 2 : C && e.tolerance > 0 || S ? 0 : null;
            if (null !== T && (T > 0 ? (h = m.getStrokeJoin(), u = m.getStrokeCap(), c = m.getMiterLimit(), x = x.add(O._getStrokePadding(T, n))) : h = u = "round"), !e.ends || e.segments || y) {
                if (e.segments || e.handles) for (var E = 0; E < _; E++) if (p = o(v[E])) return p
            } else if (p = o(v[0], !0) || o(v[_ - 1], !0)) return p;
            if (null !== T) {
                if (f = this.getNearestLocation(t)) {
                    var P = f.getTime();
                    0 === P || 1 === P && _ > 1 ? l(f.getSegment()) || (f = null) : r(f.getPoint(), x) || (f = null)
                }
                if (!f && "miter" === h && _ > 1) for (var E = 0; E < _; E++) {
                    var A = v[E];
                    if (t.getDistance(A._point) <= c * T && l(A)) {
                        f = A.getLocation();
                        break
                    }
                }
            }
            return !f && C && this._contains(t) || f && !b && !S ? new k("fill", this) : f ? new k(b ? "stroke" : "curve", this, {
                location: f,
                point: f.getPoint()
            }) : null
        }
    }, r.each(z._evaluateMethods, function (t) {
        this[t + "At"] = function (e) {
            var i = this.getLocationAt(e);
            return i && i[t]()
        }
    }, {
        beans: !1, getLocationOf: function () {
            for (var t = c.read(arguments), e = this.getCurves(), i = 0, n = e.length; i < n; i++) {
                var r = e[i].getLocationOf(t);
                if (r) return r
            }
            return null
        }, getOffsetOf: function () {
            var t = this.getLocationOf.apply(this, arguments);
            return t ? t.getOffset() : null
        }, getLocationAt: function (t) {
            if ("number" == typeof t) {
                for (var e = this.getCurves(), i = 0, n = 0, r = e.length; n < r; n++) {
                    var s = i, o = e[n];
                    if ((i += o.getLength()) > t) return o.getLocationAt(t - s)
                }
                if (e.length > 0 && t <= this.getLength()) return new I(e[e.length - 1], 1)
            } else if (t && t.getPath && t.getPath() === this) return t;
            return null
        }
    }), new function () {
        function t(t, e, i, n) {
            function r(e) {
                var i = l[e], n = l[e + 1];
                s == i && o == n || (t.beginPath(), t.moveTo(s, o), t.lineTo(i, n), t.stroke(), t.beginPath(), t.arc(i, n, a, 0, 2 * Math.PI, !0), t.fill())
            }

            for (var s, o, a = n / 2, l = new Array(6), h = 0, u = e.length; h < u; h++) {
                var c = e[h], d = c._selection;
                if (c._transformCoordinates(i, l), s = l[0], o = l[1], 2 & d && r(2), 4 & d && r(4), t.fillRect(s - a, o - a, n, n), !(1 & d)) {
                    var f = t.fillStyle;
                    t.fillStyle = "#ffffff", t.fillRect(s - a + 1, o - a + 1, n - 2, n - 2), t.fillStyle = f
                }
            }
        }

        function e(t, e, i) {
            function n(e) {
                if (i) e._transformCoordinates(i, p), r = p[0], s = p[1]; else {
                    var n = e._point;
                    r = n._x, s = n._y
                }
                if (g) t.moveTo(r, s), g = !1; else {
                    if (i) l = p[2], h = p[3]; else {
                        var d = e._handleIn;
                        l = r + d._x, h = s + d._y
                    }
                    l === r && h === s && u === o && c === a ? t.lineTo(r, s) : t.bezierCurveTo(u, c, l, h, r, s)
                }
                if (o = r, a = s, i) u = p[4], c = p[5]; else {
                    var d = e._handleOut;
                    u = o + d._x, c = a + d._y
                }
            }

            for (var r, s, o, a, l, h, u, c, d = e._segments, f = d.length, p = new Array(6), g = !0, m = 0; m < f; m++) n(d[m]);
            e._closed && f > 0 && n(d[0])
        }

        return {
            _draw: function (t, i, n, r) {
                function s(t) {
                    return c[(t % d + d) % d]
                }

                var o = i.dontStart, a = i.dontFinish || i.clip, l = this.getStyle(), h = l.hasFill(),
                    u = l.hasStroke(), c = l.getDashArray(), d = !paper.support.nativeDash && u && c && c.length;
                if (o || t.beginPath(), (h || u && !d || a) && (e(t, this, r), this._closed && t.closePath()), !a && (h || u) && (this._setStyles(t, i, n), h && (t.fill(l.getFillRule()), t.shadowColor = "rgba(0,0,0,0)"), u)) {
                    if (d) {
                        o || t.beginPath();
                        var f, p = new N(this, .25, 32, !1, r), g = p.length, m = -l.getDashOffset(), v = 0;
                        for (m %= g; m > 0;) m -= s(v--) + s(v--);
                        for (; m < g;) f = m + s(v++), (m > 0 || f > 0) && p.drawPart(t, Math.max(m, 0), Math.max(f, 0)), m = f + s(v++)
                    }
                    t.stroke()
                }
            }, _drawSelected: function (i, n) {
                i.beginPath(), e(i, this, n), i.stroke(), t(i, this._segments, n, paper.settings.handleSize)
            }
        }
    }, new function () {
        function t(t) {
            var e = t._segments;
            if (!e.length) throw new Error("Use a moveTo() command first");
            return e[e.length - 1]
        }

        return {
            moveTo: function () {
                var t = this._segments;
                1 === t.length && this.removeSegment(0), t.length || this._add([new P(c.read(arguments))])
            }, moveBy: function () {
                throw new Error("moveBy() is unsupported on Path items.")
            }, lineTo: function () {
                this._add([new P(c.read(arguments))])
            }, cubicCurveTo: function () {
                var e = c.read(arguments), i = c.read(arguments), n = c.read(arguments), r = t(this);
                r.setHandleOut(e.subtract(r._point)), this._add([new P(n, i.subtract(n))])
            }, quadraticCurveTo: function () {
                var e = c.read(arguments), i = c.read(arguments), n = t(this)._point;
                this.cubicCurveTo(e.add(n.subtract(e).multiply(1 / 3)), e.add(i.subtract(e).multiply(1 / 3)), i)
            }, curveTo: function () {
                var e = c.read(arguments), i = c.read(arguments), n = r.pick(r.read(arguments), .5), s = 1 - n,
                    o = t(this)._point, a = e.subtract(o.multiply(s * s)).subtract(i.multiply(n * n)).divide(2 * n * s);
                if (a.isNaN()) throw new Error("Cannot put a curve through points with parameter = " + n);
                this.quadraticCurveTo(a, i)
            }, arcTo: function () {
                var e, i, n, s, o, a = Math.abs, l = Math.sqrt, u = t(this), d = u._point, p = c.read(arguments),
                    g = r.peek(arguments), m = r.pick(g, !0);
                if ("boolean" == typeof m) var y = d.add(p).divide(2),
                    e = y.add(y.subtract(d).rotate(m ? -90 : 90)); else if (r.remain(arguments) <= 2) e = p, p = c.read(arguments); else {
                    var w = f.read(arguments), x = h.isZero;
                    if (x(w.width) || x(w.height)) return this.lineTo(p);
                    var b = r.read(arguments), m = !!r.read(arguments), C = !!r.read(arguments), y = d.add(p).divide(2),
                        S = d.subtract(y).rotate(-b), T = S.x, E = S.y, k = a(w.width), A = a(w.height), z = k * k,
                        I = A * A, M = T * T, O = E * E, L = l(M / z + O / I);
                    if (L > 1 && (k *= L, A *= L, z = k * k, I = A * A), L = (z * I - z * O - I * M) / (z * O + I * M), a(L) < 1e-12 && (L = 0), L < 0) throw new Error("Cannot create an arc with the given arguments");
                    i = new c(k * E / A, -A * T / k).multiply((C === m ? -1 : 1) * l(L)).rotate(b).add(y), o = (new v).translate(i).rotate(b).scale(k, A), s = o._inverseTransform(d), n = s.getDirectedAngle(o._inverseTransform(p)), !m && n > 0 ? n -= 360 : m && n < 0 && (n += 360)
                }
                if (e) {
                    var N = new _(d.add(e).divide(2), e.subtract(d).rotate(90), !0),
                        F = new _(e.add(p).divide(2), p.subtract(e).rotate(90), !0), D = new _(d, p), q = D.getSide(e);
                    if (!(i = N.intersect(F, !0))) {
                        if (!q) return this.lineTo(p);
                        throw new Error("Cannot create an arc with the given arguments")
                    }
                    s = d.subtract(i), n = s.getDirectedAngle(p.subtract(i));
                    var R = D.getSide(i);
                    0 === R ? n = q * a(n) : q === R && (n += n < 0 ? 360 : -360)
                }
                for (var H = a(n), B = H >= 360 ? 4 : Math.ceil((H - 1e-7) / 90), j = n / B, W = j * Math.PI / 360, V = 4 / 3 * Math.sin(W) / (1 + Math.cos(W)), U = [], Y = 0; Y <= B; Y++) {
                    var S = p, X = null;
                    if (Y < B && (X = s.rotate(90).multiply(V), o ? (S = o._transformPoint(s), X = o._transformPoint(s.add(X)).subtract(S)) : S = i.add(s)), Y) {
                        var Z = s.rotate(-90).multiply(V);
                        o && (Z = o._transformPoint(s.add(Z)).subtract(S)), U.push(new P(S, Z, X))
                    } else u.setHandleOut(X);
                    s = s.rotate(j)
                }
                this._add(U)
            }, lineBy: function () {
                var e = c.read(arguments), i = t(this)._point;
                this.lineTo(i.add(e))
            }, curveBy: function () {
                var e = c.read(arguments), i = c.read(arguments), n = r.read(arguments), s = t(this)._point;
                this.curveTo(s.add(e), s.add(i), n)
            }, cubicCurveBy: function () {
                var e = c.read(arguments), i = c.read(arguments), n = c.read(arguments), r = t(this)._point;
                this.cubicCurveTo(r.add(e), r.add(i), r.add(n))
            }, quadraticCurveBy: function () {
                var e = c.read(arguments), i = c.read(arguments), n = t(this)._point;
                this.quadraticCurveTo(n.add(e), n.add(i))
            }, arcBy: function () {
                var e = t(this)._point, i = e.add(c.read(arguments)), n = r.pick(r.peek(arguments), !0);
                "boolean" == typeof n ? this.arcTo(i, n) : this.arcTo(i, e.add(c.read(arguments)))
            }, closePath: function (t) {
                this.setClosed(!0), this.join(this, t)
            }
        }
    }, {
        _getBounds: function (t, e) {
            var i = e.handle ? "getHandleBounds" : e.stroke ? "getStrokeBounds" : "getBounds";
            return O[i](this._segments, this._closed, this, t, e)
        }, statics: {
            getBounds: function (t, e, i, n, r, s) {
                function o(t) {
                    t._transformCoordinates(n, l);
                    for (var e = 0; e < 2; e++) z._addBounds(h[e], h[e + 4], l[e + 2], l[e], e, s ? s[e] : 0, u, c, d);
                    var i = h;
                    h = l, l = i
                }

                var a = t[0];
                if (!a) return new g;
                for (var l = new Array(6), h = a._transformCoordinates(n, new Array(6)), u = h.slice(0, 2), c = u.slice(), d = new Array(2), f = 1, p = t.length; f < p; f++) o(t[f]);
                return e && o(a), new g(u[0], u[1], c[0] - u[0], c[1] - u[1])
            }, getStrokeBounds: function (t, e, i, n, r) {
                function s(t) {
                    m = m.include(t)
                }

                function o(t) {
                    m = m.unite(x.setCenter(t._point.transform(n)))
                }

                function a(t, e) {
                    "round" === e || t.isSmooth() ? o(t) : O._addBevelJoin(t, e, v, w, n, d, s)
                }

                function l(t, e) {
                    "round" === e ? o(t) : O._addSquareCap(t, e, v, n, d, s)
                }

                var h = i.getStyle(), u = h.hasStroke(), c = h.getStrokeWidth(), d = u && i._getStrokeMatrix(n, r),
                    p = u && O._getStrokePadding(c, d), m = O.getBounds(t, e, i, n, r, p);
                if (!u) return m;
                for (var v = c / 2, _ = h.getStrokeJoin(), y = h.getStrokeCap(), w = h.getMiterLimit(), x = new g(new f(p)), b = t.length - (e ? 0 : 1), C = 1; C < b; C++) a(t[C], _);
                return e ? a(t[0], _) : b > 0 && (l(t[0], y), l(t[t.length - 1], y)), m
            }, _getStrokePadding: function (t, e) {
                if (!e) return [t, t];
                var i = new c(t, 0).transform(e), n = new c(0, t).transform(e), r = i.getAngleInRadians(),
                    s = i.getLength(), o = n.getLength(), a = Math.sin(r), l = Math.cos(r), h = Math.tan(r),
                    u = Math.atan2(o * h, s), d = Math.atan2(o, h * s);
                return [Math.abs(s * Math.cos(u) * l + o * Math.sin(u) * a), Math.abs(o * Math.sin(d) * l + s * Math.cos(d) * a)]
            }, _addBevelJoin: function (t, e, i, n, r, s, o, a) {
                var l = t.getCurve(), h = l.getPrevious(), u = l.getPoint1().transform(r),
                    d = h.getNormalAtTime(1).multiply(i).transform(s),
                    f = l.getNormalAtTime(0).multiply(i).transform(s);
                if (d.getDirectedAngle(f) < 0 && (d = d.negate(), f = f.negate()), a && o(u), o(u.add(d)), "miter" === e) {
                    var p = new _(u.add(d), new c(-d.y, d.x), !0).intersect(new _(u.add(f), new c(-f.y, f.x), !0), !0);
                    p && u.getDistance(p) <= n * i && o(p)
                }
                o(u.add(f))
            }, _addSquareCap: function (t, e, i, n, r, s, o) {
                var a = t._point.transform(n), l = t.getLocation(),
                    h = l.getNormal().multiply(0 === l.getTime() ? i : -i).transform(r);
                "square" === e && (o && (s(a.subtract(h)), s(a.add(h))), a = a.add(h.rotate(-90))), s(a.add(h)), s(a.subtract(h))
            }, getHandleBounds: function (t, e, i, n, r) {
                var s, o, a = i.getStyle(), l = r.stroke && a.hasStroke();
                if (l) {
                    var h = i._getStrokeMatrix(n, r), u = a.getStrokeWidth() / 2, c = u;
                    "miter" === a.getStrokeJoin() && (c = u * a.getMiterLimit()), "square" === a.getStrokeCap() && (c = Math.max(c, u * Math.SQRT2)), s = O._getStrokePadding(u, h), o = O._getStrokePadding(c, h)
                }
                for (var d = new Array(6), f = 1 / 0, p = -f, m = f, v = p, _ = 0, y = t.length; _ < y; _++) {
                    t[_]._transformCoordinates(n, d);
                    for (var w = 0; w < 6; w += 2) {
                        var x = w ? s : o, b = x ? x[0] : 0, C = x ? x[1] : 0, S = d[w], T = d[w + 1], E = S - b,
                            k = S + b, P = T - C, A = T + C;
                        E < f && (f = E), k > p && (p = k), P < m && (m = P), A > v && (v = A)
                    }
                }
                return new g(f, m, p - f, v - m)
            }
        }
    });
    O.inject({
        statics: new function () {
            function t(t, e, i) {
                var n = r.getNamed(i), s = new O(n && 0 == n.insert && w.NO_INSERT);
                return s._add(t), s._closed = e, s.set(n, {insert: !0})
            }

            function e(e, i, r) {
                for (var s = new Array(4), o = 0; o < 4; o++) {
                    var a = n[o];
                    s[o] = new P(a._point.multiply(i).add(e), a._handleIn.multiply(i), a._handleOut.multiply(i))
                }
                return t(s, !0, r)
            }

            var i = .5522847498307936,
                n = [new P([-1, 0], [0, i], [0, -i]), new P([0, -1], [-i, 0], [i, 0]), new P([1, 0], [0, -i], [0, i]), new P([0, 1], [i, 0], [-i, 0])];
            return {
                Line: function () {
                    return t([new P(c.readNamed(arguments, "from")), new P(c.readNamed(arguments, "to"))], !1, arguments)
                }, Circle: function () {
                    var t = c.readNamed(arguments, "center"), i = r.readNamed(arguments, "radius");
                    return e(t, new f(i), arguments)
                }, Rectangle: function () {
                    var e, n = g.readNamed(arguments, "rectangle"),
                        r = f.readNamed(arguments, "radius", 0, {readNull: !0}), s = n.getBottomLeft(!0),
                        o = n.getTopLeft(!0), a = n.getTopRight(!0), l = n.getBottomRight(!0);
                    if (!r || r.isZero()) e = [new P(s), new P(o), new P(a), new P(l)]; else {
                        r = f.min(r, n.getSize(!0).divide(2));
                        var h = r.width, u = r.height, c = h * i, d = u * i;
                        e = [new P(s.add(h, 0), null, [-c, 0]), new P(s.subtract(0, u), [0, d]), new P(o.add(0, u), null, [0, -d]), new P(o.add(h, 0), [-c, 0], null), new P(a.subtract(h, 0), null, [c, 0]), new P(a.add(0, u), [0, -d], null), new P(l.subtract(0, u), null, [0, d]), new P(l.subtract(h, 0), [c, 0])]
                    }
                    return t(e, !0, arguments)
                }, RoundRectangle: "#Rectangle", Ellipse: function () {
                    var t = C._readEllipse(arguments);
                    return e(t.center, t.radius, arguments)
                }, Oval: "#Ellipse", Arc: function () {
                    var t = c.readNamed(arguments, "from"), e = c.readNamed(arguments, "through"),
                        i = c.readNamed(arguments, "to"), n = r.getNamed(arguments),
                        s = new O(n && 0 == n.insert && w.NO_INSERT);
                    return s.moveTo(t), s.arcTo(e, i), s.set(n)
                }, RegularPolygon: function () {
                    for (var e = c.readNamed(arguments, "center"), i = r.readNamed(arguments, "sides"), n = r.readNamed(arguments, "radius"), s = 360 / i, o = i % 3 == 0, a = new c(0, o ? -n : n), l = o ? -1 : .5, h = new Array(i), u = 0; u < i; u++) h[u] = new P(e.add(a.rotate((u + l) * s)));
                    return t(h, !0, arguments)
                }, Star: function () {
                    for (var e = c.readNamed(arguments, "center"), i = 2 * r.readNamed(arguments, "points"), n = r.readNamed(arguments, "radius1"), s = r.readNamed(arguments, "radius2"), o = 360 / i, a = new c(0, -1), l = new Array(i), h = 0; h < i; h++) l[h] = new P(e.add(a.rotate(o * h).multiply(h % 2 ? s : n)));
                    return t(l, !0, arguments)
                }
            }
        }
    });
    var L = M.extend({
        _class: "CompoundPath", _serializeFields: {children: []}, beans: !0, initialize: function (t) {
            this._children = [], this._namedChildren = {}, this._initialize(t) || ("string" == typeof t ? this.setPathData(t) : this.addChildren(Array.isArray(t) ? t : arguments))
        }, insertChildren: function t(e, i) {
            var n = i, s = n[0];
            s && "number" == typeof s[0] && (n = [n]);
            for (var o = i.length - 1; o >= 0; o--) {
                var a = n[o];
                n !== i || a instanceof O || (n = r.slice(n)), Array.isArray(a) ? n[o] = new O({
                    segments: a,
                    insert: !1
                }) : a instanceof L && (n.splice.apply(n, [o, 1].concat(a.removeChildren())), a.remove())
            }
            return t.base.call(this, e, n)
        }, reduce: function t(e) {
            for (var i = this._children, n = i.length - 1; n >= 0; n--) {
                var r = i[n].reduce(e);
                r.isEmpty() && r.remove()
            }
            if (!i.length) {
                var r = new O(w.NO_INSERT);
                return r.copyAttributes(this), r.insertAbove(this), this.remove(), r
            }
            return t.base.call(this)
        }, isClosed: function () {
            for (var t = this._children, e = 0, i = t.length; e < i; e++) if (!t[e]._closed) return !1;
            return !0
        }, setClosed: function (t) {
            for (var e = this._children, i = 0, n = e.length; i < n; i++) e[i].setClosed(t)
        }, getFirstSegment: function () {
            var t = this.getFirstChild();
            return t && t.getFirstSegment()
        }, getLastSegment: function () {
            var t = this.getLastChild();
            return t && t.getLastSegment()
        }, getCurves: function () {
            for (var t = this._children, e = [], i = 0, n = t.length; i < n; i++) e.push.apply(e, t[i].getCurves());
            return e
        }, getFirstCurve: function () {
            var t = this.getFirstChild();
            return t && t.getFirstCurve()
        }, getLastCurve: function () {
            var t = this.getLastChild();
            return t && t.getLastCurve()
        }, getArea: function () {
            for (var t = this._children, e = 0, i = 0, n = t.length; i < n; i++) e += t[i].getArea();
            return e
        }, getLength: function () {
            for (var t = this._children, e = 0, i = 0, n = t.length; i < n; i++) e += t[i].getLength();
            return e
        }, getPathData: function (t, e) {
            for (var i = this._children, n = [], r = 0, s = i.length; r < s; r++) {
                var o = i[r], a = o._matrix;
                n.push(o.getPathData(t && !a.isIdentity() ? t.appended(a) : t, e))
            }
            return n.join("")
        }, _hitTestChildren: function t(e, i, n) {
            return t.base.call(this, e, i.class === O || "path" === i.type ? i : r.set({}, i, {fill: !1}), n)
        }, _draw: function (t, e, i, n) {
            var r = this._children;
            if (r.length) {
                e = e.extend({dontStart: !0, dontFinish: !0}), t.beginPath();
                for (var s = 0, o = r.length; s < o; s++) r[s].draw(t, e, n);
                if (!e.clip) {
                    this._setStyles(t, e, i);
                    var a = this._style;
                    a.hasFill() && (t.fill(a.getFillRule()), t.shadowColor = "rgba(0,0,0,0)"), a.hasStroke() && t.stroke()
                }
            }
        }, _drawSelected: function (t, e, i) {
            for (var n = this._children, r = 0, s = n.length; r < s; r++) {
                var o = n[r], a = o._matrix;
                i[o._id] || o._drawSelected(t, a.isIdentity() ? e : e.appended(a))
            }
        }
    }, new function () {
        function t(t, e) {
            var i = t._children;
            if (e && !i.length) throw new Error("Use a moveTo() command first");
            return i[i.length - 1]
        }

        return r.each(["lineTo", "cubicCurveTo", "quadraticCurveTo", "curveTo", "arcTo", "lineBy", "cubicCurveBy", "quadraticCurveBy", "curveBy", "arcBy"], function (e) {
            this[e] = function () {
                var i = t(this, !0);
                i[e].apply(i, arguments)
            }
        }, {
            moveTo: function () {
                var e = t(this), i = e && e.isEmpty() ? e : new O(w.NO_INSERT);
                i !== e && this.addChild(i), i.moveTo.apply(i, arguments)
            }, moveBy: function () {
                var e = t(this, !0), i = e && e.getLastSegment(), n = c.read(arguments);
                this.moveTo(i ? n.add(i._point) : n)
            }, closePath: function (e) {
                t(this, !0).closePath(e)
            }
        })
    }, r.each(["reverse", "flatten", "simplify", "smooth"], function (t) {
        this[t] = function (e) {
            for (var i, n = this._children, r = 0, s = n.length; r < s; r++) i = n[r][t](e) || i;
            return i
        }
    }, {}));
    M.inject(new function () {
        function t(t, e) {
            var i = t.clone(!1).reduce({simplify: !0}).transform(null, !0, !0);
            return e ? i.resolveCrossings().reorient("nonzero" === i.getFillRule(), !0) : i
        }

        function i(t, e, i, n, r) {
            var s = new L(w.NO_INSERT);
            return s.addChildren(t, !0), s = s.reduce({simplify: e}), r && 0 == r.insert || s.insertAbove(n && i.isSibling(n) && i.getIndex() < n.getIndex() ? n : i), s.copyAttributes(i, !0), s
        }

        function n(e, n, r, o) {
            function a(t) {
                for (var e = 0, i = t.length; e < i; e++) {
                    var n = t[e];
                    w.push.apply(w, n._segments), x.push.apply(x, n.getCurves()), n._overlapsOnly = !0
                }
            }

            if (o && (0 == o.trace || o.stroke) && /^(subtract|intersect)$/.test(r)) return s(e, n, r);
            var h = t(e, !0), c = n && e !== n && t(n, !0), p = v[r];
            p[r] = !0, c && (p.subtract || p.exclude) ^ c.isClockwise() ^ h.isClockwise() && c.reverse();
            var g, m = u(I.expand(h.getCrossings(c))), _ = h._children || [h], y = c && (c._children || [c]), w = [],
                x = [];
            if (m.length) {
                a(_), y && a(y);
                for (var b = 0, C = m.length; b < C; b++) d(m[b]._segment, h, c, x, p);
                for (var b = 0, C = w.length; b < C; b++) {
                    var S = w[b], T = S._intersection;
                    S._winding || d(S, h, c, x, p), T && T._overlap || (S._path._overlapsOnly = !1)
                }
                g = f(w, p)
            } else g = l(y ? _.concat(y) : _.slice(), function (t) {
                return !!p[t]
            });
            return i(g, !0, e, n, o)
        }

        function s(e, n, r) {
            function s(t) {
                if (!c[t._id] && (u || a.contains(t.getPointAt(t.getLength() / 2)) ^ h)) return d.unshift(t), c[t._id] = !0
            }

            for (var o = t(e), a = t(n), l = o.getCrossings(a), h = "subtract" === r, u = "divide" === r, c = {}, d = [], f = l.length - 1; f >= 0; f--) {
                var p = l[f].split();
                p && (s(p) && p.getFirstSegment().setHandleIn(0, 0), o.getLastSegment().setHandleOut(0, 0))
            }
            return s(o), i(d, !1, e, n)
        }

        function o(t, e) {
            for (var i = t; i;) {
                if (i === e) return;
                i = i._previous
            }
            for (; t._next && t._next !== e;) t = t._next;
            if (!t._next) {
                for (; e._previous;) e = e._previous;
                t._next = e, e._previous = t
            }
        }

        function a(t) {
            for (var e = t.length - 1; e >= 0; e--) t[e].clearHandles()
        }

        function l(t, e, i) {
            var n = t && t.length;
            if (n) {
                var s = r.each(t, function (t, e) {
                    this[t._id] = {container: null, winding: t.isClockwise() ? 1 : -1, index: e}
                }, {}), o = t.slice().sort(function (t, e) {
                    return m(e.getArea()) - m(t.getArea())
                }), a = o[0];
                null == i && (i = a.isClockwise());
                for (var l = 0; l < n; l++) {
                    for (var h = o[l], u = s[h._id], c = h.getInteriorPoint(), d = 0, f = l - 1; f >= 0; f--) {
                        var p = o[f];
                        if (p.contains(c)) {
                            var g = s[p._id];
                            d = g.winding, u.winding += d, u.container = g.exclude ? g.container : p;
                            break
                        }
                    }
                    if (e(u.winding) === e(d)) u.exclude = !0, t[u.index] = null; else {
                        var v = u.container;
                        h.setClockwise(v ? !v.isClockwise() : i)
                    }
                }
            }
            return t
        }

        function u(t, e, i) {
            function n(t) {
                return t._path._id + "." + t._segment1._index
            }

            for (var r, s, l, h = e && [], u = !1, c = i || [], d = i && {}, f = (i && i.length) - 1; f >= 0; f--) {
                var p = i[f];
                p._path && (d[n(p)] = !0)
            }
            for (var f = t.length - 1; f >= 0; f--) {
                var g, m = t[f], v = m._time, _ = v, y = e && !e(m), p = m._curve;
                if (p && (p !== s ? (u = !p.hasHandles() || d && d[n(p)], r = [], l = null, s = p) : l >= 1e-8 && (v /= l)), y) r && r.push(m); else {
                    if (e && h.unshift(m), l = _, v < 1e-8) g = p._segment1; else if (v > 1 - 1e-8) g = p._segment2; else {
                        var w = p.divideAtTime(v, !0);
                        u && c.push(p, w), g = w._segment1;
                        for (var x = r.length - 1; x >= 0; x--) {
                            var b = r[x];
                            b._time = (b._time - v) / (1 - v)
                        }
                    }
                    m._setSegment(g);
                    var C = g._intersection, S = m._intersection;
                    if (C) {
                        o(C, S);
                        for (var T = C; T;) o(T._intersection, C), T = T._next
                    } else g._intersection = S
                }
            }
            return i || a(c), h || t
        }

        function c(t, e, i, n, r) {
            function s(s) {
                var o = s[u + 0], l = s[u + 6];
                if (!(v < p(o, l) || v > g(o, l))) {
                    var d = s[h + 0], m = s[h + 2], x = s[h + 4], b = s[h + 6];
                    if (o === l) return void ((d < w && b > y || b < w && d > y) && (T = !0));
                    var E = v === o ? 0 : v === l ? 1 : y > g(d, m, x, b) || w < p(d, m, x, b) ? 1 : z.solveCubic(s, u, v, P, 0, 1) > 0 ? P[0] : 1,
                        A = 0 === E ? d : 1 === E ? b : z.getPoint(s, E)[i ? "y" : "x"], I = o > l ? 1 : -1,
                        M = a[u] > a[u + 6] ? 1 : -1, O = a[h + 6];
                    return v !== o ? (A < y ? C += I : A > w ? S += I : T = !0, A > f - _ && A < f + _ && (k /= 2)) : (I !== M ? d < y ? C += I : d > w && (S += I) : d != O && (O < w && A > w ? (S += I, T = !0) : O > y && A < y && (C += I, T = !0)), k = 0), a = s, !r && A > y && A < w && 0 === z.getTangent(s, E)[i ? "x" : "y"] && c(t, e, !i, n, !0)
                }
            }

            function o(t) {
                var e = t[u + 0], n = t[u + 2], r = t[u + 4], o = t[u + 6];
                if (v <= g(e, n, r, o) && v >= p(e, n, r, o)) for (var a, l = t[h + 0], c = t[h + 2], d = t[h + 4], f = t[h + 6], m = y > g(l, c, d, f) || w < p(l, c, d, f) ? [t] : z.getMonoCurves(t, i), _ = 0, x = m.length; _ < x; _++) if (a = s(m[_])) return a
            }

            for (var a, l, h = i ? 1 : 0, u = 1 ^ h, d = [t.x, t.y], f = d[h], v = d[u], _ = 1e-6, y = f - 1e-9, w = f + 1e-9, x = 0, b = 0, C = 0, S = 0, T = !1, E = !1, k = 1, P = [], A = 0, I = e.length; A < I; A++) {
                var M, O = e[A], L = O._path, N = O.getValues();
                if (!(A && e[A - 1]._path === L || (a = null, L._closed || (l = z.getValues(L.getLastCurve().getSegment2(), O.getSegment1(), null, !n), l[u] !== l[u + 6] && (a = l)), a))) {
                    a = N;
                    for (var F = L.getLastCurve(); F && F !== O;) {
                        var D = F.getValues();
                        if (D[u] !== D[u + 6]) {
                            a = D;
                            break
                        }
                        F = F.getPrevious()
                    }
                }
                if (M = o(N)) return M;
                if (A + 1 === I || e[A + 1]._path !== L) {
                    if (l && (M = o(l))) return M;
                    !T || C || S || (C = S = L.isClockwise(n) ^ i ? 1 : -1), x += C, b += S, C = S = 0, T && (E = !0, T = !1), l = null
                }
            }
            return x = m(x), b = m(b), {winding: g(x, b), windingL: x, windingR: b, quality: k, onPath: E}
        }

        function d(t, e, i, n, r) {
            var s, o = [], a = t, l = 0;
            do {
                var u = t.getCurve(), d = u.getLength();
                o.push({segment: t, curve: u, length: d}), l += d, t = t.getNext()
            } while (t && !t._intersection && t !== a);
            for (var f = [.5, .25, .75], s = {
                winding: 0,
                quality: -1
            }, p = 0; p < f.length && s.quality < .5; p++) for (var d = l * f[p], g = 0, v = o.length; g < v; g++) {
                var _ = o[g], y = _.length;
                if (d <= y) {
                    var u = _.curve, w = u._path, x = w._parent, b = x instanceof L ? x : w,
                        C = h.clamp(u.getTimeAt(d), 1e-8, 1 - 1e-8), S = u.getPointAtTime(C),
                        T = m(u.getTangentAtTime(C).y) < Math.SQRT1_2,
                        E = r.subtract && i && (b === e && i._getWinding(S, T, !0).winding || b === i && !e._getWinding(S, T, !0).winding) ? {
                            winding: 0,
                            quality: 1
                        } : c(S, n, T, !0);
                    E.quality > s.quality && (s = E);
                    break
                }
                d -= y
            }
            for (var g = o.length - 1; g >= 0; g--) o[g].segment._winding = s
        }

        function f(t, e) {
            function i(t) {
                var i;
                return !(!t || t._visited || e && (!e[(i = t._winding || {}).winding] || e.unite && 2 === i.winding && i.windingL && i.windingR))
            }

            function n(t) {
                if (t) for (var e = 0, i = s.length; e < i; e++) if (t === s[e]) return !0;
                return !1
            }

            function r(t) {
                for (var e = t._segments, i = 0, n = e.length; i < n; i++) e[i]._visited = !0
            }

            var s, o = [];
            t.sort(function (t, e) {
                var i = t._intersection, n = e._intersection, r = !(!i || !i._overlap), s = !(!n || !n._overlap),
                    o = t._path, a = e._path;
                return r ^ s ? r ? 1 : -1 : !i ^ !n ? i ? 1 : -1 : o !== a ? o._id - a._id : t._index - e._index
            });
            for (var a = 0, l = t.length; a < l; a++) {
                var h, u, c, d = t[a], f = i(d), p = null, g = !1, m = !0, v = [];
                if (f && d._path._overlapsOnly) {
                    var _ = d._path, y = d._intersection._segment._path;
                    _.compare(y) && (_.getArea() && o.push(_.clone(!1)), r(_), r(y), f = !1)
                }
                for (; f;) {
                    var x = !p, b = function (t, e) {
                        function r(r, o) {
                            for (; r && r !== o;) {
                                var a = r._segment, h = a && a._path;
                                if (h) {
                                    var u = a.getNext() || h.getFirstSegment(), c = u._intersection;
                                    a !== t && (n(a) || n(u) || u && i(a) && (i(u) || c && i(c._segment))) && l.push(a), e && s.push(a)
                                }
                                r = r._next
                            }
                        }

                        var o = t._intersection, a = o, l = [];
                        if (e && (s = [t]), o) {
                            for (r(o); o && o._prev;) o = o._prev;
                            r(o, a)
                        }
                        return l
                    }(d, x), C = b.shift(), g = !x && (n(d) || n(C)), S = !g && C;
                    if (x && (p = new O(w.NO_INSERT), h = null), g) {
                        (d.isFirst() || d.isLast()) && (m = d._path._closed), d._visited = !0;
                        break
                    }
                    if (S && h && (v.push(h), h = null), h || (S && b.push(d), h = {
                        start: p._segments.length,
                        crossings: b,
                        visited: u = [],
                        handleIn: c
                    }), S && (d = C), !i(d)) {
                        p.removeSegments(h.start);
                        for (var T = 0, E = u.length; T < E; T++) u[T]._visited = !1;
                        u.length = 0;
                        do {
                            (d = h && h.crossings.shift()) && d._path || (d = null, (h = v.pop()) && (u = h.visited, c = h.handleIn))
                        } while (h && !i(d));
                        if (!d) break
                    }
                    var k = d.getNext();
                    p.add(new P(d._point, c, k && d._handleOut)), d._visited = !0, u.push(d), d = k || d._path.getFirstSegment(), c = k && k._handleIn
                }
                g && (m && (p.getFirstSegment().setHandleIn(c), p.setClosed(m)), 0 !== p.getArea() && o.push(p))
            }
            return o
        }

        var p = Math.min, g = Math.max, m = Math.abs,
            v = {unite: {1: !0, 2: !0}, intersect: {2: !0}, subtract: {1: !0}, exclude: {1: !0, "-1": !0}};
        return {
            _getWinding: function (t, e, i) {
                return c(t, this.getCurves(), e, i)
            }, unite: function (t, e) {
                return n(this, t, "unite", e)
            }, intersect: function (t, e) {
                return n(this, t, "intersect", e)
            }, subtract: function (t, e) {
                return n(this, t, "subtract", e)
            }, exclude: function (t, e) {
                return n(this, t, "exclude", e)
            }, divide: function (t, e) {
                return e && (0 == e.trace || e.stroke) ? s(this, t, "divide") : i([this.subtract(t, e), this.intersect(t, e)], !0, this, t, e)
            }, resolveCrossings: function () {
                function t(t, e) {
                    var i = t && t._intersection;
                    return i && i._overlap && i._path === e
                }

                var e = this._children, i = e || [this], n = !1, s = !1, o = this.getIntersections(null, function (t) {
                    return t.hasOverlap() && (n = !0) || t.isCrossing() && (s = !0)
                }), l = n && s && [];
                if (o = I.expand(o), n) for (var h = u(o, function (t) {
                    return t.hasOverlap()
                }, l), c = h.length - 1; c >= 0; c--) {
                    var d = h[c], p = d._path, g = d._segment, m = g.getPrevious(), v = g.getNext();
                    t(m, p) && t(v, p) && (g.remove(), m._handleOut._set(0, 0), v._handleIn._set(0, 0), m === g || m.getCurve().hasLength() || (v._handleIn.set(m._handleIn), m.remove()))
                }
                s && (u(o, n && function (t) {
                    var e = t.getCurve(), i = t.getSegment(), n = t._intersection, r = n._curve, s = n._segment;
                    if (e && r && e._path && r._path) return !0;
                    i && (i._intersection = null), s && (s._intersection = null)
                }, l), l && a(l), i = f(r.each(i, function (t) {
                    this.push.apply(this, t._segments)
                }, [])));
                var _, y = i.length;
                return y > 1 && e ? (i !== e && this.setChildren(i), _ = this) : 1 !== y || e || (i[0] !== this && this.setSegments(i[0].removeSegments()), _ = this), _ || (_ = new L(w.NO_INSERT), _.addChildren(i), _ = _.reduce(), _.copyAttributes(this), this.replaceWith(_)), _
            }, reorient: function (t, i) {
                var n = this._children;
                return n && n.length ? this.setChildren(l(this.removeChildren(), function (e) {
                    return !!(t ? e : 1 & e)
                }, i)) : i !== e && this.setClockwise(i), this
            }, getInteriorPoint: function () {
                var t = this.getBounds(), e = t.getCenter(!0);
                if (!this.contains(e)) {
                    for (var i = this.getCurves(), n = e.y, r = [], s = [], o = 0, a = i.length; o < a; o++) {
                        var l = i[o].getValues(), h = l[1], u = l[3], c = l[5], d = l[7];
                        if (n >= p(h, u, c, d) && n <= g(h, u, c, d)) for (var f = z.getMonoCurves(l), m = 0, v = f.length; m < v; m++) {
                            var _ = f[m], y = _[1], w = _[7];
                            if (y !== w && (n >= y && n <= w || n >= w && n <= y)) {
                                var x = n === y ? _[0] : n === w ? _[6] : 1 === z.solveCubic(_, 1, n, s, 0, 1) ? z.getPoint(_, s[0]).x : (_[0] + _[6]) / 2;
                                r.push(x)
                            }
                        }
                    }
                    r.length > 1 && (r.sort(function (t, e) {
                        return t - e
                    }), e.x = (r[0] + r[1]) / 2)
                }
                return e
            }
        }
    });
    var N = r.extend({
        _class: "PathFlattener", initialize: function (t, e, i, n, r) {
            function s(t, e) {
                var i = z.getValues(t, e, r);
                l.push(i), o(i, t._index, 0, 1)
            }

            function o(t, i, r, s) {
                if (!(s - r > c) || n && z.isStraight(t) || z.isFlatEnough(t, e || .25)) {
                    var a = t[6] - t[0], l = t[7] - t[1], d = Math.sqrt(a * a + l * l);
                    d > 0 && (u += d, h.push({offset: u, curve: t, index: i, time: s}))
                } else {
                    var f = z.subdivide(t, .5), p = (r + s) / 2;
                    o(f[0], i, r, p), o(f[1], i, p, s)
                }
            }

            for (var a, l = [], h = [], u = 0, c = 1 / (i || 32), d = t._segments, f = d[0], p = 1, g = d.length; p < g; p++) a = d[p], s(f, a), f = a;
            t._closed && s(a, d[0]), this.curves = l, this.parts = h, this.length = u, this.index = 0
        }, _get: function (t) {
            for (var e, i = this.parts, n = i.length, r = this.index; e = r, r && !(i[--r].offset < t);) ;
            for (; e < n; e++) {
                var s = i[e];
                if (s.offset >= t) {
                    this.index = e;
                    var o = i[e - 1], a = o && o.index === s.index ? o.time : 0, l = o ? o.offset : 0;
                    return {index: s.index, time: a + (s.time - a) * (t - l) / (s.offset - l)}
                }
            }
            return {index: i[n - 1].index, time: 1}
        }, drawPart: function (t, e, i) {
            for (var n = this._get(e), r = this._get(i), s = n.index, o = r.index; s <= o; s++) {
                var a = z.getPart(this.curves[s], s === n.index ? n.time : 0, s === r.index ? r.time : 1);
                s === n.index && t.moveTo(a[0], a[1]), t.bezierCurveTo.apply(t, a.slice(2))
            }
        }
    }, r.each(z._evaluateMethods, function (t) {
        this[t + "At"] = function (e) {
            var i = this._get(e);
            return z[t](this.curves[i.index], i.time)
        }
    }, {})), F = r.extend({
        initialize: function (t) {
            for (var e, i = this.points = [], n = t._segments, r = t._closed, s = 0, o = n.length; s < o; s++) {
                var a = n[s].point;
                e && e.equals(a) || i.push(e = a.clone())
            }
            r && (i.unshift(i[i.length - 1]), i.push(i[1])), this.closed = r
        }, fit: function (t) {
            var e = this.points, i = e.length, n = null;
            return i > 0 && (n = [new P(e[0])], i > 1 && (this.fitCubic(n, t, 0, i - 1, e[1].subtract(e[0]), e[i - 2].subtract(e[i - 1])), this.closed && (n.shift(), n.pop()))), n
        }, fitCubic: function (t, e, i, n, r, s) {
            var o = this.points;
            if (n - i == 1) {
                var a = o[i], l = o[n], h = a.getDistance(l) / 3;
                return void this.addCurve(t, [a, a.add(r.normalize(h)), l.add(s.normalize(h)), l])
            }
            for (var u, c = this.chordLengthParameterize(i, n), d = Math.max(e, e * e), f = !0, p = 0; p <= 4; p++) {
                var g = this.generateBezier(i, n, c, r, s), m = this.findMaxError(i, n, g, c);
                if (m.error < e && f) return void this.addCurve(t, g);
                if (u = m.index, m.error >= d) break;
                f = this.reparameterize(i, n, c, g), d = m.error
            }
            var v = o[u - 1].subtract(o[u + 1]);
            this.fitCubic(t, e, i, u, r, v), this.fitCubic(t, e, u, n, v.negate(), s)
        }, addCurve: function (t, e) {
            t[t.length - 1].setHandleOut(e[1].subtract(e[0])), t.push(new P(e[3], e[2].subtract(e[3])))
        }, generateBezier: function (t, e, i, n, r) {
            for (var s = Math.abs, o = this.points, a = o[t], l = o[e], h = [[0, 0], [0, 0]], u = [0, 0], c = 0, d = e - t + 1; c < d; c++) {
                var f = i[c], p = 1 - f, g = 3 * f * p, m = p * p * p, v = g * p, _ = g * f, y = f * f * f,
                    w = n.normalize(v), x = r.normalize(_),
                    b = o[t + c].subtract(a.multiply(m + v)).subtract(l.multiply(_ + y));
                h[0][0] += w.dot(w), h[0][1] += w.dot(x), h[1][0] = h[0][1], h[1][1] += x.dot(x), u[0] += w.dot(b), u[1] += x.dot(b)
            }
            var C, S, T = h[0][0] * h[1][1] - h[1][0] * h[0][1];
            if (s(T) > 1e-12) {
                var E = h[0][0] * u[1] - h[1][0] * u[0];
                C = (u[0] * h[1][1] - u[1] * h[0][1]) / T, S = E / T
            } else {
                var k = h[0][0] + h[0][1], P = h[1][0] + h[1][1];
                C = S = s(k) > 1e-12 ? u[0] / k : s(P) > 1e-12 ? u[1] / P : 0
            }
            var A, z, I = l.getDistance(a), M = 1e-12 * I;
            if (C < M || S < M) C = S = I / 3; else {
                var O = l.subtract(a);
                A = n.normalize(C), z = r.normalize(S), A.dot(O) - z.dot(O) > I * I && (C = S = I / 3, A = z = null)
            }
            return [a, a.add(A || n.normalize(C)), l.add(z || r.normalize(S)), l]
        }, reparameterize: function (t, e, i, n) {
            for (var r = t; r <= e; r++) i[r - t] = this.findRoot(n, this.points[r], i[r - t]);
            for (var r = 1, s = i.length; r < s; r++) if (i[r] <= i[r - 1]) return !1;
            return !0
        }, findRoot: function (t, e, i) {
            for (var n = [], r = [], s = 0; s <= 2; s++) n[s] = t[s + 1].subtract(t[s]).multiply(3);
            for (var s = 0; s <= 1; s++) r[s] = n[s + 1].subtract(n[s]).multiply(2);
            var o = this.evaluate(3, t, i), a = this.evaluate(2, n, i), l = this.evaluate(1, r, i), u = o.subtract(e),
                c = a.dot(a) + u.dot(l);
            return h.isZero(c) ? i : i - u.dot(a) / c
        }, evaluate: function (t, e, i) {
            for (var n = e.slice(), r = 1; r <= t; r++) for (var s = 0; s <= t - r; s++) n[s] = n[s].multiply(1 - i).add(n[s + 1].multiply(i));
            return n[0]
        }, chordLengthParameterize: function (t, e) {
            for (var i = [0], n = t + 1; n <= e; n++) i[n - t] = i[n - t - 1] + this.points[n].getDistance(this.points[n - 1]);
            for (var n = 1, r = e - t; n <= r; n++) i[n] /= i[r];
            return i
        }, findMaxError: function (t, e, i, n) {
            for (var r = Math.floor((e - t + 1) / 2), s = 0, o = t + 1; o < e; o++) {
                var a = this.evaluate(3, i, n[o - t]), l = a.subtract(this.points[o]), h = l.x * l.x + l.y * l.y;
                h >= s && (s = h, r = o)
            }
            return {error: s, index: r}
        }
    }), D = w.extend({
        _class: "TextItem",
        _applyMatrix: !1,
        _canApplyMatrix: !1,
        _serializeFields: {content: null},
        _boundsOptions: {stroke: !1, handle: !1},
        initialize: function (t) {
            this._content = "", this._lines = [];
            var i = t && r.isPlainObject(t) && t.x === e && t.y === e;
            this._initialize(i && t, !i && c.read(arguments))
        },
        _equals: function (t) {
            return this._content === t._content
        },
        copyContent: function (t) {
            this.setContent(t._content)
        },
        getContent: function () {
            return this._content
        },
        setContent: function (t) {
            this._content = "" + t, this._lines = this._content.split(/\r\n|\n|\r/gm), this._changed(265)
        },
        isEmpty: function () {
            return !this._content
        },
        getCharacterStyle: "#getStyle",
        setCharacterStyle: "#setStyle",
        getParagraphStyle: "#getStyle",
        setParagraphStyle: "#setStyle"
    }), q = D.extend({
        _class: "PointText", initialize: function () {
            D.apply(this, arguments)
        }, getPoint: function () {
            var t = this._matrix.getTranslation();
            return new d(t.x, t.y, this, "setPoint")
        }, setPoint: function () {
            var t = c.read(arguments);
            this.translate(t.subtract(this._matrix.getTranslation()))
        }, _draw: function (t, e, i) {
            if (this._content) {
                this._setStyles(t, e, i);
                var n = this._lines, r = this._style, s = r.hasFill(), o = r.hasStroke(), a = r.getLeading(),
                    l = t.shadowColor;
                t.font = r.getFontStyle(), t.textAlign = r.getJustification();
                for (var h = 0, u = n.length; h < u; h++) {
                    t.shadowColor = l;
                    var c = n[h];
                    s && (t.fillText(c, 0, 0), t.shadowColor = "rgba(0,0,0,0)"), o && t.strokeText(c, 0, 0), t.translate(0, a)
                }
            }
        }, _getBounds: function (t, e) {
            var i = this._style, n = this._lines, r = n.length, s = i.getJustification(), o = i.getLeading(),
                a = this.getView().getTextWidth(i.getFontStyle(), n), l = 0;
            "left" !== s && (l -= a / ("center" === s ? 2 : 1));
            var h = new g(l, r ? -.75 * o : 0, a, r * o);
            return t ? t._transformBounds(h, h) : h
        }
    }), R = r.extend(new function () {
        function t(t) {
            var n, r = t.match(/^#(\w{1,2})(\w{1,2})(\w{1,2})$/);
            if (r) {
                n = [0, 0, 0];
                for (var s = 0; s < 3; s++) {
                    var a = r[s + 1];
                    n[s] = parseInt(1 == a.length ? a + a : a, 16) / 255
                }
            } else if (r = t.match(/^rgba?\((.*)\)$/)) {
                n = r[1].split(",");
                for (var s = 0, l = n.length; s < l; s++) {
                    var a = +n[s];
                    n[s] = s < 3 ? a / 255 : a
                }
            } else if (i) {
                var h = o[t];
                if (!h) {
                    e || (e = tt.getContext(1, 1), e.globalCompositeOperation = "copy"), e.fillStyle = "rgba(0,0,0,0)", e.fillStyle = t, e.fillRect(0, 0, 1, 1);
                    var u = e.getImageData(0, 0, 1, 1).data;
                    h = o[t] = [u[0] / 255, u[1] / 255, u[2] / 255]
                }
                n = h.slice()
            } else n = [0, 0, 0];
            return n
        }

        var e, n = {
            gray: ["gray"],
            rgb: ["red", "green", "blue"],
            hsb: ["hue", "saturation", "brightness"],
            hsl: ["hue", "saturation", "lightness"],
            gradient: ["gradient", "origin", "destination", "highlight"]
        }, s = {}, o = {}, a = [[0, 3, 1], [2, 0, 1], [1, 0, 3], [1, 2, 0], [3, 1, 0], [0, 1, 2]], h = {
            "rgb-hsb": function (t, e, i) {
                var n = Math.max(t, e, i), r = Math.min(t, e, i), s = n - r;
                return [0 === s ? 0 : 60 * (n == t ? (e - i) / s + (e < i ? 6 : 0) : n == e ? (i - t) / s + 2 : (t - e) / s + 4), 0 === n ? 0 : s / n, n]
            }, "hsb-rgb": function (t, e, i) {
                t = (t / 60 % 6 + 6) % 6;
                var n = Math.floor(t), r = t - n, n = a[n],
                    s = [i, i * (1 - e), i * (1 - e * r), i * (1 - e * (1 - r))];
                return [s[n[0]], s[n[1]], s[n[2]]]
            }, "rgb-hsl": function (t, e, i) {
                var n = Math.max(t, e, i), r = Math.min(t, e, i), s = n - r, o = 0 === s,
                    a = o ? 0 : 60 * (n == t ? (e - i) / s + (e < i ? 6 : 0) : n == e ? (i - t) / s + 2 : (t - e) / s + 4),
                    l = (n + r) / 2;
                return [a, o ? 0 : l < .5 ? s / (n + r) : s / (2 - n - r), l]
            }, "hsl-rgb": function (t, e, i) {
                if (t = (t / 360 % 1 + 1) % 1, 0 === e) return [i, i, i];
                for (var n = [t + 1 / 3, t, t - 1 / 3], r = i < .5 ? i * (1 + e) : i + e - i * e, s = 2 * i - r, o = [], a = 0; a < 3; a++) {
                    var l = n[a];
                    l < 0 && (l += 1), l > 1 && (l -= 1), o[a] = 6 * l < 1 ? s + 6 * (r - s) * l : 2 * l < 1 ? r : 3 * l < 2 ? s + (r - s) * (2 / 3 - l) * 6 : s
                }
                return o
            }, "rgb-gray": function (t, e, i) {
                return [.2989 * t + .587 * e + .114 * i]
            }, "gray-rgb": function (t) {
                return [t, t, t]
            }, "gray-hsb": function (t) {
                return [0, 0, t]
            }, "gray-hsl": function (t) {
                return [0, 0, t]
            }, "gradient-rgb": function () {
                return []
            }, "rgb-gradient": function () {
                return []
            }
        };
        return r.each(n, function (t, e) {
            s[e] = [], r.each(t, function (t, i) {
                var o = r.capitalize(t), a = /^(hue|saturation)$/.test(t),
                    l = s[e][i] = "gradient" === t ? function (t) {
                        var e = this._components[0];
                        return t = H.read(Array.isArray(t) ? t : arguments, 0, {readNull: !0}), e !== t && (e && e._removeOwner(this), t && t._addOwner(this)), t
                    } : "gradient" === e ? function () {
                        return c.read(arguments, 0, {readNull: "highlight" === t, clone: !0})
                    } : function (t) {
                        return null == t || isNaN(t) ? 0 : t
                    };
                this["get" + o] = function () {
                    return this._type === e || a && /^hs[bl]$/.test(this._type) ? this._components[i] : this._convert(e)[i]
                }, this["set" + o] = function (t) {
                    this._type === e || a && /^hs[bl]$/.test(this._type) || (this._components = this._convert(e), this._properties = n[e], this._type = e), this._components[i] = l.call(this, t), this._changed()
                }
            }, this)
        }, {
            _class: "Color", _readIndex: !0, initialize: function e(i) {
                var o, a, l, h, u = arguments, c = this.__read, d = 0;
                Array.isArray(i) && (u = i, i = u[0]);
                var f = null != i && typeof i;
                if ("string" === f && i in n && (o = i, i = u[1], Array.isArray(i) ? (a = i, l = u[2]) : (c && (d = 1), u = r.slice(u, 1), f = typeof i)), !a) {
                    if (h = "number" === f ? u : "object" === f && null != i.length ? i : null) {
                        o || (o = h.length >= 3 ? "rgb" : "gray");
                        var p = n[o].length;
                        l = h[p], c && (d += h === arguments ? p + (null != l ? 1 : 0) : 1), h.length > p && (h = r.slice(h, 0, p))
                    } else if ("string" === f) o = "rgb", a = t(i), 4 === a.length && (l = a[3], a.length--); else if ("object" === f) if (i.constructor === e) {
                        if (o = i._type, a = i._components.slice(), l = i._alpha, "gradient" === o) for (var g = 1, m = a.length; g < m; g++) {
                            var v = a[g];
                            v && (a[g] = v.clone())
                        }
                    } else if (i.constructor === H) o = "gradient", h = u; else {
                        o = "hue" in i ? "lightness" in i ? "hsl" : "hsb" : "gradient" in i || "stops" in i || "radial" in i ? "gradient" : "gray" in i ? "gray" : "rgb";
                        var _ = n[o], y = s[o];
                        this._components = a = [];
                        for (var g = 0, m = _.length; g < m; g++) {
                            var w = i[_[g]];
                            null == w && !g && "gradient" === o && "stops" in i && (w = {
                                stops: i.stops,
                                radial: i.radial
                            }), w = y[g].call(this, w), null != w && (a[g] = w)
                        }
                        l = i.alpha
                    }
                    c && o && (d = 1)
                }
                if (this._type = o || "rgb", !a) {
                    this._components = a = [];
                    for (var y = s[this._type], g = 0, m = y.length; g < m; g++) {
                        var w = y[g].call(this, h && h[g]);
                        null != w && (a[g] = w)
                    }
                }
                return this._components = a, this._properties = n[this._type], this._alpha = l, c && (this.__read = d), this
            }, set: "#initialize", _serialize: function (t, e) {
                var i = this.getComponents();
                return r.serialize(/^(gray|rgb)$/.test(this._type) ? i : [this._type].concat(i), t, !0, e)
            }, _changed: function () {
                this._canvasStyle = null, this._owner && this._owner._changed(65)
            }, _convert: function (t) {
                var e;
                return this._type === t ? this._components.slice() : (e = h[this._type + "-" + t]) ? e.apply(this, this._components) : h["rgb-" + t].apply(this, h[this._type + "-rgb"].apply(this, this._components))
            }, convert: function (t) {
                return new R(t, this._convert(t), this._alpha)
            }, getType: function () {
                return this._type
            }, setType: function (t) {
                this._components = this._convert(t), this._properties = n[t], this._type = t
            }, getComponents: function () {
                var t = this._components.slice();
                return null != this._alpha && t.push(this._alpha), t
            }, getAlpha: function () {
                return null != this._alpha ? this._alpha : 1
            }, setAlpha: function (t) {
                this._alpha = null == t ? null : Math.min(Math.max(t, 0), 1), this._changed()
            }, hasAlpha: function () {
                return null != this._alpha
            }, equals: function (t) {
                var e = r.isPlainValue(t, !0) ? R.read(arguments) : t;
                return e === this || e && this._class === e._class && this._type === e._type && this.getAlpha() === e.getAlpha() && r.equals(this._components, e._components) || !1
            }, toString: function () {
                for (var t = this._properties, e = [], i = "gradient" === this._type, n = l.instance, r = 0, s = t.length; r < s; r++) {
                    var o = this._components[r];
                    null != o && e.push(t[r] + ": " + (i ? o : n.number(o)))
                }
                return null != this._alpha && e.push("alpha: " + n.number(this._alpha)), "{ " + e.join(", ") + " }"
            }, toCSS: function (t) {
                function e(t) {
                    return Math.round(255 * (t < 0 ? 0 : t > 1 ? 1 : t))
                }

                var i = this._convert("rgb"), n = t || null == this._alpha ? 1 : this._alpha;
                return i = [e(i[0]), e(i[1]), e(i[2])], n < 1 && i.push(n < 0 ? 0 : n), t ? "#" + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1) : (4 == i.length ? "rgba(" : "rgb(") + i.join(",") + ")"
            }, toCanvasStyle: function (t, e) {
                if (this._canvasStyle) return this._canvasStyle;
                if ("gradient" !== this._type) return this._canvasStyle = this.toCSS();
                var i, n = this._components, r = n[0], s = r._stops, o = n[1], a = n[2], l = n[3],
                    h = e && e.inverted();
                if (h && (o = h._transformPoint(o), a = h._transformPoint(a), l && (l = h._transformPoint(l))), r._radial) {
                    var u = a.getDistance(o);
                    if (l) {
                        var c = l.subtract(o);
                        c.getLength() > u && (l = o.add(c.normalize(u - .1)))
                    }
                    var d = l || o;
                    i = t.createRadialGradient(d.x, d.y, 0, o.x, o.y, u)
                } else i = t.createLinearGradient(o.x, o.y, a.x, a.y);
                for (var f = 0, p = s.length; f < p; f++) {
                    var g = s[f], m = g._offset;
                    i.addColorStop(null == m ? f / (p - 1) : m, g._color.toCanvasStyle())
                }
                return this._canvasStyle = i
            }, transform: function (t) {
                if ("gradient" === this._type) {
                    for (var e = this._components, i = 1, n = e.length; i < n; i++) {
                        var r = e[i];
                        t._transformPoint(r, r, !0)
                    }
                    this._changed()
                }
            }, statics: {
                _types: n, random: function () {
                    var t = Math.random;
                    return new R(t(), t(), t())
                }
            }
        })
    }, new function () {
        var t = {
            add: function (t, e) {
                return t + e
            }, subtract: function (t, e) {
                return t - e
            }, multiply: function (t, e) {
                return t * e
            }, divide: function (t, e) {
                return t / e
            }
        };
        return r.each(t, function (t, e) {
            this[e] = function (e) {
                e = R.read(arguments);
                for (var i = this._type, n = this._components, r = e._convert(i), s = 0, o = n.length; s < o; s++) r[s] = t(n[s], r[s]);
                return new R(i, r, null != this._alpha ? t(this._alpha, e.getAlpha()) : null)
            }
        }, {})
    }), H = r.extend({
        _class: "Gradient", initialize: function (t, e) {
            this._id = u.get(), t && r.isPlainObject(t) && (this.set(t), t = e = null), null == this._stops && this.setStops(t || ["white", "black"]), null == this._radial && this.setRadial("string" == typeof e && "radial" === e || e || !1)
        }, _serialize: function (t, e) {
            return e.add(this, function () {
                return r.serialize([this._stops, this._radial], t, !0, e)
            })
        }, _changed: function () {
            for (var t = 0, e = this._owners && this._owners.length; t < e; t++) this._owners[t]._changed()
        }, _addOwner: function (t) {
            this._owners || (this._owners = []), this._owners.push(t)
        }, _removeOwner: function (t) {
            var i = this._owners ? this._owners.indexOf(t) : -1;
            -1 != i && (this._owners.splice(i, 1), this._owners.length || (this._owners = e))
        }, clone: function () {
            for (var t = [], e = 0, i = this._stops.length; e < i; e++) t[e] = this._stops[e].clone();
            return new H(t, this._radial)
        }, getStops: function () {
            return this._stops
        }, setStops: function (t) {
            if (t.length < 2) throw new Error("Gradient stop list needs to contain at least two stops.");
            var i = this._stops;
            if (i) for (var n = 0, r = i.length; n < r; n++) i[n]._owner = e;
            i = this._stops = B.readList(t, 0, {clone: !0});
            for (var n = 0, r = i.length; n < r; n++) i[n]._owner = this;
            this._changed()
        }, getRadial: function () {
            return this._radial
        }, setRadial: function (t) {
            this._radial = t, this._changed()
        }, equals: function (t) {
            if (t === this) return !0;
            if (t && this._class === t._class) {
                var e = this._stops, i = t._stops, n = e.length;
                if (n === i.length) {
                    for (var r = 0; r < n; r++) if (!e[r].equals(i[r])) return !1;
                    return !0
                }
            }
            return !1
        }
    }), B = r.extend({
        _class: "GradientStop", initialize: function (t, i) {
            var n = t, r = i;
            "object" == typeof t && i === e && (Array.isArray(t) && "number" != typeof t[0] ? (n = t[0], r = t[1]) : ("color" in t || "offset" in t || "rampPoint" in t) && (n = t.color, r = t.offset || t.rampPoint || 0)), this.setColor(n), this.setOffset(r)
        }, clone: function () {
            return new B(this._color.clone(), this._offset)
        }, _serialize: function (t, e) {
            var i = this._color, n = this._offset;
            return r.serialize(null == n ? [i] : [i, n], t, !0, e)
        }, _changed: function () {
            this._owner && this._owner._changed(65)
        }, getOffset: function () {
            return this._offset
        }, setOffset: function (t) {
            this._offset = t, this._changed()
        }, getRampPoint: "#getOffset", setRampPoint: "#setOffset", getColor: function () {
            return this._color
        }, setColor: function () {
            var t = R.read(arguments, 0, {clone: !0});
            t && (t._owner = this), this._color = t, this._changed()
        }, equals: function (t) {
            return t === this || t && this._class === t._class && this._color.equals(t._color) && this._offset == t._offset || !1
        }
    }), j = r.extend(new function () {
        var t = {
            fillColor: null,
            fillRule: "nonzero",
            strokeColor: null,
            strokeWidth: 1,
            strokeCap: "butt",
            strokeJoin: "miter",
            strokeScaling: !0,
            miterLimit: 10,
            dashOffset: 0,
            dashArray: [],
            shadowColor: null,
            shadowBlur: 0,
            shadowOffset: new c,
            selectedColor: null
        }, i = r.set({}, t, {
            fontFamily: "sans-serif",
            fontWeight: "normal",
            fontSize: 12,
            leading: null,
            justification: "left"
        }), n = r.set({}, i, {fillColor: new R}), s = {
            strokeWidth: 97,
            strokeCap: 97,
            strokeJoin: 97,
            strokeScaling: 105,
            miterLimit: 97,
            fontFamily: 9,
            fontWeight: 9,
            fontSize: 9,
            font: 9,
            leading: 9,
            justification: 9
        }, o = {beans: !0}, a = {
            _class: "Style", beans: !0, initialize: function (e, r, s) {
                this._values = {}, this._owner = r, this._project = r && r._project || s || paper.project, this._defaults = !r || r instanceof x ? i : r instanceof D ? n : t, e && this.set(e)
            }
        };
        return r.each(i, function (t, i) {
            var n = /Color$/.test(i), l = "shadowOffset" === i, h = r.capitalize(i), u = s[i], d = "set" + h,
                f = "get" + h;
            a[d] = function (t) {
                var r = this._owner, s = r && r._children;
                if (s && s.length > 0 && !(r instanceof L)) for (var o = 0, a = s.length; o < a; o++) s[o]._style[d](t); else if (i in this._defaults) {
                    var l = this._values[i];
                    l !== t && (n && (l && l._owner !== e && (l._owner = e), t && t.constructor === R && (t._owner && (t = t.clone()), t._owner = r)), this._values[i] = t, r && r._changed(u || 65))
                }
            }, a[f] = function (t) {
                var s, o = this._owner, a = o && o._children;
                if (i in this._defaults && (!a || !a.length || t || o instanceof L)) {
                    var s = this._values[i];
                    if (s === e) (s = this._defaults[i]) && s.clone && (s = s.clone()); else {
                        var h = n ? R : l ? c : null;
                        !h || s && s.constructor === h || (this._values[i] = s = h.read([s], 0, {
                            readNull: !0,
                            clone: !0
                        }), s && n && (s._owner = o))
                    }
                } else if (a) for (var u = 0, d = a.length; u < d; u++) {
                    var p = a[u]._style[f]();
                    if (u) {
                        if (!r.equals(s, p)) return e
                    } else s = p
                }
                return s
            }, o[f] = function (t) {
                return this._style[f](t)
            }, o[d] = function (t) {
                this._style[d](t)
            }
        }), r.each({Font: "FontFamily", WindingRule: "FillRule"}, function (t, e) {
            var i = "get" + e, n = "set" + e;
            a[i] = o[i] = "#get" + t, a[n] = o[n] = "#set" + t
        }), w.inject(o), a
    }, {
        set: function (t) {
            var e = t instanceof j, i = e ? t._values : t;
            if (i) for (var n in i) if (n in this._defaults) {
                var r = i[n];
                this[n] = r && e && r.clone ? r.clone() : r
            }
        }, equals: function (t) {
            function i(t, i, n) {
                var s = t._values, o = i._values, a = i._defaults;
                for (var l in s) {
                    var h = s[l], u = o[l];
                    if (!(n && l in o || r.equals(h, u === e ? a[l] : u))) return !1
                }
                return !0
            }

            return t === this || t && this._class === t._class && i(this, t) && i(t, this, !0) || !1
        }, hasFill: function () {
            var t = this.getFillColor();
            return !!t && t.alpha > 0
        }, hasStroke: function () {
            var t = this.getStrokeColor();
            return !!t && t.alpha > 0 && this.getStrokeWidth() > 0
        }, hasShadow: function () {
            var t = this.getShadowColor();
            return !!t && t.alpha > 0 && (this.getShadowBlur() > 0 || !this.getShadowOffset().isZero())
        }, getView: function () {
            return this._project._view
        }, getFontStyle: function () {
            var t = this.getFontSize();
            return this.getFontWeight() + " " + t + (/[a-z]/i.test(t + "") ? " " : "px ") + this.getFontFamily()
        }, getFont: "#getFontFamily", setFont: "#setFontFamily", getLeading: function t() {
            var e = t.base.call(this), i = this.getFontSize();
            return /pt|em|%|px/.test(i) && (i = this.getView().getPixelSize(i)), null != e ? e : 1.2 * i
        }
    }), W = new function () {
        function t(t, e, i, n) {
            for (var r = ["", "webkit", "moz", "Moz", "ms", "o"], s = e[0].toUpperCase() + e.substring(1), o = 0; o < 6; o++) {
                var a = r[o], l = a ? a + s : e;
                if (l in t) {
                    if (!i) return t[l];
                    t[l] = n;
                    break
                }
            }
        }

        return {
            getStyles: function (t) {
                var e = t && 9 !== t.nodeType ? t.ownerDocument : t, i = e && e.defaultView;
                return i && i.getComputedStyle(t, "")
            }, getBounds: function (t, e) {
                var i, n = t.ownerDocument, r = n.body, s = n.documentElement;
                try {
                    i = t.getBoundingClientRect()
                } catch (t) {
                    i = {left: 0, top: 0, width: 0, height: 0}
                }
                var o = i.left - (s.clientLeft || r.clientLeft || 0), a = i.top - (s.clientTop || r.clientTop || 0);
                if (!e) {
                    var l = n.defaultView;
                    o += l.pageXOffset || s.scrollLeft || r.scrollLeft, a += l.pageYOffset || s.scrollTop || r.scrollTop
                }
                return new g(o, a, i.width, i.height)
            }, getViewportBounds: function (t) {
                var e = t.ownerDocument, i = e.defaultView, n = e.documentElement;
                return new g(0, 0, i.innerWidth || n.clientWidth, i.innerHeight || n.clientHeight)
            }, getOffset: function (t, e) {
                return W.getBounds(t, e).getPoint()
            }, getSize: function (t) {
                return W.getBounds(t, !0).getSize()
            }, isInvisible: function (t) {
                return W.getSize(t).equals(new f(0, 0))
            }, isInView: function (t) {
                return !W.isInvisible(t) && W.getViewportBounds(t).intersects(W.getBounds(t, !0))
            }, isInserted: function (t) {
                return n.body.contains(t)
            }, getPrefixed: function (e, i) {
                return e && t(e, i)
            }, setPrefixed: function (e, i, n) {
                if ("object" == typeof i) for (var r in i) t(e, r, !0, i[r]); else t(e, i, !0, n)
            }
        }
    }, V = {
        add: function (t, e) {
            if (t) for (var i in e) for (var n = e[i], r = i.split(/[\s,]+/g), s = 0, o = r.length; s < o; s++) t.addEventListener(r[s], n, !1)
        }, remove: function (t, e) {
            if (t) for (var i in e) for (var n = e[i], r = i.split(/[\s,]+/g), s = 0, o = r.length; s < o; s++) t.removeEventListener(r[s], n, !1)
        }, getPoint: function (t) {
            var e = t.targetTouches ? t.targetTouches.length ? t.targetTouches[0] : t.changedTouches[0] : t;
            return new c(e.pageX || e.clientX + n.documentElement.scrollLeft, e.pageY || e.clientY + n.documentElement.scrollTop)
        }, getTarget: function (t) {
            return t.target || t.srcElement
        }, getRelatedTarget: function (t) {
            return t.relatedTarget || t.toElement
        }, getOffset: function (t, e) {
            return V.getPoint(t).subtract(W.getOffset(e || V.getTarget(t)))
        }
    };
    V.requestAnimationFrame = new function () {
        function t() {
            var e = s;
            s = [];
            for (var i = 0, o = e.length; i < o; i++) e[i]();
            (r = n && s.length) && n(t)
        }

        var e, n = W.getPrefixed(i, "requestAnimationFrame"), r = !1, s = [];
        return function (i) {
            s.push(i), n ? r || (n(t), r = !0) : e || (e = setInterval(t, 1e3 / 60))
        }
    };
    var U = r.extend(s, {
        _class: "View", initialize: function t(e, r) {
            function s(t) {
                return r[t] || parseInt(r.getAttribute(t), 10)
            }

            function a() {
                var t = W.getSize(r);
                return t.isNaN() || t.isZero() ? new f(s("width"), s("height")) : t
            }

            var l;
            if (i && r) {
                this._id = r.getAttribute("id"), null == this._id && r.setAttribute("id", this._id = "view-" + t._id++), V.add(r, this._viewEvents);
                if (W.setPrefixed(r.style, {
                    userDrag: "none",
                    userSelect: "none",
                    touchCallout: "none",
                    contentZooming: "none",
                    tapHighlightColor: "rgba(0,0,0,0)"
                }), o.hasAttribute(r, "resize")) {
                    var h = this;
                    V.add(i, this._windowEvents = {
                        resize: function () {
                            h.setViewSize(a())
                        }
                    })
                }
                if (l = a(), o.hasAttribute(r, "stats") && "undefined" != typeof Stats) {
                    this._stats = new Stats;
                    var u = this._stats.domElement, c = u.style, d = W.getOffset(r);
                    c.position = "absolute", c.left = d.x + "px", c.top = d.y + "px", n.body.appendChild(u)
                }
            } else l = new f(r), r = null;
            this._project = e, this._scope = e._scope, this._element = r, this._pixelRatio || (this._pixelRatio = i && i.devicePixelRatio || 1), this._setElementSize(l.width, l.height), this._viewSize = l, t._views.push(this), t._viewsById[this._id] = this, (this._matrix = new v)._owner = this, t._focused || (t._focused = this), this._frameItems = {}, this._frameItemCount = 0, this._itemEvents = {
                native: {},
                virtual: {}
            }, this._autoUpdate = !paper.agent.node, this._needsUpdate = !1
        }, remove: function () {
            if (!this._project) return !1;
            U._focused === this && (U._focused = null), U._views.splice(U._views.indexOf(this), 1), delete U._viewsById[this._id];
            var t = this._project;
            return t._view === this && (t._view = null), V.remove(this._element, this._viewEvents), V.remove(i, this._windowEvents), this._element = this._project = null, this.off("frame"), this._animate = !1, this._frameItems = {}, !0
        }, _events: r.each(w._itemHandlers.concat(["onResize", "onKeyDown", "onKeyUp"]), function (t) {
            this[t] = {}
        }, {
            onFrame: {
                install: function () {
                    this.play()
                }, uninstall: function () {
                    this.pause()
                }
            }
        }), _animate: !1, _time: 0, _count: 0, getAutoUpdate: function () {
            return this._autoUpdate
        }, setAutoUpdate: function (t) {
            this._autoUpdate = t, t && this.requestUpdate()
        }, update: function () {
        }, draw: function () {
            this.update()
        }, requestUpdate: function () {
            if (!this._requested) {
                var t = this;
                V.requestAnimationFrame(function () {
                    if (t._requested = !1, t._animate) {
                        t.requestUpdate();
                        var e = t._element;
                        W.getPrefixed(n, "hidden") && "true" !== o.getAttribute(e, "keepalive") || !W.isInView(e) || t._handleFrame()
                    }
                    t._autoUpdate && t.update()
                }), this._requested = !0
            }
        }, play: function () {
            this._animate = !0, this.requestUpdate()
        }, pause: function () {
            this._animate = !1
        }, _handleFrame: function () {
            paper = this._scope;
            var t = Date.now() / 1e3, e = this._last ? t - this._last : 0;
            this._last = t, this.emit("frame", new r({
                delta: e,
                time: this._time += e,
                count: this._count++
            })), this._stats && this._stats.update()
        }, _animateItem: function (t, e) {
            var i = this._frameItems;
            e ? (i[t._id] = {
                item: t,
                time: 0,
                count: 0
            }, 1 == ++this._frameItemCount && this.on("frame", this._handleFrameItems)) : (delete i[t._id], 0 == --this._frameItemCount && this.off("frame", this._handleFrameItems))
        }, _handleFrameItems: function (t) {
            for (var e in this._frameItems) {
                var i = this._frameItems[e];
                i.item.emit("frame", new r(t, {time: i.time += t.delta, count: i.count++}))
            }
        }, _changed: function () {
            this._project._changed(2049), this._bounds = this._decomposed = e
        }, getElement: function () {
            return this._element
        }, getPixelRatio: function () {
            return this._pixelRatio
        }, getResolution: function () {
            return 72 * this._pixelRatio
        }, getViewSize: function () {
            var t = this._viewSize;
            return new p(t.width, t.height, this, "setViewSize")
        }, setViewSize: function () {
            var t = f.read(arguments), e = t.subtract(this._viewSize);
            e.isZero() || (this._setElementSize(t.width, t.height), this._viewSize.set(t), this._changed(), this.emit("resize", {
                size: t,
                delta: e
            }), this._autoUpdate && this.update())
        }, _setElementSize: function (t, e) {
            var i = this._element;
            i && (i.width !== t && (i.width = t), i.height !== e && (i.height = e))
        }, getBounds: function () {
            return this._bounds || (this._bounds = this._matrix.inverted()._transformBounds(new g(new c, this._viewSize))), this._bounds
        }, getSize: function () {
            return this.getBounds().getSize()
        }, isVisible: function () {
            return W.isInView(this._element)
        }, isInserted: function () {
            return W.isInserted(this._element)
        }, getPixelSize: function (t) {
            var e, i = this._element;
            if (i) {
                var r = i.parentNode, s = n.createElement("div");
                s.style.fontSize = t, r.appendChild(s), e = parseFloat(W.getStyles(s).fontSize), r.removeChild(s)
            } else e = parseFloat(e);
            return e
        }, getTextWidth: function (t, e) {
            return 0
        }
    }, r.each(["rotate", "scale", "shear", "skew"], function (t) {
        var e = "rotate" === t;
        this[t] = function () {
            var i = (e ? r : c).read(arguments), n = c.read(arguments, 0, {readNull: !0});
            return this.transform((new v)[t](i, n || this.getCenter(!0)))
        }
    }, {
        _decompose: function () {
            return this._decomposed || (this._decomposed = this._matrix.decompose())
        }, translate: function () {
            var t = new v;
            return this.transform(t.translate.apply(t, arguments))
        }, getCenter: function () {
            return this.getBounds().getCenter()
        }, setCenter: function () {
            var t = c.read(arguments);
            this.translate(this.getCenter().subtract(t))
        }, getZoom: function () {
            var t = this._decompose(), e = t && t.scaling;
            return e ? (e.x + e.y) / 2 : 0
        }, setZoom: function (t) {
            this.transform((new v).scale(t / this.getZoom(), this.getCenter()))
        }, getRotation: function () {
            var t = this._decompose();
            return t && t.rotation
        }, setRotation: function (t) {
            var e = this.getRotation();
            null != e && null != t && this.rotate(t - e)
        }, getScaling: function () {
            var t = this._decompose(), i = t && t.scaling;
            return i ? new d(i.x, i.y, this, "setScaling") : e
        }, setScaling: function () {
            var t = this.getScaling(), e = c.read(arguments, 0, {clone: !0, readNull: !0});
            t && e && this.scale(e.x / t.x, e.y / t.y)
        }, getMatrix: function () {
            return this._matrix
        }, setMatrix: function () {
            var t = this._matrix;
            t.initialize.apply(t, arguments)
        }, transform: function (t) {
            this._matrix.append(t)
        }, scrollBy: function () {
            this.translate(c.read(arguments).negate())
        }
    }), {
        projectToView: function () {
            return this._matrix._transformPoint(c.read(arguments))
        }, viewToProject: function () {
            return this._matrix._inverseTransform(c.read(arguments))
        }, getEventPoint: function (t) {
            return this.viewToProject(V.getOffset(t, this._element))
        }
    }, {
        statics: {
            _views: [], _viewsById: {}, _id: 0, create: function (t, e) {
                return n && "string" == typeof e && (e = n.getElementById(e)), new (i ? Y : U)(t, e)
            }
        }
    }, new function () {
        function t(t) {
            var e = V.getTarget(t);
            return e.getAttribute && U._viewsById[e.getAttribute("id")]
        }

        function e() {
            var t = U._focused;
            if (!t || !t.isVisible()) for (var e = 0, i = U._views.length; e < i; e++) if ((t = U._views[e]).isVisible()) {
                U._focused = l = t;
                break
            }
        }

        function r(t, e, i) {
            t._handleMouseEvent("mousemove", e, i)
        }

        function s(t, e, i, n, r, s, o) {
            function a(t, i) {
                if (t.responds(i)) {
                    if (l || (l = new $(i, n, r, e || t, s ? r.subtract(s) : null)), t.emit(i, l) && (E = !0, l.prevented && (k = !0), l.stopped)) return h = !0
                } else {
                    var o = P[i];
                    if (o) return a(t, o)
                }
            }

            for (var l, h = !1; t && t !== o && !a(t, i);) t = t._parent;
            return h
        }

        function o(t, e, i, n, r, o) {
            return t._project.removeOn(i), k = E = !1, b && s(b, null, i, n, r, o) || e && e !== b && !e.isDescendant(b) && s(e, null, i, n, r, o, b) || s(t, b || e || t, i, n, r, o)
        }

        if (i) {
            var a, l, h, u, c, d = !1, f = !1, p = i.navigator;
            p.pointerEnabled || p.msPointerEnabled ? (h = "pointerdown MSPointerDown", u = "pointermove MSPointerMove", c = "pointerup pointercancel MSPointerUp MSPointerCancel") : (h = "touchstart", u = "touchmove", c = "touchend touchcancel", "ontouchstart" in i && p.userAgent.match(/mobile|tablet|ip(ad|hone|od)|android|silk/i) || (h += " mousedown", u += " mousemove", c += " mouseup"));
            var g = {}, m = {
                mouseout: function (t) {
                    var e = U._focused, i = V.getRelatedTarget(t);
                    if (e && (!i || "HTML" === i.nodeName)) {
                        var n = V.getOffset(t, e._element), s = n.x, o = Math.abs, a = o(s), l = a - (1 << 25);
                        n.x = o(l) < a ? l * (s < 0 ? -1 : 1) : s, r(e, t, e.viewToProject(n))
                    }
                }, scroll: e
            };
            g[h] = function (e) {
                var i = U._focused = t(e);
                d || (d = !0, i._handleMouseEvent("mousedown", e))
            }, m[u] = function (i) {
                var n = U._focused;
                if (!f) {
                    var s = t(i);
                    s ? n !== s && (n && r(n, i), a || (a = n), n = U._focused = l = s) : l && l === n && (a && !a.isInserted() && (a = null), n = U._focused = a, a = null, e())
                }
                n && r(n, i)
            }, m[h] = function () {
                f = !0
            }, m[c] = function (t) {
                var e = U._focused;
                e && d && e._handleMouseEvent("mouseup", t), f = d = !1
            }, V.add(n, m), V.add(i, {load: e});
            var v, _, y, w, x, b, C, S, T, E = !1, k = !1, P = {doubleclick: "click", mousedrag: "mousemove"}, A = !1,
                z = {
                    mousedown: {mousedown: 1, mousedrag: 1, click: 1, doubleclick: 1},
                    mouseup: {mouseup: 1, mousedrag: 1, click: 1, doubleclick: 1},
                    mousemove: {mousedrag: 1, mousemove: 1, mouseenter: 1, mouseleave: 1}
                };
            return {
                _viewEvents: g, _handleMouseEvent: function (t, e, i) {
                    function n(t) {
                        return r.virtual[t] || u.responds(t) || h && h.responds(t)
                    }

                    var r = this._itemEvents, a = r.native[t], l = "mousemove" === t, h = this._scope.tool, u = this;
                    l && d && n("mousedrag") && (t = "mousedrag"), i || (i = this.getEventPoint(e));
                    var c = this.getBounds().contains(i),
                        f = a && c && u._project.hitTest(i, {tolerance: 0, fill: !0, stroke: !0}),
                        p = f && f.item || null, g = !1, m = {};
                    if (m[t.substr(5)] = !0, a && p !== x && (x && s(x, null, "mouseleave", e, i), p && s(p, null, "mouseenter", e, i), x = p), A ^ c && (s(this, null, c ? "mouseenter" : "mouseleave", e, i), v = c ? this : null, g = !0), !c && !m.drag || i.equals(y) || (o(this, p, l ? t : "mousemove", e, i, y), g = !0), A = c, m.down && c || m.up && _) {
                        if (o(this, p, t, e, i, _), m.down) {
                            if (T = p === C && Date.now() - S < 300, w = C = p, !k && p) {
                                for (var P = p; P && !P.responds("mousedrag");) P = P._parent;
                                P && (b = p)
                            }
                            _ = i
                        } else m.up && (k || p !== w || (S = Date.now(), o(this, p, T ? "doubleclick" : "click", e, i, _), T = !1), w = b = null);
                        A = !1, g = !0
                    }
                    y = i, g && h && (E = h._handleMouseEvent(t, e, i, m) || E), (E && !m.move || m.down && n("mouseup")) && e.preventDefault()
                }, _handleKeyEvent: function (t, e, i, n) {
                    function r(r) {
                        r.responds(t) && (paper = o, r.emit(t, s = s || new Z(t, e, i, n)))
                    }

                    var s, o = this._scope, a = o.tool;
                    this.isVisible() && (r(this), a && a.responds(t) && r(a))
                }, _countItemEvent: function (t, e) {
                    var i = this._itemEvents, n = i.native, r = i.virtual;
                    for (var s in z) n[s] = (n[s] || 0) + (z[s][t] || 0) * e;
                    r[t] = (r[t] || 0) + e
                }, statics: {updateFocus: e}
            }
        }
    }), Y = U.extend({
        _class: "CanvasView", initialize: function (t, e) {
            if (!(e instanceof i.HTMLCanvasElement)) {
                var n = f.read(arguments, 1);
                if (n.isZero()) throw new Error("Cannot create CanvasView with the provided argument: " + r.slice(arguments, 1));
                e = tt.getCanvas(n)
            }
            var s = this._context = e.getContext("2d");
            if (s.save(), this._pixelRatio = 1, !/^off|false$/.test(o.getAttribute(e, "hidpi"))) {
                var a = i.devicePixelRatio || 1, l = W.getPrefixed(s, "backingStorePixelRatio") || 1;
                this._pixelRatio = a / l
            }
            U.call(this, t, e), this._needsUpdate = !0
        }, remove: function t() {
            return this._context.restore(), t.base.call(this)
        }, _setElementSize: function t(e, i) {
            var n = this._pixelRatio;
            if (t.base.call(this, e * n, i * n), 1 !== n) {
                var r = this._element, s = this._context;
                if (!o.hasAttribute(r, "resize")) {
                    var a = r.style;
                    a.width = e + "px", a.height = i + "px"
                }
                s.restore(), s.save(), s.scale(n, n)
            }
        }, getPixelSize: function t(e) {
            var i, n = paper.agent;
            if (n && n.firefox) i = t.base.call(this, e); else {
                var r = this._context, s = r.font;
                r.font = e + " serif", i = parseFloat(r.font), r.font = s
            }
            return i
        }, getTextWidth: function (t, e) {
            var i = this._context, n = i.font, r = 0;
            i.font = t;
            for (var s = 0, o = e.length; s < o; s++) r = Math.max(r, i.measureText(e[s]).width);
            return i.font = n, r
        }, update: function () {
            if (!this._needsUpdate) return !1;
            var t = this._project, e = this._context, i = this._viewSize;
            return e.clearRect(0, 0, i.width + 1, i.height + 1), t && t.draw(e, this._matrix, this._pixelRatio), this._needsUpdate = !1, !0
        }
    }), X = r.extend({
        _class: "Event", initialize: function (t) {
            this.event = t, this.type = t && t.type
        }, prevented: !1, stopped: !1, preventDefault: function () {
            this.prevented = !0, this.event.preventDefault()
        }, stopPropagation: function () {
            this.stopped = !0, this.event.stopPropagation()
        }, stop: function () {
            this.stopPropagation(), this.preventDefault()
        }, getTimeStamp: function () {
            return this.event.timeStamp
        }, getModifiers: function () {
            return G.modifiers
        }
    }), Z = X.extend({
        _class: "KeyEvent", initialize: function (t, e, i, n) {
            this.type = t, this.event = e, this.key = i, this.character = n
        }, toString: function () {
            return "{ type: '" + this.type + "', key: '" + this.key + "', character: '" + this.character + "', modifiers: " + this.getModifiers() + " }"
        }
    }), G = new function () {
        function t(t) {
            var i = t.key || t.keyIdentifier;
            return i = /^U\+/.test(i) ? String.fromCharCode(parseInt(i.substr(2), 16)) : /^Arrow[A-Z]/.test(i) ? i.substr(5) : "Unidentified" === i || i === e ? String.fromCharCode(t.keyCode) : i, l[i] || (i.length > 1 ? r.hyphenate(i) : i.toLowerCase())
        }

        function s(t, e, i, n) {
            var a, l = U._focused;
            if (u[e] = t, t ? c[e] = i : delete c[e], e.length > 1 && (a = r.camelize(e)) in d) {
                d[a] = t;
                var h = paper && paper.agent;
                if ("meta" === a && h && h.mac) if (t) o = {}; else {
                    for (var f in o) f in c && s(!1, f, o[f], n);
                    o = null
                }
            } else t && o && (o[e] = i);
            l && l._handleKeyEvent(t ? "keydown" : "keyup", n, e, i)
        }

        var o, a, l = {
            "\t": "tab",
            " ": "space",
            "\b": "backspace",
            "": "delete",
            Spacebar: "space",
            Del: "delete",
            Win: "meta",
            Esc: "escape"
        }, h = {tab: "\t", space: " ", enter: "\r"}, u = {}, c = {}, d = new r({
            shift: !1,
            control: !1,
            alt: !1,
            meta: !1,
            capsLock: !1,
            space: !1
        }).inject({
            option: {
                get: function () {
                    return this.alt
                }
            }, command: {
                get: function () {
                    var t = paper && paper.agent;
                    return t && t.mac ? this.meta : this.control
                }
            }
        });
        return V.add(n, {
            keydown: function (e) {
                var i = t(e), n = paper && paper.agent;
                i.length > 1 || n && n.chrome && (e.altKey || n.mac && e.metaKey || !n.mac && e.ctrlKey) ? s(!0, i, h[i] || (i.length > 1 ? "" : i), e) : a = i
            }, keypress: function (e) {
                if (a) {
                    var i = t(e), n = e.charCode, r = n >= 32 ? String.fromCharCode(n) : i.length > 1 ? "" : i;
                    i !== a && (i = r.toLowerCase()), s(!0, i, r, e), a = null
                }
            }, keyup: function (e) {
                var i = t(e);
                i in c && s(!1, i, c[i], e)
            }
        }), V.add(i, {
            blur: function (t) {
                for (var e in c) s(!1, e, c[e], t)
            }
        }), {
            modifiers: d, isDown: function (t) {
                return !!u[t]
            }
        }
    }, $ = X.extend({
        _class: "MouseEvent", initialize: function (t, e, i, n, r) {
            this.type = t, this.event = e, this.point = i, this.target = n, this.delta = r
        }, toString: function () {
            return "{ type: '" + this.type + "', point: " + this.point + ", target: " + this.target + (this.delta ? ", delta: " + this.delta : "") + ", modifiers: " + this.getModifiers() + " }"
        }
    }), J = X.extend({
        _class: "ToolEvent", _item: null, initialize: function (t, e, i) {
            this.tool = t,
                this.type = e, this.event = i
        }, _choosePoint: function (t, e) {
            return t || (e ? e.clone() : null)
        }, getPoint: function () {
            return this._choosePoint(this._point, this.tool._point)
        }, setPoint: function (t) {
            this._point = t
        }, getLastPoint: function () {
            return this._choosePoint(this._lastPoint, this.tool._lastPoint)
        }, setLastPoint: function (t) {
            this._lastPoint = t
        }, getDownPoint: function () {
            return this._choosePoint(this._downPoint, this.tool._downPoint)
        }, setDownPoint: function (t) {
            this._downPoint = t
        }, getMiddlePoint: function () {
            return !this._middlePoint && this.tool._lastPoint ? this.tool._point.add(this.tool._lastPoint).divide(2) : this._middlePoint
        }, setMiddlePoint: function (t) {
            this._middlePoint = t
        }, getDelta: function () {
            return !this._delta && this.tool._lastPoint ? this.tool._point.subtract(this.tool._lastPoint) : this._delta
        }, setDelta: function (t) {
            this._delta = t
        }, getCount: function () {
            return this.tool[/^mouse(down|up)$/.test(this.type) ? "_downCount" : "_moveCount"]
        }, setCount: function (t) {
            this.tool[/^mouse(down|up)$/.test(this.type) ? "downCount" : "count"] = t
        }, getItem: function () {
            if (!this._item) {
                var t = this.tool._scope.project.hitTest(this.getPoint());
                if (t) {
                    for (var e = t.item, i = e._parent; /^(Group|CompoundPath)$/.test(i._class);) e = i, i = i._parent;
                    this._item = e
                }
            }
            return this._item
        }, setItem: function (t) {
            this._item = t
        }, toString: function () {
            return "{ type: " + this.type + ", point: " + this.getPoint() + ", count: " + this.getCount() + ", modifiers: " + this.getModifiers() + " }"
        }
    }), Q = a.extend({
        _class: "Tool",
        _list: "tools",
        _reference: "tool",
        _events: ["onMouseDown", "onMouseUp", "onMouseDrag", "onMouseMove", "onActivate", "onDeactivate", "onEditOptions", "onKeyDown", "onKeyUp"],
        initialize: function (t) {
            a.call(this), this._moveCount = -1, this._downCount = -1, this.set(t)
        },
        getMinDistance: function () {
            return this._minDistance
        },
        setMinDistance: function (t) {
            this._minDistance = t, null != t && null != this._maxDistance && t > this._maxDistance && (this._maxDistance = t)
        },
        getMaxDistance: function () {
            return this._maxDistance
        },
        setMaxDistance: function (t) {
            this._maxDistance = t, null != this._minDistance && null != t && t < this._minDistance && (this._minDistance = t)
        },
        getFixedDistance: function () {
            return this._minDistance == this._maxDistance ? this._minDistance : null
        },
        setFixedDistance: function (t) {
            this._minDistance = this._maxDistance = t
        },
        _handleMouseEvent: function (t, e, i, n) {
            function r(t, e) {
                var r = i, s = o ? c._point : c._downPoint || r;
                if (o) {
                    if (c._moveCount && r.equals(s)) return !1;
                    if (s && (null != t || null != e)) {
                        var a = r.subtract(s), l = a.getLength();
                        if (l < (t || 0)) return !1;
                        e && (r = s.add(a.normalize(Math.min(l, e))))
                    }
                    c._moveCount++
                }
                return c._point = r, c._lastPoint = s || r, n.down && (c._moveCount = -1, c._downPoint = r, c._downCount++), !0
            }

            function s() {
                a && (u = c.emit(t, new J(c, t, e)) || u)
            }

            paper = this._scope, n.drag && !this.responds(t) && (t = "mousemove");
            var o = n.move || n.drag, a = this.responds(t), l = this.minDistance, h = this.maxDistance, u = !1,
                c = this;
            if (n.down) r(), s(); else if (n.up) r(null, h), s(); else if (a) for (; r(l, h);) s();
            return u
        }
    }), K = {
        request: function (e) {
            var i = new t.XMLHttpRequest;
            return i.open((e.method || "get").toUpperCase(), e.url, r.pick(e.async, !0)), e.mimeType && i.overrideMimeType(e.mimeType), i.onload = function () {
                var t = i.status;
                0 === t || 200 === t ? e.onLoad && e.onLoad.call(i, i.responseText) : i.onerror()
            }, i.onerror = function () {
                var t = i.status, n = 'Could not load "' + e.url + '" (Status: ' + t + ")";
                if (!e.onError) throw new Error(n);
                e.onError(n, t)
            }, i.send(null)
        }
    }, tt = {
        canvases: [], getCanvas: function (t, e) {
            if (!i) return null;
            var r, s = !0;
            "object" == typeof t && (e = t.height, t = t.width), this.canvases.length ? r = this.canvases.pop() : (r = n.createElement("canvas"), s = !1);
            var o = r.getContext("2d");
            if (!o) throw new Error("Canvas " + r + " is unable to provide a 2D context.");
            return r.width === t && r.height === e ? s && o.clearRect(0, 0, t + 1, e + 1) : (r.width = t, r.height = e), o.save(), r
        }, getContext: function (t, e) {
            var i = this.getCanvas(t, e);
            return i ? i.getContext("2d") : null
        }, release: function (t) {
            var e = t && t.canvas ? t.canvas : t;
            e && e.getContext && (e.getContext("2d").restore(), this.canvases.push(e))
        }
    }, et = new function () {
        function t(t, e, i) {
            return .2989 * t + .587 * e + .114 * i
        }

        function e(e, i, n, r) {
            var s = r - t(e, i, n);
            f = e + s, p = i + s, g = n + s;
            var r = t(f, p, g), o = m(f, p, g), a = v(f, p, g);
            if (o < 0) {
                var l = r - o;
                f = r + (f - r) * r / l, p = r + (p - r) * r / l, g = r + (g - r) * r / l
            }
            if (a > 255) {
                var h = 255 - r, u = a - r;
                f = r + (f - r) * h / u, p = r + (p - r) * h / u, g = r + (g - r) * h / u
            }
        }

        function i(t, e, i) {
            return v(t, e, i) - m(t, e, i)
        }

        function n(t, e, i, n) {
            var r, s = [t, e, i], o = v(t, e, i), a = m(t, e, i);
            a = a === t ? 0 : a === e ? 1 : 2, o = o === t ? 0 : o === e ? 1 : 2, r = 0 === m(a, o) ? 1 === v(a, o) ? 2 : 1 : 0, s[o] > s[a] ? (s[r] = (s[r] - s[a]) * n / (s[o] - s[a]), s[o] = n) : s[r] = s[o] = 0, s[a] = 0, f = s[0], p = s[1], g = s[2]
        }

        var s, o, a, l, h, u, c, d, f, p, g, m = Math.min, v = Math.max, _ = Math.abs, y = {
                multiply: function () {
                    f = h * s / 255, p = u * o / 255, g = c * a / 255
                }, screen: function () {
                    f = h + s - h * s / 255, p = u + o - u * o / 255, g = c + a - c * a / 255
                }, overlay: function () {
                    f = h < 128 ? 2 * h * s / 255 : 255 - 2 * (255 - h) * (255 - s) / 255, p = u < 128 ? 2 * u * o / 255 : 255 - 2 * (255 - u) * (255 - o) / 255, g = c < 128 ? 2 * c * a / 255 : 255 - 2 * (255 - c) * (255 - a) / 255
                }, "soft-light": function () {
                    var t = s * h / 255;
                    f = t + h * (255 - (255 - h) * (255 - s) / 255 - t) / 255, t = o * u / 255, p = t + u * (255 - (255 - u) * (255 - o) / 255 - t) / 255, t = a * c / 255, g = t + c * (255 - (255 - c) * (255 - a) / 255 - t) / 255
                }, "hard-light": function () {
                    f = s < 128 ? 2 * s * h / 255 : 255 - 2 * (255 - s) * (255 - h) / 255, p = o < 128 ? 2 * o * u / 255 : 255 - 2 * (255 - o) * (255 - u) / 255, g = a < 128 ? 2 * a * c / 255 : 255 - 2 * (255 - a) * (255 - c) / 255
                }, "color-dodge": function () {
                    f = 0 === h ? 0 : 255 === s ? 255 : m(255, 255 * h / (255 - s)), p = 0 === u ? 0 : 255 === o ? 255 : m(255, 255 * u / (255 - o)), g = 0 === c ? 0 : 255 === a ? 255 : m(255, 255 * c / (255 - a))
                }, "color-burn": function () {
                    f = 255 === h ? 255 : 0 === s ? 0 : v(0, 255 - 255 * (255 - h) / s), p = 255 === u ? 255 : 0 === o ? 0 : v(0, 255 - 255 * (255 - u) / o), g = 255 === c ? 255 : 0 === a ? 0 : v(0, 255 - 255 * (255 - c) / a)
                }, darken: function () {
                    f = h < s ? h : s, p = u < o ? u : o, g = c < a ? c : a
                }, lighten: function () {
                    f = h > s ? h : s, p = u > o ? u : o, g = c > a ? c : a
                }, difference: function () {
                    f = h - s, f < 0 && (f = -f), p = u - o, p < 0 && (p = -p), (g = c - a) < 0 && (g = -g)
                }, exclusion: function () {
                    f = h + s * (255 - h - h) / 255, p = u + o * (255 - u - u) / 255, g = c + a * (255 - c - c) / 255
                }, hue: function () {
                    n(s, o, a, i(h, u, c)), e(f, p, g, t(h, u, c))
                }, saturation: function () {
                    n(h, u, c, i(s, o, a)), e(f, p, g, t(h, u, c))
                }, luminosity: function () {
                    e(h, u, c, t(s, o, a))
                }, color: function () {
                    e(s, o, a, t(h, u, c))
                }, add: function () {
                    f = m(h + s, 255), p = m(u + o, 255), g = m(c + a, 255)
                }, subtract: function () {
                    f = v(h - s, 0), p = v(u - o, 0), g = v(c - a, 0)
                }, average: function () {
                    f = (h + s) / 2, p = (u + o) / 2, g = (c + a) / 2
                }, negation: function () {
                    f = 255 - _(255 - s - h), p = 255 - _(255 - o - u), g = 255 - _(255 - a - c)
                }
            },
            w = this.nativeModes = r.each(["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "darker", "copy", "xor"], function (t) {
                this[t] = !0
            }, {}), x = tt.getContext(1, 1);
        x && (r.each(y, function (t, e) {
            var i = "darken" === e, n = !1;
            x.save();
            try {
                x.fillStyle = i ? "#300" : "#a00", x.fillRect(0, 0, 1, 1), x.globalCompositeOperation = e, x.globalCompositeOperation === e && (x.fillStyle = i ? "#a00" : "#300", x.fillRect(0, 0, 1, 1), n = x.getImageData(0, 0, 1, 1).data[0] !== i ? 170 : 51)
            } catch (t) {
            }
            x.restore(), w[e] = n
        }), tt.release(x)), this.process = function (t, e, i, n, r) {
            var m = e.canvas, v = "normal" === t;
            if (v || w[t]) i.save(), i.setTransform(1, 0, 0, 1, 0, 0), i.globalAlpha = n, v || (i.globalCompositeOperation = t), i.drawImage(m, r.x, r.y), i.restore(); else {
                var _ = y[t];
                if (!_) return;
                for (var x = i.getImageData(r.x, r.y, m.width, m.height), b = x.data, C = e.getImageData(0, 0, m.width, m.height).data, S = 0, T = b.length; S < T; S += 4) {
                    s = C[S], h = b[S], o = C[S + 1], u = b[S + 1], a = C[S + 2], c = b[S + 2], l = C[S + 3], d = b[S + 3], _();
                    var E = l * n / 255, k = 1 - E;
                    b[S] = E * f + k * h, b[S + 1] = E * p + k * u, b[S + 2] = E * g + k * c, b[S + 3] = l * n + k * d
                }
                i.putImageData(x, r.x, r.y)
            }
        }
    }, it = new function () {
        function t(t, e, s) {
            return i(n.createElementNS(r, t), e, s)
        }

        function e(t, e) {
            var i = a[e], n = i ? t.getAttributeNS(i, e) : t.getAttribute(e);
            return "null" === n ? null : n
        }

        function i(t, e, i) {
            for (var n in e) {
                var r = e[n], s = a[n];
                "number" == typeof r && i && (r = i.number(r)), s ? t.setAttributeNS(s, n, r) : t.setAttribute(n, r)
            }
            return t
        }

        var r = "http://www.w3.org/2000/svg", s = "http://www.w3.org/2000/xmlns", o = "http://www.w3.org/1999/xlink",
            a = {href: o, xlink: s, xmlns: s + "/", "xmlns:xlink": s + "/"};
        return {svg: r, xmlns: s, xlink: o, create: t, get: e, set: i}
    }, nt = r.each({
        fillColor: ["fill", "color"],
        fillRule: ["fill-rule", "string"],
        strokeColor: ["stroke", "color"],
        strokeWidth: ["stroke-width", "number"],
        strokeCap: ["stroke-linecap", "string"],
        strokeJoin: ["stroke-linejoin", "string"],
        strokeScaling: ["vector-effect", "lookup", {true: "none", false: "non-scaling-stroke"}, function (t, e) {
            return !e && (t instanceof M || t instanceof C || t instanceof D)
        }],
        miterLimit: ["stroke-miterlimit", "number"],
        dashArray: ["stroke-dasharray", "array"],
        dashOffset: ["stroke-dashoffset", "number"],
        fontFamily: ["font-family", "string"],
        fontWeight: ["font-weight", "string"],
        fontSize: ["font-size", "number"],
        justification: ["text-anchor", "lookup", {left: "start", center: "middle", right: "end"}],
        opacity: ["opacity", "number"],
        blendMode: ["mix-blend-mode", "style"]
    }, function (t, e) {
        var i = r.capitalize(e), n = t[2];
        this[e] = {
            type: t[1], property: e, attribute: t[0], toSVG: n, fromSVG: n && r.each(n, function (t, e) {
                this[t] = e
            }, {}), exportFilter: t[3], get: "get" + i, set: "set" + i
        }
    }, {});
    return new function () {
        function e(t, e, i) {
            var n = new r, s = t.getTranslation();
            if (e) {
                t = t._shiftless();
                var o = t._inverseTransform(s);
                n[i ? "cx" : "x"] = o.x, n[i ? "cy" : "y"] = o.y, s = null
            }
            if (!t.isIdentity()) {
                var a = t.decompose();
                if (a) {
                    var l = [], u = a.rotation, c = a.scaling, d = a.skewing;
                    s && !s.isZero() && l.push("translate(" + S.point(s) + ")"), u && l.push("rotate(" + S.number(u) + ")"), h.isZero(c.x - 1) && h.isZero(c.y - 1) || l.push("scale(" + S.point(c) + ")"), d.x && l.push("skewX(" + S.number(d.x) + ")"), d.y && l.push("skewY(" + S.number(d.y) + ")"), n.transform = l.join(" ")
                } else n.transform = "matrix(" + t.getValues().join(",") + ")"
            }
            return n
        }

        function i(t, i) {
            for (var n = e(t._matrix), r = t._children, s = it.create("g", n, S), o = 0, a = r.length; o < a; o++) {
                var l = r[o], h = b(l, i);
                if (h) if (l.isClipMask()) {
                    var u = it.create("clipPath");
                    u.appendChild(h), _(l, u, "clip"), it.set(s, {"clip-path": "url(#" + u.id + ")"})
                } else s.appendChild(h)
            }
            return s
        }

        function n(t, i) {
            var n = e(t._matrix, !0), r = t.getSize(), s = t.getImage();
            return n.x -= r.width / 2, n.y -= r.height / 2, n.width = r.width, n.height = r.height, n.href = 0 == i.embedImages && s && s.src || t.toDataURL(), it.create("image", n, S)
        }

        function s(t, i) {
            var n = i.matchShapes;
            if (n) {
                var r = t.toShape(!1);
                if (r) return o(r)
            }
            var s, a = t._segments, l = a.length, h = e(t._matrix);
            if (n && l >= 2 && !t.hasHandles()) if (l > 2) {
                s = t._closed ? "polygon" : "polyline";
                for (var u = [], c = 0; c < l; c++) u.push(S.point(a[c]._point));
                h.points = u.join(" ")
            } else {
                s = "line";
                var d = a[0]._point, f = a[1]._point;
                h.set({x1: d.x, y1: d.y, x2: f.x, y2: f.y})
            } else s = "path", h.d = t.getPathData(null, i.precision);
            return it.create(s, h, S)
        }

        function o(t) {
            var i = t._type, n = t._radius, r = e(t._matrix, !0, "rectangle" !== i);
            if ("rectangle" === i) {
                i = "rect";
                var s = t._size, o = s.width, a = s.height;
                r.x -= o / 2, r.y -= a / 2, r.width = o, r.height = a, n.isZero() && (n = null)
            }
            return n && ("circle" === i ? r.r = n : (r.rx = n.width, r.ry = n.height)), it.create(i, r, S)
        }

        function a(t, i) {
            var n = e(t._matrix), r = t.getPathData(null, i.precision);
            return r && (n.d = r), it.create("path", n, S)
        }

        function c(t, i) {
            var n = e(t._matrix, !0), r = t._definition, s = m(r, "symbol"), o = r._item, a = o.getBounds();
            return s || (s = it.create("symbol", {viewBox: S.rectangle(a)}), s.appendChild(b(o, i)), _(r, s, "symbol")), n.href = "#" + s.id, n.x += a.x, n.y += a.y, n.width = a.width, n.height = a.height, n.overflow = "visible", it.create("use", n, S)
        }

        function d(t) {
            var e = m(t, "color");
            if (!e) {
                var i, n = t.getGradient(), r = n._radial, s = t.getOrigin(), o = t.getDestination();
                if (r) {
                    i = {cx: s.x, cy: s.y, r: s.getDistance(o)};
                    var a = t.getHighlight();
                    a && (i.fx = a.x, i.fy = a.y)
                } else i = {x1: s.x, y1: s.y, x2: o.x, y2: o.y};
                i.gradientUnits = "userSpaceOnUse", e = it.create((r ? "radial" : "linear") + "Gradient", i, S);
                for (var l = n._stops, h = 0, u = l.length; h < u; h++) {
                    var c = l[h], d = c._color, f = d.getAlpha(), p = c._offset;
                    i = {offset: null == p ? h / (u - 1) : p}, d && (i["stop-color"] = d.toCSS(!0)), f < 1 && (i["stop-opacity"] = f), e.appendChild(it.create("stop", i, S))
                }
                _(t, e, "color")
            }
            return "url(#" + e.id + ")"
        }

        function f(t) {
            var i = it.create("text", e(t._matrix, !0), S);
            return i.textContent = t._content, i
        }

        function p(t, e, i) {
            var n = {}, s = !i && t.getParent(), o = [];
            return null != t._name && (n.id = t._name), r.each(nt, function (e) {
                var i = e.get, a = e.type, l = t[i]();
                if (e.exportFilter ? e.exportFilter(t, l) : !s || !r.equals(s[i](), l)) {
                    if ("color" === a && null != l) {
                        var h = l.getAlpha();
                        h < 1 && (n[e.attribute + "-opacity"] = h)
                    }
                    "style" === a ? o.push(e.attribute + ": " + l) : n[e.attribute] = null == l ? "none" : "color" === a ? l.gradient ? d(l, t) : l.toCSS(!0) : "array" === a ? l.join(",") : "lookup" === a ? e.toSVG[l] : l
                }
            }), o.length && (n.style = o.join(";")), 1 === n.opacity && delete n.opacity, t._visible || (n.visibility = "hidden"), it.set(e, n, S)
        }

        function m(t, e) {
            return T || (T = {ids: {}, svgs: {}}), t && T.svgs[e + "-" + (t._id || t.__id || (t.__id = u.get("svg")))]
        }

        function _(t, e, i) {
            T || m();
            var n = T.ids[i] = (T.ids[i] || 0) + 1;
            e.id = i + "-" + n, T.svgs[i + "-" + (t._id || t.__id)] = e
        }

        function x(e, i) {
            var n = e, r = null;
            if (T) {
                n = "svg" === e.nodeName.toLowerCase() && e;
                for (var s in T.svgs) r || (n || (n = it.create("svg"), n.appendChild(e)), r = n.insertBefore(it.create("defs"), n.firstChild)), r.appendChild(T.svgs[s]);
                T = null
            }
            return i.asString ? (new t.XMLSerializer).serializeToString(n) : n
        }

        function b(t, e, i) {
            var n = E[t._class], r = n && n(t, e);
            if (r) {
                var s = e.onExport;
                s && (r = s(t, r, e) || r);
                var o = JSON.stringify(t._data);
                o && "{}" !== o && "null" !== o && r.setAttribute("data-paper-data", o)
            }
            return r && p(t, r, i)
        }

        function C(t) {
            return t || (t = {}), S = new l(t.precision), t
        }

        var S, T, E = {Group: i, Layer: i, Raster: n, Path: s, Shape: o, CompoundPath: a, SymbolItem: c, PointText: f};
        w.inject({
            exportSVG: function (t) {
                return t = C(t), x(b(this, t, !0), t)
            }
        }), y.inject({
            exportSVG: function (t) {
                t = C(t);
                var i = this._children, n = this.getView(), s = r.pick(t.bounds, "view"),
                    o = t.matrix || "view" === s && n._matrix, a = o && v.read([o]),
                    l = "view" === s ? new g([0, 0], n.getViewSize()) : "content" === s ? w._getBounds(i, a, {stroke: !0}).rect : g.read([s], 0, {readNull: !0}),
                    h = {version: "1.1", xmlns: it.svg, "xmlns:xlink": it.xlink};
                l && (h.width = l.width, h.height = l.height, (l.x || l.y) && (h.viewBox = S.rectangle(l)));
                var u = it.create("svg", h, S), c = u;
                a && !a.isIdentity() && (c = u.appendChild(it.create("g", e(a), S)));
                for (var d = 0, f = i.length; d < f; d++) c.appendChild(b(i[d], t, !0));
                return x(u, t)
            }
        })
    }, new function () {
        function s(t, e, i, n, r) {
            var s = it.get(t, e), o = null == s ? n ? null : i ? "" : 0 : i ? s : parseFloat(s);
            return /%\s*$/.test(s) ? o / 100 * (r ? 1 : z[/x|^width/.test(e) ? "width" : "height"]) : o
        }

        function o(t, e, i, n, r) {
            return e = s(t, e || "x", !1, n, r), i = s(t, i || "y", !1, n, r), !n || null != e && null != i ? new c(e, i) : null
        }

        function a(t, e, i, n, r) {
            return e = s(t, e || "width", !1, n, r), i = s(t, i || "height", !1, n, r), !n || null != e && null != i ? new f(e, i) : null
        }

        function l(t, e, i) {
            return "none" === t ? null : "number" === e ? parseFloat(t) : "array" === e ? t ? t.split(/[\s,]+/g).map(parseFloat) : [] : "color" === e ? k(t) || t : "lookup" === e ? i[t] : t
        }

        function h(t, e, i, n) {
            var r = t.childNodes, s = "clippath" === e, o = "defs" === e, a = new x, l = a._project,
                h = l._currentStyle, u = [];
            if (s || o || (a = T(a, t, n), l._currentStyle = a._style.clone()), n) for (var c = t.querySelectorAll("defs"), d = 0, f = c.length; d < f; d++) P(c[d], i, !1);
            for (var d = 0, f = r.length; d < f; d++) {
                var p, g = r[d];
                1 !== g.nodeType || /^defs$/i.test(g.nodeName) || !(p = P(g, i, !1)) || p instanceof E || u.push(p)
            }
            return a.addChildren(u), s && (a = T(a.reduce(), t, n)), l._currentStyle = h, (s || o) && (a.remove(), a = null), a
        }

        function u(t, e) {
            for (var i = t.getAttribute("points").match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g), n = [], r = 0, s = i.length; r < s; r += 2) n.push(new c(parseFloat(i[r]), parseFloat(i[r + 1])));
            var o = new O(n);
            return "polygon" === e && o.closePath(), o
        }

        function d(t) {
            return M.create(t.getAttribute("d"))
        }

        function p(t, e) {
            var i, n = (s(t, "href", !0) || "").substring(1), r = "radialgradient" === e;
            if (n) i = I[n].getGradient(), i._radial ^ r && (i = i.clone(), i._radial = r); else {
                for (var a = t.childNodes, l = [], h = 0, u = a.length; h < u; h++) {
                    var c = a[h];
                    1 === c.nodeType && l.push(T(new B, c))
                }
                i = new H(l, r)
            }
            var d, f, p, g = "userSpaceOnUse" !== s(t, "gradientUnits", !0);
            return r ? (d = o(t, "cx", "cy", !1, g), f = d.add(s(t, "r", !1, !1, g), 0), p = o(t, "fx", "fy", !0, g)) : (d = o(t, "x1", "y1", !1, g), f = o(t, "x2", "y2", !1, g)), T(new R(i, d, f, p), t)._scaleToBounds = g, null
        }

        function m(t, e, i, n) {
            if (t.transform) {
                for (var r = (n.getAttribute(i) || "").split(/\)\s*/g), s = new v, o = 0, a = r.length; o < a; o++) {
                    var l = r[o];
                    if (!l) break;
                    for (var h = l.split(/\(\s*/), u = h[0], c = h[1].split(/[\s,]+/g), d = 0, f = c.length; d < f; d++) c[d] = parseFloat(c[d]);
                    switch (u) {
                        case"matrix":
                            s.append(new v(c[0], c[1], c[2], c[3], c[4], c[5]));
                            break;
                        case"rotate":
                            s.rotate(c[0], c[1], c[2]);
                            break;
                        case"translate":
                            s.translate(c[0], c[1]);
                            break;
                        case"scale":
                            s.scale(c);
                            break;
                        case"skewX":
                            s.skew(c[0], 0);
                            break;
                        case"skewY":
                            s.skew(0, c[0])
                    }
                }
                t.transform(s)
            }
        }

        function _(t, e, i) {
            var n = "fill-opacity" === i ? "getFillColor" : "getStrokeColor", r = t[n] && t[n]();
            r && r.setAlpha(parseFloat(e))
        }

        function b(t, i, n) {
            var s = t.attributes[i], o = s && s.value;
            if (!o) {
                var a = r.camelize(i);
                o = t.style[a], o || n.node[a] === n.parent[a] || (o = n.node[a])
            }
            return o ? "none" === o ? null : o : e
        }

        function T(t, i, n) {
            if (i.style) {
                var s = i.parentNode,
                    o = {node: W.getStyles(i) || {}, parent: !n && !/^defs$/i.test(s.tagName) && W.getStyles(s) || {}};
                r.each(N, function (n, r) {
                    var s = b(i, r, o);
                    t = s !== e && n(t, s, r, i, o) || t
                })
            }
            return t
        }

        function k(t) {
            var e = t && t.match(/\((?:["'#]*)([^"')]+)/), n = e && e[1],
                r = n && I[i ? n.replace(i.location.href.split("#")[0] + "#", "") : n];
            return r && r._scaleToBounds && (r = r.clone(), r._scaleToBounds = !0), r
        }

        function P(t, e, i) {
            var s, o, l, h = t.nodeName.toLowerCase(), u = "#document" !== h, c = n.body;
            i && u && (z = paper.getView().getSize(), z = a(t, null, null, !0) || z, s = it.create("svg", {style: "stroke-width: 1px; stroke-miterlimit: 10"}), o = t.parentNode, l = t.nextSibling, s.appendChild(t), c.appendChild(s));
            var d = paper.settings, f = d.applyMatrix, p = d.insertItems;
            d.applyMatrix = !1, d.insertItems = !1;
            var g = L[h], m = g && g(t, h, e, i) || null;
            if (d.insertItems = p, d.applyMatrix = f, m) {
                !u || m instanceof x || (m = T(m, t, i));
                var v = e.onImport, _ = u && t.getAttribute("data-paper-data");
                v && (m = v(t, m, e) || m), e.expandShapes && m instanceof C && (m.remove(), m = m.toPath()), _ && (m._data = JSON.parse(_))
            }
            return s && (c.removeChild(s), o && (l ? o.insertBefore(t, l) : o.appendChild(t))), i && (I = {}, m && r.pick(e.applyMatrix, f) && m.matrix.apply(!0, !0)), m
        }

        function A(i, r, s) {
            function o(n) {
                try {
                    var o = "object" == typeof n ? n : (new t.DOMParser).parseFromString(n, "image/svg+xml");
                    if (!o.nodeName) throw o = null, new Error("Unsupported SVG source: " + i);
                    paper = l, h = P(o, r, !0), r && !1 === r.insert || s._insertItem(e, h);
                    var u = r.onLoad;
                    u && u(h, n)
                } catch (t) {
                    a(t)
                }
            }

            function a(t, e) {
                var i = r.onError;
                if (!i) throw new Error(t);
                i(t, e)
            }

            if (!i) return null;
            r = "function" == typeof r ? {onLoad: r} : r || {};
            var l = paper, h = null;
            if ("string" != typeof i || /^.*</.test(i)) {
                if ("undefined" != typeof File && i instanceof File) {
                    var u = new FileReader;
                    return u.onload = function () {
                        o(u.result)
                    }, u.onerror = function () {
                        a(u.error)
                    }, u.readAsText(i)
                }
                o(i)
            } else {
                var c = n.getElementById(i);
                c ? o(c) : K.request({url: i, async: !0, onLoad: o, onError: a})
            }
            return h
        }

        var z, I = {}, L = {
            "#document": function (t, e, i, n) {
                for (var r = t.childNodes, s = 0, o = r.length; s < o; s++) {
                    var a = r[s];
                    if (1 === a.nodeType) return P(a, i, n)
                }
            },
            g: h,
            svg: h,
            clippath: h,
            polygon: u,
            polyline: u,
            path: d,
            lineargradient: p,
            radialgradient: p,
            image: function (t) {
                var e = new S(s(t, "href", !0));
                return e.on("load", function () {
                    var e = a(t);
                    this.setSize(e);
                    var i = this._matrix._transformPoint(o(t).add(e.divide(2)));
                    this.translate(i)
                }), e
            },
            symbol: function (t, e, i, n) {
                return new E(h(t, e, i, n), !0)
            },
            defs: h,
            use: function (t) {
                var e = (s(t, "href", !0) || "").substring(1), i = I[e], n = o(t);
                return i ? i instanceof E ? i.place(n) : i.clone().translate(n) : null
            },
            circle: function (t) {
                return new C.Circle(o(t, "cx", "cy"), s(t, "r"))
            },
            ellipse: function (t) {
                return new C.Ellipse({center: o(t, "cx", "cy"), radius: a(t, "rx", "ry")})
            },
            rect: function (t) {
                return new C.Rectangle(new g(o(t), a(t)), a(t, "rx", "ry"))
            },
            line: function (t) {
                return new O.Line(o(t, "x1", "y1"), o(t, "x2", "y2"))
            },
            text: function (t) {
                var e = new q(o(t).add(o(t, "dx", "dy")));
                return e.setContent(t.textContent.trim() || ""), e
            }
        }, N = r.set(r.each(nt, function (t) {
            this[t.attribute] = function (e, i) {
                if (e[t.set] && (e[t.set](l(i, t.type, t.fromSVG)), "color" === t.type)) {
                    var n = e[t.get]();
                    if (n && n._scaleToBounds) {
                        var r = e.getBounds();
                        n.transform((new v).translate(r.getPoint()).scale(r.getSize()))
                    }
                }
            }
        }, {}), {
            id: function (t, e) {
                I[e] = t, t.setName && t.setName(e)
            }, "clip-path": function (t, e) {
                var i = k(e);
                if (i) {
                    if (i = i.clone(), i.setClipMask(!0), !(t instanceof x)) return new x(i, t);
                    t.insertChild(0, i)
                }
            }, gradientTransform: m, transform: m, "fill-opacity": _, "stroke-opacity": _, visibility: function (t, e) {
                t.setVisible && t.setVisible("visible" === e)
            }, display: function (t, e) {
                t.setVisible && t.setVisible(null !== e)
            }, "stop-color": function (t, e) {
                t.setColor && t.setColor(e)
            }, "stop-opacity": function (t, e) {
                t._color && t._color.setAlpha(parseFloat(e))
            }, offset: function (t, e) {
                if (t.setOffset) {
                    var i = e.match(/(.*)%$/);
                    t.setOffset(i ? i[1] / 100 : parseFloat(e))
                }
            }, viewBox: function (t, e, i, n, r) {
                var s, o, h = new g(l(e, "array")), u = a(n, null, null, !0);
                if (t instanceof x) {
                    var c = u ? u.divide(h.getSize()) : 1, o = (new v).scale(c).translate(h.getPoint().negate());
                    s = t
                } else t instanceof E && (u && h.setSize(u), s = t._item);
                if (s) {
                    if ("visible" !== b(n, "overflow", r)) {
                        var d = new C.Rectangle(h);
                        d.setClipMask(!0), s.addChild(d)
                    }
                    o && s.transform(o)
                }
            }
        });
        w.inject({
            importSVG: function (t, e) {
                return A(t, e, this)
            }
        }), y.inject({
            importSVG: function (t, e) {
                return this.activate(), A(t, e, this)
            }
        })
    }, r.exports.PaperScript = function () {
        function e(t, e) {
            return (g.acorn || m).parse(t, e)
        }

        function s(t, e, i) {
            var n = y[e];
            if (t && t[n]) {
                var r = t[n](i);
                return "!=" === e ? !r : r
            }
            switch (e) {
                case"+":
                    return t + i;
                case"-":
                    return t - i;
                case"*":
                    return t * i;
                case"/":
                    return t / i;
                case"%":
                    return t % i;
                case"==":
                    return t == i;
                case"!=":
                    return t != i
            }
        }

        function a(t, e) {
            var i = w[t];
            if (e && e[i]) return e[i]();
            switch (t) {
                case"+":
                    return +e;
                case"-":
                    return -e
            }
        }

        function l(r, s) {
            function o(t) {
                for (var e = 0, i = d.length; e < i; e++) {
                    var n = d[e];
                    if (n[0] >= t) break;
                    t += n[1]
                }
                return t
            }

            function a(t) {
                return r.substring(o(t.range[0]), o(t.range[1]))
            }

            function l(t, e) {
                return r.substring(o(t.range[1]), o(e.range[0]))
            }

            function h(t, e) {
                for (var i = o(t.range[0]), n = o(t.range[1]), s = 0, a = d.length - 1; a >= 0; a--) if (i > d[a][0]) {
                    s = a + 1;
                    break
                }
                d.splice(s, 0, [i, e.length - n + i]), r = r.substring(0, i) + e + r.substring(n)
            }

            function u(t, e) {
                if (t) {
                    for (var i in t) if ("range" !== i && "loc" !== i) {
                        var n = t[i];
                        if (Array.isArray(n)) for (var r = 0, s = n.length; r < s; r++) u(n[r], t); else n && "object" == typeof n && u(n, t)
                    }
                    switch (t.type) {
                        case"UnaryExpression":
                            if (t.operator in w && "Literal" !== t.argument.type) {
                                var o = a(t.argument);
                                h(t, '$__("' + t.operator + '", ' + o + ")")
                            }
                            break;
                        case"BinaryExpression":
                            if (t.operator in y && "Literal" !== t.left.type) {
                                var c = a(t.left), d = a(t.right), f = l(t.left, t.right), p = t.operator;
                                h(t, "__$__(" + c + "," + f.replace(new RegExp("\\" + p), '"' + p + '"') + ", " + d + ")")
                            }
                            break;
                        case"UpdateExpression":
                        case"AssignmentExpression":
                            var g = e && e.type;
                            if (!("ForStatement" === g || "BinaryExpression" === g && /^[=!<>]/.test(e.operator) || "MemberExpression" === g && e.computed)) if ("UpdateExpression" === t.type) {
                                var o = a(t.argument), m = "__$__(" + o + ', "' + t.operator[0] + '", 1)',
                                    v = o + " = " + m;
                                t.prefix || "AssignmentExpression" !== g && "VariableDeclarator" !== g || (a(e.left || e.id) === o && (v = m), v = o + "; " + v), h(t, v)
                            } else if (/^.=$/.test(t.operator) && "Literal" !== t.left.type) {
                                var c = a(t.left), d = a(t.right),
                                    m = c + " = __$__(" + c + ', "' + t.operator[0] + '", ' + d + ")";
                                h(t, /^\(.*\)$/.test(a(t)) ? "(" + m + ")" : m)
                            }
                    }
                }
            }

            if (!r) return "";
            s = s || {};
            var c, d = [], f = s.url || "", p = paper.agent, g = p.versionNumber, m = !1, v = s.sourceMaps,
                _ = s.source || r, x = /\r\n|\n|\r/gm, b = s.offset || 0;
            if (v && (p.chrome && g >= 30 || p.webkit && g >= 537.76 || p.firefox && g >= 23 || p.node)) {
                if (p.node) b -= 2; else if (i && f && !i.location.href.indexOf(f)) {
                    var C = n.getElementsByTagName("html")[0].innerHTML;
                    b = C.substr(0, C.indexOf(r) + 1).match(x).length + 1
                }
                m = b > 0 && !(p.chrome && g >= 36 || p.safari && g >= 600 || p.firefox && g >= 40 || p.node);
                var S = ["AA" + function (t) {
                    var e = "";
                    for (t = (Math.abs(t) << 1) + (t < 0 ? 1 : 0); t || !e;) {
                        var i = 31 & t;
                        t >>= 5, t && (i |= 32), e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[i]
                    }
                    return e
                }(m ? 0 : b) + "A"];
                S.length = (r.match(x) || []).length + 1 + (m ? b : 0), c = {
                    version: 3,
                    file: f,
                    names: [],
                    mappings: S.join(";AACA"),
                    sourceRoot: "",
                    sources: [f],
                    sourcesContent: [_]
                }
            }
            return u(e(r, {
                ranges: !0,
                preserveParens: !0
            })), c && (m && (r = new Array(b + 1).join("\n") + r), /^(inline|both)$/.test(v) && (r += "\n//# sourceMappingURL=data:application/json;base64," + t.btoa(unescape(encodeURIComponent(JSON.stringify(c))))), r += "\n//# sourceURL=" + (f || "paperscript")), {
                url: f,
                source: _,
                code: r,
                map: c
            }
        }

        function h(t, e, i) {
            function o(e, i) {
                for (var n in e) !i && /^_/.test(n) || !new RegExp("([\\b\\s\\W]|^)" + n.replace(/\$/g, "\\$") + "\\b").test(t) || (g.push(n), m.push(e[n]))
            }

            paper = e;
            var h, u = e.getView(),
                d = /\btool\.\w+|\s+on(?:Key|Mouse)(?:Up|Down|Move|Drag)\b/.test(t) && !/\bnew\s+Tool\b/.test(t) ? new Q : null,
                f = d ? d._events : [], p = ["onFrame", "onResize"].concat(f), g = [], m = [],
                v = "object" == typeof t ? t : l(t, i);
            t = v.code, o({__$__: s, $__: a, paper: e, view: u, tool: d}, !0), o(e), (p = r.each(p, function (e) {
                new RegExp("\\s+" + e + "\\b").test(t) && (g.push(e), this.push(e + ": " + e))
            }, []).join(", ")) && (t += "\nreturn { " + p + " };");
            var _ = paper.agent;
            if (n && (_.chrome || _.firefox && _.versionNumber < 40)) {
                var y = n.createElement("script"), w = n.head || n.getElementsByTagName("head")[0];
                _.firefox && (t = "\n" + t), y.appendChild(n.createTextNode("paper._execute = function(" + g + ") {" + t + "\n}")), w.appendChild(y), h = paper._execute, delete paper._execute, w.removeChild(y)
            } else h = Function(g, t);
            var x = h.apply(e, m) || {};
            return r.each(f, function (t) {
                var e = x[t];
                e && (d[t] = e)
            }), u && (x.onResize && u.setOnResize(x.onResize), u.emit("resize", {
                size: u.size,
                delta: new c
            }), x.onFrame && u.setOnFrame(x.onFrame), u.requestUpdate()), v
        }

        function u(t) {
            if (/^text\/(?:x-|)paperscript$/.test(t.type) && "true" !== o.getAttribute(t, "ignore")) {
                var e = o.getAttribute(t, "canvas"), i = n.getElementById(e), r = t.src || t.getAttribute("data-src"),
                    s = o.hasAttribute(t, "async");
                if (!i) throw new Error('Unable to find canvas with id "' + e + '"');
                var a = o.get(i.getAttribute("data-paper-scope")) || (new o).setup(i);
                return i.setAttribute("data-paper-scope", a._id), r ? K.request({
                    url: r,
                    async: s,
                    mimeType: "text/plain",
                    onLoad: function (t) {
                        h(t, a, r)
                    }
                }) : h(t.innerHTML, a, t.baseURI), t.setAttribute("data-paper-ignore", "true"), a
            }
        }

        function d() {
            r.each(n && n.getElementsByTagName("script"), u)
        }

        function p(t) {
            return t ? u(t) : d()
        }

        var g = this, m = g.acorn;
        if (!m && "undefined" != typeof require) try {
            m = require("acorn")
        } catch (t) {
        }
        if (!m) {
            var v, _;
            m = v = _ = {}, function (t, e) {
                "object" == typeof v && "object" == typeof _ ? e(v) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.acorn || (t.acorn = {}))
            }(this, function (t) {
                "use strict";

                function e(t) {
                    ct = t || {};
                    for (var e in gt) Object.prototype.hasOwnProperty.call(ct, e) || (ct[e] = gt[e]);
                    pt = ct.sourceFile || null
                }

                function i(t, e) {
                    var i = mt(dt, t);
                    e += " (" + i.line + ":" + i.column + ")";
                    var n = new SyntaxError(e);
                    throw n.pos = t, n.loc = i, n.raisedAt = vt, n
                }

                function n(t) {
                    function e(t) {
                        if (1 == t.length) return i += "return str === " + JSON.stringify(t[0]) + ";";
                        i += "switch(str){";
                        for (var e = 0; e < t.length; ++e) i += "case " + JSON.stringify(t[e]) + ":";
                        i += "return true}return false;"
                    }

                    t = t.split(" ");
                    var i = "", n = [];
                    t:for (var r = 0; r < t.length; ++r) {
                        for (var s = 0; s < n.length; ++s) if (n[s][0].length == t[r].length) {
                            n[s].push(t[r]);
                            continue t
                        }
                        n.push([t[r]])
                    }
                    if (n.length > 3) {
                        n.sort(function (t, e) {
                            return e.length - t.length
                        }), i += "switch(str.length){";
                        for (var r = 0; r < n.length; ++r) {
                            var o = n[r];
                            i += "case " + o[0].length + ":", e(o)
                        }
                        i += "}"
                    } else e(t);
                    return new Function("str", i)
                }

                function r() {
                    this.line = Tt, this.column = vt - Et
                }

                function s() {
                    Tt = 1, vt = Et = 0, St = !0, h()
                }

                function o(t, e) {
                    yt = vt, ct.locations && (xt = new r), bt = t, h(), Ct = e, St = t.beforeExpr
                }

                function a() {
                    var t = ct.onComment && ct.locations && new r, e = vt, n = dt.indexOf("*/", vt += 2);
                    if (-1 === n && i(vt - 2, "Unterminated comment"), vt = n + 2, ct.locations) {
                        Ge.lastIndex = e;
                        for (var s; (s = Ge.exec(dt)) && s.index < vt;) ++Tt, Et = s.index + s[0].length
                    }
                    ct.onComment && ct.onComment(!0, dt.slice(e + 2, n), e, vt, t, ct.locations && new r)
                }

                function l() {
                    for (var t = vt, e = ct.onComment && ct.locations && new r, i = dt.charCodeAt(vt += 2); vt < ft && 10 !== i && 13 !== i && 8232 !== i && 8233 !== i;) ++vt, i = dt.charCodeAt(vt);
                    ct.onComment && ct.onComment(!1, dt.slice(t + 2, vt), t, vt, e, ct.locations && new r)
                }

                function h() {
                    for (; vt < ft;) {
                        var t = dt.charCodeAt(vt);
                        if (32 === t) ++vt; else if (13 === t) {
                            ++vt;
                            var e = dt.charCodeAt(vt);
                            10 === e && ++vt, ct.locations && (++Tt, Et = vt)
                        } else if (10 === t || 8232 === t || 8233 === t) ++vt, ct.locations && (++Tt, Et = vt); else if (t > 8 && t < 14) ++vt; else if (47 === t) {
                            var e = dt.charCodeAt(vt + 1);
                            if (42 === e) a(); else {
                                if (47 !== e) break;
                                l()
                            }
                        } else if (160 === t) ++vt; else {
                            if (!(t >= 5760 && Ve.test(String.fromCharCode(t)))) break;
                            ++vt
                        }
                    }
                }

                function u() {
                    var t = dt.charCodeAt(vt + 1);
                    return t >= 48 && t <= 57 ? S(!0) : (++vt, o(we))
                }

                function c() {
                    var t = dt.charCodeAt(vt + 1);
                    return St ? (++vt, x()) : 61 === t ? w(Se, 2) : w(be, 1)
                }

                function d() {
                    return 61 === dt.charCodeAt(vt + 1) ? w(Se, 2) : w(Fe, 1)
                }

                function f(t) {
                    var e = dt.charCodeAt(vt + 1);
                    return e === t ? w(124 === t ? ke : Pe, 2) : 61 === e ? w(Se, 2) : w(124 === t ? Ae : Ie, 1)
                }

                function p() {
                    return 61 === dt.charCodeAt(vt + 1) ? w(Se, 2) : w(ze, 1)
                }

                function g(t) {
                    var e = dt.charCodeAt(vt + 1);
                    return e === t ? 45 == e && 62 == dt.charCodeAt(vt + 2) && Ze.test(dt.slice(Pt, vt)) ? (vt += 3, l(), h(), y()) : w(Te, 2) : 61 === e ? w(Se, 2) : w(Ne, 1)
                }

                function m(t) {
                    var e = dt.charCodeAt(vt + 1), i = 1;
                    return e === t ? (i = 62 === t && 62 === dt.charCodeAt(vt + 2) ? 3 : 2, 61 === dt.charCodeAt(vt + i) ? w(Se, i + 1) : w(Le, i)) : 33 == e && 60 == t && 45 == dt.charCodeAt(vt + 2) && 45 == dt.charCodeAt(vt + 3) ? (vt += 4, l(), h(), y()) : (61 === e && (i = 61 === dt.charCodeAt(vt + 2) ? 3 : 2), w(Oe, i))
                }

                function v(t) {
                    return 61 === dt.charCodeAt(vt + 1) ? w(Me, 61 === dt.charCodeAt(vt + 2) ? 3 : 2) : w(61 === t ? Ce : Ee, 1)
                }

                function _(t) {
                    switch (t) {
                        case 46:
                            return u();
                        case 40:
                            return ++vt, o(ge);
                        case 41:
                            return ++vt, o(me);
                        case 59:
                            return ++vt, o(_e);
                        case 44:
                            return ++vt, o(ve);
                        case 91:
                            return ++vt, o(ce);
                        case 93:
                            return ++vt, o(de);
                        case 123:
                            return ++vt, o(fe);
                        case 125:
                            return ++vt, o(pe);
                        case 58:
                            return ++vt, o(ye);
                        case 63:
                            return ++vt, o(xe);
                        case 48:
                            var e = dt.charCodeAt(vt + 1);
                            if (120 === e || 88 === e) return C();
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                            return S(!1);
                        case 34:
                        case 39:
                            return T(t);
                        case 47:
                            return c(t);
                        case 37:
                        case 42:
                            return d();
                        case 124:
                        case 38:
                            return f(t);
                        case 94:
                            return p();
                        case 43:
                        case 45:
                            return g(t);
                        case 60:
                        case 62:
                            return m(t);
                        case 61:
                        case 33:
                            return v(t);
                        case 126:
                            return w(Ee, 1)
                    }
                    return !1
                }

                function y(t) {
                    if (t ? vt = _t + 1 : _t = vt, ct.locations && (wt = new r), t) return x();
                    if (vt >= ft) return o(qt);
                    var e = dt.charCodeAt(vt);
                    if ($e(e) || 92 === e) return P();
                    var n = _(e);
                    if (!1 === n) {
                        var s = String.fromCharCode(e);
                        if ("\\" === s || Ye.test(s)) return P();
                        i(vt, "Unexpected character '" + s + "'")
                    }
                    return n
                }

                function w(t, e) {
                    var i = dt.slice(vt, vt + e);
                    vt += e, o(t, i)
                }

                function x() {
                    for (var t, e, n = "", r = vt; ;) {
                        vt >= ft && i(r, "Unterminated regular expression");
                        var s = dt.charAt(vt);
                        if (Ze.test(s) && i(r, "Unterminated regular expression"), t) t = !1; else {
                            if ("[" === s) e = !0; else if ("]" === s && e) e = !1; else if ("/" === s && !e) break;
                            t = "\\" === s
                        }
                        ++vt
                    }
                    var n = dt.slice(r, vt);
                    ++vt;
                    var a = k();
                    a && !/^[gmsiy]*$/.test(a) && i(r, "Invalid regexp flag");
                    try {
                        var l = new RegExp(n, a)
                    } catch (t) {
                        t instanceof SyntaxError && i(r, t.message), i(t)
                    }
                    return o(Nt, l)
                }

                function b(t, e) {
                    for (var i = vt, n = 0, r = 0, s = null == e ? 1 / 0 : e; r < s; ++r) {
                        var o, a = dt.charCodeAt(vt);
                        if ((o = a >= 97 ? a - 97 + 10 : a >= 65 ? a - 65 + 10 : a >= 48 && a <= 57 ? a - 48 : 1 / 0) >= t) break;
                        ++vt, n = n * t + o
                    }
                    return vt === i || null != e && vt - i !== e ? null : n
                }

                function C() {
                    vt += 2;
                    var t = b(16);
                    return null == t && i(_t + 2, "Expected hexadecimal number"), $e(dt.charCodeAt(vt)) && i(vt, "Identifier directly after number"), o(Lt, t)
                }

                function S(t) {
                    var e = vt, n = !1, r = 48 === dt.charCodeAt(vt);
                    t || null !== b(10) || i(e, "Invalid number"), 46 === dt.charCodeAt(vt) && (++vt, b(10), n = !0);
                    var s = dt.charCodeAt(vt);
                    69 !== s && 101 !== s || (s = dt.charCodeAt(++vt), 43 !== s && 45 !== s || ++vt, null === b(10) && i(e, "Invalid number"), n = !0), $e(dt.charCodeAt(vt)) && i(vt, "Identifier directly after number");
                    var a, l = dt.slice(e, vt);
                    return n ? a = parseFloat(l) : r && 1 !== l.length ? /[89]/.test(l) || Mt ? i(e, "Invalid number") : a = parseInt(l, 8) : a = parseInt(l, 10), o(Lt, a)
                }

                function T(t) {
                    vt++;
                    for (var e = ""; ;) {
                        vt >= ft && i(_t, "Unterminated string constant");
                        var n = dt.charCodeAt(vt);
                        if (n === t) return ++vt, o(Ft, e);
                        if (92 === n) {
                            n = dt.charCodeAt(++vt);
                            var r = /^[0-7]+/.exec(dt.slice(vt, vt + 3));
                            for (r && (r = r[0]); r && parseInt(r, 8) > 255;) r = r.slice(0, -1);
                            if ("0" === r && (r = null), ++vt, r) Mt && i(vt - 2, "Octal literal in strict mode"), e += String.fromCharCode(parseInt(r, 8)), vt += r.length - 1; else switch (n) {
                                case 110:
                                    e += "\n";
                                    break;
                                case 114:
                                    e += "\r";
                                    break;
                                case 120:
                                    e += String.fromCharCode(E(2));
                                    break;
                                case 117:
                                    e += String.fromCharCode(E(4));
                                    break;
                                case 85:
                                    e += String.fromCharCode(E(8));
                                    break;
                                case 116:
                                    e += "\t";
                                    break;
                                case 98:
                                    e += "\b";
                                    break;
                                case 118:
                                    e += "\v";
                                    break;
                                case 102:
                                    e += "\f";
                                    break;
                                case 48:
                                    e += "\0";
                                    break;
                                case 13:
                                    10 === dt.charCodeAt(vt) && ++vt;
                                case 10:
                                    ct.locations && (Et = vt, ++Tt);
                                    break;
                                default:
                                    e += String.fromCharCode(n)
                            }
                        } else 13 !== n && 10 !== n && 8232 !== n && 8233 !== n || i(_t, "Unterminated string constant"), e += String.fromCharCode(n), ++vt
                    }
                }

                function E(t) {
                    var e = b(16, t);
                    return null === e && i(_t, "Bad character escape sequence"), e
                }

                function k() {
                    qe = !1;
                    for (var t, e = !0, n = vt; ;) {
                        var r = dt.charCodeAt(vt);
                        if (Je(r)) qe && (t += dt.charAt(vt)), ++vt; else {
                            if (92 !== r) break;
                            qe || (t = dt.slice(n, vt)), qe = !0, 117 != dt.charCodeAt(++vt) && i(vt, "Expecting Unicode escape sequence \\uXXXX"), ++vt;
                            var s = E(4), o = String.fromCharCode(s);
                            o || i(vt - 1, "Invalid Unicode escape"), (e ? $e(s) : Je(s)) || i(vt - 4, "Invalid Unicode escape"), t += o
                        }
                        e = !1
                    }
                    return qe ? t : dt.slice(n, vt)
                }

                function P() {
                    var t = k(), e = Dt;
                    return !qe && We(t) && (e = ue[t]), o(e, t)
                }

                function A() {
                    kt = _t, Pt = yt, At = xt, y()
                }

                function z(t) {
                    if (Mt = t, vt = _t,
                        ct.locations) for (; vt < Et;) Et = dt.lastIndexOf("\n", Et - 2) + 1, --Tt;
                    h(), y()
                }

                function I() {
                    this.type = null, this.start = _t, this.end = null
                }

                function M() {
                    this.start = wt, this.end = null, null !== pt && (this.source = pt)
                }

                function O() {
                    var t = new I;
                    return ct.locations && (t.loc = new M), ct.directSourceFile && (t.sourceFile = ct.directSourceFile), ct.ranges && (t.range = [_t, 0]), t
                }

                function L(t) {
                    var e = new I;
                    return e.start = t.start, ct.locations && (e.loc = new M, e.loc.start = t.loc.start), ct.ranges && (e.range = [t.range[0], 0]), e
                }

                function N(t, e) {
                    return t.type = e, t.end = Pt, ct.locations && (t.loc.end = At), ct.ranges && (t.range[1] = Pt), t
                }

                function F(t) {
                    return ct.ecmaVersion >= 5 && "ExpressionStatement" === t.type && "Literal" === t.expression.type && "use strict" === t.expression.value
                }

                function D(t) {
                    if (bt === t) return A(), !0
                }

                function q() {
                    return !ct.strictSemicolons && (bt === qt || bt === pe || Ze.test(dt.slice(Pt, _t)))
                }

                function R() {
                    D(_e) || q() || B()
                }

                function H(t) {
                    bt === t ? A() : B()
                }

                function B() {
                    i(_t, "Unexpected token")
                }

                function j(t) {
                    "Identifier" !== t.type && "MemberExpression" !== t.type && i(t.start, "Assigning to rvalue"), Mt && "Identifier" === t.type && je(t.name) && i(t.start, "Assigning to " + t.name + " in strict mode")
                }

                function W(t) {
                    kt = Pt = vt, ct.locations && (At = new r), zt = Mt = null, It = [], y();
                    var e = t || O(), i = !0;
                    for (t || (e.body = []); bt !== qt;) {
                        var n = V();
                        e.body.push(n), i && F(n) && z(!0), i = !1
                    }
                    return N(e, "Program")
                }

                function V() {
                    (bt === be || bt === Se && "/=" == Ct) && y(!0);
                    var t = bt, e = O();
                    switch (t) {
                        case Rt:
                        case jt:
                            A();
                            var n = t === Rt;
                            D(_e) || q() ? e.label = null : bt !== Dt ? B() : (e.label = ut(), R());
                            for (var r = 0; r < It.length; ++r) {
                                var s = It[r];
                                if (null == e.label || s.name === e.label.name) {
                                    if (null != s.kind && (n || "loop" === s.kind)) break;
                                    if (e.label && n) break
                                }
                            }
                            return r === It.length && i(e.start, "Unsyntactic " + t.keyword), N(e, n ? "BreakStatement" : "ContinueStatement");
                        case Wt:
                            return A(), R(), N(e, "DebuggerStatement");
                        case Ut:
                            return A(), It.push(Qe), e.body = V(), It.pop(), H(ie), e.test = U(), R(), N(e, "DoWhileStatement");
                        case Zt:
                            if (A(), It.push(Qe), H(ge), bt === _e) return X(e, null);
                            if (bt === ee) {
                                var o = O();
                                return A(), G(o, !0), N(o, "VariableDeclaration"), 1 === o.declarations.length && D(he) ? Z(e, o) : X(e, o)
                            }
                            var o = $(!1, !0);
                            return D(he) ? (j(o), Z(e, o)) : X(e, o);
                        case Gt:
                            return A(), lt(e, !0);
                        case $t:
                            return A(), e.test = U(), e.consequent = V(), e.alternate = D(Yt) ? V() : null, N(e, "IfStatement");
                        case Jt:
                            return zt || ct.allowReturnOutsideFunction || i(_t, "'return' outside of function"), A(), D(_e) || q() ? e.argument = null : (e.argument = $(), R()), N(e, "ReturnStatement");
                        case Qt:
                            A(), e.discriminant = U(), e.cases = [], H(fe), It.push(Ke);
                            for (var a, l; bt != pe;) if (bt === Ht || bt === Vt) {
                                var h = bt === Ht;
                                a && N(a, "SwitchCase"), e.cases.push(a = O()), a.consequent = [], A(), h ? a.test = $() : (l && i(kt, "Multiple default clauses"), l = !0, a.test = null), H(ye)
                            } else a || B(), a.consequent.push(V());
                            return a && N(a, "SwitchCase"), A(), It.pop(), N(e, "SwitchStatement");
                        case Kt:
                            return A(), Ze.test(dt.slice(Pt, _t)) && i(Pt, "Illegal newline after throw"), e.argument = $(), R(), N(e, "ThrowStatement");
                        case te:
                            if (A(), e.block = Y(), e.handler = null, bt === Bt) {
                                var u = O();
                                A(), H(ge), u.param = ut(), Mt && je(u.param.name) && i(u.param.start, "Binding " + u.param.name + " in strict mode"), H(me), u.guard = null, u.body = Y(), e.handler = N(u, "CatchClause")
                            }
                            return e.guardedHandlers = Ot, e.finalizer = D(Xt) ? Y() : null, e.handler || e.finalizer || i(e.start, "Missing catch or finally clause"), N(e, "TryStatement");
                        case ee:
                            return A(), G(e), R(), N(e, "VariableDeclaration");
                        case ie:
                            return A(), e.test = U(), It.push(Qe), e.body = V(), It.pop(), N(e, "WhileStatement");
                        case ne:
                            return Mt && i(_t, "'with' in strict mode"), A(), e.object = U(), e.body = V(), N(e, "WithStatement");
                        case fe:
                            return Y();
                        case _e:
                            return A(), N(e, "EmptyStatement");
                        default:
                            var c = Ct, d = $();
                            if (t === Dt && "Identifier" === d.type && D(ye)) {
                                for (var r = 0; r < It.length; ++r) It[r].name === c && i(d.start, "Label '" + c + "' is already declared");
                                var f = bt.isLoop ? "loop" : bt === Qt ? "switch" : null;
                                return It.push({
                                    name: c,
                                    kind: f
                                }), e.body = V(), It.pop(), e.label = d, N(e, "LabeledStatement")
                            }
                            return e.expression = d, R(), N(e, "ExpressionStatement")
                    }
                }

                function U() {
                    H(ge);
                    var t = $();
                    return H(me), t
                }

                function Y(t) {
                    var e, i = O(), n = !0, r = !1;
                    for (i.body = [], H(fe); !D(pe);) {
                        var s = V();
                        i.body.push(s), n && t && F(s) && (e = r, z(r = !0)), n = !1
                    }
                    return r && !e && z(!1), N(i, "BlockStatement")
                }

                function X(t, e) {
                    return t.init = e, H(_e), t.test = bt === _e ? null : $(), H(_e), t.update = bt === me ? null : $(), H(me), t.body = V(), It.pop(), N(t, "ForStatement")
                }

                function Z(t, e) {
                    return t.left = e, t.right = $(), H(me), t.body = V(), It.pop(), N(t, "ForInStatement")
                }

                function G(t, e) {
                    for (t.declarations = [], t.kind = "var"; ;) {
                        var n = O();
                        if (n.id = ut(), Mt && je(n.id.name) && i(n.id.start, "Binding " + n.id.name + " in strict mode"), n.init = D(Ce) ? $(!0, e) : null, t.declarations.push(N(n, "VariableDeclarator")), !D(ve)) break
                    }
                    return t
                }

                function $(t, e) {
                    var i = J(e);
                    if (!t && bt === ve) {
                        var n = L(i);
                        for (n.expressions = [i]; D(ve);) n.expressions.push(J(e));
                        return N(n, "SequenceExpression")
                    }
                    return i
                }

                function J(t) {
                    var e = Q(t);
                    if (bt.isAssign) {
                        var i = L(e);
                        return i.operator = Ct, i.left = e, A(), i.right = J(t), j(e), N(i, "AssignmentExpression")
                    }
                    return e
                }

                function Q(t) {
                    var e = K(t);
                    if (D(xe)) {
                        var i = L(e);
                        return i.test = e, i.consequent = $(!0), H(ye), i.alternate = $(!0, t), N(i, "ConditionalExpression")
                    }
                    return e
                }

                function K(t) {
                    return tt(et(), -1, t)
                }

                function tt(t, e, i) {
                    var n = bt.binop;
                    if (null != n && (!i || bt !== he) && n > e) {
                        var r = L(t);
                        r.left = t, r.operator = Ct;
                        var s = bt;
                        A(), r.right = tt(et(), n, i);
                        return tt(N(r, s === ke || s === Pe ? "LogicalExpression" : "BinaryExpression"), e, i)
                    }
                    return t
                }

                function et() {
                    if (bt.prefix) {
                        var t = O(), e = bt.isUpdate;
                        return t.operator = Ct, t.prefix = !0, St = !0, A(), t.argument = et(), e ? j(t.argument) : Mt && "delete" === t.operator && "Identifier" === t.argument.type && i(t.start, "Deleting local variable in strict mode"), N(t, e ? "UpdateExpression" : "UnaryExpression")
                    }
                    for (var n = it(); bt.postfix && !q();) {
                        var t = L(n);
                        t.operator = Ct, t.prefix = !1, t.argument = n, j(n), A(), n = N(t, "UpdateExpression")
                    }
                    return n
                }

                function it() {
                    return nt(rt())
                }

                function nt(t, e) {
                    if (D(we)) {
                        var i = L(t);
                        return i.object = t, i.property = ut(!0), i.computed = !1, nt(N(i, "MemberExpression"), e)
                    }
                    if (D(ce)) {
                        var i = L(t);
                        return i.object = t, i.property = $(), i.computed = !0, H(de), nt(N(i, "MemberExpression"), e)
                    }
                    if (!e && D(ge)) {
                        var i = L(t);
                        return i.callee = t, i.arguments = ht(me, !1), nt(N(i, "CallExpression"), e)
                    }
                    return t
                }

                function rt() {
                    switch (bt) {
                        case se:
                            var t = O();
                            return A(), N(t, "ThisExpression");
                        case Dt:
                            return ut();
                        case Lt:
                        case Ft:
                        case Nt:
                            var t = O();
                            return t.value = Ct, t.raw = dt.slice(_t, yt), A(), N(t, "Literal");
                        case oe:
                        case ae:
                        case le:
                            var t = O();
                            return t.value = bt.atomValue, t.raw = bt.keyword, A(), N(t, "Literal");
                        case ge:
                            var e = wt, i = _t;
                            A();
                            var n = $();
                            return n.start = i, n.end = yt, ct.locations && (n.loc.start = e, n.loc.end = xt), ct.ranges && (n.range = [i, yt]), H(me), n;
                        case ce:
                            var t = O();
                            return A(), t.elements = ht(de, !0, !0), N(t, "ArrayExpression");
                        case fe:
                            return ot();
                        case Gt:
                            var t = O();
                            return A(), lt(t, !1);
                        case re:
                            return st();
                        default:
                            B()
                    }
                }

                function st() {
                    var t = O();
                    return A(), t.callee = nt(rt(), !0), D(ge) ? t.arguments = ht(me, !1) : t.arguments = Ot, N(t, "NewExpression")
                }

                function ot() {
                    var t = O(), e = !0, n = !1;
                    for (t.properties = [], A(); !D(pe);) {
                        if (e) e = !1; else if (H(ve), ct.allowTrailingCommas && D(pe)) break;
                        var r, s = {key: at()}, o = !1;
                        if (D(ye) ? (s.value = $(!0), r = s.kind = "init") : ct.ecmaVersion >= 5 && "Identifier" === s.key.type && ("get" === s.key.name || "set" === s.key.name) ? (o = n = !0, r = s.kind = s.key.name, s.key = at(), bt !== ge && B(), s.value = lt(O(), !1)) : B(), "Identifier" === s.key.type && (Mt || n)) for (var a = 0; a < t.properties.length; ++a) {
                            var l = t.properties[a];
                            if (l.key.name === s.key.name) {
                                var h = r == l.kind || o && "init" === l.kind || "init" === r && ("get" === l.kind || "set" === l.kind);
                                h && !Mt && "init" === r && "init" === l.kind && (h = !1), h && i(s.key.start, "Redefinition of property")
                            }
                        }
                        t.properties.push(s)
                    }
                    return N(t, "ObjectExpression")
                }

                function at() {
                    return bt === Lt || bt === Ft ? rt() : ut(!0)
                }

                function lt(t, e) {
                    bt === Dt ? t.id = ut() : e ? B() : t.id = null, t.params = [];
                    var n = !0;
                    for (H(ge); !D(me);) n ? n = !1 : H(ve), t.params.push(ut());
                    var r = zt, s = It;
                    if (zt = !0, It = [], t.body = Y(!0), zt = r, It = s, Mt || t.body.body.length && F(t.body.body[0])) for (var o = t.id ? -1 : 0; o < t.params.length; ++o) {
                        var a = o < 0 ? t.id : t.params[o];
                        if ((Be(a.name) || je(a.name)) && i(a.start, "Defining '" + a.name + "' in strict mode"), o >= 0) for (var l = 0; l < o; ++l) a.name === t.params[l].name && i(a.start, "Argument name clash in strict mode")
                    }
                    return N(t, e ? "FunctionDeclaration" : "FunctionExpression")
                }

                function ht(t, e, i) {
                    for (var n = [], r = !0; !D(t);) {
                        if (r) r = !1; else if (H(ve), e && ct.allowTrailingCommas && D(t)) break;
                        i && bt === ve ? n.push(null) : n.push($(!0))
                    }
                    return n
                }

                function ut(t) {
                    var e = O();
                    return t && "everywhere" == ct.forbidReserved && (t = !1), bt === Dt ? (!t && (ct.forbidReserved && (3 === ct.ecmaVersion ? Re : He)(Ct) || Mt && Be(Ct)) && -1 == dt.slice(_t, yt).indexOf("\\") && i(_t, "The keyword '" + Ct + "' is reserved"), e.name = Ct) : t && bt.keyword ? e.name = bt.keyword : B(), St = !1, A(), N(e, "Identifier")
                }

                t.version = "0.5.0";
                var ct, dt, ft, pt;
                t.parse = function (t, i) {
                    return dt = String(t), ft = dt.length, e(i), s(), W(ct.program)
                };
                var gt = t.defaultOptions = {
                    ecmaVersion: 5,
                    strictSemicolons: !1,
                    allowTrailingCommas: !0,
                    forbidReserved: !1,
                    allowReturnOutsideFunction: !1,
                    locations: !1,
                    onComment: null,
                    ranges: !1,
                    program: null,
                    sourceFile: null,
                    directSourceFile: null
                }, mt = t.getLineInfo = function (t, e) {
                    for (var i = 1, n = 0; ;) {
                        Ge.lastIndex = n;
                        var r = Ge.exec(t);
                        if (!(r && r.index < e)) break;
                        ++i, n = r.index + r[0].length
                    }
                    return {line: i, column: e - n}
                };
                t.tokenize = function (t, i) {
                    function n(t) {
                        return Pt = yt, y(t), r.start = _t, r.end = yt, r.startLoc = wt, r.endLoc = xt, r.type = bt, r.value = Ct, r
                    }

                    dt = String(t), ft = dt.length, e(i), s();
                    var r = {};
                    return n.jumpTo = function (t, e) {
                        if (vt = t, ct.locations) {
                            Tt = 1, Et = Ge.lastIndex = 0;
                            for (var i; (i = Ge.exec(dt)) && i.index < t;) ++Tt, Et = i.index + i[0].length
                        }
                        St = e, h()
                    }, n
                };
                var vt, _t, yt, wt, xt, bt, Ct, St, Tt, Et, kt, Pt, At, zt, It, Mt, Ot = [], Lt = {type: "num"},
                    Nt = {type: "regexp"}, Ft = {type: "string"}, Dt = {type: "name"}, qt = {type: "eof"},
                    Rt = {keyword: "break"}, Ht = {keyword: "case", beforeExpr: !0}, Bt = {keyword: "catch"},
                    jt = {keyword: "continue"}, Wt = {keyword: "debugger"}, Vt = {keyword: "default"},
                    Ut = {keyword: "do", isLoop: !0}, Yt = {keyword: "else", beforeExpr: !0}, Xt = {keyword: "finally"},
                    Zt = {keyword: "for", isLoop: !0}, Gt = {keyword: "function"}, $t = {keyword: "if"},
                    Jt = {keyword: "return", beforeExpr: !0}, Qt = {keyword: "switch"},
                    Kt = {keyword: "throw", beforeExpr: !0}, te = {keyword: "try"}, ee = {keyword: "var"},
                    ie = {keyword: "while", isLoop: !0}, ne = {keyword: "with"}, re = {keyword: "new", beforeExpr: !0},
                    se = {keyword: "this"}, oe = {keyword: "null", atomValue: null},
                    ae = {keyword: "true", atomValue: !0}, le = {keyword: "false", atomValue: !1},
                    he = {keyword: "in", binop: 7, beforeExpr: !0}, ue = {
                        break: Rt,
                        case: Ht,
                        catch: Bt,
                        continue: jt,
                        debugger: Wt,
                        default: Vt,
                        do: Ut,
                        else: Yt,
                        finally: Xt,
                        for: Zt,
                        function: Gt,
                        if: $t,
                        return: Jt,
                        switch: Qt,
                        throw: Kt,
                        try: te,
                        var: ee,
                        while: ie,
                        with: ne,
                        null: oe,
                        true: ae,
                        false: le,
                        new: re,
                        in: he,
                        instanceof: {keyword: "instanceof", binop: 7, beforeExpr: !0},
                        this: se,
                        typeof: {keyword: "typeof", prefix: !0, beforeExpr: !0},
                        void: {keyword: "void", prefix: !0, beforeExpr: !0},
                        delete: {keyword: "delete", prefix: !0, beforeExpr: !0}
                    }, ce = {type: "[", beforeExpr: !0}, de = {type: "]"}, fe = {type: "{", beforeExpr: !0},
                    pe = {type: "}"}, ge = {type: "(", beforeExpr: !0}, me = {type: ")"},
                    ve = {type: ",", beforeExpr: !0}, _e = {type: ";", beforeExpr: !0},
                    ye = {type: ":", beforeExpr: !0}, we = {type: "."}, xe = {type: "?", beforeExpr: !0},
                    be = {binop: 10, beforeExpr: !0}, Ce = {isAssign: !0, beforeExpr: !0},
                    Se = {isAssign: !0, beforeExpr: !0}, Te = {postfix: !0, prefix: !0, isUpdate: !0},
                    Ee = {prefix: !0, beforeExpr: !0}, ke = {binop: 1, beforeExpr: !0}, Pe = {binop: 2, beforeExpr: !0},
                    Ae = {binop: 3, beforeExpr: !0}, ze = {binop: 4, beforeExpr: !0}, Ie = {binop: 5, beforeExpr: !0},
                    Me = {binop: 6, beforeExpr: !0}, Oe = {binop: 7, beforeExpr: !0}, Le = {binop: 8, beforeExpr: !0},
                    Ne = {binop: 9, prefix: !0, beforeExpr: !0}, Fe = {binop: 10, beforeExpr: !0};
                t.tokTypes = {
                    bracketL: ce,
                    bracketR: de,
                    braceL: fe,
                    braceR: pe,
                    parenL: ge,
                    parenR: me,
                    comma: ve,
                    semi: _e,
                    colon: ye,
                    dot: we,
                    question: xe,
                    slash: be,
                    eq: Ce,
                    name: Dt,
                    eof: qt,
                    num: Lt,
                    regexp: Nt,
                    string: Ft
                };
                for (var De in ue) t.tokTypes["_" + De] = ue[De];
                var qe,
                    Re = n("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"),
                    He = n("class enum extends super const export import"),
                    Be = n("implements interface let package private protected public static yield"),
                    je = n("eval arguments"),
                    We = n("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"),
                    Ve = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
                    Ue = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",
                    Ye = new RegExp("[" + Ue + "]"),
                    Xe = new RegExp("[" + Ue + "̀-ͯ҃-֑҇-ׇֽֿׁׂׅׄؐ-ؚؠ-ىٲ-ۓۧ-ۨۻ-ۼܰ-݊ࠀ-ࠔࠛ-ࠣࠥ-ࠧࠩ-࠭ࡀ-ࡗࣤ-ࣾऀ-ःऺ-़ा-ॏ॑-ॗॢ-ॣ०-९ঁ-ঃ়া-ৄেৈৗয়-ৠਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢ-ૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୟ-ୠ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఁ-ఃె-ైొ-్ౕౖౢ-ౣ౦-౯ಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢ-ೣ೦-೯ംഃെ-ൈൗൢ-ൣ൦-൯ංඃ්ා-ුූෘ-ෟෲෳิ-ฺเ-ๅ๐-๙ິ-ູ່-ໍ໐-໙༘༙༠-༩༹༵༷ཁ-ཇཱ-྄྆-྇ྍ-ྗྙ-ྼ࿆က-ဩ၀-၉ၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟ᜎ-ᜐᜠ-ᜰᝀ-ᝐᝲᝳក-ឲ៝០-៩᠋-᠍᠐-᠙ᤠ-ᤫᤰ-᤻ᥑ-ᥭᦰ-ᧀᧈ-ᧉ᧐-᧙ᨀ-ᨕᨠ-ᩓ᩠-᩿᩼-᪉᪐-᪙ᭆ-ᭋ᭐-᭙᭫-᭳᮰-᮹᯦-᯳ᰀ-ᰢ᱀-᱉ᱛ-ᱽ᳐-᳒ᴀ-ᶾḁ-ἕ‌‍‿⁀⁔⃐-⃥⃜⃡-⃰ⶁ-ⶖⷠ-ⷿ〡-〨゙゚Ꙁ-ꙭꙴ-꙽ꚟ꛰-꛱ꟸ-ꠀ꠆ꠋꠣ-ꠧꢀ-ꢁꢴ-꣄꣐-꣙ꣳ-ꣷ꤀-꤉ꤦ-꤭ꤰ-ꥅꦀ-ꦃ꦳-꧀ꨀ-ꨧꩀ-ꩁꩌ-ꩍ꩐-꩙ꩻꫠ-ꫩꫲ-ꫳꯀ-ꯡ꯬꯭꯰-꯹ﬠ-ﬨ︀-️︠-︦︳︴﹍-﹏０-９＿]"),
                    Ze = /[\n\r\u2028\u2029]/, Ge = /\r\n|[\n\r\u2028\u2029]/g,
                    $e = t.isIdentifierStart = function (t) {
                        return t < 65 ? 36 === t : t < 91 || (t < 97 ? 95 === t : t < 123 || t >= 170 && Ye.test(String.fromCharCode(t)))
                    }, Je = t.isIdentifierChar = function (t) {
                        return t < 48 ? 36 === t : t < 58 || !(t < 65) && (t < 91 || (t < 97 ? 95 === t : t < 123 || t >= 170 && Xe.test(String.fromCharCode(t))))
                    }, Qe = {kind: "loop"}, Ke = {kind: "switch"}
            }), m.version || (m = null)
        }
        var y = {
                "+": "__add",
                "-": "__subtract",
                "*": "__multiply",
                "/": "__divide",
                "%": "__modulo",
                "==": "__equals",
                "!=": "__equals"
            }, w = {"-": "__negate", "+": "__self"},
            x = r.each(["add", "subtract", "multiply", "divide", "modulo", "equals", "negate"], function (t) {
                this["__" + t] = "#" + t
            }, {
                __self: function () {
                    return this
                }
            });
        return c.inject(x), f.inject(x), R.inject(x), i && ("complete" === n.readyState ? setTimeout(d) : V.add(i, {load: d})), {
            compile: l,
            execute: h,
            load: p,
            parse: e
        }
    }.call(this), paper = new (o.inject(r.exports, {
        Base: r,
        Numerical: h,
        Key: G,
        DomEvent: V,
        DomElement: W,
        document: n,
        window: i,
        Symbol: E,
        PlacedSymbol: T
    })), paper.agent.node && require("./node/extend.js")(paper), "function" == typeof define && define.amd ? define("paper", paper) : "object" == typeof module && module && (module.exports = paper), paper
}.call(this, "object" == typeof self ? self : null);
!function t(e, i, n) {
    function r(o, a) {
        if (!i[o]) {
            if (!e[o]) {
                var l = "function" == typeof require && require;
                if (!a && l) return l(o, !0);
                if (s) return s(o, !0);
                var h = new Error("Cannot find module '" + o + "'");
                throw h.code = "MODULE_NOT_FOUND", h
            }
            var u = i[o] = {exports: {}};
            e[o][0].call(u.exports, function (t) {
                return r(e[o][1][t] || t)
            }, u, u.exports, t, e, i, n)
        }
        return i[o].exports
    }

    for (var s = "function" == typeof require && require, o = 0; o < n.length; o++) r(n[o]);
    return r
}({
    1: [function (t, e, i) {
    }, {}],
    2: [function (t, e, i) {
        "use strict";

        function n(t) {
            var e = {
                duration: 400,
                delay: 0,
                repeat: 0,
                easing: "linear",
                complete: void 0,
                step: void 0,
                mode: "onFrame"
            };
            return void 0 === t && (t = {}), void 0 === t.duration ? t.duration = e.duration : (t.duration = Number(t.duration), t.duration < 0 && (t.duration = e.duration)), void 0 === t.delay ? t.delay = e.delay : (t.delay = Number(t.delay), t.delay < 1 && (t.delay = e.delay)), void 0 === t.repeat ? t.repeat = e.repeat : "function" == typeof t.repeat || !0 !== t.repeat && (t.repeat = Number(t.repeat), t.repeat < 0 && (t.repeat = e.repeat)), void 0 === t.easing && (t.easing = e.easing), "function" == typeof t.easing ? t.easingFunction = t.easing : void 0 !== o.easing[t.easing] && o.easing.hasOwnProperty(t.easing) ? t.easingFunction = o.easing[t.easing] : (t.easing = e.easing, t.easingFunction = o.easing[e.easing]), "function" != typeof t.complete && (t.complete = void 0), "function" != typeof t.step && (t.step = void 0), -1 === ["onFrame", "timeout"].indexOf(t.mode) && (t.mode = e.mode), t
        }

        i.__esModule = !0;
        var r = (t("./getPaper"), t("./tween")), s = t("./frameManager"), o = t("./easing"), a = function () {
            function t(e, i, o, a) {
                var l = this;
                if (this.stopped = !1, this.startTime = (new Date).getTime(), this.settings = n(o), this.item = e, this.itemForAnimations = this.settings.parentItem || this.item, this.repeat = this.settings.repeat || 0, "function" == typeof this.settings.repeat) {
                    var h = this.settings.repeat;
                    this.repeatCallback = function () {
                        return h(e, l) ? new t(e, i, o, a) : null
                    }
                } else (!0 === this.repeat || this.repeat > 0) && (this.repeatCallback = function (n) {
                    return o.repeat = n, new t(e, i, o, a)
                });
                this.tweens = [], this.ticker = null, this._continue = a, void 0 === this.itemForAnimations.data && (this.itemForAnimations.data = {}), void 0 === this.itemForAnimations.data._animatePaperAnims && (this.itemForAnimations.data._animatePaperAnims = []), this._dataIndex = this.itemForAnimations.data._animatePaperAnims.length, this.itemForAnimations.data._animatePaperAnims[this._dataIndex] = this;
                for (var u in i) i.hasOwnProperty(u) && this.tweens.push(new r.Tween(u, i[u], this));
                "onFrame" === this.settings.mode && (this.ticker = s.add(this.itemForAnimations, "_animate" + this.startTime + (Math.floor(999 * Math.random()) + 1), function () {
                    l.tick()
                }))
            }

            return t.prototype.tick = function () {
                var t = this;
                if (t.stopped) return !1;
                var e = (new Date).getTime();
                if (t.startTime + t.settings.delay > e) return !1;
                for (var i = Math.max(0, t.startTime + t.settings.delay + t.settings.duration - e), n = i / t.settings.duration || 0, r = 1 - n, s = 0, o = t.tweens.length; s < o; s++) t.tweens[s].run(r);
                return void 0 !== t.settings.step && t.settings.step.call(t.item, {
                    percent: r,
                    remaining: i
                }), void 0 !== t.settings.parentItem ? t.settings.parentItem.project.view.draw() : t.item.project.view.draw(), t.settings.mode, r < 1 && o ? i : (t.end(), !1)
            }, t.prototype.stop = function (t, e) {
                void 0 === t && (t = !1), void 0 === e && (e = !1);
                var i = this, n = 0, r = t ? i.tweens.length : 0;
                if (i.stopped) return i;
                for (i.stopped = !0; n < r; n++) i.tweens[n].run(1);
                t && (i._continue && (i._continue = null), i.end(e))
            }, t.prototype.end = function (t) {
                void 0 === t && (t = !1);
                var e = this;
                if ("onFrame" === e.settings.mode && s.remove(e.itemForAnimations, e.ticker), void 0 !== e.settings.complete && e.settings.complete.call(e.item, this), e.settings.mode, "function" == typeof e._continue && e._continue.call(e.item), e.itemForAnimations.data._animatePaperAnims[e._dataIndex] = null, !t && "function" == typeof e.repeatCallback) {
                    var i = e.repeat;
                    return !0 !== e.repeat && (i = e.repeat - 1), e.repeatCallback(i)
                }
                e = null
            }, t
        }();
        i.Animation = a
    }, {"./easing": 3, "./frameManager": 7, "./getPaper": 8, "./tween": 10}],
    3: [function (t, e, i) {
        "use strict";
        i.__esModule = !0, i.easing = {
            extendEasing: function (t) {
                for (var e in t) t.hasOwnProperty(e) && (i.easing[e] = t[e])
            }, linear: function (t) {
                return t
            }, swing: function (t) {
                return .5 - Math.cos(t * Math.PI) / 2
            }, Sine: function (t) {
                return 1 - Math.cos(t * Math.PI / 2)
            }, Circ: function (t) {
                return 1 - Math.sqrt(1 - t * t)
            }, Elastic: function (t) {
                return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15)
            }, Back: function (t) {
                return t * t * (3 * t - 2)
            }, Bounce: function (t) {
                for (var e, i = 4; t < ((e = Math.pow(2, --i)) - 1) / 11;) ;
                return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
            }
        };
        for (var n = ["Quad", "Cubic", "Quart", "Quint", "Expo"], r = 0, s = n.length; r < s; r++) i.easing[n[r]] = function (t) {
            return Math.pow(t, r + 2)
        };
        n = null;
        for (var o in i.easing) if (i.easing.hasOwnProperty(o)) {
            var a = i.easing[o];
            i.easing["easeIn" + o] = a, i.easing["easeOut" + o] = function (t) {
                return 1 - a(1 - t)
            }, i.easing["easeInOut" + o] = function (t) {
                return t < .5 ? a(2 * t) / 2 : 1 - a(-2 * t + 2) / 2
            }
        }
    }, {}],
    4: [function (t, e, i) {
        "use strict";
        i.__esModule = !0;
        var n = t("./animation"), r = function (t, e) {
            var i = [];
            e instanceof Array ? i = e : i.push(e);
            var r = 0;
            return new n.Animation(t, i[r].properties, i[r].settings, function e() {
                r++, void 0 !== i[r] && new n.Animation(t, i[r].properties, i[r].settings, e)
            }), t
        };
        i.grow = function (t, e) {
            return console.log("segmentGrow was buggy and has been removed, sorry :/"), t
        }, i.shake = function (t, e) {
            for (var i = 2 * Math.floor(e ? e.nb || 2 : 2), n = Math.floor(e ? e.movement || 40 : 40), s = [], o = !0; i > 0; i--) {
                var a = i % 2 ? "+" : "-", l = n, h = null;
                1 === i && e && void 0 !== e.complete && (h = e.complete), (o || 1 === i) && (l /= 2, o = !1), s.push({
                    properties: {position: {x: a + l}},
                    settings: {duration: 100, easing: "swing", complete: h}
                })
            }
            r(t, s)
        }, i.fadeIn = function (t, e) {
            var i = 500, n = void 0, s = "swing";
            void 0 !== e && (void 0 !== e.duration && (i = Number(e.duration)), "function" == typeof e.complete && (n = e.complete), void 0 !== e.easing && (s = e.easing)), r(t, {
                properties: {opacity: 1},
                settings: {duration: i, easing: s, complete: n}
            })
        }, i.fadeOut = function (t, e) {
            var i = 500, n = void 0, s = "swing";
            void 0 !== e && (void 0 !== e.duration && (i = Number(e.duration)), "function" == typeof e.complete && (n = e.complete), void 0 !== e.easing && (s = e.easing)), r(t, {
                properties: {opacity: 0},
                settings: {duration: i, easing: s, complete: n}
            })
        }, i.slideUp = function (t, e) {
            var i = 500, n = void 0, s = 50, o = "swing";
            void 0 !== e && (void 0 !== e.duration && (i = Number(e.duration)), "function" == typeof e.complete && (n = e.complete), void 0 !== e.easing && (o = e.easing), void 0 !== e.distance && (s = e.distance)), r(t, {
                properties: {
                    opacity: 1,
                    position: {y: "-" + s}
                }, settings: {duration: i, easing: o, complete: n}
            })
        }, i.slideDown = function (t, e) {
            var i = 500, n = void 0, s = 50, o = "swing";
            void 0 !== e && (void 0 !== e.duration && (i = Number(e.duration)), "function" == typeof e.complete && (n = e.complete), void 0 !== e.easing && (o = e.easing), void 0 !== e.distance && (s = e.distance)), r(t, {
                properties: {
                    opacity: 0,
                    position: {y: "+" + s}
                }, settings: {duration: i, easing: o, complete: n}
            })
        }, i.splash = function (t, e) {
            var i = 500, n = void 0, s = "swing";
            void 0 !== e && (void 0 !== e.duration && (i = Number(e.duration)), "function" == typeof e.complete && (n = e.complete), void 0 !== e.easing && (s = e.easing)), r(t, {
                properties: {
                    opacity: 1,
                    scale: 3,
                    rotate: 360
                }, settings: {duration: i, easing: s, complete: n}
            })
        }, void 0 !== e && (e.exports = {
            grow: function (t, e) {
                return console.log("segmentGrow was buggy and has been removed, sorry :/"), t
            },
            shake: i.shake,
            fadeIn: i.fadeIn,
            fadeOut: i.fadeOut,
            slideUp: i.slideUp,
            slideDown: i.slideDown,
            splash: i.splash
        })
    }, {"./animation": 2}],
    5: [function (t, e, i) {
        "use strict";
        i.__esModule = !0;
        var n = t("./export");
        window.animatePaper = n
    }, {"./export": 6}],
    6: [function (t, e, i) {
        "use strict";
        i.__esModule = !0;
        var n = t("./animation"), r = t("./effects"), s = t("./easing"), o = t("./frameManager"), a = t("./prophooks"),
            l = t("./getPaper");
        i.animate = function (t, e) {
            var i = [];
            e instanceof Array ? i = e : i.push(e);
            var r = 0;
            return new n.Animation(t, i[r].properties, i[r].settings, function e() {
                r++, void 0 !== i[r] && new n.Animation(t, i[r].properties, i[r].settings, e)
            }), t
        }, i.stop = function (t, e, i) {
            if (t.data._animatePaperAnims) for (var n = 0, r = t.data._animatePaperAnims.length; n < r; n++) t.data._animatePaperAnims[n] && t.data._animatePaperAnims[n].stop(e, i);
            return t
        }, i.extendEasing = s.easing.extendEasing, i.frameManager = o, i.fx = r, l.Item.prototype.animate || (l.Item.prototype.animate = function (t) {
            return i.animate(this, t)
        }), l.Item.prototype.stop || (l.Item.prototype.stop = function (t, e) {
            return i.stop(this, t, e)
        }), void 0 !== e && (e.exports = {
            animate: i.animate,
            stop: i.stop,
            frameManager: i.frameManager,
            fx: i.fx,
            extendEasing: i.extendEasing,
            extendPropHooks: a.extendPropHooks
        })
    }, {"./animation": 2, "./easing": 3, "./effects": 4, "./frameManager": 7, "./getPaper": 8, "./prophooks": 9}],
    7: [function (t, e, i) {
        "use strict";

        function n(t) {
            var e = this;
            if (void 0 === e.data && (e.data = {}), void 0 !== e.data._customHandlers && e.data._customHandlersCount > 0) for (var i in e.data._customHandlers) e.data._customHandlers.hasOwnProperty(i) && "function" == typeof e.data._customHandlers[i] && e.data._customHandlers[i].call(e, t)
        }

        i.__esModule = !0, i.add = function (t, e, i, r) {
            return void 0 === t.data._customHandlers && (t.data._customHandlers = {}, t.data._customHandlersCount = 0), t.data._customHandlers[e] = i, t.data._customHandlersCount += 1, t.data._customHandlersCount > 0 && (void 0 !== r ? r.onFrame = n : t.onFrame = n), e
        }, i.remove = function (t, e) {
            void 0 !== t.data._customHandlers && (t.data._customHandlers[e] = null, t.data._customHandlersCount -= 1, t.data._customHandlersCount <= 0 && (t.data._customHandlersCount = 0))
        }
    }, {}],
    8: [function (t, e, i) {
        var n = t("paper");
        "undefined" != typeof window && void 0 !== window.paper && (n = window.paper), e.exports = n
    }, {paper: 1}],
    9: [function (t, e, i) {
        "use strict";

        function n(t) {
            var e = null, i = "";
            if (e = Number(t), "string" == typeof t) {
                var n = t.match(o);
                i = n[1], e = Number(n[2])
            }
            return {value: e, direction: i}
        }

        function r(t) {
            var e;
            return t.type ? e = t.type : (t.red, e = "rgb"), e
        }

        function s(t) {
            var e;
            if (t._properties) e = t._properties; else switch (r(t)) {
                case"gray":
                    e = ["gray"];
                    break;
                case"rgb":
                    e = ["red", "green", "blue"];
                    break;
                case"hsl":
                    e = ["hue", "saturation", "lightness"];
                    break;
                case"hsb":
                    e = ["hue", "brightness", "saturation"]
            }
            return e
        }

        i.__esModule = !0;
        for (var o = /^([+\-])(.+)/, a = function (t, e, i) {
            if (-1 !== ["+", "-"].indexOf(i) && void 0 !== t && void 0 !== e) {
                if (t.x, e.x, t.y, e.y, "+" === i) return t.add(e);
                if ("-" === i) return t.subtract(e);
                throw new Error("Unknown operator")
            }
        }, l = {
            _default: {
                get: function (t) {
                    var e;
                    return null !== t.item[t.prop] && (e = t.item[t.prop]), e
                }, set: function (t) {
                    var e = {};
                    e[t.prop] = t.now, t.item.set(e)
                }
            }, scale: {
                get: function (t) {
                    return t.item.data._animatePaperVals || (t.item.data._animatePaperVals = {}), void 0 === t.item.data._animatePaperVals.scale && (t.item.data._animatePaperVals.scale = 1), t.item.data._animatePaperVals.scale
                }, set: function (t) {
                    var e = t.item.data._animatePaperVals.scale, i = t.now / e;
                    t.item.data._animatePaperVals.scale = t.now;
                    var n = !1;
                    void 0 !== t.A.settings.center && (n = t.A.settings.center), void 0 !== t.A.settings.scaleCenter && (n = t.A.settings.scaleCenter), !1 !== n ? t.item.scale(i, n) : t.item.scale(i)
                }
            }, rotate: {
                get: function (t) {
                    return t.item.data._animatePaperVals || (t.item.data._animatePaperVals = {}), void 0 === t.item.data._animatePaperVals.rotate && (t.item.data._animatePaperVals.rotate = -0), t.item.data._animatePaperVals.rotate
                }, set: function (t) {
                    var e = t.item.data._animatePaperVals.rotate, i = t.now - e;
                    t.item.data._animatePaperVals.rotate = t.now;
                    var n = !1;
                    void 0 !== t.A.settings.center && (n = t.A.settings.center), void 0 !== t.A.settings.rotateCenter && (n = t.A.settings.rotateCenter), !1 !== n ? t.item.rotate(i, n) : t.item.rotate(i)
                }
            }, translate: {
                get: function (t) {
                    return t.item.data._animatePaperVals || (t.item.data._animatePaperVals = {}), void 0 === t.item.data._animatePaperVals.translate && (t.item.data._animatePaperVals.translate = new paper.Point(0, 0)), t.item.data._animatePaperVals.translate
                }, set: function (t) {
                    var e = t.item.data._animatePaperVals.translate, i = a(t.now, e, "-");
                    t.item.data._animatePaperVals.translate = t.now, t.item.translate(i)
                }, ease: function (t, e) {
                    var i = a(t.end, t.start, "-");
                    return i.x = i.x * e, i.y = i.y * e, t.now = a(i, t.start, "+"), t.now
                }
            }, position: {
                get: function (t) {
                    return {x: t.item.position.x, y: t.item.position.y}
                }, set: function (t) {
                    t.item.position.x += t.now.x, t.item.position.y += t.now.y
                }, ease: function (t, e) {
                    void 0 === t._easePositionCache && (t._easePositionCache = {x: 0, y: 0});
                    var i = n(t.end.x || 0), r = i.value, s = i.direction, o = n(t.end.y || 0), a = o.value,
                        l = o.direction, h = function (t) {
                            return (t || 0) * e
                        };
                    return void 0 !== t.end.x ? "+" === s ? (t.now.x = h(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : "-" === s ? (t.now.x = h(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x, t.now.x = -t.now.x) : (t.now.x = (r - t.start.x) * e - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : t.now.x = 0, void 0 !== t.end.y ? "+" === l ? (t.now.y = h(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : "-" === l ? (t.now.y = h(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y, t.now.y = -t.now.y) : (t.now.y = (a - t.start.y) * e - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : t.now.y = 0, t.now
                }
            }, pointPosition: {
                get: function (t) {
                    return {x: t.item.x, y: t.item.y}
                }, set: function (t) {
                    t.item.x += t.now.x, t.item.y += t.now.y
                }, ease: function (t, e) {
                    void 0 === t._easePositionCache && (t._easePositionCache = {x: 0, y: 0});
                    var i = n(t.end.x || 0), r = i.value, s = i.direction, o = n(t.end.y || 0), a = o.value,
                        l = o.direction, h = function (t) {
                            return (t || 0) * e
                        };
                    return void 0 !== t.end.x ? "+" === s ? (t.now.x = h(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : "-" === s ? (t.now.x = h(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x, t.now.x = -t.now.x) : (t.now.x = (r - t.start.x) * e - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : t.now.x = 0, void 0 !== t.end.y ? "+" === l ? (t.now.y = h(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : "-" === l ? (t.now.y = h(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y, t.now.y = -t.now.y) : (t.now.y = (a - t.start.y) * e - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : t.now.y = 0, t.now
                }
            }, Color: {
                get: function (t) {
                    for (var e = t.item[t.prop], i = s(e), n = {}, r = 0, o = i; r < o.length; r++) {
                        var a = o[r];
                        n[a] = e[a]
                    }
                    return n
                }, set: function (t) {
                    for (var e = s(t.item[t.prop]), i = t.item[t.prop], n = {}, r = 0, o = e; r < o.length; r++) {
                        var a = o[r];
                        n[a] = i[a] + t.now[a]
                    }
                    t.item[t.prop] = n
                }, ease: function (t, e) {
                    for (var i = s(t.item[t.prop]), r = function (t) {
                        return (t || 0) * e
                    }, o = 0, a = i; o < a.length; o++) {
                        var l = a[o], h = l;
                        void 0 === t._easeColorCache && (t._easeColorCache = {}), void 0 === t._easeColorCache[h] && (t._easeColorCache[h] = 0);
                        var u = n(t.end[h] || 0), c = u.value, d = u.direction;
                        void 0 !== t.end[h] ? "+" === d ? (t.now[h] = r(c) - t._easeColorCache[h], t._easeColorCache[h] += t.now[h]) : "-" === d ? (t.now[h] = r(c) - t._easeColorCache[h], t._easeColorCache[h] += t.now[h], t.now[h] = -t.now[h]) : (t.now[h] = (c - t.start[h]) * e - t._easeColorCache[h], t._easeColorCache[h] += t.now[h]) : t.now[h] = 0
                    }
                    return t.now
                }
            }
        }, h = ["fill", "stroke"], u = 0, c = h.length; u < c; u++) l[h[u] + "Color"] = l.Color;
        i._tweenPropHooks = l, i._pointDiff = a, i.extendPropHooks = function (t) {
            for (var e in t) t.hasOwnProperty(e) && (l[e] = t[e])
        }, void 0 !== e && (e.exports = {_tweenPropHooks: l, __pointDiff: a, extendPropHooks: i.extendPropHooks})
    }, {}],
    10: [function (t, e, i) {
        "use strict";
        i.__esModule = !0;
        var n = t("./prophooks"), r = t("./easing"), s = function () {
            function t(t, e, i) {
                var n = this;
                n.A = i, n.item = i.item, n.prop = t, n.end = e, n.start = n.cur(), "string" == typeof n.end && "+" === n.end.charAt(0) ? n.end = n.start + parseFloat(n.end) : "string" == typeof n.end && "-" === n.end.charAt(0) && (n.end = n.start + parseFloat(n.end)), n.now = n.cur(), n.direction = n.end > n.start ? "+" : "-"
            }

            return t.prototype.cur = function () {
                var t = this, e = n._tweenPropHooks[t.prop];
                return e && e.get ? e.get(t) : n._tweenPropHooks._default.get(t)
            }, t.prototype.run = function (t) {
                var e, i = this, s = n._tweenPropHooks[i.prop], o = i.A.settings;
                if (o.duration) {
                    var a = void 0;
                    a = "function" == typeof o.easing ? o.easing : r.easing[o.easing], i.pos = e = a(t, o.duration * t, 0, 1, i.duration)
                } else i.pos = e = t;
                return s && s.ease ? s.ease(i, e) : i.now = (i.end - i.start) * e + i.start, s && s.set ? s.set(i) : n._tweenPropHooks._default.set(i), i
            }, t
        }();
        i.Tween = s
    }, {"./easing": 3, "./prophooks": 9}]
}, {}, [5]), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.Headroom = e()
}(this, function () {
    "use strict";

    function t(t) {
        this.callback = t, this.ticking = !1
    }

    function e(t) {
        return t && "undefined" != typeof window && (t === window || t.nodeType)
    }

    function i(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var n, r, s = t || {};
        for (r = 1; r < arguments.length; r++) {
            var o = arguments[r] || {};
            for (n in o) "object" != typeof s[n] || e(s[n]) ? s[n] = s[n] || o[n] : s[n] = i(s[n], o[n])
        }
        return s
    }

    function n(t) {
        return t === Object(t) ? t : {down: t, up: t}
    }

    function r(t, e) {
        e = i(e, r.options), this.lastKnownScrollY = 0, this.elem = t, this.tolerance = n(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop, this.onBottom = e.onBottom, this.onNotBottom = e.onNotBottom
    }

    var s = {
        bind: !!function () {
        }.bind,
        classList: "classList" in document.documentElement,
        rAF: !!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame)
    };
    return window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, t.prototype = {
        constructor: t,
        update: function () {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function () {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function () {
            this.requestTick()
        }
    }, r.prototype = {
        constructor: r, init: function () {
            if (r.cutsTheMustard) return this.debouncer = new t(this.update.bind(this)), this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this
        }, destroy: function () {
            var t = this.classes;
            this.initialised = !1;
            for (var e in t) t.hasOwnProperty(e) && this.elem.classList.remove(t[e]);
            this.scroller.removeEventListener("scroll", this.debouncer, !1)
        }, attachEvent: function () {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(),
                this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        }, unpin: function () {
            var t = this.elem.classList, e = this.classes;
            !t.contains(e.pinned) && t.contains(e.unpinned) || (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        }, pin: function () {
            var t = this.elem.classList, e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        }, top: function () {
            var t = this.elem.classList, e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        }, notTop: function () {
            var t = this.elem.classList, e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        }, bottom: function () {
            var t = this.elem.classList, e = this.classes;
            t.contains(e.bottom) || (t.add(e.bottom), t.remove(e.notBottom), this.onBottom && this.onBottom.call(this))
        }, notBottom: function () {
            var t = this.elem.classList, e = this.classes;
            t.contains(e.notBottom) || (t.add(e.notBottom), t.remove(e.bottom), this.onNotBottom && this.onNotBottom.call(this))
        }, getScrollY: function () {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop
        }, getViewportHeight: function () {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }, getElementPhysicalHeight: function (t) {
            return Math.max(t.offsetHeight, t.clientHeight)
        }, getScrollerPhysicalHeight: function () {
            return this.scroller === window || this.scroller === document.body ? this.getViewportHeight() : this.getElementPhysicalHeight(this.scroller)
        }, getDocumentHeight: function () {
            var t = document.body, e = document.documentElement;
            return Math.max(t.scrollHeight, e.scrollHeight, t.offsetHeight, e.offsetHeight, t.clientHeight, e.clientHeight)
        }, getElementHeight: function (t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        }, getScrollerHeight: function () {
            return this.scroller === window || this.scroller === document.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        }, isOutOfBounds: function (t) {
            var e = t < 0, i = t + this.getScrollerPhysicalHeight() > this.getScrollerHeight();
            return e || i
        }, toleranceExceeded: function (t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        }, shouldUnpin: function (t, e) {
            var i = t > this.lastKnownScrollY, n = t >= this.offset;
            return i && n && e
        }, shouldPin: function (t, e) {
            var i = t < this.lastKnownScrollY, n = t <= this.offset;
            return i && e || n
        }, update: function () {
            var t = this.getScrollY(), e = t > this.lastKnownScrollY ? "down" : "up", i = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), t + this.getViewportHeight() >= this.getScrollerHeight() ? this.bottom() : this.notBottom(), this.shouldUnpin(t, i) ? this.unpin() : this.shouldPin(t, i) && this.pin(), this.lastKnownScrollY = t)
        }
    }, r.options = {
        tolerance: {up: 0, down: 0},
        offset: 0,
        scroller: window,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            bottom: "headroom--bottom",
            notBottom: "headroom--not-bottom",
            initial: "headroom"
        }
    }, r.cutsTheMustard = void 0 !== s && s.rAF && s.bind && s.classList, r
}), function () {
    var t;
    t = function () {
        function t(t, e) {
            var i, n;
            if (this.options = {
                target: "instafeed",
                get: "popular",
                resolution: "thumbnail",
                sortBy: "none",
                links: !0,
                mock: !1,
                useHttp: !1
            }, "object" == typeof t) for (i in t) n = t[i], this.options[i] = n;
            this.context = null != e ? e : this, this.unique = this._genKey()
        }

        return t.prototype.hasNext = function () {
            return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0
        }, t.prototype.next = function () {
            return !!this.hasNext() && this.run(this.context.nextUrl)
        }, t.prototype.run = function (e) {
            var i, n, r;
            if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
            if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
            return null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this), "undefined" != typeof document && null !== document && (r = document.createElement("script"), r.id = "instafeed-fetcher", r.src = e || this._buildUrl(), i = document.getElementsByTagName("head"), i[0].appendChild(r), n = "instafeedCache" + this.unique, window[n] = new t(this.options, this), window[n].unique = this.unique), !0
        }, t.prototype.parse = function (t) {
            var e, i, n, r, s, o, a, l, h, u, c, d, f, p, g, m, v, _, y, w, x, b, C, S, T, E, k, P, A, z, I;
            if ("object" != typeof t) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), !1;
                throw new Error("Invalid JSON response")
            }
            if (200 !== t.meta.code) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, t.meta.error_message), !1;
                throw new Error("Error from Instagram: " + t.meta.error_message)
            }
            if (0 === t.data.length) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), !1;
                throw new Error("No images were returned from Instagram")
            }
            if (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, t), this.context.nextUrl = "", null != t.pagination && (this.context.nextUrl = t.pagination.next_url), "none" !== this.options.sortBy) switch (A = "random" === this.options.sortBy ? ["", "random"] : this.options.sortBy.split("-"), P = "least" === A[0], A[1]) {
                case"random":
                    t.data.sort(function () {
                        return .5 - Math.random()
                    });
                    break;
                case"recent":
                    t.data = this._sortBy(t.data, "created_time", P);
                    break;
                case"liked":
                    t.data = this._sortBy(t.data, "likes.count", P);
                    break;
                case"commented":
                    t.data = this._sortBy(t.data, "comments.count", P);
                    break;
                default:
                    throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
            }
            if ("undefined" != typeof document && null !== document && !1 === this.options.mock) {
                if (g = t.data, k = parseInt(this.options.limit, 10), null != this.options.limit && g.length > k && (g = g.slice(0, k)), o = document.createDocumentFragment(), null != this.options.filter && "function" == typeof this.options.filter && (g = this._filter(g, this.options.filter)), null != this.options.template && "string" == typeof this.options.template) {
                    for (l = "", f = "", "", I = document.createElement("div"), u = 0, C = g.length; u < C; u++) {
                        if (c = g[u], "object" != typeof (d = c.images[this.options.resolution])) throw s = "No image found for resolution: " + this.options.resolution + ".", new Error(s);
                        y = d.width, v = d.height, _ = "square", y > v && (_ = "landscape"), y < v && (_ = "portrait"), p = d.url, h = window.location.protocol.indexOf("http") >= 0, h && !this.options.useHttp && (p = p.replace(/https?:\/\//, "//")), f = this._makeTemplate(this.options.template, {
                            model: c,
                            id: c.id,
                            link: c.link,
                            type: c.type,
                            image: p,
                            width: y,
                            height: v,
                            orientation: _,
                            caption: this._getObjectProperty(c, "caption.text"),
                            likes: c.likes.count,
                            comments: c.comments.count,
                            location: this._getObjectProperty(c, "location.name")
                        }), l += f
                    }
                    for (I.innerHTML = l, r = [], n = 0, i = I.childNodes.length; n < i;) r.push(I.childNodes[n]), n += 1;
                    for (x = 0, S = r.length; x < S; x++) E = r[x], o.appendChild(E)
                } else for (b = 0, T = g.length; b < T; b++) {
                    if (c = g[b], m = document.createElement("img"), "object" != typeof (d = c.images[this.options.resolution])) throw s = "No image found for resolution: " + this.options.resolution + ".", new Error(s);
                    p = d.url, h = window.location.protocol.indexOf("http") >= 0, h && !this.options.useHttp && (p = p.replace(/https?:\/\//, "//")), m.src = p, !0 === this.options.links ? (e = document.createElement("a"), e.href = c.link, e.appendChild(m), o.appendChild(e)) : o.appendChild(m)
                }
                if (z = this.options.target, "string" == typeof z && (z = document.getElementById(z)), null == z) throw s = 'No element with id="' + this.options.target + '" on page.', new Error(s);
                z.appendChild(o), a = document.getElementsByTagName("head")[0], a.removeChild(document.getElementById("instafeed-fetcher")), w = "instafeedCache" + this.unique, window[w] = void 0;
                try {
                    delete window[w]
                } catch (t) {
                    t
                }
            }
            return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), !0
        }, t.prototype._buildUrl = function () {
            var t, e, i;
            switch (t = "https://api.instagram.com/v1", this.options.get) {
                case"popular":
                    e = "media/popular";
                    break;
                case"tagged":
                    if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                    e = "tags/" + this.options.tagName + "/media/recent";
                    break;
                case"location":
                    if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                    e = "locations/" + this.options.locationId + "/media/recent";
                    break;
                case"user":
                    if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                    e = "users/" + this.options.userId + "/media/recent";
                    break;
                default:
                    throw new Error("Invalid option for get: '" + this.options.get + "'.")
            }
            return i = t + "/" + e, null != this.options.accessToken ? i += "?access_token=" + this.options.accessToken : i += "?client_id=" + this.options.clientId, null != this.options.limit && (i += "&count=" + this.options.limit), i += "&callback=instafeedCache" + this.unique + ".parse"
        }, t.prototype._genKey = function () {
            var t;
            return "" + (t = function () {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            })() + t() + t() + t()
        }, t.prototype._makeTemplate = function (t, e) {
            var i, n, r, s, o;
            for (n = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, i = t; n.test(i);) s = i.match(n)[1], o = null != (r = this._getObjectProperty(e, s)) ? r : "", i = i.replace(n, function () {
                return "" + o
            });
            return i
        }, t.prototype._getObjectProperty = function (t, e) {
            var i, n;
            for (e = e.replace(/\[(\w+)\]/g, ".$1"), n = e.split("."); n.length;) {
                if (i = n.shift(), !(null != t && i in t)) return null;
                t = t[i]
            }
            return t
        }, t.prototype._sortBy = function (t, e, i) {
            var n;
            return n = function (t, n) {
                var r, s;
                return r = this._getObjectProperty(t, e), s = this._getObjectProperty(n, e), i ? r > s ? 1 : -1 : r < s ? 1 : -1
            }, t.sort(n.bind(this)), t
        }, t.prototype._filter = function (t, e) {
            var i, n, r, s, o;
            for (i = [], n = function (t) {
                if (e(t)) return i.push(t)
            }, r = 0, o = t.length; r < o; r++) s = t[r], n(s);
            return i
        }, t
    }(), function (t, e) {
        "function" == typeof define && define.amd ? define([], e) : "object" == typeof module && module.exports ? module.exports = e() : t.Instafeed = e()
    }(this, function () {
        return t
    })
}.call(this), function (t, e, i, n) {
    "use strict";

    function r(t, e, i) {
        return setTimeout(h(t, i), e)
    }

    function s(t, e, i) {
        return !!Array.isArray(t) && (o(t, i[e], i), !0)
    }

    function o(t, e, i) {
        var r;
        if (t) if (t.forEach) t.forEach(e, i); else if (t.length !== n) for (r = 0; r < t.length;) e.call(i, t[r], r, t), r++; else for (r in t) t.hasOwnProperty(r) && e.call(i, t[r], r, t)
    }

    function a(e, i, n) {
        var r = "DEPRECATED METHOD: " + i + "\n" + n + " AT \n";
        return function () {
            var i = new Error("get-stack-trace"),
                n = i && i.stack ? i.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                s = t.console && (t.console.warn || t.console.log);
            return s && s.call(t.console, r, n), e.apply(this, arguments)
        }
    }

    function l(t, e, i) {
        var n, r = e.prototype;
        n = t.prototype = Object.create(r), n.constructor = t, n._super = r, i && ut(n, i)
    }

    function h(t, e) {
        return function () {
            return t.apply(e, arguments)
        }
    }

    function u(t, e) {
        return typeof t == ft ? t.apply(e ? e[0] || n : n, e) : t
    }

    function c(t, e) {
        return t === n ? e : t
    }

    function d(t, e, i) {
        o(m(e), function (e) {
            t.addEventListener(e, i, !1)
        })
    }

    function f(t, e, i) {
        o(m(e), function (e) {
            t.removeEventListener(e, i, !1)
        })
    }

    function p(t, e) {
        for (; t;) {
            if (t == e) return !0;
            t = t.parentNode
        }
        return !1
    }

    function g(t, e) {
        return t.indexOf(e) > -1
    }

    function m(t) {
        return t.trim().split(/\s+/g)
    }

    function v(t, e, i) {
        if (t.indexOf && !i) return t.indexOf(e);
        for (var n = 0; n < t.length;) {
            if (i && t[n][i] == e || !i && t[n] === e) return n;
            n++
        }
        return -1
    }

    function _(t) {
        return Array.prototype.slice.call(t, 0)
    }

    function y(t, e, i) {
        for (var n = [], r = [], s = 0; s < t.length;) {
            var o = e ? t[s][e] : t[s];
            v(r, o) < 0 && n.push(t[s]), r[s] = o, s++
        }
        return i && (n = e ? n.sort(function (t, i) {
            return t[e] > i[e]
        }) : n.sort()), n
    }

    function w(t, e) {
        for (var i, r, s = e[0].toUpperCase() + e.slice(1), o = 0; o < ct.length;) {
            if (i = ct[o], (r = i ? i + s : e) in t) return r;
            o++
        }
        return n
    }

    function x() {
        return yt++
    }

    function b(e) {
        var i = e.ownerDocument || e;
        return i.defaultView || i.parentWindow || t
    }

    function C(t, e) {
        var i = this;
        this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function (e) {
            u(t.options.enable, [t]) && i.handler(e)
        }, this.init()
    }

    function S(t) {
        var e = t.options.inputClass;
        return new (e || (bt ? q : Ct ? B : xt ? W : D))(t, T)
    }

    function T(t, e, i) {
        var n = i.pointers.length, r = i.changedPointers.length, s = e & Tt && n - r == 0,
            o = e & (kt | Pt) && n - r == 0;
        i.isFirst = !!s, i.isFinal = !!o, s && (t.session = {}), i.eventType = e, E(t, i), t.emit("hammer.input", i), t.recognize(i), t.session.prevInput = i
    }

    function E(t, e) {
        var i = t.session, n = e.pointers, r = n.length;
        i.firstInput || (i.firstInput = A(e)), r > 1 && !i.firstMultiple ? i.firstMultiple = A(e) : 1 === r && (i.firstMultiple = !1);
        var s = i.firstInput, o = i.firstMultiple, a = o ? o.center : s.center, l = e.center = z(n);
        e.timeStamp = mt(), e.deltaTime = e.timeStamp - s.timeStamp, e.angle = L(a, l), e.distance = O(a, l), k(i, e), e.offsetDirection = M(e.deltaX, e.deltaY);
        var h = I(e.deltaTime, e.deltaX, e.deltaY);
        e.overallVelocityX = h.x, e.overallVelocityY = h.y, e.overallVelocity = gt(h.x) > gt(h.y) ? h.x : h.y, e.scale = o ? F(o.pointers, n) : 1, e.rotation = o ? N(o.pointers, n) : 0, e.maxPointers = i.prevInput ? e.pointers.length > i.prevInput.maxPointers ? e.pointers.length : i.prevInput.maxPointers : e.pointers.length, P(i, e);
        var u = t.element;
        p(e.srcEvent.target, u) && (u = e.srcEvent.target), e.target = u
    }

    function k(t, e) {
        var i = e.center, n = t.offsetDelta || {}, r = t.prevDelta || {}, s = t.prevInput || {};
        e.eventType !== Tt && s.eventType !== kt || (r = t.prevDelta = {
            x: s.deltaX || 0,
            y: s.deltaY || 0
        }, n = t.offsetDelta = {x: i.x, y: i.y}), e.deltaX = r.x + (i.x - n.x), e.deltaY = r.y + (i.y - n.y)
    }

    function P(t, e) {
        var i, r, s, o, a = t.lastInterval || e, l = e.timeStamp - a.timeStamp;
        if (e.eventType != Pt && (l > St || a.velocity === n)) {
            var h = e.deltaX - a.deltaX, u = e.deltaY - a.deltaY, c = I(l, h, u);
            r = c.x, s = c.y, i = gt(c.x) > gt(c.y) ? c.x : c.y, o = M(h, u), t.lastInterval = e
        } else i = a.velocity, r = a.velocityX, s = a.velocityY, o = a.direction;
        e.velocity = i, e.velocityX = r, e.velocityY = s, e.direction = o
    }

    function A(t) {
        for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
            clientX: pt(t.pointers[i].clientX),
            clientY: pt(t.pointers[i].clientY)
        }, i++;
        return {timeStamp: mt(), pointers: e, center: z(e), deltaX: t.deltaX, deltaY: t.deltaY}
    }

    function z(t) {
        var e = t.length;
        if (1 === e) return {x: pt(t[0].clientX), y: pt(t[0].clientY)};
        for (var i = 0, n = 0, r = 0; r < e;) i += t[r].clientX, n += t[r].clientY, r++;
        return {x: pt(i / e), y: pt(n / e)}
    }

    function I(t, e, i) {
        return {x: e / t || 0, y: i / t || 0}
    }

    function M(t, e) {
        return t === e ? At : gt(t) >= gt(e) ? t < 0 ? zt : It : e < 0 ? Mt : Ot
    }

    function O(t, e, i) {
        i || (i = Dt);
        var n = e[i[0]] - t[i[0]], r = e[i[1]] - t[i[1]];
        return Math.sqrt(n * n + r * r)
    }

    function L(t, e, i) {
        i || (i = Dt);
        var n = e[i[0]] - t[i[0]], r = e[i[1]] - t[i[1]];
        return 180 * Math.atan2(r, n) / Math.PI
    }

    function N(t, e) {
        return L(e[1], e[0], qt) + L(t[1], t[0], qt)
    }

    function F(t, e) {
        return O(e[0], e[1], qt) / O(t[0], t[1], qt)
    }

    function D() {
        this.evEl = Ht, this.evWin = Bt, this.pressed = !1, C.apply(this, arguments)
    }

    function q() {
        this.evEl = Vt, this.evWin = Ut, C.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
    }

    function R() {
        this.evTarget = Xt, this.evWin = Zt, this.started = !1, C.apply(this, arguments)
    }

    function H(t, e) {
        var i = _(t.touches), n = _(t.changedTouches);
        return e & (kt | Pt) && (i = y(i.concat(n), "identifier", !0)), [i, n]
    }

    function B() {
        this.evTarget = $t, this.targetIds = {}, C.apply(this, arguments)
    }

    function j(t, e) {
        var i = _(t.touches), n = this.targetIds;
        if (e & (Tt | Et) && 1 === i.length) return n[i[0].identifier] = !0, [i, i];
        var r, s, o = _(t.changedTouches), a = [], l = this.target;
        if (s = i.filter(function (t) {
            return p(t.target, l)
        }), e === Tt) for (r = 0; r < s.length;) n[s[r].identifier] = !0, r++;
        for (r = 0; r < o.length;) n[o[r].identifier] && a.push(o[r]), e & (kt | Pt) && delete n[o[r].identifier], r++;
        return a.length ? [y(s.concat(a), "identifier", !0), a] : void 0
    }

    function W() {
        C.apply(this, arguments);
        var t = h(this.handler, this);
        this.touch = new B(this.manager, t), this.mouse = new D(this.manager, t), this.primaryTouch = null, this.lastTouches = []
    }

    function V(t, e) {
        t & Tt ? (this.primaryTouch = e.changedPointers[0].identifier, U.call(this, e)) : t & (kt | Pt) && U.call(this, e)
    }

    function U(t) {
        var e = t.changedPointers[0];
        if (e.identifier === this.primaryTouch) {
            var i = {x: e.clientX, y: e.clientY};
            this.lastTouches.push(i);
            var n = this.lastTouches, r = function () {
                var t = n.indexOf(i);
                t > -1 && n.splice(t, 1)
            };
            setTimeout(r, Jt)
        }
    }

    function Y(t) {
        for (var e = t.srcEvent.clientX, i = t.srcEvent.clientY, n = 0; n < this.lastTouches.length; n++) {
            var r = this.lastTouches[n], s = Math.abs(e - r.x), o = Math.abs(i - r.y);
            if (s <= Qt && o <= Qt) return !0
        }
        return !1
    }

    function X(t, e) {
        this.manager = t, this.set(e)
    }

    function Z(t) {
        if (g(t, ne)) return ne;
        var e = g(t, re), i = g(t, se);
        return e && i ? ne : e || i ? e ? re : se : g(t, ie) ? ie : ee
    }

    function G(t) {
        this.options = ut({}, this.defaults, t || {}), this.id = x(), this.manager = null, this.options.enable = c(this.options.enable, !0), this.state = ae, this.simultaneous = {}, this.requireFail = []
    }

    function $(t) {
        return t & de ? "cancel" : t & ue ? "end" : t & he ? "move" : t & le ? "start" : ""
    }

    function J(t) {
        return t == Ot ? "down" : t == Mt ? "up" : t == zt ? "left" : t == It ? "right" : ""
    }

    function Q(t, e) {
        var i = e.manager;
        return i ? i.get(t) : t
    }

    function K() {
        G.apply(this, arguments)
    }

    function tt() {
        K.apply(this, arguments), this.pX = null, this.pY = null
    }

    function et() {
        K.apply(this, arguments)
    }

    function it() {
        G.apply(this, arguments), this._timer = null, this._input = null
    }

    function nt() {
        K.apply(this, arguments)
    }

    function rt() {
        K.apply(this, arguments)
    }

    function st() {
        G.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
    }

    function ot(t, e) {
        return e = e || {}, e.recognizers = c(e.recognizers, ot.defaults.preset), new at(t, e)
    }

    function at(t, e) {
        this.options = ut({}, ot.defaults, e || {}), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = t, this.input = S(this), this.touchAction = new X(this, this.options.touchAction), lt(this, !0), o(this.options.recognizers, function (t) {
            var e = this.add(new t[0](t[1]));
            t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
        }, this)
    }

    function lt(t, e) {
        var i = t.element;
        if (i.style) {
            var n;
            o(t.options.cssProps, function (r, s) {
                n = w(i.style, s), e ? (t.oldCssProps[n] = i.style[n], i.style[n] = r) : i.style[n] = t.oldCssProps[n] || ""
            }), e || (t.oldCssProps = {})
        }
    }

    function ht(t, i) {
        var n = e.createEvent("Event");
        n.initEvent(t, !0, !0), n.gesture = i, i.target.dispatchEvent(n)
    }

    var ut, ct = ["", "webkit", "Moz", "MS", "ms", "o"], dt = e.createElement("div"), ft = "function", pt = Math.round,
        gt = Math.abs, mt = Date.now;
    ut = "function" != typeof Object.assign ? function (t) {
        if (t === n || null === t) throw new TypeError("Cannot convert undefined or null to object");
        for (var e = Object(t), i = 1; i < arguments.length; i++) {
            var r = arguments[i];
            if (r !== n && null !== r) for (var s in r) r.hasOwnProperty(s) && (e[s] = r[s])
        }
        return e
    } : Object.assign;
    var vt = a(function (t, e, i) {
            for (var r = Object.keys(e), s = 0; s < r.length;) (!i || i && t[r[s]] === n) && (t[r[s]] = e[r[s]]), s++;
            return t
        }, "extend", "Use `assign`."), _t = a(function (t, e) {
            return vt(t, e, !0)
        }, "merge", "Use `assign`."), yt = 1, wt = /mobile|tablet|ip(ad|hone|od)|android/i, xt = "ontouchstart" in t,
        bt = w(t, "PointerEvent") !== n, Ct = xt && wt.test(navigator.userAgent), St = 25, Tt = 1, Et = 2, kt = 4,
        Pt = 8, At = 1, zt = 2, It = 4, Mt = 8, Ot = 16, Lt = zt | It, Nt = Mt | Ot, Ft = Lt | Nt, Dt = ["x", "y"],
        qt = ["clientX", "clientY"];
    C.prototype = {
        handler: function () {
        }, init: function () {
            this.evEl && d(this.element, this.evEl, this.domHandler), this.evTarget && d(this.target, this.evTarget, this.domHandler), this.evWin && d(b(this.element), this.evWin, this.domHandler)
        }, destroy: function () {
            this.evEl && f(this.element, this.evEl, this.domHandler), this.evTarget && f(this.target, this.evTarget, this.domHandler), this.evWin && f(b(this.element), this.evWin, this.domHandler)
        }
    };
    var Rt = {mousedown: Tt, mousemove: Et, mouseup: kt}, Ht = "mousedown", Bt = "mousemove mouseup";
    l(D, C, {
        handler: function (t) {
            var e = Rt[t.type];
            e & Tt && 0 === t.button && (this.pressed = !0), e & Et && 1 !== t.which && (e = kt), this.pressed && (e & kt && (this.pressed = !1), this.callback(this.manager, e, {
                pointers: [t],
                changedPointers: [t],
                pointerType: "mouse",
                srcEvent: t
            }))
        }
    });
    var jt = {pointerdown: Tt, pointermove: Et, pointerup: kt, pointercancel: Pt, pointerout: Pt},
        Wt = {2: "touch", 3: "pen", 4: "mouse", 5: "kinect"}, Vt = "pointerdown",
        Ut = "pointermove pointerup pointercancel";
    t.MSPointerEvent && !t.PointerEvent && (Vt = "MSPointerDown", Ut = "MSPointerMove MSPointerUp MSPointerCancel"), l(q, C, {
        handler: function (t) {
            var e = this.store, i = !1, n = t.type.toLowerCase().replace("ms", ""), r = jt[n],
                s = Wt[t.pointerType] || t.pointerType, o = "touch" == s, a = v(e, t.pointerId, "pointerId");
            r & Tt && (0 === t.button || o) ? a < 0 && (e.push(t), a = e.length - 1) : r & (kt | Pt) && (i = !0), a < 0 || (e[a] = t, this.callback(this.manager, r, {
                pointers: e,
                changedPointers: [t],
                pointerType: s,
                srcEvent: t
            }), i && e.splice(a, 1))
        }
    });
    var Yt = {touchstart: Tt, touchmove: Et, touchend: kt, touchcancel: Pt}, Xt = "touchstart",
        Zt = "touchstart touchmove touchend touchcancel";
    l(R, C, {
        handler: function (t) {
            var e = Yt[t.type];
            if (e === Tt && (this.started = !0), this.started) {
                var i = H.call(this, t, e);
                e & (kt | Pt) && i[0].length - i[1].length == 0 && (this.started = !1), this.callback(this.manager, e, {
                    pointers: i[0],
                    changedPointers: i[1],
                    pointerType: "touch",
                    srcEvent: t
                })
            }
        }
    });
    var Gt = {touchstart: Tt, touchmove: Et, touchend: kt, touchcancel: Pt},
        $t = "touchstart touchmove touchend touchcancel";
    l(B, C, {
        handler: function (t) {
            var e = Gt[t.type], i = j.call(this, t, e);
            i && this.callback(this.manager, e, {
                pointers: i[0],
                changedPointers: i[1],
                pointerType: "touch",
                srcEvent: t
            })
        }
    });
    var Jt = 2500, Qt = 25;
    l(W, C, {
        handler: function (t, e, i) {
            var n = "touch" == i.pointerType, r = "mouse" == i.pointerType;
            if (!(r && i.sourceCapabilities && i.sourceCapabilities.firesTouchEvents)) {
                if (n) V.call(this, e, i); else if (r && Y.call(this, i)) return;
                this.callback(t, e, i)
            }
        }, destroy: function () {
            this.touch.destroy(), this.mouse.destroy()
        }
    });
    var Kt = w(dt.style, "touchAction"), te = Kt !== n, ee = "auto", ie = "manipulation", ne = "none", re = "pan-x",
        se = "pan-y", oe = function () {
            if (!te) return !1;
            var e = {}, i = t.CSS && t.CSS.supports;
            return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (n) {
                e[n] = !i || t.CSS.supports("touch-action", n)
            }), e
        }();
    X.prototype = {
        set: function (t) {
            "compute" == t && (t = this.compute()), te && this.manager.element.style && oe[t] && (this.manager.element.style[Kt] = t), this.actions = t.toLowerCase().trim()
        }, update: function () {
            this.set(this.manager.options.touchAction)
        }, compute: function () {
            var t = [];
            return o(this.manager.recognizers, function (e) {
                u(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
            }), Z(t.join(" "))
        }, preventDefaults: function (t) {
            var e = t.srcEvent, i = t.offsetDirection;
            if (this.manager.session.prevented) return void e.preventDefault();
            var n = this.actions, r = g(n, ne) && !oe[ne], s = g(n, se) && !oe[se], o = g(n, re) && !oe[re];
            if (r) {
                var a = 1 === t.pointers.length, l = t.distance < 2, h = t.deltaTime < 250;
                if (a && l && h) return
            }
            return o && s ? void 0 : r || s && i & Lt || o && i & Nt ? this.preventSrc(e) : void 0
        }, preventSrc: function (t) {
            this.manager.session.prevented = !0, t.preventDefault()
        }
    };
    var ae = 1, le = 2, he = 4, ue = 8, ce = ue, de = 16;
    G.prototype = {
        defaults: {}, set: function (t) {
            return ut(this.options, t), this.manager && this.manager.touchAction.update(), this
        }, recognizeWith: function (t) {
            if (s(t, "recognizeWith", this)) return this;
            var e = this.simultaneous;
            return t = Q(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
        }, dropRecognizeWith: function (t) {
            return s(t, "dropRecognizeWith", this) ? this : (t = Q(t, this), delete this.simultaneous[t.id], this)
        }, requireFailure: function (t) {
            if (s(t, "requireFailure", this)) return this;
            var e = this.requireFail;
            return t = Q(t, this), -1 === v(e, t) && (e.push(t), t.requireFailure(this)), this
        }, dropRequireFailure: function (t) {
            if (s(t, "dropRequireFailure", this)) return this;
            t = Q(t, this);
            var e = v(this.requireFail, t);
            return e > -1 && this.requireFail.splice(e, 1), this
        }, hasRequireFailures: function () {
            return this.requireFail.length > 0
        }, canRecognizeWith: function (t) {
            return !!this.simultaneous[t.id]
        }, emit: function (t) {
            function e(e) {
                i.manager.emit(e, t)
            }

            var i = this, n = this.state;
            n < ue && e(i.options.event + $(n)), e(i.options.event), t.additionalEvent && e(t.additionalEvent), n >= ue && e(i.options.event + $(n))
        }, tryEmit: function (t) {
            if (this.canEmit()) return this.emit(t);
            this.state = 32
        }, canEmit: function () {
            for (var t = 0; t < this.requireFail.length;) {
                if (!(this.requireFail[t].state & (32 | ae))) return !1;
                t++
            }
            return !0
        }, recognize: function (t) {
            var e = ut({}, t);
            if (!u(this.options.enable, [this, e])) return this.reset(), void (this.state = 32);
            this.state & (ce | de | 32) && (this.state = ae), this.state = this.process(e), this.state & (le | he | ue | de) && this.tryEmit(e)
        }, process: function (t) {
        }, getTouchAction: function () {
        }, reset: function () {
        }
    }, l(K, G, {
        defaults: {pointers: 1}, attrTest: function (t) {
            var e = this.options.pointers;
            return 0 === e || t.pointers.length === e
        }, process: function (t) {
            var e = this.state, i = t.eventType, n = e & (le | he), r = this.attrTest(t);
            return n && (i & Pt || !r) ? e | de : n || r ? i & kt ? e | ue : e & le ? e | he : le : 32
        }
    }), l(tt, K, {
        defaults: {event: "pan", threshold: 10, pointers: 1, direction: Ft}, getTouchAction: function () {
            var t = this.options.direction, e = [];
            return t & Lt && e.push(se), t & Nt && e.push(re), e
        }, directionTest: function (t) {
            var e = this.options, i = !0, n = t.distance, r = t.direction, s = t.deltaX, o = t.deltaY;
            return r & e.direction || (e.direction & Lt ? (r = 0 === s ? At : s < 0 ? zt : It, i = s != this.pX, n = Math.abs(t.deltaX)) : (r = 0 === o ? At : o < 0 ? Mt : Ot, i = o != this.pY, n = Math.abs(t.deltaY))), t.direction = r, i && n > e.threshold && r & e.direction
        }, attrTest: function (t) {
            return K.prototype.attrTest.call(this, t) && (this.state & le || !(this.state & le) && this.directionTest(t))
        }, emit: function (t) {
            this.pX = t.deltaX, this.pY = t.deltaY;
            var e = J(t.direction);
            e && (t.additionalEvent = this.options.event + e), this._super.emit.call(this, t)
        }
    }), l(et, K, {
        defaults: {event: "pinch", threshold: 0, pointers: 2}, getTouchAction: function () {
            return [ne]
        }, attrTest: function (t) {
            return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & le)
        }, emit: function (t) {
            if (1 !== t.scale) {
                var e = t.scale < 1 ? "in" : "out";
                t.additionalEvent = this.options.event + e
            }
            this._super.emit.call(this, t)
        }
    }), l(it, G, {
        defaults: {event: "press", pointers: 1, time: 251, threshold: 9}, getTouchAction: function () {
            return [ee]
        }, process: function (t) {
            var e = this.options, i = t.pointers.length === e.pointers, n = t.distance < e.threshold,
                s = t.deltaTime > e.time;
            if (this._input = t, !n || !i || t.eventType & (kt | Pt) && !s) this.reset(); else if (t.eventType & Tt) this.reset(), this._timer = r(function () {
                this.state = ce, this.tryEmit()
            }, e.time, this); else if (t.eventType & kt) return ce;
            return 32
        }, reset: function () {
            clearTimeout(this._timer)
        }, emit: function (t) {
            this.state === ce && (t && t.eventType & kt ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = mt(), this.manager.emit(this.options.event, this._input)))
        }
    }), l(nt, K, {
        defaults: {event: "rotate", threshold: 0, pointers: 2}, getTouchAction: function () {
            return [ne]
        }, attrTest: function (t) {
            return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & le)
        }
    }), l(rt, K, {
        defaults: {event: "swipe", threshold: 10, velocity: .3, direction: Lt | Nt, pointers: 1},
        getTouchAction: function () {
            return tt.prototype.getTouchAction.call(this)
        },
        attrTest: function (t) {
            var e, i = this.options.direction;
            return i & (Lt | Nt) ? e = t.overallVelocity : i & Lt ? e = t.overallVelocityX : i & Nt && (e = t.overallVelocityY), this._super.attrTest.call(this, t) && i & t.offsetDirection && t.distance > this.options.threshold && t.maxPointers == this.options.pointers && gt(e) > this.options.velocity && t.eventType & kt
        },
        emit: function (t) {
            var e = J(t.offsetDirection);
            e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
        }
    }), l(st, G, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 9,
            posThreshold: 10
        }, getTouchAction: function () {
            return [ie]
        }, process: function (t) {
            var e = this.options, i = t.pointers.length === e.pointers, n = t.distance < e.threshold,
                s = t.deltaTime < e.time;
            if (this.reset(), t.eventType & Tt && 0 === this.count) return this.failTimeout();
            if (n && s && i) {
                if (t.eventType != kt) return this.failTimeout();
                var o = !this.pTime || t.timeStamp - this.pTime < e.interval,
                    a = !this.pCenter || O(this.pCenter, t.center) < e.posThreshold;
                this.pTime = t.timeStamp, this.pCenter = t.center, a && o ? this.count += 1 : this.count = 1, this._input = t;
                if (0 === this.count % e.taps) return this.hasRequireFailures() ? (this._timer = r(function () {
                    this.state = ce, this.tryEmit()
                }, e.interval, this), le) : ce
            }
            return 32
        }, failTimeout: function () {
            return this._timer = r(function () {
                this.state = 32
            }, this.options.interval, this), 32
        }, reset: function () {
            clearTimeout(this._timer)
        }, emit: function () {
            this.state == ce && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    }), ot.VERSION = "2.0.7", ot.defaults = {
        domEvents: !1,
        touchAction: "compute",
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [[nt, {enable: !1}], [et, {enable: !1}, ["rotate"]], [rt, {direction: Lt}], [tt, {direction: Lt}, ["swipe"]], [st], [st, {
            event: "doubletap",
            taps: 2
        }, ["tap"]], [it]],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    at.prototype = {
        set: function (t) {
            return ut(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
        }, stop: function (t) {
            this.session.stopped = t ? 2 : 1
        }, recognize: function (t) {
            var e = this.session;
            if (!e.stopped) {
                this.touchAction.preventDefaults(t);
                var i, n = this.recognizers, r = e.curRecognizer;
                (!r || r && r.state & ce) && (r = e.curRecognizer = null);
                for (var s = 0; s < n.length;) i = n[s], 2 === e.stopped || r && i != r && !i.canRecognizeWith(r) ? i.reset() : i.recognize(t), !r && i.state & (le | he | ue) && (r = e.curRecognizer = i), s++
            }
        }, get: function (t) {
            if (t instanceof G) return t;
            for (var e = this.recognizers, i = 0; i < e.length; i++) if (e[i].options.event == t) return e[i];
            return null
        }, add: function (t) {
            if (s(t, "add", this)) return this;
            var e = this.get(t.options.event);
            return e && this.remove(e), this.recognizers.push(t), t.manager = this, this.touchAction.update(), t
        }, remove: function (t) {
            if (s(t, "remove", this)) return this;
            if (t = this.get(t)) {
                var e = this.recognizers, i = v(e, t);
                -1 !== i && (e.splice(i, 1), this.touchAction.update())
            }
            return this
        }, on: function (t, e) {
            if (t !== n && e !== n) {
                var i = this.handlers;
                return o(m(t), function (t) {
                    i[t] = i[t] || [], i[t].push(e)
                }), this
            }
        }, off: function (t, e) {
            if (t !== n) {
                var i = this.handlers;
                return o(m(t), function (t) {
                    e ? i[t] && i[t].splice(v(i[t], e), 1) : delete i[t]
                }), this
            }
        }, emit: function (t, e) {
            this.options.domEvents && ht(t, e);
            var i = this.handlers[t] && this.handlers[t].slice();
            if (i && i.length) {
                e.type = t, e.preventDefault = function () {
                    e.srcEvent.preventDefault()
                };
                for (var n = 0; n < i.length;) i[n](e), n++
            }
        }, destroy: function () {
            this.element && lt(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
        }
    }, ut(ot, {
        INPUT_START: Tt,
        INPUT_MOVE: Et,
        INPUT_END: kt,
        INPUT_CANCEL: Pt,
        STATE_POSSIBLE: ae,
        STATE_BEGAN: le,
        STATE_CHANGED: he,
        STATE_ENDED: ue,
        STATE_RECOGNIZED: ce,
        STATE_CANCELLED: de,
        STATE_FAILED: 32,
        DIRECTION_NONE: At,
        DIRECTION_LEFT: zt,
        DIRECTION_RIGHT: It,
        DIRECTION_UP: Mt,
        DIRECTION_DOWN: Ot,
        DIRECTION_HORIZONTAL: Lt,
        DIRECTION_VERTICAL: Nt,
        DIRECTION_ALL: Ft,
        Manager: at,
        Input: C,
        TouchAction: X,
        TouchInput: B,
        MouseInput: D,
        PointerEventInput: q,
        TouchMouseInput: W,
        SingleTouchInput: R,
        Recognizer: G,
        AttrRecognizer: K,
        Tap: st,
        Pan: tt,
        Swipe: rt,
        Pinch: et,
        Rotate: nt,
        Press: it,
        on: d,
        off: f,
        each: o,
        merge: _t,
        extend: vt,
        assign: ut,
        inherit: l,
        bindFn: h,
        prefixed: w
    }), (void 0 !== t ? t : "undefined" != typeof self ? self : {}).Hammer = ot, "function" == typeof define && define.amd ? define(function () {
        return ot
    }) : "undefined" != typeof module && module.exports ? module.exports = ot : t.Hammer = ot
}(window, document), function (t, e) {
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery)
}(window, function (t, e) {
    "use strict";

    function i(i, s, a) {
        function l(t, e, n) {
            var r, s = "$()." + i + '("' + e + '")';
            return t.each(function (t, l) {
                var h = a.data(l, i);
                if (!h) return void o(i + " not initialized. Cannot call methods, i.e. " + s);
                var u = h[e];
                if (!u || "_" == e.charAt(0)) return void o(s + " is not a valid method");
                var c = u.apply(h, n);
                r = void 0 === r ? c : r
            }), void 0 !== r ? r : t
        }

        function h(t, e) {
            t.each(function (t, n) {
                var r = a.data(n, i);
                r ? (r.option(e), r._init()) : (r = new s(n, e), a.data(n, i, r))
            })
        }

        (a = a || e || t.jQuery) && (s.prototype.option || (s.prototype.option = function (t) {
            a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t))
        }), a.fn[i] = function (t) {
            if ("string" == typeof t) {
                return l(this, t, r.call(arguments, 1))
            }
            return h(this, t), this
        }, n(a))
    }

    function n(t) {
        !t || t && t.bridget || (t.bridget = i)
    }

    var r = Array.prototype.slice, s = t.console, o = void 0 === s ? function () {
    } : function (t) {
        s.error(t)
    };
    return n(e || t.jQuery), i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function () {
    function t() {
    }

    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {}, n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {};
            return (i[t] = i[t] || {})[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            i = i.slice(0), e = e || [];
            for (var n = this._onceEvents && this._onceEvents[t], r = 0; r < i.length; r++) {
                var s = i[r];
                n && n[s] && (this.off(t, s), delete n[s]), s.apply(this, e)
            }
            return this
        }
    }, e.allOff = function () {
        delete this._events, delete this._onceEvents
    }, t
}), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("get-size/get-size", [], function () {
        return e()
    }) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
}(window, function () {
    "use strict";

    function t(t) {
        var e = parseFloat(t);
        return -1 == t.indexOf("%") && !isNaN(e) && e
    }

    function e() {
    }

    function i() {
        for (var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, e = 0; e < h; e++) {
            t[l[e]] = 0
        }
        return t
    }

    function n(t) {
        var e = getComputedStyle(t);
        return e || a("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), e
    }

    function r() {
        if (!u) {
            u = !0;
            var e = document.createElement("div");
            e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style.boxSizing = "border-box";
            var i = document.body || document.documentElement;
            i.appendChild(e);
            var r = n(e);
            s.isBoxSizeOuter = o = 200 == t(r.width), i.removeChild(e)
        }
    }

    function s(e) {
        if (r(), "string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
            var s = n(e);
            if ("none" == s.display) return i();
            var a = {};
            a.width = e.offsetWidth, a.height = e.offsetHeight;
            for (var u = a.isBorderBox = "border-box" == s.boxSizing, c = 0; c < h; c++) {
                var d = l[c], f = s[d], p = parseFloat(f);
                a[d] = isNaN(p) ? 0 : p
            }
            var g = a.paddingLeft + a.paddingRight, m = a.paddingTop + a.paddingBottom,
                v = a.marginLeft + a.marginRight, _ = a.marginTop + a.marginBottom,
                y = a.borderLeftWidth + a.borderRightWidth, w = a.borderTopWidth + a.borderBottomWidth, x = u && o,
                b = t(s.width);
            !1 !== b && (a.width = b + (x ? 0 : g + y));
            var C = t(s.height);
            return !1 !== C && (a.height = C + (x ? 0 : m + w)), a.innerWidth = a.width - (g + y), a.innerHeight = a.height - (m + w), a.outerWidth = a.width + v, a.outerHeight = a.height + _, a
        }
    }

    var o, a = "undefined" == typeof console ? e : function (t) {
            console.error(t)
        },
        l = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
        h = l.length, u = !1;
    return s
}), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
}(window, function () {
    "use strict";
    var t = function () {
        var t = window.Element.prototype;
        if (t.matches) return "matches";
        if (t.matchesSelector) return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var n = e[i], r = n + "MatchesSelector";
            if (t[r]) return r
        }
    }();
    return function (e, i) {
        return e[t](i)
    }
}), function (t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function (i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector)
}(window, function (t, e) {
    var i = {};
    i.extend = function (t, e) {
        for (var i in e) t[i] = e[i];
        return t
    }, i.modulo = function (t, e) {
        return (t % e + e) % e
    }, i.makeArray = function (t) {
        var e = [];
        if (Array.isArray(t)) e = t; else if (t && "object" == typeof t && "number" == typeof t.length) for (var i = 0; i < t.length; i++) e.push(t[i]); else e.push(t);
        return e
    }, i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        -1 != i && t.splice(i, 1)
    }, i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body;) if (t = t.parentNode, e(t, i)) return t
    }, i.getQueryElement = function (t) {
        return "string" == typeof t ? document.querySelector(t) : t
    }, i.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, i.filterFindElements = function (t, n) {
        t = i.makeArray(t);
        var r = [];
        return t.forEach(function (t) {
            if (t instanceof HTMLElement) {
                if (!n) return void r.push(t);
                e(t, n) && r.push(t);
                for (var i = t.querySelectorAll(n), s = 0; s < i.length; s++) r.push(i[s])
            }
        }), r
    }, i.debounceMethod = function (t, e, i) {
        var n = t.prototype[e], r = e + "Timeout";
        t.prototype[e] = function () {
            var t = this[r];
            t && clearTimeout(t);
            var e = arguments, s = this;
            this[r] = setTimeout(function () {
                n.apply(s, e), delete s[r]
            }, i || 100)
        }
    }, i.docReady = function (t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
    }, i.toDashed = function (t) {
        return t.replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    };
    var n = t.console;
    return i.htmlInit = function (e, r) {
        i.docReady(function () {
            var s = i.toDashed(r), o = "data-" + s, a = document.querySelectorAll("[" + o + "]"),
                l = document.querySelectorAll(".js-" + s), h = i.makeArray(a).concat(i.makeArray(l)),
                u = o + "-options", c = t.jQuery;
            h.forEach(function (t) {
                var i, s = t.getAttribute(o) || t.getAttribute(u);
                try {
                    i = s && JSON.parse(s)
                } catch (e) {
                    return void (n && n.error("Error parsing " + o + " on " + t.className + ": " + e))
                }
                var a = new e(t, i);
                c && c.data(t, r, a)
            })
        })
    }, i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize))
}(window, function (t, e) {
    "use strict";

    function i(t) {
        for (var e in t) return !1;
        return null, !0
    }

    function n(t, e) {
        t && (this.element = t, this.layout = e, this.position = {x: 0, y: 0}, this._create())
    }

    var r = document.documentElement.style, s = "string" == typeof r.transition ? "transition" : "WebkitTransition",
        o = "string" == typeof r.transform ? "transform" : "WebkitTransform",
        a = {WebkitTransition: "webkitTransitionEnd", transition: "transitionend"}[s], l = {
            transform: o,
            transition: s,
            transitionDuration: s + "Duration",
            transitionProperty: s + "Property",
            transitionDelay: s + "Delay"
        }, h = n.prototype = Object.create(t.prototype);
    h.constructor = n, h._create = function () {
        this._transn = {ingProperties: {}, clean: {}, onEnd: {}}, this.css({position: "absolute"})
    }, h.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, h.getSize = function () {
        this.size = e(this.element)
    }, h.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
            e[l[i] || i] = t[i]
        }
    }, h.getPosition = function () {
        var t = getComputedStyle(this.element), e = this.layout._getOption("originLeft"),
            i = this.layout._getOption("originTop"), n = t[e ? "left" : "right"], r = t[i ? "top" : "bottom"],
            s = this.layout.size, o = -1 != n.indexOf("%") ? parseFloat(n) / 100 * s.width : parseInt(n, 10),
            a = -1 != r.indexOf("%") ? parseFloat(r) / 100 * s.height : parseInt(r, 10);
        o = isNaN(o) ? 0 : o, a = isNaN(a) ? 0 : a, o -= e ? s.paddingLeft : s.paddingRight, a -= i ? s.paddingTop : s.paddingBottom, this.position.x = o, this.position.y = a
    }, h.layoutPosition = function () {
        var t = this.layout.size, e = {}, i = this.layout._getOption("originLeft"),
            n = this.layout._getOption("originTop"), r = i ? "paddingLeft" : "paddingRight", s = i ? "left" : "right",
            o = i ? "right" : "left", a = this.position.x + t[r];
        e[s] = this.getXValue(a), e[o] = "";
        var l = n ? "paddingTop" : "paddingBottom", h = n ? "top" : "bottom", u = n ? "bottom" : "top",
            c = this.position.y + t[l];
        e[h] = this.getYValue(c), e[u] = "", this.css(e), this.emitEvent("layout", [this])
    }, h.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
    }, h.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
    }, h._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x, n = this.position.y, r = parseInt(t, 10), s = parseInt(e, 10),
            o = r === this.position.x && s === this.position.y;
        if (this.setPosition(t, e), o && !this.isTransitioning) return void this.layoutPosition();
        var a = t - i, l = e - n, h = {};
        h.transform = this.getTranslate(a, l), this.transition({
            to: h,
            onTransitionEnd: {transform: this.layoutPosition},
            isCleaning: !0
        })
    }, h.getTranslate = function (t, e) {
        var i = this.layout._getOption("originLeft"), n = this.layout._getOption("originTop");
        return t = i ? t : -t, e = n ? e : -e, "translate3d(" + t + "px, " + e + "px, 0)"
    }, h.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition()
    }, h.moveTo = h._transitionTo, h.setPosition = function (t, e) {
        this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
    }, h._nonTransition = function (t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
    }, h.transition = function (t) {
        if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            this.element.offsetHeight;
            null
        }
        this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
    };
    var u = "opacity," + function (t) {
        return t.replace(/([A-Z])/g, function (t) {
            return "-" + t.toLowerCase()
        })
    }(o);
    h.enableTransition = function () {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t, this.css({
                transitionProperty: u,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }), this.element.addEventListener(a, this, !1)
        }
    }, h.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t)
    }, h.onotransitionend = function (t) {
        this.ontransitionend(t)
    };
    var c = {"-webkit-transform": "transform"};
    h.ontransitionend = function (t) {
        if (t.target === this.element) {
            var e = this._transn, n = c[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[n], i(e.ingProperties) && this.disableTransition(), n in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[n]), n in e.onEnd) {
                e.onEnd[n].call(this), delete e.onEnd[n]
            }
            this.emitEvent("transitionEnd", [this])
        }
    }, h.disableTransition = function () {
        this.removeTransitionStyles(), this.element.removeEventListener(a, this, !1), this.isTransitioning = !1
    }, h._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e)
    };
    var d = {transitionProperty: "", transitionDuration: "", transitionDelay: ""};
    return h.removeTransitionStyles = function () {
        this.css(d)
    }, h.stagger = function (t) {
        t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms"
    }, h.removeElem = function () {
        this.element.parentNode.removeChild(this.element), this.css({display: ""}), this.emitEvent("remove", [this])
    }, h.remove = function () {
        if (!s || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
        this.once("transitionEnd", function () {
            this.removeElem()
        }), this.hide()
    }, h.reveal = function () {
        delete this.isHidden, this.css({display: ""});
        var t = this.layout.options, e = {};
        e[this.getHideRevealTransitionEndProperty("visibleStyle")] = this.onRevealTransitionEnd, this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, h.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal")
    }, h.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i
    }, h.hide = function () {
        this.isHidden = !0, this.css({display: ""});
        var t = this.layout.options, e = {};
        e[this.getHideRevealTransitionEndProperty("hiddenStyle")] = this.onHideTransitionEnd, this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, h.onHideTransitionEnd = function () {
        this.isHidden && (this.css({display: "none"}), this.emitEvent("hide"))
    }, h.destroy = function () {
        this.css({position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: ""})
    }, n
}), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function (i, n, r, s) {
        return e(t, i, n, r, s)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
}(window, function (t, e, i, n, r) {
    "use strict";

    function s(t, e) {
        var i = n.getQueryElement(t);
        if (!i) return void (l && l.error("Bad element for " + this.constructor.namespace + ": " + (i || t)));
        this.element = i, h && (this.$element = h(this.element)), this.options = n.extend({}, this.constructor.defaults), this.option(e);
        var r = ++c;
        this.element.outlayerGUID = r, d[r] = this, this._create(), this._getOption("initLayout") && this.layout()
    }

    function o(t) {
        function e() {
            t.apply(this, arguments)
        }

        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e
    }

    function a(t) {
        if ("number" == typeof t) return t;
        var e = t.match(/(^\d*\.?\d*)(\w*)/), i = e && e[1], n = e && e[2];
        return i.length ? (i = parseFloat(i)) * (p[n] || 1) : 0
    }

    var l = t.console, h = t.jQuery, u = function () {
    }, c = 0, d = {};
    s.namespace = "outlayer", s.Item = r, s.defaults = {
        containerStyle: {position: "relative"},
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {opacity: 0, transform: "scale(0.001)"},
        visibleStyle: {opacity: 1, transform: "scale(1)"}
    };
    var f = s.prototype;
    n.extend(f, e.prototype), f.option = function (t) {
        n.extend(this.options, t)
    }, f._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
    }, s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    }, f._create = function () {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), n.extend(this.element.style, this.options.containerStyle), this._getOption("resize") && this.bindResize()
    }, f.reloadItems = function () {
        this.items = this._itemize(this.element.children)
    }, f._itemize = function (t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], r = 0; r < e.length; r++) {
            var s = e[r], o = new i(s, this);
            n.push(o)
        }
        return n
    }, f._filterFindItemElements = function (t) {
        return n.filterFindElements(t, this.options.itemSelector)
    }, f.getItemElements = function () {
        return this.items.map(function (t) {
            return t.element
        })
    }, f.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"), e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), this._isLayoutInited = !0
    }, f._init = f.layout, f._resetLayout = function () {
        this.getSize()
    }, f.getSize = function () {
        this.size = i(this.element)
    }, f._getMeasurement = function (t, e) {
        var n, r = this.options[t];
        r ? ("string" == typeof r ? n = this.element.querySelector(r) : r instanceof HTMLElement && (n = r), this[t] = n ? i(n)[e] : r) : this[t] = 0
    }, f.layoutItems = function (t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
    }, f._getItemsForLayout = function (t) {
        return t.filter(function (t) {
            return !t.isIgnored
        })
    }, f._layoutItems = function (t, e) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            var i = [];
            t.forEach(function (t) {
                var n = this._getItemLayoutPosition(t);
                n.item = t, n.isInstant = e || t.isLayoutInstant, i.push(n)
            }, this), this._processLayoutQueue(i)
        }
    }, f._getItemLayoutPosition = function () {
        return {x: 0, y: 0}
    }, f._processLayoutQueue = function (t) {
        this.updateStagger(), t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e)
        }, this)
    }, f.updateStagger = function () {
        var t = this.options.stagger;
        return null === t || void 0 === t ? void (this.stagger = 0) : (this.stagger = a(t), this.stagger)
    }, f._positionItem = function (t, e, i, n, r) {
        n ? t.goTo(e, i) : (t.stagger(r * this.stagger), t.moveTo(e, i))
    }, f._postLayout = function () {
        this.resizeContainer()
    }, f.resizeContainer = function () {
        if (this._getOption("resizeContainer")) {
            var t = this._getContainerSize();
            t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
        }
    }, f._getContainerSize = u, f._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
        }
    }, f._emitCompleteOnItems = function (t, e) {
        function i() {
            r.dispatchEvent(t + "Complete", null, [e])
        }

        function n() {
            ++o == s && i()
        }

        var r = this, s = e.length;
        if (!e || !s) return void i();
        var o = 0;
        e.forEach(function (e) {
            e.once(t, n)
        })
    }, f.dispatchEvent = function (t, e, i) {
        var n = e ? [e].concat(i) : i;
        if (this.emitEvent(t, n), h) if (this.$element = this.$element || h(this.element), e) {
            var r = h.Event(e);
            r.type = t, this.$element.trigger(r, i)
        } else this.$element.trigger(t, i)
    }, f.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }, f.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }, f.stamp = function (t) {
        (t = this._find(t)) && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this))
    }, f.unstamp = function (t) {
        (t = this._find(t)) && t.forEach(function (t) {
            n.removeFrom(this.stamps, t), this.unignore(t)
        }, this)
    }, f._find = function (t) {
        if (t) return "string" == typeof t && (t = this.element.querySelectorAll(t)), t = n.makeArray(t)
    }, f._manageStamps = function () {
        this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this))
    }, f._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(), e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }, f._manageStamp = u, f._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(), n = this._boundingRect, r = i(t);
        return {
            left: e.left - n.left - r.marginLeft,
            top: e.top - n.top - r.marginTop,
            right: n.right - e.right - r.marginRight,
            bottom: n.bottom - e.bottom - r.marginBottom
        }
    }, f.handleEvent = n.handleEvent, f.bindResize = function () {
        t.addEventListener("resize", this), this.isResizeBound = !0
    }, f.unbindResize = function () {
        t.removeEventListener("resize", this), this.isResizeBound = !1
    }, f.onresize = function () {
        this.resize()
    }, n.debounceMethod(s, "onresize", 100), f.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }, f.needsResizeLayout = function () {
        var t = i(this.element);
        return this.size && t && t.innerWidth !== this.size.innerWidth
    }, f.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e
    }, f.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e))
    }, f.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
        }
    }, f.reveal = function (t) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function (t, i) {
                t.stagger(i * e), t.reveal()
            })
        }
    }, f.hide = function (t) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function (t, i) {
                t.stagger(i * e), t.hide()
            })
        }
    }, f.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e)
    }, f.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e)
    }, f.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t) return i
        }
    }, f.getItems = function (t) {
        t = n.makeArray(t);
        var e = [];
        return t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i)
        }, this), e
    }, f.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e), e && e.length && e.forEach(function (t) {
            t.remove(), n.removeFrom(this.items, t)
        }, this)
    }, f.destroy = function () {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "", this.items.forEach(function (t) {
            t.destroy()
        }), this.unbindResize();
        var e = this.element.outlayerGUID;
        delete d[e], delete this.element.outlayerGUID, h && h.removeData(this.element, this.constructor.namespace)
    }, s.data = function (t) {
        t = n.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && d[e]
    }, s.create = function (t, e) {
        var i = o(s);
        return i.defaults = n.extend({}, s.defaults), n.extend(i.defaults, e), i.compatOptions = n.extend({}, s.compatOptions), i.namespace = t, i.data = s.data, i.Item = o(r), n.htmlInit(i, t), h && h.bridget && h.bridget(t, i), i
    };
    var p = {ms: 1, s: 1e3};
    return s.Item = r, s
}), function (t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
}(window, function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var n = i.prototype;
    return n._resetLayout = function () {
        this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        this.maxY = 0, this.horizontalColIndex = 0
    }, n.measureColumns = function () {
        if (this.getContainerWidth(), !this.columnWidth) {
            var t = this.items[0], i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth
        }
        var n = this.columnWidth += this.gutter, r = this.containerWidth + this.gutter, s = r / n, o = n - r % n,
            a = o && o < 1 ? "round" : "floor";
        s = Math[a](s), this.cols = Math.max(s, 1)
    }, n.getContainerWidth = function () {
        var t = this._getOption("fitWidth"), i = t ? this.element.parentNode : this.element, n = e(i);
        this.containerWidth = n && n.innerWidth
    }, n._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth, i = e && e < 1 ? "round" : "ceil",
            n = Math[i](t.size.outerWidth / this.columnWidth);
        n = Math.min(n, this.cols);
        for (var r = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition", s = this[r](n, t), o = {
            x: this.columnWidth * s.col,
            y: s.y
        }, a = s.y + t.size.outerHeight, l = n + s.col, h = s.col; h < l; h++) this.colYs[h] = a;
        return o
    }, n._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t), i = Math.min.apply(Math, e);
        return {col: e.indexOf(i), y: i}
    }, n._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; n < i; n++) e[n] = this._getColGroupY(n, t);
        return e
    }, n._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i)
    }, n._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols;
        i = t > 1 && i + t > this.cols ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return this.horizontalColIndex = n ? i + t : this.horizontalColIndex, {col: i, y: this._getColGroupY(i, t)}
    }, n._manageStamp = function (t) {
        var i = e(t), n = this._getElementOffset(t), r = this._getOption("originLeft"), s = r ? n.left : n.right,
            o = s + i.outerWidth, a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var l = Math.floor(o / this.columnWidth);
        l -= o % this.columnWidth ? 0 : 1, l = Math.min(this.cols - 1, l);
        for (var h = this._getOption("originTop"), u = (h ? n.top : n.bottom) + i.outerHeight, c = a; c <= l; c++) this.colYs[c] = Math.max(u, this.colYs[c])
    }, n._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {height: this.maxY};
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), t
    }, n._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }, n.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth
    }, i
}), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.MediaBox = e()
}(this, function () {
    "use strict";
    var t = function (e) {
        return this && this instanceof t ? !!e && (this.selector = e instanceof NodeList ? e : document.querySelectorAll(e), this.root = document.querySelector("body"), void this.run()) : new t(e)
    };
    return t.prototype = {
        run: function () {
            Array.prototype.forEach.call(this.selector, function (t) {
                t.addEventListener("click", function (e) {
                    e.preventDefault();
                    var i = this.parseUrl(t.getAttribute("href"));
                    this.render(i), this.events()
                }.bind(this), !1)
            }.bind(this)), this.root.addEventListener("keyup", function (t) {
                27 === (t.keyCode || t.which) && this.close(this.root.querySelector(".mediabox-wrap"))
            }.bind(this), !1)
        }, template: function (t, e) {
            var i;
            for (i in e) e.hasOwnProperty(i) && (t = t.replace(new RegExp("{" + i + "}", "g"), e[i]));
            return t
        }, parseUrl: function (t) {
            var e, i = {};
            return (e = t.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)) ? (i.provider = "youtube", i.id = e[2]) : (e = t.match(/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/)) ? (i.provider = "vimeo", i.id = e[3]) : (i.provider = "Unknown", i.id = ""), i
        }, render: function (t) {
            var e, i;
            if ("youtube" === t.provider) e = "https://www.youtube.com/embed/" + t.id; else {
                if ("vimeo" !== t.provider) throw new Error("Invalid video URL");
                e = "https://player.vimeo.com/video/" + t.id
            }
            i = this.template('<div class="mediabox-wrap" role="dialog" aria-hidden="false"><div class="mediabox-content" role="document" tabindex="0"><span class="mediabox-close" aria-label="close"></span><iframe src="{embed}?autoplay=1" frameborder="0" allowfullscreen></iframe></div></div>', {embed: e}), this.root.insertAdjacentHTML("beforeend", i)
        }, events: function () {
            var t = document.querySelector(".mediabox-wrap");
            t.addEventListener("click", function (e) {
                (e.target && "SPAN" === e.target.nodeName && "mediabox-close" === e.target.className || "DIV" === e.target.nodeName && "mediabox-wrap" === e.target.className) && this.close(t)
            }.bind(this), !1)
        }, close: function (t) {
            if (null === t) return !0;
            var e = null;
            e && clearTimeout(e), t.classList.add("mediabox-hide"), e = setTimeout(function () {
                var t = document.querySelector(".mediabox-wrap");
                null !== t && this.root.removeChild(t)
            }.bind(this), 500)
        }
    }, t
}), function (t, e) {
    t.IS_TOUCH_DEVICE = function () {
        "use strict";
        try {
            return "ontouchstart" in window || navigator.maxTouchPoints
        } catch (t) {
            return !1
        }
    }()
}(this), ResizeSensor = function (t, e) {
    function i() {
        this.q = [], this.add = function (t) {
            this.q.push(t)
        };
        var t, e;
        this.call = function () {
            for (t = 0, e = this.q.length; t < e; t++) this.q[t].call()
        }
    }

    function n(t, e) {
        return t.currentStyle ? t.currentStyle[e] : window.getComputedStyle ? window.getComputedStyle(t, null).getPropertyValue(e) : t.style[e]
    }

    function r(t, e) {
        if (t.resizedAttached) {
            if (t.resizedAttached) return void t.resizedAttached.add(e)
        } else t.resizedAttached = new i, t.resizedAttached.add(e);
        t.resizeSensor = document.createElement("div"), t.resizeSensor.className = "resize-sensor";
        var r = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;",
            s = "position: absolute; left: 0; top: 0;";
        t.resizeSensor.style.cssText = r, t.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + r + '"><div style="' + s + '"></div></div><div class="resize-sensor-shrink" style="' + r + '"><div style="' + s + ' width: 200%; height: 200%"></div></div>', t.appendChild(t.resizeSensor), {
            fixed: 1,
            absolute: 1
        }[n(t, "position")] || (t.style.position = "relative");
        var o, a, l = t.resizeSensor.childNodes[0], h = l.childNodes[0], u = t.resizeSensor.childNodes[1],
            c = (u.childNodes[0], function () {
                h.style.width = l.offsetWidth + 10 + "px", h.style.height = l.offsetHeight + 10 + "px", l.scrollLeft = l.scrollWidth, l.scrollTop = l.scrollHeight, u.scrollLeft = u.scrollWidth, u.scrollTop = u.scrollHeight, o = t.offsetWidth, a = t.offsetHeight
            });
        c();
        var d = function () {
            t.resizedAttached && t.resizedAttached.call()
        }, f = function (t, e, i) {
            t.attachEvent ? t.attachEvent("on" + e, i) : t.addEventListener(e, i)
        };
        f(l, "scroll", function () {
            (t.offsetWidth > o || t.offsetHeight > a) && d(), c()
        }), f(u, "scroll", function () {
            (t.offsetWidth < o || t.offsetHeight < a) && d(), c()
        })
    }

    if ("[object Array]" === Object.prototype.toString.call(t) || "undefined" != typeof jQuery && t instanceof jQuery || "undefined" != typeof Elements && t instanceof Elements) for (var s = 0, o = t.length; s < o; s++) r(t[s], e); else r(t, e);
    this.detach = function () {
        ResizeSensor.detach(t)
    }
}, ResizeSensor.detach = function (t) {
    t.resizeSensor && (t.removeChild(t.resizeSensor), delete t.resizeSensor, delete t.resizedAttached)
}, function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define("Siema", [], e) : "object" == typeof exports ? exports.Siema = e() : t.Siema = e()
}(this, function () {
    return function (t) {
        function e(n) {
            if (i[n]) return i[n].exports;
            var r = i[n] = {i: n, l: !1, exports: {}};
            return t[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports
        }

        var i = {};
        return e.m = t, e.c = i, e.i = function (t) {
            return t
        }, e.d = function (t, i, n) {
            e.o(t, i) || Object.defineProperty(t, i, {configurable: !1, enumerable: !0, get: n})
        }, e.n = function (t) {
            var i = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return e.d(i, "a", i), i
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 0)
    }([function (t, e, i) {
        "use strict";

        function n(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        Object.defineProperty(e, "__esModule", {value: !0});
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }, s = function () {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }

            return function (e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }(), o = function () {
            function t(e) {
                var i = this;
                n(this, t), this.config = t.mergeSettings(e), this.selector = "string" == typeof this.config.selector ? document.querySelector(this.config.selector) : this.config.selector, this.selectorWidth = this.selector.offsetWidth, this.innerElements = [].slice.call(this.selector.children), this.currentSlide = this.config.startIndex, this.transformProperty = t.webkitOrNot(), ["resizeHandler", "touchstartHandler", "touchendHandler", "touchmoveHandler", "mousedownHandler", "mouseupHandler", "mouseleaveHandler", "mousemoveHandler"].forEach(function (t) {
                    i[t] = i[t].bind(i)
                }), this.init()
            }

            return s(t, [{
                key: "init", value: function () {
                    if (window.addEventListener("resize", this.resizeHandler), this.config.draggable && (this.pointerDown = !1, this.drag = {
                        startX: 0,
                        endX: 0,
                        startY: 0,
                        letItGo: null
                    }, this.selector.addEventListener("touchstart", this.touchstartHandler), this.selector.addEventListener("touchend", this.touchendHandler), this.selector.addEventListener("touchmove", this.touchmoveHandler, {passive: !0}), this.selector.addEventListener("mousedown", this.mousedownHandler), this.selector.addEventListener("mouseup", this.mouseupHandler), this.selector.addEventListener("mouseleave", this.mouseleaveHandler), this.selector.addEventListener("mousemove", this.mousemoveHandler)), null === this.selector) throw new Error("Something wrong with your selector 😭");
                    this.resolveSlidesNumber(), this.selector.style.overflow = "hidden", this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = this.selectorWidth / this.perPage * this.innerElements.length + "px", this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.config.draggable && (this.selector.style.cursor = "-webkit-grab");
                    for (var t = document.createDocumentFragment(), e = 0; e < this.innerElements.length; e++) {
                        var i = document.createElement("div");
                        i.style.cssFloat = "left", i.style.float = "left", i.style.width = 100 / this.innerElements.length + "%", i.appendChild(this.innerElements[e]), t.appendChild(i)
                    }
                    this.sliderFrame.appendChild(t), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent(), this.config.onInit.call(this)
                }
            }, {
                key: "resolveSlidesNumber", value: function () {
                    if ("number" == typeof this.config.perPage) this.perPage = this.config.perPage; else if ("object" === r(this.config.perPage)) {
                        this.perPage = 1;
                        for (var t in this.config.perPage) window.innerWidth >= t && (this.perPage = this.config.perPage[t])
                    }
                }
            }, {
                key: "prev", value: function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, e = arguments[1];
                    if (!(this.innerElements.length <= this.perPage)) {
                        var i = this.currentSlide;
                        0 === this.currentSlide && this.config.loop ? this.currentSlide = this.innerElements.length - this.perPage : this.currentSlide = Math.max(this.currentSlide - t, 0), i !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), e && e.call(this))
                    }
                }
            }, {
                key: "next", value: function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, e = arguments[1];
                    if (!(this.innerElements.length <= this.perPage)) {
                        var i = this.currentSlide;
                        this.currentSlide === this.innerElements.length - this.perPage && this.config.loop ? this.currentSlide = 0 : this.currentSlide = Math.min(this.currentSlide + t, this.innerElements.length - this.perPage), i !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), e && e.call(this))
                    }
                }
            }, {
                key: "goTo", value: function (t, e) {
                    this.innerElements.length <= this.perPage || (this.currentSlide = Math.min(Math.max(t, 0), this.innerElements.length - this.perPage), this.slideToCurrent(), e && e.call(this))
                }
            }, {
                key: "slideToCurrent", value: function () {
                    this.sliderFrame.style[this.transformProperty] = "translate3d(-" + this.currentSlide * (this.selectorWidth / this.perPage) + "px, 0, 0)"
                }
            }, {
                key: "updateAfterDrag", value: function () {
                    var t = this.drag.endX - this.drag.startX, e = Math.abs(t),
                        i = Math.ceil(e / (this.selectorWidth / this.perPage))
                    ;t > 0 && e > this.config.threshold && this.innerElements.length > this.perPage ? this.prev(i) : t < 0 && e > this.config.threshold && this.innerElements.length > this.perPage && this.next(i), this.slideToCurrent()
                }
            }, {
                key: "resizeHandler", value: function () {
                    this.resolveSlidesNumber(), this.selectorWidth = this.selector.offsetWidth, this.sliderFrame.style.width = this.selectorWidth / this.perPage * this.innerElements.length + "px", this.slideToCurrent()
                }
            }, {
                key: "clearDrag", value: function () {
                    this.drag = {startX: 0, endX: 0, startY: 0, letItGo: null}
                }
            }, {
                key: "touchstartHandler", value: function (t) {
                    t.stopPropagation(), this.pointerDown = !0, this.drag.startX = t.touches[0].pageX, this.drag.startY = t.touches[0].pageY
                }
            }, {
                key: "touchendHandler", value: function (t) {
                    t.stopPropagation(), this.pointerDown = !1, this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.drag.endX && this.updateAfterDrag(), this.clearDrag()
                }
            }, {
                key: "touchmoveHandler", value: function (t) {
                    t.stopPropagation(), null === this.drag.letItGo && (this.drag.letItGo = Math.abs(this.drag.startY - t.touches[0].pageY) < Math.abs(this.drag.startX - t.touches[0].pageX)), this.pointerDown && this.drag.letItGo && (this.drag.endX = t.touches[0].pageX, this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing, this.sliderFrame.style[this.transformProperty] = "translate3d(" + -1 * (this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.startX - this.drag.endX)) + "px, 0, 0)")
                }
            }, {
                key: "mousedownHandler", value: function (t) {
                    t.preventDefault(), t.stopPropagation(), this.pointerDown = !0, this.drag.startX = t.pageX
                }
            }, {
                key: "mouseupHandler", value: function (t) {
                    t.stopPropagation(), this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.drag.endX && this.updateAfterDrag(), this.clearDrag()
                }
            }, {
                key: "mousemoveHandler", value: function (t) {
                    t.preventDefault(), this.pointerDown && (this.drag.endX = t.pageX, this.selector.style.cursor = "-webkit-grabbing", this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing, this.sliderFrame.style[this.transformProperty] = "translate3d(" + -1 * (this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.startX - this.drag.endX)) + "px, 0, 0)")
                }
            }, {
                key: "mouseleaveHandler", value: function (t) {
                    this.pointerDown && (this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.drag.endX = t.pageX, this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.updateAfterDrag(), this.clearDrag())
                }
            }, {
                key: "updateFrame", value: function () {
                    this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = this.selectorWidth / this.perPage * this.innerElements.length + "px", this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.config.draggable && (this.selector.style.cursor = "-webkit-grab");
                    for (var t = document.createDocumentFragment(), e = 0; e < this.innerElements.length; e++) {
                        var i = document.createElement("div");
                        i.style.cssFloat = "left", i.style.float = "left", i.style.width = 100 / this.innerElements.length + "%", i.appendChild(this.innerElements[e]), t.appendChild(i)
                    }
                    this.sliderFrame.appendChild(t), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent()
                }
            }, {
                key: "remove", value: function (t, e) {
                    if (t < 0 || t > this.innerElements.length) throw new Error("Item to remove doesn't exist 😭");
                    this.innerElements.splice(t, 1), this.currentSlide = t < this.currentSlide ? this.currentSlide - 1 : this.currentSlide, this.updateFrame(), e && e.call(this)
                }
            }, {
                key: "insert", value: function (t, e, i) {
                    if (e < 0 || e > this.innerElements.length + 1) throw new Error("Unable to inset it at this index 😭");
                    if (-1 !== this.innerElements.indexOf(t)) throw new Error("The same item in a carousel? Really? Nope 😭");
                    this.innerElements.splice(e, 0, t), this.currentSlide = e <= this.currentSlide ? this.currentSlide + 1 : this.currentSlide, this.updateFrame(), i && i.call(this)
                }
            }, {
                key: "prepend", value: function (t, e) {
                    this.insert(t, 0), e && e.call(this)
                }
            }, {
                key: "append", value: function (t, e) {
                    this.insert(t, this.innerElements.length + 1), e && e.call(this)
                }
            }, {
                key: "destroy", value: function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], e = arguments[1];
                    if (window.removeEventListener("resize", this.resizeHandler), this.selector.style.cursor = "auto", this.selector.removeEventListener("touchstart", this.touchstartHandler), this.selector.removeEventListener("touchend", this.touchendHandler), this.selector.removeEventListener("touchmove", this.touchmoveHandler), this.selector.removeEventListener("mousedown", this.mousedownHandler), this.selector.removeEventListener("mouseup", this.mouseupHandler), this.selector.removeEventListener("mouseleave", this.mouseleaveHandler), this.selector.removeEventListener("mousemove", this.mousemoveHandler), t) {
                        for (var i = document.createDocumentFragment(), n = 0; n < this.innerElements.length; n++) i.appendChild(this.innerElements[n]);
                        this.selector.innerHTML = "", this.selector.appendChild(i), this.selector.removeAttribute("style")
                    }
                    e && e.call(this)
                }
            }], [{
                key: "mergeSettings", value: function (t) {
                    var e = {
                        selector: ".siema",
                        duration: 200,
                        easing: "ease-out",
                        perPage: 1,
                        startIndex: 0,
                        draggable: !0,
                        threshold: 20,
                        loop: !1,
                        onInit: function () {
                        },
                        onChange: function () {
                        }
                    }, i = t;
                    for (var n in i) e[n] = i[n];
                    return e
                }
            }, {
                key: "webkitOrNot", value: function () {
                    return "string" == typeof document.documentElement.style.transform ? "transform" : "WebkitTransform"
                }
            }]), t
        }();
        e.default = o, t.exports = e.default
    }])
}), function (t, e) {
    var i = function (t, e) {
        "use strict";
        if (e.getElementsByClassName) {
            var i, n, r = e.documentElement, s = t.Date, o = t.HTMLPictureElement, a = t.addEventListener,
                l = t.setTimeout, h = t.requestAnimationFrame || l, u = t.requestIdleCallback, c = /^picture$/i,
                d = ["load", "error", "lazyincluded", "_lazyloaded"], f = {}, p = Array.prototype.forEach,
                g = function (t, e) {
                    return f[e] || (f[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), f[e].test(t.getAttribute("class") || "") && f[e]
                }, m = function (t, e) {
                    g(t, e) || t.setAttribute("class", (t.getAttribute("class") || "").trim() + " " + e)
                }, v = function (t, e) {
                    var i;
                    (i = g(t, e)) && t.setAttribute("class", (t.getAttribute("class") || "").replace(i, " "))
                }, _ = function (t, e, i) {
                    var n = i ? "addEventListener" : "removeEventListener";
                    i && _(t, e), d.forEach(function (i) {
                        t[n](i, e)
                    })
                }, y = function (t, n, r, s, o) {
                    var a = e.createEvent("CustomEvent");
                    return r || (r = {}), r.instance = i, a.initCustomEvent(n, !s, !o, r), t.dispatchEvent(a), a
                }, w = function (e, i) {
                    var r;
                    !o && (r = t.picturefill || n.pf) ? r({reevaluate: !0, elements: [e]}) : i && i.src && (e.src = i.src)
                }, x = function (t, e) {
                    return (getComputedStyle(t, null) || {})[e]
                }, b = function (t, e, i) {
                    for (i = i || t.offsetWidth; i < n.minSize && e && !t._lazysizesWidth;) i = e.offsetWidth, e = e.parentNode;
                    return i
                }, C = function () {
                    var t, i, n = [], r = [], s = n, o = function () {
                        var e = s;
                        for (s = n.length ? r : n, t = !0, i = !1; e.length;) e.shift()();
                        t = !1
                    }, a = function (n, r) {
                        t && !r ? n.apply(this, arguments) : (s.push(n), i || (i = !0, (e.hidden ? l : h)(o)))
                    };
                    return a._lsFlush = o, a
                }(), S = function (t, e) {
                    return e ? function () {
                        C(t)
                    } : function () {
                        var e = this, i = arguments;
                        C(function () {
                            t.apply(e, i)
                        })
                    }
                }, T = function (t) {
                    var e, i = 0, r = n.throttleDelay, o = n.ricTimeout, a = function () {
                        e = !1, i = s.now(), t()
                    }, h = u && o > 49 ? function () {
                        u(a, {timeout: o}), o !== n.ricTimeout && (o = n.ricTimeout)
                    } : S(function () {
                        l(a)
                    }, !0);
                    return function (t) {
                        var n;
                        (t = !0 === t) && (o = 33), e || (e = !0, n = r - (s.now() - i), n < 0 && (n = 0), t || n < 9 ? h() : l(h, n))
                    }
                }, E = function (t) {
                    var e, i, n = function () {
                        e = null, t()
                    }, r = function () {
                        var t = s.now() - i;
                        t < 99 ? l(r, 99 - t) : (u || n)(n)
                    };
                    return function () {
                        i = s.now(), e || (e = l(r, 99))
                    }
                };
            !function () {
                var e, i = {
                    lazyClass: "lazyload",
                    loadedClass: "lazyloaded",
                    loadingClass: "lazyloading",
                    preloadClass: "lazypreload",
                    errorClass: "lazyerror",
                    autosizesClass: "lazyautosizes",
                    srcAttr: "data-src",
                    srcsetAttr: "data-srcset",
                    sizesAttr: "data-sizes",
                    minSize: 40,
                    customMedia: {},
                    init: !0,
                    expFactor: 1.5,
                    hFac: .8,
                    loadMode: 2,
                    loadHidden: !0,
                    ricTimeout: 0,
                    throttleDelay: 125
                };
                n = t.lazySizesConfig || t.lazysizesConfig || {};
                for (e in i) e in n || (n[e] = i[e]);
                t.lazySizesConfig = n, l(function () {
                    n.init && A()
                })
            }();
            var k = function () {
                var o, h, u, d, f, b, k, A, z, I, M, O, L, N, F = /^img$/i, D = /^iframe$/i,
                    q = "onscroll" in t && !/glebot/.test(navigator.userAgent), R = 0, H = 0, B = -1, j = function (t) {
                        H--, t && t.target && _(t.target, j), (!t || H < 0 || !t.target) && (H = 0)
                    }, W = function (t, i) {
                        var n, s = t, o = "hidden" == x(e.body, "visibility") || "hidden" != x(t, "visibility");
                        for (A -= i, M += i, z -= i, I += i; o && (s = s.offsetParent) && s != e.body && s != r;) (o = (x(s, "opacity") || 1) > 0) && "visible" != x(s, "overflow") && (n = s.getBoundingClientRect(), o = I > n.left && z < n.right && M > n.top - 1 && A < n.bottom + 1);
                        return o
                    }, V = function () {
                        var t, s, a, l, u, c, f, p, g, m = i.elements;
                        if ((d = n.loadMode) && H < 8 && (t = m.length)) {
                            s = 0, B++, null == L && ("expand" in n || (n.expand = r.clientHeight > 500 && r.clientWidth > 500 ? 500 : 370), O = n.expand, L = O * n.expFactor), R < L && H < 1 && B > 2 && d > 2 && !e.hidden ? (R = L, B = 0) : R = d > 1 && B > 1 && H < 6 ? O : 0;
                            for (; s < t; s++) if (m[s] && !m[s]._lazyRace) if (q) if ((p = m[s].getAttribute("data-expand")) && (c = 1 * p) || (c = R), g !== c && (b = innerWidth + c * N, k = innerHeight + c, f = -1 * c, g = c), a = m[s].getBoundingClientRect(), (M = a.bottom) >= f && (A = a.top) <= k && (I = a.right) >= f * N && (z = a.left) <= b && (M || I || z || A) && (n.loadHidden || "hidden" != x(m[s], "visibility")) && (h && H < 3 && !p && (d < 3 || B < 4) || W(m[s], c))) {
                                if (Q(m[s]), u = !0, H > 9) break
                            } else !u && h && !l && H < 4 && B < 4 && d > 2 && (o[0] || n.preloadAfterLoad) && (o[0] || !p && (M || I || z || A || "auto" != m[s].getAttribute(n.sizesAttr))) && (l = o[0] || m[s]); else Q(m[s]);
                            l && !u && Q(l)
                        }
                    }, U = T(V), Y = function (t) {
                        m(t.target, n.loadedClass), v(t.target, n.loadingClass), _(t.target, Z), y(t.target, "lazyloaded")
                    }, X = S(Y), Z = function (t) {
                        X({target: t.target})
                    }, G = function (t, e) {
                        try {
                            t.contentWindow.location.replace(e)
                        } catch (i) {
                            t.src = e
                        }
                    }, $ = function (t) {
                        var e, i = t.getAttribute(n.srcsetAttr);
                        (e = n.customMedia[t.getAttribute("data-media") || t.getAttribute("media")]) && t.setAttribute("media", e), i && t.setAttribute("srcset", i)
                    }, J = S(function (t, e, i, r, s) {
                        var o, a, h, d, f, g;
                        (f = y(t, "lazybeforeunveil", e)).defaultPrevented || (r && (i ? m(t, n.autosizesClass) : t.setAttribute("sizes", r)), a = t.getAttribute(n.srcsetAttr), o = t.getAttribute(n.srcAttr), s && (h = t.parentNode, d = h && c.test(h.nodeName || "")), g = e.firesLoad || "src" in t && (a || o || d), f = {target: t}, g && (_(t, j, !0), clearTimeout(u), u = l(j, 2500), m(t, n.loadingClass), _(t, Z, !0)), d && p.call(h.getElementsByTagName("source"), $), a ? t.setAttribute("srcset", a) : o && !d && (D.test(t.nodeName) ? G(t, o) : t.src = o), s && (a || d) && w(t, {src: o})), t._lazyRace && delete t._lazyRace, v(t, n.lazyClass), C(function () {
                            (!g || t.complete && t.naturalWidth > 1) && (g ? j(f) : H--, Y(f))
                        }, !0)
                    }), Q = function (t) {
                        var e, i = F.test(t.nodeName), r = i && (t.getAttribute(n.sizesAttr) || t.getAttribute("sizes")),
                            s = "auto" == r;
                        (!s && h || !i || !t.getAttribute("src") && !t.srcset || t.complete || g(t, n.errorClass) || !g(t, n.lazyClass)) && (e = y(t, "lazyunveilread").detail, s && P.updateElem(t, !0, t.offsetWidth), t._lazyRace = !0, H++, J(t, e, s, r, i))
                    }, K = function () {
                        if (!h) {
                            if (s.now() - f < 999) return void l(K, 999);
                            var t = E(function () {
                                n.loadMode = 3, U()
                            });
                            h = !0, n.loadMode = 3, U(), a("scroll", function () {
                                3 == n.loadMode && (n.loadMode = 2), t()
                            }, !0)
                        }
                    };
                return {
                    _: function () {
                        f = s.now(), i.elements = e.getElementsByClassName(n.lazyClass), o = e.getElementsByClassName(n.lazyClass + " " + n.preloadClass), N = n.hFac, a("scroll", U, !0), a("resize", U, !0), t.MutationObserver ? new MutationObserver(U).observe(r, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0
                        }) : (r.addEventListener("DOMNodeInserted", U, !0), r.addEventListener("DOMAttrModified", U, !0), setInterval(U, 999)), a("hashchange", U, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (t) {
                            e.addEventListener(t, U, !0)
                        }), /d$|^c/.test(e.readyState) ? K() : (a("load", K), e.addEventListener("DOMContentLoaded", U), l(K, 2e4)), i.elements.length ? (V(), C._lsFlush()) : U()
                    }, checkElems: U, unveil: Q
                }
            }(), P = function () {
                var t, i = S(function (t, e, i, n) {
                    var r, s, o;
                    if (t._lazysizesWidth = n, n += "px", t.setAttribute("sizes", n), c.test(e.nodeName || "")) for (r = e.getElementsByTagName("source"), s = 0, o = r.length; s < o; s++) r[s].setAttribute("sizes", n);
                    i.detail.dataAttr || w(t, i.detail)
                }), r = function (t, e, n) {
                    var r, s = t.parentNode;
                    s && (n = b(t, s, n), r = y(t, "lazybeforesizes", {
                        width: n,
                        dataAttr: !!e
                    }), r.defaultPrevented || (n = r.detail.width) && n !== t._lazysizesWidth && i(t, s, r, n))
                }, s = function () {
                    var e, i = t.length;
                    if (i) for (e = 0; e < i; e++) r(t[e])
                }, o = E(s);
                return {
                    _: function () {
                        t = e.getElementsByClassName(n.autosizesClass), a("resize", o)
                    }, checkElems: o, updateElem: r
                }
            }(), A = function () {
                A.i || (A.i = !0, P._(), k._())
            };
            return i = {cfg: n, autoSizer: P, loader: k, init: A, uP: w, aC: m, rC: v, hC: g, fire: y, gW: b, rAF: C}
        }
    }(t, t.document);
    t.lazySizes = i, "object" == typeof module && module.exports && (module.exports = i)
}(window), function (t, e) {
    "use strict";

    function i(t, i) {
        if (!s[t]) {
            var n = e.createElement(i ? "link" : "script"), r = e.getElementsByTagName("script")[0];
            i ? (n.rel = "stylesheet", n.href = t) : n.src = t, s[t] = !0, s[n.src || n.href] = !0, r.parentNode.insertBefore(n, r)
        }
    }

    var n, r, s = {};
    e.addEventListener && (r = /\(|\)|\s|'/, n = function (t, i) {
        var n = e.createElement("img");
        n.onload = function () {
            n.onload = null, n.onerror = null, n = null, i()
        }, n.onerror = n.onload, n.src = t, n && n.complete && n.onload && n.onload()
    }, addEventListener("lazybeforeunveil", function (t) {
        var e, s, o, a;
        t.defaultPrevented || ("none" == t.target.preload && (t.target.preload = "auto"), e = t.target.getAttribute("data-link"), e && i(e, !0), e = t.target.getAttribute("data-script"), e && i(e), e = t.target.getAttribute("data-require"), e && (lazySizes.cfg.requireJs ? lazySizes.cfg.requireJs([e]) : i(e)), o = t.target.getAttribute("data-bg"), o && (t.detail.firesLoad = !0, s = function () {
            t.target.style.backgroundImage = "url(" + (r.test(o) ? JSON.stringify(o) : o) + ")", t.detail.firesLoad = !1, lazySizes.fire(t.target, "_lazyloaded", {}, !0, !0)
        }, n(o, s)), (a = t.target.getAttribute("data-poster")) && (t.detail.firesLoad = !0, s = function () {
            t.target.poster = a, t.detail.firesLoad = !1, lazySizes.fire(t.target, "_lazyloaded", {}, !0, !0)
        }, n(a, s)))
    }, !1))
}(window, document), function (t, e) {
    "use strict";

    function i() {
        void 0 !== paper && t.querySelectorAll(".paper--patterns").forEach(function (t) {
            var i = t.querySelector("canvas"), n = e[t.getAttribute("data-elements")], r = new paper.PaperScope;
            r.setup(i), r.view.viewSize.width = i.clientWidth, r.view.viewSize.height = i.clientHeight;
            var s, o = new r.Tool, a = !1, l = !1, h = "desktop", u = {},
                c = {x: 0, y: 0, limit: .2, speed: 15e-5, onmove: !1},
                d = {min: 40, max: -40, speed: .002, angle: 0, direction: 1}, f = {deltaX: 0, deltaY: 0},
                p = function (t) {
                    if (!1 === l && void 0 !== s && void 0 !== s.children) for (var e = 0, i = s.children.length; e < i; e++) f.deltaX = s.children[e].position.x + (c.x - u.x) * ((e + 1) * c.speed), f.deltaX > s.children[e].limits.x.min && f.deltaX < s.children[e].limits.x.max && (s.children[e].position.x = f.deltaX), f.deltaY = s.children[e].position.y + (c.y - u.y) * ((e + 1) * c.speed), f.deltaY > s.children[e].limits.y.min && f.deltaY < s.children[e].limits.y.max && (s.children[e].position.y = f.deltaY)
                }, g = function (t) {
                    if (!1 === l) {
                        d.angle > d.min ? d.direction = -1 : d.angle < d.max && (d.direction = 1), d.angle += d.direction;
                        for (var e = 0, i = s.children.length; e < i; e++) s.children[e].position.y += d.angle * d.speed * (e + 1)
                    }
                }, m = function (t, e) {
                    return void 0 !== e && (t = {x: t, y: e}), new r.Point(t.x, t.y)
                }, v = function (t) {
                    return {x: u.x + t[h].x, y: u.y + t[h].y}
                }, _ = function (t) {
                    return m(v(t))
                }, y = function () {
                    !1 === a && (a = !0, r.view.onFrame = null, r.project.activeLayer.removeChildren(), h = e.innerWidth < 992 ? "mobile" : "desktop", s = new r.Group, u = r.view.center, s.position = r.view.center, S(), a = !1)
                }, w = function (t) {
                    clearTimeout(c.onmove), c.x = t.x, c.y = t.y, !0 !== b && p(), c.onmove = setTimeout(function () {
                        c.onmove = !1
                    }, 100)
                }, x = function (t) {
                    for (var e = 0, i = s.children.length; e < i; e++) t = (s.children[e].index + 1) / c.limit, s.children[e].limits = {
                        x: {
                            min: s.children[e].position.x - t,
                            max: s.children[e].position.x + t
                        }, y: {min: s.children[e].position.y - t, max: s.children[e].position.y + t}
                    };
                    r.view.onFrame = !0 !== b ? g : null
                }, C = {
                    triangle: function (t, e) {
                        e = new r.Path.RegularPolygon(_(t), 3, t[h].size), e.strokeColor = t.strokeColor, e.strokeWidth = t.strokeWidth, e.blendMode = t.blendMode || "normal", e.rotate(t.rotate || 0), s.addChild(e)
                    }, circle: function (t, e) {
                        e = new r.Path.Circle(_(t), t[h].size), e.strokeColor = t.strokeColor, e.strokeWidth = t.strokeWidth, e.blendMode = t.blendMode || "normal", s.addChild(e)
                    }, wave: function (t, e, i) {
                        i = v(t), i.a = t[h].size, i.b = Math.floor(.5 * i.a), i.c = Math.floor(.5 * i.b), e = new r.Path, e.strokeColor = t.strokeColor, e.strokeWidth = t.strokeWidth, e.blendMode = t.blendMode || "normal", e.add(m(i.x - i.a, i.y)), e.add(m(i.x - i.a, i.y)), e.add(m(i.x - i.b, i.y + i.c)), e.add(m(i.x, i.y)), e.add(m(i.x + i.b, i.y + i.c)), e.add(m(i.x + i.a, i.y)), e.smooth({
                            type: "catmull-rom",
                            factor: .5
                        }), e.rotate(t.rotate || 0), s.addChild(e)
                    }, raster: function (t, e) {
                        e = new r.Raster({
                            source: t.src,
                            position: _(t)
                        }), e.blendMode = t.blendMode || "normal", e.on("load", function () {
                            e.setHeight(e.height + 1), e.setHeight(e.height - 1), e.scale(t[h].scale || .5), e.rotate(t.rotate || 0)
                        }), s.addChild(e)
                    }
                }, S = function () {
                    for (var t = 0, e = n.length; t < e; t++) C[n[t].type] && C[n[t].type](n[t]);
                    x()
                };
            y();
            var T = 0;
            r.view.onResize = function (e) {
                r.activate(), r.view._needsUpdate = !0, r.view.update(), y(), classie.add(t, "resizing"), clearTimeout(T), T = setTimeout(function () {
                    classie.remove(t, "resizing")
                }, 500)
            }, e.addEventListener("scroll", function (t) {
                clearTimeout(l), l = setTimeout(function () {
                    l = !1
                }, 25)
            }, !1), o.onMouseMove = function (t) {
                w(t.lastPoint)
            }
        })
    }

    function n() {
        void 0 !== paper && "undefined" != typeof animatePaper && t.querySelectorAll(".paper--gooey").forEach(function (t) {
            var i = t.querySelector("canvas"), n = [].concat(e[t.getAttribute("data-elements")]),
                r = new paper.PaperScope;
            r.setup(i), r.view.viewSize.width = i.clientWidth, r.view.viewSize.height = i.clientHeight;
            var s = new r.Tool, o = !1, a = "desktop", l = new r.Point(-1e3, -1e3), h = [], u = function () {
                if (!1 === o) {
                    o = !0, r.view.onFrame = null, r.project.activeLayer.removeChildren(), a = e.innerWidth < 992 ? "mobile" : "desktop", h = [];
                    for (var t = 0, i = n.length; t < i; t++) {
                        var s = Object.assign({}, n[t]),
                            l = {center: {x: r.view.center.x + s[a].center.x, y: r.view.center.y + s[a].center.y}},
                            u = Object.assign({radius: 100, center: {x: 0, y: 0}, fillColor: "#00000"}, s[a], l);
                        s.mesh = u;
                        var d = !1;
                        "mask" === s.type && (d = new r.Raster({
                            source: s.src,
                            position: u.center
                        }), d.opacity = 0, d.on("load", function () {
                            animatePaper.animate(d, {
                                properties: {opacity: 1},
                                settings: {
                                    duration: s.fadeIn || 2e3,
                                    easing: "easeInOutCirc",
                                    complete: function (t, e) {
                                    }
                                }
                            })
                        }));
                        var f = new r.Path.Circle(u);
                        s.flatten && (f.flatten(s.flatten), f.smooth({type: "asymmetric"}));
                        for (var p = u.radius / 200, g = [], m = 0; m < f.segments.length; m++) g.push({
                            relativeX: f.segments[m].point.x - u.center.x,
                            relativeY: f.segments[m].point.y - u.center.y,
                            offsetX: p,
                            offsetY: p,
                            momentum: new r.Point(0, 0)
                        });
                        if (s.settings = g, s.threshold = 1.4 * u.radius, s.circlePath = f, s.group = new r.Group([f]), s.controlCircle = f.clone(), s.rotationMultiplicator = p, s.controlCircle.fullySelected = !1, s.controlCircle.visible = !1, !1 !== d) {
                            var v = new r.Group([s.group, d]);
                            v.clipped = !0, s.mask = d, s.maskGroup = v
                        }
                        f.opacity = 0, animatePaper.animate(f, {
                            properties: {opacity: 1},
                            settings: {
                                duration: s.fadeIn || 2e3, easing: "easeInOutCirc", complete: function (t, e) {
                                }
                            }
                        }), h.push(s)
                    }
                    !0 !== b && (r.view.onFrame = function (t) {
                        c(t)
                    }), o = !1
                }
            }, c = function (t) {
                for (var e = 0, i = h.length; e < i; e++) {
                    var n = h[e], s = n.mesh;
                    n.group.rotate(-.2, s.center);
                    for (var o = 0; o < n.circlePath.segments.length; o++) {
                        var a = n.circlePath.segments[o], u = n.settings[o], c = n.controlCircle.segments[o].point,
                            d = l.subtract(c), f = l.getDistance(c), p = 0;
                        f < n.threshold && (p = .15 * (f - n.threshold));
                        var g = new r.Point(0, 0);
                        0 !== f && (g = new r.Point(d.x / f * p, d.y / f * p));
                        var m = c.add(g), v = a.point.subtract(m);
                        u.momentum = u.momentum.subtract(v.divide(6)), u.momentum = u.momentum.multiply(.6);
                        var _ = u.offsetX, y = u.offsetY, w = Math.sin(t.time + 4 * o), x = Math.cos(t.time + 4 * o);
                        u.momentum = u.momentum.add(new r.Point(x * -_, w * -y)), a.point = a.point.add(u.momentum)
                    }
                }
            };
            u(), r.view.onResize = function (t) {
                r.activate(), r.view._needsUpdate = !0, r.view.update(), u()
            }, e.addEventListener("scroll", function (t) {
                clearTimeout(self.pageScrolling), self.pageScrolling = setTimeout(function () {
                    self.pageScrolling = !1
                }, 25)
            }, !1), s.onMouseMove = function (t) {
                l = t.lastPoint
            }
        })
    }

    function r() {
        void 0 !== paper && t.querySelectorAll(".paper--stars").forEach(function (t) {
            var i = t.querySelector("canvas"), n = e[t.getAttribute("data-elements")], r = new paper.PaperScope;
            r.setup(i), r.view.viewSize.width = i.clientWidth, r.view.viewSize.height = i.clientHeight;
            var s = new r.Tool, o = new r.Point(r.view.center.x, r.view.center.y + 100), a = r.view.center,
                l = function () {
                    a = new r.Point(a.x + (o.x - a.x) / 10, a.y + (o.y - a.y) / 10);
                    var t = new r.Point((r.view.center.x - a.x) / 10, (r.view.center.y - a.y) / 10);
                    h(t)
                }, h = new function () {
                    function t(t) {
                        var e = t.position, i = r.view.bounds;
                        if (!e.isInside(i)) {
                            var n = t.bounds;
                            e.x > i.width + 5 && (e.x = -t.bounds.width), e.x < -n.width - 5 && (e.x = i.width), e.y > i.height + 5 && (e.y = -n.height), e.y < -n.height - 5 && (e.y = i.height)
                        }
                    }

                    for (var e = n.count || 50, i = new r.Path.Circle({
                        center: [0, 0],
                        radius: n.radius || 4,
                        fillColor: n.fillColor || "black"
                    }), s = new r.Symbol(i), o = 0; o < e; o++) {
                        var a = r.Point.random(), l = new r.Point(a.x * r.view.size.width, a.y * r.view.size.height),
                            h = s.place(l);
                        h.scale(o / e + .01), h.data = {
                            vector: new r.Point({
                                angle: 360 * Math.random(),
                                length: o / e * Math.random() / 5
                            })
                        }
                    }
                    new r.Point({angle: 45, length: 0});
                    return function (i) {
                        for (var n = r.project.activeLayer, s = 0; s < e; s++) {
                            var o = n.children[s], a = o.bounds.size, l = i.length / 10 * a.width / 10, h = i.normalize(l);
                            o.position = new r.Point(o.position.x + h.x + o.data.vector.x, o.position.y + h.y + o.data.vector.y), t(o)
                        }
                    }
                };
            l(), r.view.onFrame = null, !0 !== b && (s.onMouseMove = function (t) {
                o = t.lastPoint
            }, r.view.onFrame = l)
        })
    }

    function s() {
        var i = t.querySelectorAll(".carousel");
        if (0 !== i.length && "undefined" != typeof Siema) for (var n = 0, r = i.length; n < r; n++) !function (i) {
            function n(t) {
                !1 === t && (a.selector.style.height = Math.ceil(a.innerElements[a.currentSlide].clientHeight) + "px")
            }

            function r() {
                clearTimeout(a.autoPlayTimeout), a.autoPlayTimeout = setTimeout(function () {
                    !0 === a.config.loop ? a.next() : a.currentSlide >= a.innerElements.length - 1 ? (a.goTo(a.config.startIndex), s("startIndex")) : a.next()
                }, a.config.autoplay)
            }

            function s(t) {
                a = a || this;
                var e = a.innerElements[a.currentSlide].querySelector(".dashed");
                "init" !== t && 0 < a.copies.length && 500 !== a.config.duration && !0 !== a.fistCopyDelaySet && (a.copies[0].style.animationDelay = a.config.duration + "ms", a.fistCopyDelaySet = !0), a.lastSlide > a.currentSlide ? classie.add(i, "carousel--reverse") : classie.remove(i, "carousel--reverse"), a.lastSlide = a.currentSlide;
                for (var s = 0, o = a.innerElements.length; s < o; s++) if (classie.remove(a.innerElements[s], "carousel__item--active"), 0 < a.dotElements.length && classie.remove(a.dotElements[s], "active"), null !== e) {
                    var l = a.innerElements[s].querySelector(".dashed");
                    null !== l && classie.remove(a.innerElements[s].querySelector(".dashed"), "in-view__child--in")
                }
                classie.add(a.innerElements[a.currentSlide], "carousel__item--active"), 0 < a.dotElements.length && classie.add(a.dotElements[a.currentSlide], "active"), setTimeout(function () {
                    null !== e && classie.add(e, "in-view__child--in")
                }, a.config.duration), classie.remove(i, "carousel--on-first"), classie.remove(i, "carousel--on-last"), !1 === a.config.loop && 0 === a.currentSlide && classie.add(i, "carousel--on-first"), !1 === a.config.loop && a.innerElements.length - 1 === a.currentSlide && classie.add(i, "carousel--on-last"), n(!0), "on" === a.config.rotate && r()
            }

            function o() {
                a = a || this, a.lastSlide = a.currentSlide, a.dotElements = [], a.dots = i.querySelector(".carousel__dots"), a.copies = i.querySelectorAll(".carousel__copy");
                var r = i.querySelector(".carousel__prev"), o = i.querySelector(".carousel__next"), l = null;
                if (null !== r && r.addEventListener("click", function () {
                    a.prev()
                }), null !== o && o.addEventListener("click", function () {
                    a.next()
                }), 1 < a.copies.length && 500 !== a.config.duration) for (var h = 1, u = a.copies.length - 1; h < u; h++) a.copies[h].style.animationDelay = a.config.duration + "ms";
                if (null !== a.dots && !1 === a.config.loop) for (var h = 0, u = a.innerElements.length; h < u; h++) {
                    var c = t.createElement("span");
                    c.slideTarget = h, h === a.currentSlide && classie.add(c, "active"), c.style.transition = "all 0.6s " + Math.round(10 * (.1 * h + .2)) / 10 + "s cubic-bezier(0.68, -1, 0.27, 2)", a.dotElements.push(c), a.dots.appendChild(c), c.addEventListener("click", function () {
                        a.goTo(this.slideTarget), s("dot")
                    })
                }
                e.addEventListener("resize", function () {
                    classie.add(i, "carousel--resizing"), clearTimeout(l), l = setTimeout(function () {
                        n(!1), classie.remove(i, "carousel--resizing")
                    }, 200)
                }, !1);
                for (var h = 0, u = a.innerElements.length; h < u; h++) a.innerElements[h].resizeSensor = new ResizeSensor(a.innerElements[h], function () {
                    n(!1)
                });
                s("init"), classie.add(i, "carousel--init")
            }

            var a = !1, l = {
                selector: i.querySelector(".carousel__frame"),
                duration: parseInt(i.getAttribute("data-duration")) || 500,
                easing: i.getAttribute("data-easing") || "ease",
                perPage: 1,
                draggable: !0,
                threshold: 100,
                autoplay: parseInt(i.getAttribute("data-autoplay")) || 3e3,
                rotate: i.getAttribute("data-rotate") || "on",
                onInit: o,
                onChange: s
            };
            i.siema = new Siema(l)
        }(i[n])
    }

    function o() {
        var e = t.querySelectorAll('a[href^="#"]:not([href="#"])');
        if (0 !== e.length && void 0 !== animateScrollTo) for (var i = 0, n = e.length; i < n; i++) e[i].addEventListener("click", function (e, i) {
            null !== (e = t.querySelector(this.hash)) && (i = e.getBoundingClientRect(), animateScrollTo(i.top + window.pageYOffset || 0, {cancelOnUserAction: !1}))
        }, !1)
    }

    function a() {
        function e() {
            !1 === n.opened && (classie.add(t.documentElement, n.classes.active), setTimeout(function () {
                classie.add(t.documentElement, n.classes.display), n.opened = !0
            }, 50))
        }

        function i() {
            !0 === n.opened && (classie.remove(t.documentElement, n.classes.display), setTimeout(function () {
                classie.remove(t.documentElement, n.classes.active), n.opened = !1
            }, 300))
        }

        var n = {
            opened: !1,
            trigger: t.querySelectorAll(".side-menu-trigger"),
            swipeable: t.querySelectorAll(".side-menu-swipeable"),
            sidemenu: t.querySelector(".site-sidenav__elements"),
            overlay: t.querySelector(".site-sidenav__overlay"),
            sidemenuitems: t.querySelectorAll(".site-sidenav__elements a"),
            classes: {active: "side-menu", display: "side-menu--display", avoid: "side-menu-trigger"}
        };
        if (null !== n.sidemenu) {
            if (0 < n.swipeable.length && function () {
                if ("undefined" != typeof Hammer) for (var e = 0, r = n.swipeable.length; e < r; e++) {
                    var s = 0, o = n.sidemenu.clientWidth, a = new Hammer(n.swipeable[e]);
                    a.on("panstart", function (e) {
                        classie.add(t.documentElement, "side-menu--panning")
                    }), a.on("swipeleft", i), a.on("panright panleft", function (t) {
                        s += 4 === t.direction ? Math.round(Math.max(3, t.velocity)) : Math.round(Math.min(-3, t.velocity)), s > 0 && (s = 0), Math.abs(s) > o && (s = -1 * o), n.overlay.style.opacity = 1 + 1 * s / o, n.sidemenu.style.webkitTransform = "translateX(" + s + "px)", n.sidemenu.style.transform = "translateX(" + s + "px)"
                    }), a.on("panend pancancel", function (e) {
                        classie.remove(t.documentElement, "side-menu--panning"), Math.abs(s) > .5 * o && i(), n.overlay.style.opacity = "", n.sidemenu.style.webkitTransform = "", n.sidemenu.style.transform = "", s = 0
                    })
                }
            }(), t.addEventListener("click", function (t) {
                !0 === n.opened && t.pageX > n.sidemenu.clientWidth && !1 === classie.has(t.target, n.classes.avoid) && i()
            }, !1), null !== n.sidemenuitems && 0 < n.sidemenuitems.length) for (var r = 0, s = n.sidemenuitems.length; r < s; r++) n.sidemenuitems[r].addEventListener("click", i, !1);
            if (null !== n.trigger && 0 < n.trigger.length) for (var r = 0, s = n.trigger.length; r < s; r++) n.trigger[r].addEventListener("click", e, !1)
        }
    }

    function l(e) {
        function i(t, e, i) {
            setTimeout(function () {
                classie.add(t, e)
            }, i)
        }

        if (null !== typeof (e = t.getElementsByClassName("in-view")) && 0 !== e.length && "undefined" != typeof Waypoint) for (var n = {
            offset: "80%",
            delay: 200,
            classes: {child: "in-view__child", scope_in: "in-view--in", child_in: "in-view__child--in"}
        }, r = 0, s = e.length; r < s; r++) {
            new Waypoint({
                element: e[r], handler: function (t) {
                    var e = this.element.getElementsByClassName(n.classes.child);
                    if (0 < e.length) for (var r = 0, s = e.length; r < s; r++) i(e[r], n.classes.child_in, n.delay * (r + 1));
                    i(this.element, n.classes.scope_in, 0), this.destroy()
                }, offset: e[r].getAttribute("data-offset") || n.offset
            })
        }
    }

    function h(e, i) {
        null !== (e = t.getElementById("masthead")) && null !== typeof e && 0 !== e.length && "undefined" != typeof Headroom && (i = new Headroom(e, {offset: e.clientHeight || 120}), i.init())
    }

    function u(i, n) {
        null !== (i = t.getElementById("up")) && "undefined" != typeof Headroom && (n = new Headroom(i, {offset: e.innerHeight}), n.init())
    }

    function c(e) {
        function i(t, e, i, n) {
            if (!0 !== classie.has(t, "tabs__nav--active") && null !== (n = e.querySelector('.tabs__item[data-tab="' + t.getAttribute("data-tab") + '"]')) && 0 !== n.length) {
                for (var r = 0, s = i.length; r < s; r++) classie.remove(i[r], "tabs__nav--active"), classie.remove(i[r], "tabs__item--active"), i[r].setAttribute("tabindex", "-1"), i[r].setAttribute("aria-selected", "false");
                classie.add(t, "tabs__nav--active"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-selected", "true"), classie.add(n, "tabs__item--active"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-selected", "true")
            }
        }

        if (null !== typeof (e = t.querySelectorAll(".tabs")) && 0 !== e.length) for (var n = 0, r = e.length; n < r; n++) !function (t, e, n) {
            e = t.querySelectorAll(".tabs__nav"), n = t.querySelectorAll("[data-tab]");
            for (var r = 0, s = e.length; r < s; r++) e[r].addEventListener("click", function () {
                i(this, t, n)
            }, !1)
        }(e[n])
    }

    function d(i) {
        "undefined" != typeof Instafeed && null !== (i = t.getElementById("instafeed")) && function (t, i, n, r) {
            null !== (n = t.getAttribute("data-config")) && void 0 !== e[n] && void 0 !== e[n].userId && void 0 !== e[n].accessToken && (i = new Instafeed({
                get: "user",
                userId: e[n].userId,
                accessToken: e[n].accessToken,
                limit: e[n].limit || 6,
                resolution: e[n].resolution || "standard_resolution",
                template: '<figure class="instagram-feed__item lazyload--el lazyload" data-bg="{{image}}"></figure>',
                error: function (t) {
                    console.warn("Instagram feed warning:", t)
                },
                success: function (t) {
                }
            }), i.run())
        }(i)
    }

    function f(e) {
        if (null !== typeof (e = t.querySelectorAll(".masonry")) && 0 !== e.length && "undefined" != typeof Masonry) for (var i = 0, n = e.length; i < n; i++) {
            var r = new Masonry(e[i], {
                itemSelector: ".masonry-item",
                columnWidth: ".masonry-item",
                horizontalOrder: !0,
                percentPosition: !0
            });
            r.once("layoutComplete", function (t, e, i, n) {
                function r(t, e, i) {
                    setTimeout(function () {
                        classie.add(t, e)
                    }, i)
                }

                e = 0, i = t[0].layout.cols, n = {
                    offset: "80%",
                    delay: 200,
                    classes: {scope_in: "indexed-list__in-view--in"}
                };
                for (var s = 0, o = t.length; s < o; s++) {
                    t[s].element.inViewDelay = e * n.delay, e++, e === i && (e = 0);
                    new Waypoint({
                        element: t[s].element, handler: function (t) {
                            r(this.element.querySelector(".indexed-list__in-view"), n.classes.scope_in, this.element.inViewDelay), this.destroy()
                        }, offset: n.offset
                    })
                }
            }), function (t) {
                setTimeout(function () {
                    t.layout()
                }, 0)
            }(r)
        }
    }

    function p(e) {
        null !== typeof (e = t.querySelectorAll(".video-popup")) && 0 !== e.length && "undefined" != typeof MediaBox && MediaBox(".video-popup")
    }

    function g(e) {
        if (null !== typeof (e = t.querySelectorAll("[data-sources]")) && 0 !== e.length) for (var i = 0, n = e.length; i < n; i++) try {
            var r = e[i].getAttribute("data-sources").split("|");
            if (0 === r.length) continue;
            !function (e, i) {
                for (var n = 0, r = i.length; n < r; n++) {
                    var s = t.createElement("source");
                    e.appendChild(s), s.src = i[n]
                }
                e.removeAttribute("data-sources"), e.load()
            }(e[i], r)
        } catch (t) {
            console.warn(t)
        }
    }

    function m(i, n) {
        null !== (i = t.getElementById("mc-embedded-subscribe-form")) && null !== typeof i && 0 !== i.length && (n = t.createElement("script"), n.type = "text/javascript", n.src = "https://s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js", t.head.appendChild(n), n.onload = function () {
            e.fnames = ["EMAIL", "FNAME"], e.ftypes = ["email", "text"], e.$mcj = jQuery.noConflict(!0)
        })
    }

    function v(e) {
        if (null !== typeof (e = t.querySelectorAll(".countdown")) && 0 !== e.length) for (var i = 0, n = e.length; i < n; i++) !function (t) {
            function e() {
                var e = (new Date).getTime(), o = n - e;
                if (o < 0) return clearInterval(r), void console.warn("Countdown timer is expired!", {
                    element: t,
                    target: i
                });
                for (var a = {
                    days: Math.floor(o / 864e5),
                    hours: Math.floor(o % 864e5 / 36e5),
                    minutes: Math.floor(o % 36e5 / 6e4),
                    seconds: Math.floor(o % 6e4 / 1e3)
                }, l = 0, h = s.length; l < h; l++) {
                    var u = a[s[l].type];
                    void 0 !== u && (s[l].count.innerText = u < s[l].max ? (s[l].default + u).slice(s[l].length) : u)
                }
            }

            var i = t.getAttribute("data-count");
            if (void 0 !== i) {
                var n = new Date(i).getTime();
                if (!0 !== isNaN(n) && !0 !== isNaN(n - 0)) {
                    for (var r, s = [], o = t.querySelectorAll(".countdown__el"), a = 0, l = o.length; a < l; a++) {
                        var h = o[a].getAttribute("data-display");
                        if (void 0 !== h) {
                            var u = o[a].querySelector(".countdown__count");
                            if (null !== u) {
                                var c = u.innerText || "00";
                                s.push({
                                    type: h,
                                    count: u,
                                    default: c,
                                    length: -1 * c.length,
                                    max: 1 * Array(c.length + 1).join("9")
                                })
                            }
                        }
                    }
                    e(), r = setInterval(e, 1e3)
                }
            }
        }(e[i])
    }

    function _() {
        var i = t.querySelectorAll(".google-map");
        if (0 !== i.length) {
            var n = {
                silver: [{elementType: "geometry", stylers: [{color: "#efefef"}]}, {
                    elementType: "labels.icon",
                    stylers: [{visibility: "off"}]
                }, {elementType: "labels.text.fill", stylers: [{color: "#32353a"}]}, {
                    elementType: "labels.text.stroke",
                    stylers: [{color: "#f5f5f5"}, {visibility: "off"}]
                }, {
                    featureType: "administrative.land_parcel",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#bdbdbd"}]
                }, {featureType: "poi", elementType: "geometry", stylers: [{color: "#eeeeee"}]}, {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#757575"}]
                }, {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{color: "#e5e5e5"}]
                }, {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#92959a"}]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{color: "#ffffff"}]
                }, {
                    featureType: "road.arterial",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#32353a"}]
                }, {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{color: "#dadada"}]
                }, {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#616161"}]
                }, {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#acb1bc"}]
                }, {
                    featureType: "transit.line",
                    elementType: "geometry",
                    stylers: [{color: "#e5e5e5"}]
                }, {
                    featureType: "transit.station",
                    elementType: "geometry",
                    stylers: [{color: "#eeeeee"}]
                }, {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{color: "#c9c9c9"}]
                }, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#9e9e9e"}]}],
                dark: [{elementType: "geometry", stylers: [{color: "#32353a"}]}, {
                    elementType: "labels.icon",
                    stylers: [{visibility: "off"}]
                }, {elementType: "labels.text.fill", stylers: [{color: "#72757a"}]}, {
                    elementType: "labels.text.stroke",
                    stylers: [{color: "#37393c"}, {visibility: "off"}]
                }, {
                    featureType: "administrative",
                    elementType: "geometry",
                    stylers: [{color: "#72757a"}]
                }, {
                    featureType: "administrative.country",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#92959a"}]
                }, {
                    featureType: "administrative.land_parcel",
                    stylers: [{visibility: "off"}]
                }, {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#b2b5ba"}]
                }, {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#72757a"}]
                }, {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{color: "#22252a"}]
                }, {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#62656a"}]
                }, {
                    featureType: "poi.park",
                    elementType: "labels.text.stroke",
                    stylers: [{color: "#22252a"}, {visibility: "off"}]
                }, {
                    featureType: "road",
                    elementType: "geometry.fill",
                    stylers: [{color: "#2c2f35"}]
                }, {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#82858a"}]
                }, {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [{color: "#37393c"}]
                }, {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{color: "#3c3c3c"}]
                }, {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry",
                    stylers: [{color: "#4e4e4e"}]
                }, {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#52555a"}]
                }, {
                    featureType: "transit",
                    elementType: "labels.text.fill",
                    stylers: [{color: "#75757a"}]
                }, {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{color: "#12151a"}]
                }, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#32353a"}]}]
            }, r = function () {
                var t = function (t) {
                    var e = t.getAttribute("data-theme"), i = t.getAttribute("data-address"),
                        r = t.getAttribute("data-zoom") || 15, s = "false" !== t.getAttribute("data-marker"),
                        o = "true" === t.getAttribute("data-scrollwheel"),
                        a = JSON.parse(t.getAttribute("data-icon")) || {
                            url: "assets/media/map-marker.svg",
                            size: {width: 72, height: 72}
                        }, l = JSON.parse(t.getAttribute("data-location")), h = function () {
                            var i = new google.maps.Map(t, {
                                scrollwheel: o,
                                center: l,
                                zoom: parseInt(r),
                                styles: void 0 !== n[e] ? n[e] : []
                            });
                            !0 === s && new google.maps.Marker({
                                map: i,
                                animation: google.maps.Animation.DROP,
                                position: l,
                                draggable: !1,
                                optimized: !1,
                                icon: {url: a.url, scaledSize: new google.maps.Size(a.size.width, a.size.height)}
                            })
                        };
                    if (null === l) {
                        (new google.maps.Geocoder).geocode({address: i}, function (t, e) {
                            e == google.maps.GeocoderStatus.OK && (l = t[0].geometry.location, setTimeout(h, 0))
                        })
                    } else setTimeout(h, 0)
                };
                i.forEach(function (e) {
                    return t(e)
                })
            };
            if (e.initMap = r, "undefined" == typeof google) {
                var s = t.createElement("script");
                s.async = !0, s.defer = !0, s.src = "https://maps.googleapis.com/maps/api/js?key=" + i[0].getAttribute("data-key") + "&callback=initMap", t.head.appendChild(s)
            }
        }
    }

    function y() {
        var e = t.querySelectorAll(".alert .close");
        0 !== e.length && e.forEach(function (t) {
            return t.addEventListener("click", function () {
                return classie.add(t.closest(".alert"), "sr-only")
            }, !1)
        })
    }

    function w() {
        var e = t.querySelectorAll(".accordion");
        if (0 !== e.length) {
            var i = function (t) {
                var e = t.querySelectorAll(".accordion__card"), i = function (t) {
                    var i = t.closest(".accordion__card"), n = classie.has(i, "accordion__card--collapse");
                    e.forEach(function (t) {
                        return classie.add(t, "accordion__card--collapse")
                    }), !0 === n && classie.remove(i, "accordion__card--collapse")
                };
                t.querySelectorAll(".accordion__header label").forEach(function (t) {
                    return t.addEventListener("click", function () {
                        return i(t)
                    }, !1)
                })
            };
            e.forEach(function (t) {
                return i(t)
            })
        }
    }

    function x() {
        classie.add(t.documentElement, "loaded")
    }

    var b = !("undefined" === IS_TOUCH_DEVICE || !IS_TOUCH_DEVICE), C = !1;
    try {
        -1 !== ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(e.navigator.platform) && (C = !0)
    } catch (t) {
    }
    var S = !1;
    try {
        S = !!window.chrome && !!window.chrome.webstore
    } catch (t) {
    }
    e.addEventListener("load", x), function () {
        !0 === b && classie.add(t.documentElement, "is-touch"), !0 === C && classie.add(t.documentElement, "is-mac"), !0 === S && classie.add(t.documentElement, "is-chrome"), setTimeout(i, 0), setTimeout(n, 0), setTimeout(r, 0), setTimeout(s, 0), setTimeout(o, 0), setTimeout(a, 0), setTimeout(h, 0), setTimeout(u, 0), setTimeout(c, 0), setTimeout(f, 0), setTimeout(p, 0), setTimeout(m, 0), setTimeout(d, 0), setTimeout(l, 0), setTimeout(v, 0), setTimeout(_, 0), setTimeout(y, 0), setTimeout(w, 0), setTimeout(g, 0)
    }()
}(document, window);
