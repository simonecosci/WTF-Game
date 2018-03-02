WTF.TeamSelector.addPlayer({
    name: "FooBarBaz",
    speed: 100,
    width: 100,
    height: 100,
    image: {
        stop: "/images/players/boss1.gif",
        move: "/images/players/boss1.gif",
    },
    health: {
        regen: 2,
        max: 10000
    },
    energy: {
        regen: 1,
        max: 200
    },
    tick: .1,
    abilities: {
        "Shot": {
            label: "Shot",
            bind: "1",
            cooldown: 0,
            speed: 500,
            damage: {
                min: 10,
                max: 100
            },
            cost: {
                energy: 2
            }
        },
        "Heal": {
            label: "Heal",
            bind: "2",
            cooldown: 5,
            heal: {
                min: 20,
                max: 200
            },
            cost: {
                energy: 5
            }
        }
    },
    behavior: "Tank"
});