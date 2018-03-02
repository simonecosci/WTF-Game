<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/redirect/{provider}', 'Auth\SocialAuthController@redirect');
Route::get('/callback/{provider}', 'Auth\SocialAuthController@callback');

Route::get('/teams', function () {
    $teams = app()->make(App\Team::class)->with('teammembers')->get();
    $players = app()->make(App\Http\Controllers\HomeController::class)->getPlayers();
    return view('teams')->with(compact('teams', 'players'));
})->name('teams');

Route::get('/players', function () {
    $players = app()->make(App\Http\Controllers\HomeController::class)->getPlayers();
    return view('players')->with(compact('players'));
})->name('players');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::any('/create-team', 'HomeController@createTeam')->name('create-team');
Route::get('/team/{id}', 'HomeController@team')->name('team');
Route::get('/play/{id}', 'HomeController@play')->name('play');
Route::get('/fight/{id}/{against}', 'HomeController@fight')->name('fight');
Route::get('/result', 'HomeController@result');

