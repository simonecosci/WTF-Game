WTF.Game = function (options) {
    var self = this;
    self.started = false;
    self.key = options.key;
    self.options = options;

    WTF.game = self;
    WTF.toolbar = options.toolbar;
    WTF.stage = options.stage || $("body");
    if (options.background) {
        WTF.stage.css("background-image", "url(" + self.options.background + ")");
    }

    self.addPlayer = function (config) {
        var player = new WTF.Game.Player(config);
        WTF.players[config.type].push(player);
        return player;
    };

    self.stageClickAndMove = function (e) {
        e.stopPropagation();
        if (WTF.selection) {
            var destination = {
                left: e.pageX,
                top: e.pageY
            };
            WTF.selection.moveTo(destination);
        }
    };

    self.init = function () {

        WTF.stage.on("click", self.stageClickAndMove);

        self.options.panels
            .append($("<h2>Team</h2><div id='panel-team'/>"))
            .append($("<h2>Enemies</h2><div id='panel-enemy'/>"))
            ;
        WTF.notification = self.options.notification.kendoNotification({
            appendTo: self.options.panels,
            stacking: "down",
            position: {
                bottom: 0
            },
            autoHideAfter: 3000
        }).data("kendoNotification");

        var dataSourceTeam = [];
        WTF.players.team.forEach(element => {
            dataSourceTeam.push({
                name: element.name,
                id: element.id,
                health: element.health,
                energy: element.energy,
                stats: element.stats,
                image: element.options.image.stop
            });
        });

        WTF.panels.team = self.options.panels.find("#panel-team").kendoGrid({
            dataSource: dataSourceTeam,
            width: 300,
            selectable: true,
            change: function (e) {
                var tr = e.sender.select();
                var item = this.dataItem(tr);
                var player = WTF.find(item.id);
                if (player)
                    player.select();
            },
            columns: [
                {
                    title: "Player",
                    template: function (dataItem) {
                        return "<img src='" + dataItem.image + "' style='height: 30px; width: auto'>";
                    }
                }, {
                    field: "name",
                    title: "Name"
                }, {
                    title: "Damages",
                    field: "stats.damagesDone"
                }, {
                    field: "stats.healsDone",
                    title: "Heals"
                }, {
                    title: "Stats",
                    template: function (dataItem) {
                        return "<div class='playerbar energybar'></div><div class='playerbar healthbar'></div>"
                    }
                }],
            dataBound: function (e) {
                var grid = this, top = 0;
                grid.element.find(".playerbar").each(function () {
                    top += 15;
                    var row = $(this).closest("tr");
                    var model = grid.dataItem(row);
                    var field;
                    if ($(this).is(".healthbar")) {
                        field = "health";
                    }
                    if ($(this).is(".energybar")) {
                        field = "energy";
                    }
                    $(this).css({
                        width: "100px",
                        bottom: "auto",
                        top: top,
                        height: 15
                    });
                    $(this).kendoProgressBar({
                        type: "value",
                        animation: false,
                        value: model[field].value,
                        max: model[field].max,
                        change: function (e) {
                            this.progressStatus.text(e.value);
                        }
                    });
                });
            }
        }).data("kendoGrid");

        var dataSourceEnemy = [];
        WTF.players.enemy.forEach(element => {
            dataSourceEnemy.push({
                name: element.name,
                id: element.id,
                health: element.health,
                energy: element.energy,
                stats: element.stats,
                image: element.options.image.stop
            });
        });

        WTF.panels.enemy = self.options.panels.find("#panel-enemy").kendoGrid({
            dataSource: dataSourceEnemy,
            width: 300,
            selectable: true,
            change: function (e) {
                if (!WTF.selection)
                    return;
                var tr = e.sender.select();
                var item = this.dataItem(tr);
                WTF.selection.target = WTF.find(item.id);
                WTF.selection.target.element.css(WTF.markStyle.target);
            },
            columns: [{
                title: "Player",
                template: function (dataItem) {
                    return "<img src='" + dataItem.image + "' style='height: 30px; width: auto'>";
                }
            }, {
                field: "name",
                title: "Name"
            }, {
                title: "Damages",
                field: "stats.damagesDone"
            }, {
                field: "stats.healsDone",
                title: "Heals"
            }, {
                title: "Stats",
                template: function (dataItem) {
                    return "<div class='playerbar energybar'></div><div class='playerbar healthbar'></div>"
                }
            }],
            dataBound: function (e) {
                var grid = this, top = 0;
                grid.element.find(".playerbar").each(function () {
                    top += 15;
                    var row = $(this).closest("tr");
                    var model = grid.dataItem(row);
                    var field;
                    if ($(this).is(".healthbar")) {
                        field = "health";
                    }
                    if ($(this).is(".energybar")) {
                        field = "energy";
                    }
                    $(this).css({
                        width: "100px",
                        bottom: "auto",
                        top: top,
                        height: 15
                    });
                    $(this).kendoProgressBar({
                        type: "value",
                        animation: false,
                        value: model[field].value,
                        max: model[field].max,
                        change: function (e) {
                            this.progressStatus.text(e.value);
                        }
                    });
                });
            }
        }).data("kendoGrid");

        var ondead = function (evt, dead) {
            if (WTF.selection && WTF.selection === dead) {
                var target = WTF.selection.target;
                if (target) {
                    target.element.css(WTF.markStyle.unselected);
                }
                WTF.selection = null;
            }
            if (dead.type === "team") {
                WTF.notification.warning(dead.name + " is dead");
            }
            if (dead.type === "enemy") {
                WTF.notification.success(dead.name + " is dead");
            }
            ["enemy", "team"].forEach(type => {
                WTF.players[type].forEach(element => {
                    if (element.target === dead) {
                        element.target = null;
                        if (self.started && element !== WTF.selection && element.behavior) {
                            element.behavior.stop();
                            element.behavior.start();
                        }
                    }
                });
            });
        }

        for (var type in WTF.players) {
            var last = 0;
            WTF.players[type].forEach(o => {
                if (type === "team") {
                    o.element.css({
                        top: last + 10,
                        left: 10,
                    });
                }
                if (type === "enemy") {
                    o.element.css({
                        top: last + 10,
                        right: 10,
                    });
                }
                o.element.show();
                $(o).on("dead", ondead);
                last = o.element.height();
            });
        }
        
        return this;
    };

    self.start = function () {
        if (self.started)
            return;
        ["enemy", "team"].forEach(type => {
            WTF.players[type].forEach(element => {
                if (element.behavior) {
                    element.behavior.start();
                }
            });
        });
        self.started = true;
        return this;
    };
    
    self.gameover = function (callback) {
        $(self).on("gameover", function(e, result) {
            $(self).off("gameover");
            callback.call(self, result);
        });
    };
    
};
