<!DOCTYPE html>
<html>

<head>
    <title>WTF GAME</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=.5, maximum-scale=.0, minimum-scale=.5, user-scalable=no" />
    
    <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2018.1.117/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2018.1.117/styles/kendo.blueopal.min.css" />
    <link href="/styles/style.css" rel="stylesheet" />

    <script src="http://kendo.cdn.telerik.com/2018.1.117/js/jquery.min.js"></script>
    <script src="http://kendo.cdn.telerik.com/2018.1.117/js/kendo.all.min.js"></script>
    <script src="/js/WTF.js"></script>
</head>

<body>
    <div id="combat">
        <div id="stage"></div>
        <div id="toolbar"></div>
        <div id="panels"></div>
        <div id="notification"></div>
    </div>
    <script>
        $(function () {
            $(WTF).on("gameready", function () {
                
                WTF.debug = false;

                var game = new WTF.Game({
                    key: "{{ $key }}",
                    type: "1vs1",
                    stage: $("#stage"),
                    panels: $("#panels"),
                    toolbar: $("#toolbar"),
                    notification: $("#notification"),
                    background: "/images/stages/bg2.jpg"
                });
                
                var players = [
                    @foreach($players as $player)
                    "{{ $player }}",
                    @endforeach
                ];
                WTF.TeamSelector.loadPlayers(players, function () {
                    $("#combat").show();
                    @foreach($teams as $type => $team) 
                        @foreach($team->teammembers as $player)
                        for (var i = 0; i < WTF.TeamSelector.players.length; i++) {
                            if (WTF.TeamSelector.players[i].name == "{{ $player['name'] }}") {
                                var player = $.extend(true, {}, WTF.TeamSelector.players[i]);
                                player.type = "{{ $type }}";
                                game.addPlayer(player).setup();
                            }
                        }
                        @endforeach
                    @endforeach

                    game.init().start().gameover(function(result) {
                        $.ajax({
                            url: "/result",
                            type: "POST",
                            dataType: "text",
                            data: {
                                result: result,
                                key: this.key
                            },
                            error: function (xhr, status, msg) {
                                console.log(xhr, status, msg);
                                alert(xhr.responseText);
                            },
                            success: function (res) {
                                alert(res);
                                window.location = "/team/{{ $teams['team']->id }}";
                            }
                        });
                    });
                    
                });

            });
        });
    </script>
</body>

</html>