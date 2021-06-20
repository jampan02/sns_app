<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Post;
use App\User;
use App\Like;
class PostController extends Controller
{
    //新しい純
	public function getNewerPosts(){
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
	//人気順
	/*public function getPopularPosts(){
		$mixedPosts=array();
		$popularSortLikes=Like::withCount('post_id')->orderBy('post_id_count','desc')->get();
		Log::debug($popularSortLikes);
		$posts=array();
		foreach($popularSortLikes as $popularSortLike){
			Log::debug($popularSortLike);
			$post_id=$popularSortLike->post_id;
			$posts[]=Post::where("id",$post_id)->first();
		}
		//$posts=Post::orderBy("id","DESC")->take(10)->get();
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
	}*/
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
	//検索結果一覧
	public function getPostBySearch(Request $request){
		$mixedPosts=array();
		$queryS=$request->q;
		$posts=Post::where("body","like","%{$queryS}%")->orWhere("title","like","%{$queryS}%")->get();
		Log::debug($posts);
		foreach($posts as $post){
			Log::debug($post);
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
		Log::debug($mixedPosts);
		return $mixedPosts;
	}
}
