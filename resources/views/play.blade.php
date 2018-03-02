@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading"><h2>Play a {{ $team->members }} vs {{ $team->members }} with <b>{{ $team->name }}</b></h2></div>
                <div class="panel-body">
                    <div class="row">
                    @foreach($team->teammembers as $player) 
                    <div class="text-center col-md-{{ intval(12 / $team->teammembers->count()) }}">
                        <img title="{{ $player->name }}" style="width: 50px; height: auto;">
                        <div class="alert alert-info">{{ $player->name }}</div>
                    </div>
                    @endforeach
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

                            @foreach($teams as $opponent)
                            <tr>
                                <td>{{ $opponent->name }}</td>
                                <td>{{ $opponent->played }}</td>
                                <td>{{ $opponent->won }}</td>
                                <td>{{ $opponent->members }} vs {{ $opponent->members }}</td>
                                <td>{{ $opponent->updated_at }}</td>
                                <td>
                                    @foreach($opponent->teammembers as $player)
                                    <img title="{{ $player->name }}" style="width: 30px; height: auto;">
                                    @endforeach
                                </td>
                                <td>
                                    <a href="{{ route('fight', ['id' => $team->id, 'against' => $opponent->id]) }}" class="btn btn-primary btn-sm">Play</a>
                                </td>
                            </tr>
                            @endforeach
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
        @foreach($players as $player)
        players.push(
            {!! $player['options'] !!}  
        );
        @endforeach
        for (var i = 0; i < players.length; i++) {
            $("[title='" + players[i].name + "']").attr("src", players[i].image.stop);
        }
    });
</script>
@endsection
