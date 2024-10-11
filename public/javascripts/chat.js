let enviaMensagens = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/chat/recebemensagens");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  var mensagem = document.getElementById("mensagem").value;
  xhr.send("mensagem=" + mensagem);
  xhr.onload = () => {
    let status = xhr.status;
    if (status == 200) {
      document.getElementById("mensagem").value = "";
      buscaMensagens();
    }
  };
};

let buscaMensagens = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/chat/buscamensagens");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    let status = xhr.status;

    if (status == 200) {
      let dado = xhr.response;
      document.getElementById("chat-conteudo").innerHTML = dado;
      $("#chat-conteudo").scrollTop($("#chat-conteudo")[0].scrollHeight);
    }
  };
  xhr.send();
};

// Dispara a função para já buscar os dados quando carregar a página
buscaMensagens();
// Executa novamente a função a cada 5000 milissegundos (5 segundos)
setInterval(() => buscaMensagens(), 5000);