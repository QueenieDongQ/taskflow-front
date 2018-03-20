let server;
let shell = require('electron').shell;

function serve(path) {
    if(server) {
        server.close()
    }
    try {
      let certs = require(path);
      let app = get_express_server(certs, "localhost", 8443);
        let port = $("#port").val();
        port = parseInt(port);
        server = app.listen(port)
    } catch(e) {
        alert(e);
    }
}

$(document).ready(()=>{
  let path2 = localStorage.getItem('path');
    if(path2) {
        $("#user-file-path").val(path2)
    }
    $("#port").val(3001);

    $("#user-file").change(() => {
      let files = $("#user-file").prop('files');
        if(files.length !== 0) {
            $("#user-file-path").val(files[0].path)
        }
    });

    $("#open-user-file").click(()=>{
        $("#user-file").click()
    });

    $('#serve').click(()=>{
        let path = $("#user-file-path").val();
        localStorage.setItem('path', path);
        if(!path) {
            alert('please select a user identity');
            return
        }
        serve(path)
    });

    $("#stop").click(() => {
        if(server) {
            server.close();
            server = undefined
        }
    });

    $("#open-link").click(() => {
        if(!server) {
            alert('please launch the server');
            return
        }
        let port = $("#port").val();
        // window.open("http://localhost:"+port+'/api/user/info')
        mainView2("http://localhost:"+port+'/')
    });
    $("#open-extra").click(() => {
        if(!server) {
            alert('please launch the server');
            return
        }
        let port = $("#port").val();
        shell.openExternal("http://localhost:"+port+'/api/user/info')
    });
    function mainView2(url) {
        let webview = document.getElementById('main-view');
        webview.loadURL(url);
    }
});
