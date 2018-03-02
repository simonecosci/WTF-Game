
WTF.Game.Player = WTF.Game.Object.extend({

    init: function (options) {

        var self = this;

        WTF.Game.Object.fn.init.call(self, options);

        self.dead = false;
        self.name = self.options.name;
        self.type = self.options.type;
        self.behavior = null;
        self.abilities = {};
        self.target = null;
        self.stats = new kendo.data.ObservableObject({
            damagesDone: 0,
            damagesTaken: 0,
            healsDone: 0,
            healsTaken: 0
        });
        self.regen = {
            energy: self.options.energy.regen,
            health: self.options.health.regen,
        };

        self.options.selectable = true;
        self.options.hitable = true;
        self.options.movable = true;
    },

    setup: function () {
        var self = this;

        self.color = "black";
        if (self.type === "enemy")
            self.color = "red";
        if (self.type === "team")
            self.color = "green";

        self.createLabel();
        self.createHealthBar();
        self.createEnergyBar();
        self.createAbilities();
        self.createBehavior();

        self.element.addClass("player");
        self.element.css({
            backgroundImage: "url(" + self.options.image.stop + ")",
        });
        self.element.on("click", function (e) {
            e.stopPropagation();
            if (!self.options.selectable) {
                return;
            }
            if (WTF.selection) {
                if (WTF.selection.target) {
                    WTF.selection.target.element.css(WTF.markStyle.unselected);
                }
            }
            if (WTF.selection && (self.type === "enemy" || (self.type === "team" && e.ctrlKey))) {
                WTF.selection.setTarget(self);
                WTF.selection.select();
                return;
            }
            if (self.type === "team") {
                if (WTF.selection) {
                    WTF.selection.element.css(WTF.markStyle.unselected);
                }
                self.select();
                return;
            }
        });
        self.element.children().on("dragstart", function (e) {
            e.preventDefault();
        });
        self.timeout = setInterval(function () {
            self.tick();
        }, self.options.tick * 1000);

    },

    destroy: function () {
        var self = this;
        self.dead = true;
        clearInterval(self.timeout);
        self.behavior.stop();
        var o = WTF.players[self.type].findIndex(function (element) {
            return element.id === self.id;
        });
        if (o >= 0) {
            WTF.players[self.type].splice(o, 1);
        }
        WTF.Game.Object.fn.destroy.call(self);
        if (WTF.players[self.type].length === 0) {
            var res = { 
                result: self.type == "team" ? "lost" : "won" 
            };
            $(WTF.game).trigger("gameover", res);
        }
    },

    select: function () {
        var self = this;
        if (self.dead)
            return;
        if (self.behavior) {
            self.behavior.stop();
            if (WTF.selection && WTF.selection !== self && WTF.selection.behavior) {
                WTF.selection.behavior.start();
            }
        }
        WTF.selection = self;
        WTF.selection.element.css(WTF.markStyle.selection);
        if (WTF.selection.target) {
            self.setTarget(WTF.selection.target);
        }
        WTF.toolbar.empty();
        for (var name in self.abilities) {
            (function (ability) {
                var button = $("<button/>");
                button.append('<span/>');
                button.find("span").text(ability.options.label);
                button.attr("title", "KEY " + ability.options.bind + ": " + ability.options.description + "");
                button.attr("id", "ability-" + ability.options.bind);
                button.css({
                    width: Math.floor(100 / Object.keys(self.abilities).length) + "%"
                });
                WTF.toolbar.append(button);
                button.kendoButton({
                    enabled: ability.usable,
                    imageUrl: ability.options.icon,
                    click: function () {
                        if (!ability.usable) {
                            return;
                        }
                        ability.use();
                    }
                });
                button.data("ability", ability);
            })(self.abilities[name]);
        }
        $(document).off("keydown").on("keydown", function (e) {
            if (!WTF.selection || !WTF.selection.target)
                return;
            var target = WTF.selection.target;
            var key = parseInt(e.keyCode || e.which);
            if (e.altKey) {
                self.setTarget(self);
                self.select();
            }
            try {
                var button = WTF.toolbar.find("#ability-" + String.fromCharCode(key));
                if (button.length === 1) {
                    var ability = button.data("ability");
                    ability.use();
                }
            } catch (error) {
            }
            WTF.selection.setTarget(target);
            self.select();
        });
    },

    moveTo: function (position, options) {
        var self = this;
        if (!self.options.movable)
            return;
        self.element.stop(true, false);
        var duration = self.timeNeeded(position);
        var base = {
            duration: duration,
            queue: false,
            easing: "linear",
            start: function () {
                self.element.css({
                    backgroundImage: "url(" + self.options.image.move + ")"
                });
            },
            complete: function () {
                self.element.css({
                    backgroundImage: "url(" + self.options.image.stop + ")"
                });
            },
            progress: function () {
                if (self.element.css("background-image") !== "url(" + self.options.image.move + ")") {
                    self.element.css({
                        backgroundImage: "url(" + self.options.image.move + ")"
                    });
                }
            }
        };
        var options = $.extend(true, base, options);
        return self.element.animate({
            left: position.left - parseInt(self.width / 2),
            top: position.top - parseInt(self.height / 2)
        }, options);

    },

    setTarget: function (target) {
        if (!target) {
            return;
        }
        if (!WTF.selection) {
            return;
        }
        if (WTF.selection.target) {
            WTF.selection.target.element.css(WTF.markStyle.unselected);
        }
        WTF.selection.target = target;
        WTF.selection.target.element.css(WTF.markStyle.target);
    },

    createLabel: function () {
        var self = this;
        var label = $("<div/>");
        label.addClass("playername").addClass(self.type);
        label.text(self.name);
        self.element.append(label);
    },

    createHealthBar: function () {
        var self = this;
        var healthbar = $("<div/>");
        healthbar.addClass("playerbar").addClass("healthbar");
        self.element.append(healthbar);
        self.healthbar = healthbar.kendoProgressBar({
            chunkCount: 10,
            duration: 0,
            type: "chunk",
            value: this.options.health.max,
            max: this.options.health.max
        }).data("kendoProgressBar");
        self.health = new kendo.data.ObservableObject({
            value: this.options.health.max,
            max: this.options.health.max
        });
        self.health.bind("change", function (e) {
            if (this.value <= 0) {
                this.value = 0;
                $(self).trigger("dead", self);
                self.destroy();
            }
            self.healthbar.value(this.value);
        });

    },

    createEnergyBar: function (energy) {
        var self = this;
        var energybar = $("<div/>");
        energybar.addClass("playerbar").addClass("energybar");
        self.element.append(energybar);
        self.energybar = energybar.kendoProgressBar({
            chunkCount: 10,
            duration: 0,
            type: "chunk",
            value: this.options.energy.max,
            max: this.options.energy.max
        }).data("kendoProgressBar");
        self.energy = new kendo.data.ObservableObject({
            value: this.options.energy.max,
            max: this.options.energy.max
        });
        self.energy.bind("change", function (e) {
            self.energybar.value(self.energy.value);
        });
    },

    createAbilities: function () {
        var self = this;
        for (var name in self.options.abilities) {
            if (!WTF.Abilities[name]) {
                continue;
            }
            var options = self.options.abilities[name];
            var Ability = WTF.Abilities[name].extend();
            self.abilities[name] = new Ability(options, self);
        }
    },

    createBehavior: function () {
        var self = this;
        if (self.options.behavior) {
            var name = self.options.behavior;
            if (!WTF.Behaviors[name]) {
                return;
            }
            var options = self.options.behavior;
            var Behavior = WTF.Behaviors[name].extend();
            self.behavior = new Behavior(options, self);
        }
    },

    closest: function (type) {
        var self = this;
        var distance = null;
        var closest = null;
        WTF.players[type].forEach(player => {
            if (self === player)
                return;
            var d = self.distanceTo(player.position());
            if (distance === null || d < distance) {
                closest = player;
                distance = d;
            }
        });
        return closest;
    },

    tick: function () {
        var self = this;
        if (self.dead) {
            return;
        }
        ["energy", "health"].forEach(e => {
            if (self[e].value + self.regen[e] <= self[e].max)
                self[e].set("value", self[e].value + self.regen[e]);
            else
                self[e].set("value", self[e].max);
        });
    }
});
