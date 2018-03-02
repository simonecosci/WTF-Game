WTF.Loader = function (scripts) {
    var self = this;
    this.callback = function () { };
    this.scripts = scripts.reverse();
    this.load = function () {
        if (this.scripts.length === 0) {
            this.callback.call();
            return this;
        }
        var script = this.scripts.pop();
        $.getScript(script, function () {
            self.load();
        }).fail(function () {
            if (arguments[0].readyState === 0) {
            } else {
                alert(arguments[2].toString());
                console.log(arguments, arguments[2].stack);
            }
        });
        return this;
    };
    this.then = function (callback) {
        this.callback = callback;
    };
};