document.addEventListener('DOMContentLoaded', function(){
    // ぐるぐる表示
        // 親要素の取得
        // ぐるぐるの生成
        // 親にぐるぐるを追加
    getScore(function(){
        console.log('get score');
        // ぐるぐる非表示
            // ぐるぐるの取得
            // ぐるぐるの非表示
    });
});

function getScore(callback){
    var xhr = new XMLHttpRequest();

    xhr.onload = function(response){
        var dom = document.getElementById('result');
        dom.innerHTML = xhr.response;
        callback();
    };

    xhr.onerror = function(error){
        console.error(error);
    };

    xhr.open('POST', '/score');

    xhr.send();
}
