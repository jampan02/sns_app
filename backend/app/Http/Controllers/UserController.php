<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Post;
use App\Like;
use App\Follow;
use App\Comment;
use Illuminate\Support\Facades\Log;
use Storage;
class UserController extends Controller
{
	public function json(){
		if (Auth::check()) {
		return Auth::user()->toJson();
		}
	}
	public function getPostUser(Request $request){
		$users=User::all();
		return $users;
	}
	//個別のアカウント情報取得
	public function getUser(Request $request){
		$userId=$request->user_id;
		$user=User::where("id",$userId)->first();
		if($user){
			return $user;
		}else{
			return redirect("/404");
		}
	}

	//検索機能
	public function getUserBySearch(Request $request){
		$number=$request->number-1;
		$queryS=$request->q;
		$user_id=$request->user_id;

		$user=User::orderBy("updated_at","DESC")->where("name","like","%{$queryS}%")->skip($number)->first();
		if($user){
		$follow=Follow::where("followee_id",$user_id)->where("follower_id",$user->id)->first();
		$result=array();
		$result["user"]=$user;
		$result["follow"]=$follow;
		return $result;
		}
	}
	//ユーザー情報更新
	public function editUserName(Request $request){
		$user_id=$request->input('id');
		$new_user_name=$request->input('name');
		$new_self_introduction=$request->input('self_introduction');
		$user=User::where("id",$user_id)->first();
		$user->name=$new_user_name;
		//profile_imageをS3にアップロード
		$new_profile_image=$request->file('image');
		if($new_profile_image){
		
		$path=Storage::disk("s3")->putFile("profile_images",$new_profile_image,"public");
		//パスを代入
		Log::debug($path);
		//Storage::disk("s3")->delete($user->profile_image);
		$user->profile_image=Storage::disk("s3")->url($path);
		
		}
		$user->self_introduction=$new_self_introduction;
		$user->save();
		return redirect('/');
	}
	public function deleteUser(Request $request){
		$user_id=$request->user_id;
		$user=User::where("id",$user_id)->first();
		$user->delete();
		//該当のユーザーが絡む、フォローフォロワー・いいね・コメント全削除
		$follows=Follow::where("followee_id",$user_id)->orWhere("follower_id",$user->id)->get();
		$follows->delete();
		$likes=Like::where("user_id",$user_id)->get();
		$likes->delete();
		$comments=Comment::where("user_id",$user_id)->get();
		$comments->delete();
	}
}
