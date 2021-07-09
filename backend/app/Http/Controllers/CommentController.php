<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Comment;
use App\Post;
use App\User;
class CommentController extends Controller
{
    //
	public function getComments(Request $request){
		$number=$request->number-1;
		$postId=$request->postId;
		$comment=Comment::where("post_id",$postId)->orderBy("updated_at","desc")->skip($number)->first();
		if($comment){
			$user=User::where("id",$comment->user_id)->first();
			$result=array();
			$result["user"]=$user;
			$result["comment"]=$comment;
			return $result;
			}else{
				return;
			}

	}
	public function addComment(Request $request){
		$data=$request;
		Log::debug($data);
		$comment=new Comment;
		$comment->comment=$data->comment;
		$comment->user_id=$data->user_id;
		$comment->post_id=$data->post_id;
		$comment->save();

		$comments=Comment::where("post_id",$data->post_id)->take(10)->get();
		$resultArray=array();
		foreach($comments as $comment){
			$newArray=array();
			$user=User::where("id",$comment->user_id)->first();
			$newArray["user"]=$user;
			$newArray["comment"]=$comment;
			$resultArray[]=$newArray;
		}
		return $resultArray;
	}
}
