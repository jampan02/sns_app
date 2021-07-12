<?php
 
namespace Tests\Feature\Database;
 
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Post;
 
class DatabaseTest extends TestCase
{
    use RefreshDatabase;
 
    public function testDatabase()
    {
        $post = new Post();
        $post->user_id=1;
        $post->site_name="test_site";
		$post->title="test_title";
		$post->image="https://unruffled-spence-0404bb.netlify.app/images/posts/%E3%82%A4%E3%83%B3%E3%83%95%E3%83%A9/Docker/1/ogp.png";
		$post->url="https://unruffled-spence-0404bb.netlify.app/posts/infrastructure/docker/1";
		$post->body="this is awesome";
        $savePost = $post->save();
		$post=[
			"title"=>"test_title"
		];
        $this->assertDatabaseHas('posts', $post);
    }
}