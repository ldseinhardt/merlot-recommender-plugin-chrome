(function() {
  'use strict';

  document.getElementById('feedback').focus();

  // evento clicar para enviar feedback
  document.getElementById('send').addEventListener('click', sendFeedback);
  document.getElementById('feedback').addEventListener('keydown', function(e) {
    if (e.which == 13) {
      e.preventDefault();
      sendFeedback();
    }
  });

  function sendFeedback() {
    // carrega as configurações do plugin
    GET(chrome.extension.getURL('settings.json'), function (data) {
      var settings = JSON.parse(data);
      chrome.tabs.getSelected(null,function(tab) {
        // verifica o id do usuário
        var regex = /[\\?&]id=([^&#]*)/.exec(tab.url)
          , user =  (regex === null) ? 0 : parseInt(regex[1], 10)
          , feedback = document.getElementById('feedback').value;
        if (feedback.length) {
          GET(settings.url + '/feedback/?user=' + user + '&feedback=' + feedback);
          document.querySelector('body').innerHTML = '<p><img src="icon.png"></p><p>Thanks for the feedback.</p>';
        }
      });

    }, 'json');
  }

  // função ajax para realizar requisições
  function GET(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (callback && xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }

})();