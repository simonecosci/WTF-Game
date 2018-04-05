WTF.TeamSelector.addPlayer({
    name: "Junkrat",
    speed: 80,
    width: 80,
    height: 80,
    image: {
        stop: "/images/players/junkrat.png",
        move: "/images/players/junkrat.png",
    },
    health: {
        regen: 2,
        max: 900
    },
    energy: {
        regen: 1,
        max: 200
    },
    tick: 1,
    abilities: {
        "Melee": {
            label: "Melee",
            bind: "1",
            cooldown: .2,
            damage: {
                min: 0,
                max: 100
            },
            cost: {
                energy: 2
            },
        },
        "Bomb": {
            label: "Bomb",
            bind: "2",
            cooldown: 2,
            speed: 200,
            range: {
                min: 0,
                max: 400
            },
            damage: {
                min: 100,
                max: 700
            },
            cost: {
                energy: 15
            }
        },
        "Trap": {
            label: "Trap",
            bind: "3",
            cooldown: 20,
            duration: 7
        }
    },
    behavior: "Attacker"
});