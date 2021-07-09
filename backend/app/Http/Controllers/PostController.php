<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Post;
use App\User;
use App\Like;
use Storage;
//ここに一行追加-------------------------------------//
use Weidner\Goutte\GoutteFacade as GoutteFacade;
//ライブラリロード

    //use
    use Goutte\Client;
class PostController extends Controller
{
	public function addPost(Request $request){
		Log::debug("message");
				$URL=$request->url;
				$client = new Client();
				$crawler = $client->request('GET', $URL);
				$meta = $crawler->filter('meta')->each(function($node) {
					return [
						'property' => $node->attr('property'),
						'content' => $node->attr('content'),
					];
				});
			
				$post=new Post;
				foreach($meta as $data){
				
				switch($data["property"]){
				
				case "og:site_name":
					Log::debug($data);
						$post->site_name=$data["content"];
						break;
				case "og:title":
						$post->title=$data["content"];
						break;
				case "og:image":
						$post->image=$data["content"];
						break;
				default:
					break;
				}
			}
			if($post->image === null){
				$post->image=Storage::disk("s3")->url("default/l_e_others_501.png");
			
			}
			if($post->title === null){
				$post->title=$crawler->filter('title')->text();
			}
			if($post->site_name === null){
				$post->site_name=$URL;
			}
		
		$post->user_id=$request->user_id;
		$post->url=$URL;
		$post->body=$request->body;
			
		$post->save();
				

			

		return $post;
	}
	//検索結果一覧
	public function getPostBySearch(Request $request){
		$number=$request->number-1;
		$queryS=$request->q;
		$post=Post::orderBy("updated_at","DESC")->where("body","like","%{$queryS}%")->orWhere("title","like","%{$queryS}%")->skip($number)->first();
		if($post){
		$user=User::where("id",$post->user_id)->first();
		$likes=Like::where("post_id",$post->id)->get();
		$result=array();
		$result["post"]=$post;
		$result["user"]=$user;
		$result["likes"]=$likes;
		return $result;
		}
	}
	//編集
	public function editPost(Request $request){
		$url=$request->url;
		$body=$request->body;
		$id=$request->post_id;
		$post=Post::where("id",$id)->first();
		$post->url=$url;
		$post->body=$body;
		$post->save();
	}
	//スラッグでポスト取得
	public function getPost(Request $request){
		$post=Post::where("id",$request->id)->first();
		$user=User::where("id",$post->user_id)->first();
		$likes=Like::where("post_id",$request->id)->get();
		$result=array();
		$result["post"]=$post;
		$result["user"]=$user;
		$result["likes"]=$likes;
		return $result;
	}
	public function getPostByScroll(Request $request){
		$number=$request->number-1;
		Log::debug($number);
		$post=Post::orderBy("updated_at","DESC")->skip($number)->first();
		Log::debug($post);
		if($post){
		$user=User::where("id",$post->user_id)->first();
		$likes=Like::where("post_id",$post->id)->get();
		$result=array();
		$result["post"]=$post;
		$result["user"]=$user;
		$result["likes"]=$likes;
		return $result;
		}else{
			return;
		}
	}
 public function getPostByScrollInUser(Request $request){
	$number=$request->number-1;
	$user_id=$request->user_id;
	Log::debug($user_id);
	Log::debug($number);
	$post=Post::where("user_id",$user_id)->orderBy("updated_at","DESC")->skip($number)->first();

	if($post){
		Log::debug($post);
	$user=User::where("id",$post->user_id)->first();
	$likes=Like::where("post_id",$post->id)->get();
	$result=array();
	$result["post"]=$post;
	$result["user"]=$user;
	$result["likes"]=$likes;
	return $result;
	}
 }
 //削除関数
 public function delPost(Request $request){
	 $post_id=$request->id;
	 Log::debug($post_id);
	 $post=Post::where("id",$post_id)->first();
	 $post->delete();
 }
}
