

<!DOCTYPE html>
<html lang="ja">
    <head>

<meta property="og:url" content="https://yuarueru.com" />
 
<meta property="og:type" content="website" />
 
<meta property="og:title" content="yuarueru.com" />
<meta property="og:site_name" content="ゆあるえる" />

<meta property="og:image" content="/site_icon.png" />
		<meta charset="utf-8">
		<meta name="description" content="面白い、勉強になる等のサイトを共有するサイトです。 SNS でもあるため、自分が興味のある投稿をするユーザーをフォローして個別の投稿を閲覧することも可能です。">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="/css/app.css">
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<link rel="shortcut icon" href="{{ asset('/favicon.ico') }}">
		<link rel="apple-touch-icon" href="{{asset('/apple-touch-icon.png')}}">
		<link rel="icon" type="image/png" href="{{asset('/android-chrome-192x192.png')}}">
    </head>
    <body>

			<div id="app"></div>
     
    </body>
	<script src="/js/index.js">
	</script>
	
</html>
