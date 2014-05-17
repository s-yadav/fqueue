/*
 *fqueue.js v 0.3.2
 *Author: Sudhanshu Yadav
 *s-yadav.github.com
 *Copyright (c) 2013 Sudhanshu Yadav.
 *Licensed under MIT licenses
 */
;(function () {
    //function to convert argument into array
    function argToArray(arg, startIdx) {
        startIdx = startIdx || 0;
        return Array.prototype.slice.call(arg, startIdx);
    }
    //to merge object
    function merge() {
        var arg = arguments,
            target = arg[0];
        for (var i = 1, ln = arg.length; i < ln; i++) {
            var obj = arg[i];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    target[k] = obj[k];
                }
            }
        }
        return target;
    }

    function index(ary, elm) {
        for (var i = 0, ln = ary.length; i < ln; i++) {
            if (ary[i] == elm) return i;
        }
        return -1;
    }

    function queue(option, func) {
        this.func = func;
        this.current = -1;
        this.startParams = option.startParams;
        this.data = {};
        this.ignoreIdxs = [];
        this.results = [];
        this.autoStep = option.autoStep;
    }

    queue.prototype = {
        constructor: queue,
        next: function () {
            var curIdx = ++this.current,
                func = this.func[curIdx],
                result;
            
			this.left = 1;

            if (!func) return;
            if (index(this.ignoreIdxs, curIdx) == -1) {
                if (typeof func === "function") {
                    result = func.apply(this, argToArray(arguments));
                } else {
                    result = [];
                    var left = this.left =  func.length;
                    for (var i = 0; i < left; i++) {
                        result.push(func[i].apply(this, argToArray(arguments)));
                    }
                }
                this.previousResult = result;
                this.results[curIdx] = result;
            }
            //need to check when this next should be called.
            if (this.autoStep && !this.paused) {
                this.next();
            }
        },
        complete: function () {
            this.left--;
            if (this.left === 0) {
                this.paused = false;
                //in this way if there are two asynchronous both passing arguments than only one will go
                //so both must pass same type of arguments
                this.next.apply(this, argToArray(arguments));
            }
        },
        hold: function () {
            this.paused = true;
        },
        continue: function () {
            this.paused = false;
            this.next();
        },
        start: function (index) {
            this.results = [];
            this.previousResult = null;
            this.current = index - 1;
            this.next(argToArray(arguments, 1));
        },
        stop: function () {
            this.autoStep = false;
            this.current = -1;
        },
        add: function (func, index) {
            index = index || this.func.length;
            //to add into functions
            this.func.splice(index, 0, func);
            //to add into result
            this.results.splice(index, 0, func);
        },
        remove: function (index) {
            this.func.splice(index, 1);
            //to remove from result
            this.results.splice(index, 1);
        },
        ignore: function (idxAry) {
            this.ignoreIdxs = idxAry;
        }
    };

    var fqueue = function (option) {
        var settings = option,
            funcIdx = 1;
        if (Object.prototype.toString.call(option) != '[object Object]') {
            settings = {};
            funcIdx = 0;
        }
        settings = merge({}, fqueue.defaults, settings);
        var newObj = new queue(settings, argToArray(arguments, funcIdx));

        //define a step method which will take care of this in next function in queue while saving the incoming this on originialThis key. 
        newObj.step = function () {
            var self = newObj;
            self.originialThis = this;
            self.left--;

            if (self.left === 0) {
                self.paused = false;
                self.next.apply(self, argToArray(arguments));
            }
        };

        if (settings.autoStart) {
            var params = [0].concat(settings.startParams);
            newObj.start.apply(newObj, params);
        }
        return newObj;

    };
    //defaults
    fqueue.defaults = {
        autoStart: true,
        autoStep: true,
        startParams: []
    };

    //to make fqueue globally accessible
    window.exports = fqueue;
}());