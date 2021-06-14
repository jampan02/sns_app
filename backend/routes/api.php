<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/



Route::group(["middleware"=>"api"],function(){
	Route::get("user","UserController@getUser");
	Route::get("post_user","UserController@getPostUser");
	Route::get("get","PostController@getPosts");
	Route::post("add","PostController@addPost");
	Route::post("add/like","LikeController@addLike");
	Route::get("get/likes","LikeController@getLikes");
	Route::get("get/like/user","LikeController@getUserByLike");
	Route::post("remove/like","LikeController@removeLike");
	//user
	//コメント
	Route::get("get/comment","CommentController@getComments");
	Route::post("add/comment","CommentController@addComment");
});
