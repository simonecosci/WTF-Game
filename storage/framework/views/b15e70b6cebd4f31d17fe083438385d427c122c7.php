<?php $__env->startSection('content'); ?>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading"><h2>Play a <?php echo e($team->members); ?> vs <?php echo e($team->members); ?> with <b><?php echo e($team->name); ?></b></h2></div>
                <div class="panel-body">
                    <div class="row">
                    <?php $__currentLoopData = $team->teammembers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?> 
                    <div class="text-center col-md-<?php echo e(intval(12 / $team->teammembers->count())); ?>">
                        <img title="<?php echo e($player->name); ?>" style="width: 50px; height: auto;">
                        <div class="alert alert-info"><?php echo e($player->name); ?></div>
                    </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                </div>
                <div class="panel-footer">
                    <h2>against ...</h2>
                    <table id="teams" class="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Played</th>
                                <th>Won</th>
                                <th>Type</th>
                                <th>Last play</th>
                                <th>Players</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>

                            <?php $__currentLoopData = $teams; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $opponent): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr>
                                <td><?php echo e($opponent->name); ?></td>
                                <td><?php echo e($opponent->played); ?></td>
                                <td><?php echo e($opponent->won); ?></td>
                                <td><?php echo e($opponent->members); ?> vs <?php echo e($opponent->members); ?></td>
                                <td><?php echo e($opponent->updated_at); ?></td>
                                <td>
                                    <?php $__currentLoopData = $opponent->teammembers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <img title="<?php echo e($player->name); ?>" style="width: 30px; height: auto;">
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </td>
                                <td>
                                    <a href="<?php echo e(route('fight', ['id' => $team->id, 'against' => $opponent->id])); ?>" class="btn btn-primary btn-sm">Play</a>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
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
            $("[title='" + players[i].name + "']").attr("src", players[i].image.stop);
        }
    });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>