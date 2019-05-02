<p align="center"><img src="https://laravel.com/assets/img/components/logo-laravel.svg"></p>

## About this game

WTF-Game is a simple browser based game built with kendo-ui using dom nodes.
It means that no canvas is required and all game objeicts are simple tag elements

DOM Browser game 

- [Laravel](https://laravel.com/docs/5.6).
- [Telerik Kendo UI for jQuery](https://www.progress.com/kendo-ui).
- [Project homepage](http://wtf-game.simonecosci.com/).

## Installation
Cloning the git
```
git clone https://github.com/simonecosci/WTF-Game.git <install-directory>
cd <install-directory>
composer install
npm install
```

Via Composer
```
composer create-project simonecosci/WTF-Game <install-directory>
cd <install-directory>
npm install
```
## Database
Creata a new database
```
mysql -uroot -p
mysql> create database yourDatabaseName;
mysql> quit;
```

Then `cp .env.example .env` and update your database creds.
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yourDatabaseName
DB_USERNAME=root
DB_PASSWORD=root
```

run the migrations with seed
```
php artisan migrate
```
You can now run the web server

```
php artisan serve
```

or configure a virtualhost in your web server config

```
<VirtualHost *:80>
	ServerName localhost
	DocumentRoot "/<install-directory>/public"
	<Directory  "/<install-directory>/public/">
		Options +Indexes +Includes +FollowSymLinks +MultiViews
		AllowOverride All
		Require local
	</Directory>
</VirtualHost>
```

Navigate http://localhost/ and login

## License

The WTF-Game is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
