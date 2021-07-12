<?php

use Illuminate\Database\Seeder;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
		DB::table("posts")->truncate();
		$posts=[
			["user_id"=>1,
			"site_name"=>"example.com",
			"title"=>"タイトル",
			"image"=>"画像",
			"url"=>"https://example.com",
			"body"=>"内容"
		],			["user_id"=>2,
		"site_name"=>"example.com",
		"title"=>"タイトル",
		"image"=>"画像",
		"url"=>"https://example.com",
		"body"=>"内容"
	],			["user_id"=>3,
	"site_name"=>"example.com",
	"title"=>"タイトル",
	"image"=>"画像",
	"url"=>"https://example.com",
	"body"=>"内容"
],			["user_id"=>4,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],			["user_id"=>5,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],			["user_id"=>6,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],			["user_id"=>7,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],			["user_id"=>8,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],			["user_id"=>9,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],			["user_id"=>10,
"site_name"=>"example.com",
"title"=>"タイトル",
"image"=>"画像",
"url"=>"https://example.com",
"body"=>"内容"
],
		];
		foreach($posts as $post){
			\App\Post::create($post);
		};
    }
}
