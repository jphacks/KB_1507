document.addEventListener('DOMContentLoaded', function(){
    getScore(function(){
        alert('ok');
    });
});

function getScore(callback){
    var xhr = new XMLHttpRequest();

    xhr.onload = function(response){
        var dom = document.getElementById('result');
        dom.innerHTML = response;
        callback();
    };

    xhr.onerror = function(error){
        console.error(error);
    };

    xhr.open('POST', '/score');

    xhr.send();
}
