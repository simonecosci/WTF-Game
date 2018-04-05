WTF.TeamSelector.addPlayer({
    name: "Mercy",
    speed: 80,
    width: 80,
    height: 80,
    image: {
        stop: "/images/players/mercy.png",
        move: "/images/players/mercy.png",
    },
    health: {
        regen: 2,
        max: 800
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
        "Shot": {
            label: "Shot",
            bind: "2",
            cooldown: 2,
            speed: 700,
            damage: {
                min: 30,
                max: 750
            },
            cost: {
                energy: 5
            },
            range: {
                min: 50,
                max: 800
            }
        },
        "Heal": {
            label: "Heal",
            bind: "4",
            cooldown: 5,
            heal: {
                min: 50,
                max: 300
            },
            cost: {
                energy: 10
            }
        },
    },
    behavior: "Healer"
});