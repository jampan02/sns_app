<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Post;
use App\User;
use App\Like;
class PostController extends Controller
{
    //
	public function getPosts(){
		$mixedPosts=array();
		$posts=Post::orderBy("id","DESC")->take(10)->get();
		foreach($posts as $post){
			//Log::debug($post);
			$posterId=$post->user_id;
			$user=User::where("id",$posterId)->first();
			$likes=Like::where("post_id",$post->id)->get();
			$postData=array();
			$postData["post"]=$post;
			$postData["user"]=$user;
			$postData["likes"]=$likes;
			$mixedPosts[]=$postData;
			//$newArray=array("post"=>$post,"user"=>$user,"likes"=>$likes);
		}
		return $mixedPosts;
	}
	public function addPost(Request $request){
		$post=new Post;
		$post->user_id=$request->user_id;
		$post->site_name=$request->site_name;
		$post->title=$request->title;
		$post->image=$request->image;
		$post->url=$request->url;
		$post->body=$request->body;

		$post->save();
	}
}
