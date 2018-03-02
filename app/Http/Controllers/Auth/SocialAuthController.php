<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\SocialAccountService;
use Socialite;

class SocialAuthController extends Controller {

    public function redirect($provider) {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(Request $request, SocialAccountService $service, $provider) {
        try {
            $user = $service->createOrGetUser($request, Socialite::driver($provider));
            auth()->login($user);
        } catch (\Exception $e) {
            throw $e;
        }
        return redirect()->to('/');
    }

}
