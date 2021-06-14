<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
class UserController extends Controller
{
    //
	public function getUser(){
	  if (Auth::check()) {
		return Auth::user()->toJson();
	  }else{
		  return "nologined";
	  }
		
	}
	public function json(){
		if (Auth::check()) {
		return Auth::user()->toJson();
		}
	}
	public function getPostUser(Request $request){
		$users=User::all();
		return $users;
	}
}
