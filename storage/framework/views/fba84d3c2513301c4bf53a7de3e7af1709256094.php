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
                    key: "<?php echo e($key); ?>",
                    type: "1vs1",
                    stage: $("#stage"),
                    panels: $("#panels"),
                    toolbar: $("#toolbar"),
                    notification: $("#notification"),
                    background: "/images/stages/bg2.jpg"
                });
                
                var players = [
                    <?php $__currentLoopData = $players; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    "<?php echo e($player); ?>",
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                ];
                WTF.TeamSelector.loadPlayers(players, function () {
                    $("#combat").show();
                    <?php $__currentLoopData = $teams; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $type => $team): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?> 
                        <?php $__currentLoopData = $team->teammembers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        for (var i = 0; i < WTF.TeamSelector.players.length; i++) {
                            if (WTF.TeamSelector.players[i].name == "<?php echo e($player['name']); ?>") {
                                var player = $.extend(true, {}, WTF.TeamSelector.players[i]);
                                player.type = "<?php echo e($type); ?>";
                                game.addPlayer(player).setup();
                            }
                        }
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

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
                                window.location = "/team/<?php echo e($teams['team']->id); ?>";
                            }
                        });
                    });
                    
                });

            });
        });
    </script>
</body>

</html>