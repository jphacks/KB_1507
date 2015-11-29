document.addEventListener('DOMContentLoaded', function(){
    getScore(function(){
        console.log('get score');
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
