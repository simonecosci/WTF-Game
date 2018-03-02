<?php $__env->startSection('content'); ?>

<script id="row-template" type="tf/x-template" style="display: none">
    <tr>
        <td valign=top class="player-select">
            <input type="checkbox" name="players[]" value=""> 
        </td>
        <td valign=top class="player-img">
            <img src="" >
        </td>
        <td valign=top class="player-info"></td>
        <td valign=top class="player-ability1"></td>
        <td valign=top class="player-ability2"></td>
        <td valign=top class="player-ability3"></td>
    </tr>
</script>

<div class="container">
    <div class="row">
        <div>
            <div class="panel panel-default">
                <div class="panel-heading">Create a new Team</div>
                <div class="panel-body">
                    <div class="alert alert-info">
                        <h1 class="text-center"><span class="count"></span> vs <span class="count"></span></h1>
                    </div>
                    <form id="create-team" method="POST" class="form-horizontal" action="/create-team">

                        <?php echo e(csrf_field()); ?>


                        <div class="form-group<?php echo e($errors->has('name') ? ' has-error' : ''); ?>">
                            <label for="name" class="col-md-2 control-label">Name</label>
                            <div class="col-md-10">
                                <input id="name" type="text" class="form-control" name="name" value="<?php echo e(old('name')); ?>" required autofocus>

                                <?php if($errors->has('name')): ?>
                                <span class="help-block">
                                    <strong><?php echo e($errors->first('name')); ?></strong>
                                </span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="form-group<?php echo e($errors->has('players') ? ' has-error' : ''); ?>">
                            <label forplayersname" class="col-md-2 control-label">Players</label>
                            <div class="col-md-10">
                                <?php if($errors->has('players')): ?>
                                <span class="help-block">
                                    <strong><?php echo e($errors->first('players')); ?></strong>
                                </span>
                                <?php endif; ?>
                                
                                <table id="players" class="table table-bordered table-condensed table-striped">
                                    <thead>
                                        <tr>
                                            <th>&nbsp;</th>
                                            <th>Image</th>
                                            <th>Info</th>
                                            <th>Ability1</th>
                                            <th>Ability2</th>
                                            <th>Ability3</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>

                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-10 col-md-offset-2">
                                <button type="submit" class="btn btn-primary">
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function(){
        var players = [];
        <?php $__currentLoopData = $players; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        players.push(
            <?php echo $player['options']; ?>  
        );
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        for (var i = 0; i < players.length; i++) {
            var row = $("#row-template").html();
            var info = [
                "Name: <b>" + players[i].name + "</b>",
                "Speed: <b>" + players[i].speed + "</b> px/sec",
                "Hitbox: <b>" + players[i].width + "x" + players[i].height + "</b>",
                "Health: <b>" + players[i].health.max + "</b> (" + players[i].health.regen + "/sec regen.)",
                "Energy: <b>" + players[i].energy.max + "</b> (" + players[i].energy.regen + "/sec regen.)",
                "Behavior: <b>" + players[i].behavior + "</b>"
            ];
            $("#players tbody").append(row);
            var last = $("#players tbody tr:last");
            last.find(".player-select input").val(players[i].name);
            last.find(".player-img img")
                    .attr("src", players[i].image.stop)
                    .css({
                        width: "80px",
                        height: "auto"
                    });
            last.find(".player-info").html(info.join("<br>"));
            var index = 1;
            for(var abilityName in players[i].abilities) {
                var ability = [
                    "Name: <b>" + abilityName + "</b>",
                    "Bind: <b>" + players[i].abilities[abilityName].bind + "</b>",
                    "Cooldown: <b>" + players[i].abilities[abilityName].cooldown + "</b>",
                    "Speed: <b>" + players[i].abilities[abilityName].speed + "</b>",
                    "Duration: <b>" + players[i].abilities[abilityName].duration + "</b>",
                ];
                if (players[i].abilities[abilityName].cost) {
                    if (players[i].abilities[abilityName].cost.energy) {
                        ability.push("Cost: <b>" + players[i].abilities[abilityName].cost.energy + "</b> Energy");
                    }
                    if (players[i].abilities[abilityName].cost.health) {
                        ability.push("Cost: <b>" + players[i].abilities[abilityName].cost.health + "</b> Health");
                    }
                }
                if (players[i].abilities[abilityName].range) {
                    ability.push("Range: <b>" + players[i].abilities[abilityName].range.min + " - " + players[i].abilities[abilityName].range.max + "</b>");
                }
                if (players[i].abilities[abilityName].damage) {
                    ability.push("Damage: <b>" + players[i].abilities[abilityName].damage.min + " - " + players[i].abilities[abilityName].damage.max + "</b>");
                }
                if (players[i].abilities[abilityName].heal) {
                    ability.push("Heal: <b>" + players[i].abilities[abilityName].heal.min + " - " + players[i].abilities[abilityName].heal.max + "</b>");
                }
                
                last.find(".player-ability" + index).html(ability.join("<br>"));
                index++;
            }
        }
        
        $("#players tbody [type=checkbox]").on("click", function(){
            var count = $("#players tbody [type=checkbox]:checked").length;
            if (count === 0) {
                return $(".alert").hide();
            }
            $(".alert").show();
            $(".alert .count").text(count);
            if (count > 4) {
                alert("Max 4 players");
            }
        });
        
        $("#create-team").on("submit", function() {
            var count = $("#players tbody [type=checkbox]:checked").length;
            if (count > 4) {
                alert("Max 4 players");
                return false;
            }
            return true;
        });
        
        $(".alert").hide();
    });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>