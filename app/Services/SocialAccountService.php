<?php

namespace App\Services;

use Laravel\Socialite\Contracts\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

use App\User;
use App\SocialAccount;

class SocialAccountService {

    public function createOrGetUser(Request $request, Provider $provider) {
        
        if ($provider instanceof \Laravel\Socialite\One\TwitterProvider) {
            $providerUser = $provider->user();
        } else {
            $providerUser = $provider->stateless()->user();
        }
        if ($providerUser->getEmail() === null) {
            throw new \Exception('Email not provided');
        } 
        $providerName = class_basename($provider);

        $account = SocialAccount::whereProvider($providerName)
                ->whereProviderUserId($providerUser->getId())
                ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => $providerName
            ]);

            $user = User::whereEmail($providerUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $providerUser->getEmail(),
                    'email' => $providerUser->getEmail(),
                    'password' => bcrypt(time())
                ]);
            }

            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }

}
