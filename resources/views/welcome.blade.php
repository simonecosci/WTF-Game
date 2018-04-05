<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

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
                background: rgba(255,255,255,.5);
                display: inline-block;
                padding: 3px;
                margin: 10px;
            }

            .m-b-md {
                margin-bottom: 30px;
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
        <div class="flex-center position-ref full-height">
            @if (Route::has('login'))
                <div class="top-right links">
                    @if (!Auth::check())
                        <a href="{{ url('/login') }}">Login</a>
                        <a href="{{ url('/register') }}">Register</a>
                    @endif
                </div>
            @endif

            <div class="content">
                <div class="slogan">
                    Too nOOb to play Overwatch ?<br>
                    Play this.
                </div>
                <div class="title m-b-md">
                    WTF GAME
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
            </div>
            <footer>&COPY; <?php echo date('Y'); ?> - Simone Cosci - No rights reserved</footer>
        </div>
    </body>
</html>
