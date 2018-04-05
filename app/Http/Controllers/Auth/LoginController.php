<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\Traits\CaptchaTrait;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers, CaptchaTrait;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
	
	/**
     * Validate the user login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    protected function validateLogin(Request $request) {
        $res = $request->get('g-recaptcha-response');
        $request->merge(['captcha' => $this->captchaCheck($res)]);
        $rules = [
            $this->username() => 'required|string',
            'password' => 'required|string'
        ];
        $messages = [];
        if (config('app.recaptcha')) {
            $rules['g-recaptcha-response'] = 'required';
            $rules['captcha'] = 'accepted';
            $messages = [
                'g-recaptcha-response.required' => 'Captcha is required',
                'captcha.min' => 'Wrong captcha, please try again.'
            ];
        }
        $this->validate($request, $rules, $messages);
    }
}
