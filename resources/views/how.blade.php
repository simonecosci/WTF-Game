@extends('layouts.app')

@section('content')
<div class="container">
    <h1>How to play</h1>
    <div class="content">
        <ul>
            <li>Register a <b>new account</b> or login an existent</li>
            <li>Click on <b>"Create a new Team"</b></li>
            <li>Give a <b>name</b> to your team, select 1, 2 or 3 players and click <b>"Create"</b></li>
            <li>Click <b>"Play"</b> and select the team you want to play against</li>
            <li>
                <h3>The Stage</h3>
                The combat area where players fight.<br>
                Your team will start from the left side and enemies form the right side.<br>
                <img src="/images/how1.JPG" style="width: 100%"><br>
                If you click on one of your team you will select it and take control of it.<br>
                The selected player is marked with a black border around it.<br>
                The Action bar will show the available actions and each one of the will be bound to your keyboards with the first 3 numebers.<br>
                Once you select another one, the previous selected will re-start to behave as normal (out of your control).<br>
                If you click on an enemy, this will be assigned as target of your current team selection.<br>
                If you want to select a teammate as target (for heals eg.) you have to hold CTRL and then click on the teammate.<br>
                <h3>The Grid</h3>
                You can also use the grid in the right sidebar to select the players.<br>
                <img src="/images/how2.JPG" style="width: 100%"><br>
                Once your selected player has aquired a target, you can use the buttons placed at the bottom of the stage or use the bound keys 1,2,3 to perform the actions which the selected player owns.<br>
                Each player has a defined number of health points, represented as red bar under the figure. When the health is finished, the player is dead.<br>
                Each player has 3 dirrent abilities which can be used for different purposes.<br>
                Each ability can belongs to one of these tree categories:
                <ol>
                    <li>Defense</li>
                    <li>Heal</li>
                    <li>Attack</li>
                </ol>
                In the same way each player has it's own behavior which can be one of these:
                <ol>
                    <li>Tank</li>
                    <li>Healer</li>
                    <li>Attacker</li>
                </ol>
                Every time a player uses an ability its energy will be reduced by the cost of that spell/action and when the energy is finished it can't cast anymore.<br>
                Both bars (Health and Energy) will be slowly refilled using the automatic regeneration.<br>
                Once all enemies has been defeated the match is WON.<br>
            </li>
            <li>Enjoy</li>
        </ul>
    </div>
</div>
@endsection
