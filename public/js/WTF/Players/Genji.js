WTF.TeamSelector.addPlayer({
    name: "Genji",
    speed: 130,
    width: 85,
    height: 85,
    image: {
        stop: "/images/players/genji.png",
        move: "/images/players/genji.png",
    },
    health: {
        regen: 2,
        max: 1100
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
            cooldown: .6,
            damage: {
                min: 10,
                max: 300
            },
            cost: {
                energy: 3
            }
        },
        "Shot": {
            label: "Shuriken",
            bind: "2",
            cooldown: 2,
            speed: 600,
            damage: {
                min: 30,
                max: 750
            },
            cost: {
                energy: 5
            },
            range: {
                min: 10,
                max: 700
            }
        },
        "Sprint": {
            label: "Sprint",
            bind: "3",
            cooldown: 14,
            damage: {
                min: 10,
                max: 300
            },
            cost: {
                energy: 10
            }
        },
    },
    behavior: "Attacker"
});