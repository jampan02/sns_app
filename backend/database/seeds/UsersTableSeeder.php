<?php

use Illuminate\Database\Seeder;
//use Storage;
class UsersTableSeeder extends Seeder

{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
		DB::table("users")->truncate();
		$profile_image="https://www.willstyle.co.jp/w/wp-content/uploads/2017/08/laravel-search.jpg";
		$users=[
			[
				'name'=>"test1",
				"profile_image"=>$profile_image,
				 'email'=>"test1@gmail.com",
				 'password'=>"testtest",
				// "password_confirmation"=>"testtest"
			],
			[
				'name'=>"test2",
				"profile_image"=>$profile_image,
				 'email'=>"test2@gmail.com",
				 'password'=>"testtest",
				 //"password_confirmation"=>"testtest"
			],
			[
				'name'=>"test3",
				"profile_image"=>$profile_image,
				 'email'=>"test3@gmail.com",
				 'password'=>"testtest",
				// "password_confirmation"=>"testtest"
			],
		];
		foreach($users as $user){
			\App\User::create($user);
		};
    }
}
