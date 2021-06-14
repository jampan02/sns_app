<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Like;
use App\User;
class LikeController extends Controller
{
    //
	public function removeLike(Request $request){
		$like=Like::find($request->id);
		$like->delete();
		$likes=Like::all();
		return $likes;
	}
	public function addLike(Request $request){
		$like=new Like;
		$like->user_id=$request->user_id;
		$like->post_id=$request->post_id;
		$like->save();
		$likes=Like::all();
		return $likes;
	}
	public function getLikes(){
		$likes=Like::all();
		return $likes;
	}
	public function getUserByLike(Request $request){
		$likes=$request->data;
		$usersWithLikes=array();
		foreach($likes as $like){
			Log::debug($like);
			
			//Log::debug($likerId);
			$user=User::where("id",$like)->first();
			$newArray=array();
			$newArray["user"]=$user;
			$newArray["like"]=$like;
			$usersWithLikes[]=$newArray;
		}
		return $usersWithLikes;
	}
}
