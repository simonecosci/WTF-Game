WTF.TeamSelector.addPlayer({
    name: "John Doe",
    speed: 100,
    width: 100,
    height: 100,
    image: {
        stop: "/images/players/stop.jpg",
        move: "/images/players/run.gif",
    },
    health: {
        regen: 2,
        max: 1000
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
                max: 200
            },
            cost: {
                energy: 2
            }
        },
        "Shot": {
            label: "Shot",
            bind: "2",
            cooldown: .5,
            speed: 500,
            damage: {
                min: 30,
                max: 750
            },
            cost: {
                energy: 5
            }
        },
        "Bomb": {
            label: "Bomb",
            bind: "3",
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
        "Heal": {
            label: "Heal",
            bind: "4",
            cooldown: 5,
            heal: {
                min: 20,
                max: 200
            },
            cost: {
                energy: 10
            }
        },
        "Charge": {
            label: "Charge",
            bind: "5",
            cooldown: 14,
            damage: {
                min: 200,
                max: 1000
            },
            cost: {
                energy: 20
            }
        },
        "Shield": {
            label: "Shield",
            bind: "6",
            cooldown: 20,
            duration: 5,
            cost: {
                energy: 10
            }
        },
    },
    behavior: "Tank"
});