<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta property="og:url"           content="http://wtf-game.simonecosci.com/" />
        <meta property="og:type"          content="website" />
        <meta property="og:title"         content="WTF GAME" />
        <meta property="og:description"   content="Too nOOb to play Overwatch ? Play this." />
        <meta property="og:image"         content="http://wtf-game.simonecosci.com/images/logo.jpg" />
        
        <title>WTF GAME</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Raleway', sans-serif;
                font-weight: 100;
                height: 100vh;
                margin: 0;
            }
            
            .logo {
                display: none;
            }

            .full-height {
                background-image: url(/images/logo.jpg);
                background-repeat: no-repeat;
                background-position: bottom right;
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
                text-shadow: 0px 0px 12px #fff;
                font-weight: bold;
            }
            
            .slogan {
                color: yellow;
                font-size: 54px;
                text-shadow: 0px 0px 12px #333;
                font-weight: bold;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
                background: rgba(200,200,200,.5);
                display: inline-block;
                padding: 3px;
                margin: 10px;
                border: 1px solid silver;
                border-radius: 4px;
            }
            .powered-by a,
            .inpired-by a {
                display: inline-block;
                overflow: hidden;
            }
            .inpired-by img {
                width: auto;
                height: 80px;
            }
            .powered-by img {
                width: auto;
                height: 80px;
            }
            .social {
                width: 300px;
                margin: 0 auto;
                text-align: center;
            }
            
            footer {
                position: absolute;
                display: block;
                text-align: center;
                font-size: 150%;
                bottom: 0;
                padding: 5px;
                color: #000;
                z-index: 2000;
            }
        </style>
    </head>
    <body>
        
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v2.12&appId=154713115022251&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
        
        <div class="flex-center position-ref full-height">
            @if (Route::has('login'))
                <div class="top-right links">
                    @if (!Auth::check())
                        <a href="{{ url('/login') }}">Login</a>
                        <a href="{{ url('/register') }}">Register</a>
                    @endif
                </div>
            @endif
            
            <div class="logo">
                <img src="/images/logo.jpg">
            </div>

            <div class="content">
                <div class="slogan">
                    Too nOOb to play Overwatch ?<br>
                    Play this.
                </div>
                <div class="title m-b-md">
                    WTF GAME
                </div>
                <div class="social">
                    <div class="fb-like" data-href="http://wtf-game.simonecosci.com/" data-layout="standard" data-action="like" data-size="large" data-show-faces="true" data-share="true"></div>
                </div>
                
                <div class="links">
                    <a href="http://www.simonecosci.com" target="_blank">Author</a>
                    <a href="/teams">Teams</a>
                    <a href="/players">Players</a>
                    <a href="/how">How to play</a>
                    @if (Auth::check())
                        <a href="{{ url('/home') }}">Dashboard</a>
                    @endif
                </div>
                
                <div class="powered-by">
                    <p>Powerd by</p>
                    <a href="https://www.laravel.com/" target="_blank">
                        <img src="/images/laravel.png">
                    </a>
                    <a href="https://www.telerik.com/kendo-ui" target="_blank">
                        <img src="/images/kendo-ui.png">
                    </a>
                </div>
                
                <div class="inpired-by">
                    <p>Inspired by</p>
                    <div>
                        <a href="https://www.blizzard.com" target="_blank">
                            <img src="/images/blizzard.png"> <img src="/images/Overwatch_Logo.png"><br>
                        </a>
                    </div>
                </div>
                <h3>Beta 1</h3>
            </div>
            <footer>
                &COPY; <?php echo date('Y'); ?> - Simone Cosci - No rights reserved
            </footer>
        </div>
    </body>
</html>
