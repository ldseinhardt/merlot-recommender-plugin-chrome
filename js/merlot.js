(function() {
  'use strict';

  // carrega as configurações do plugin
  GET(chrome.extension.getURL('settings.json'), function (data) {
    var settings = JSON.parse(data);

    // verifica o id do usuário
    var regex = /[\\?&]id=([^&#]*)/.exec(location.search)
      , user =  (regex === null) ? 0 : parseInt(regex[1], 10);

    // carrega recomendações para o usuário
    GET(settings.url + '/recommender/?user=' + user, function (data) {
      data = JSON.parse(data);

      // número de tipos de recomendações disponiveis para o usuário
      var types = 0;
  
      // lista compartilhada de objetos recomendados
      var objects = [];

      // insere as caixas de recomendações
      var html = '';
      ['specific', 'general'].forEach(function(type) {

        if (data.hasOwnProperty(type) && data[type].hasOwnProperty('recommendations') && data[type].recommendations.length) {

          html += '<div id="merlot_recommender_' + type + '" class="merlot_recommender_tile member_tile">';
          html += '<h3><span class="member_tile_header_text">' + type.charAt(0).toUpperCase() + type.slice(1) + ' Recommendations</span></h3>';
          html += '<div class="member_tile_body">';

          data[type].recommendations.forEach(function(rec, i) {

            if (i) {
              html += '<hr/>';
            }

            html += '<div class="merlot_recommender_' + rec.object + '"';
            html += '<h3><a href="viewMaterial.htm?id=' + rec.object + '" class="merlot_recommender_title">' + 'loading title ...' + '</a></h3>';
            html += '<p class="merlot_recommender_description" align="justify">' + 'loading description ...' + '</p>';
            html += '<img src="/merlot/images/apricotstars/' + rec.value + '.png" alt="' + rec.value + ' rating" style="border:0">';
            html += '</div>';

            if (objects.indexOf(rec.object) === -1) {
              objects.push(rec.object);
            }

          });
          html += '<hr/>Errors:';
          html += '<ul>';
          html += '<li>MAE = ' + data[type].errors.mae + '</li>';
          html += '<li>RMS = ' + data[type].errors.rms + '</li>';
          html += '</ul>';
          html += '</div>';
          html += '</div>';

          types++;

        }

      });

      var main = document.getElementById('main_div');

      // calcula o tamanho necessário para a página
      main.style.width = (715 + (272 * types)) + 'px';

      // insere as caixas de recomendações com um container
      main.innerHTML = '<div id="merlot_recommender_wrapper">' + main.innerHTML + '</div>' + html;

      // carrega informações do objeto (titulo e descrição)
      objects.forEach(function(id) {
        GET('viewMaterial.htm?id=' + id, function (data) {
          var parser = new DOMParser()
            , doc = parser.parseFromString(data, 'text/html')
            , title = doc.querySelector('.material_tile_header_text').innerHTML.trim()
            , description = doc.querySelector('#descriptionshort').innerHTML.trim()
          // atualiza o link para a opção mais (more)
          description = description.replace('javascript:void(0)" id="seemoredescriptionlink" aria-label="Show the full description" onclick="displayDescription(true)', 'viewMaterial.htm?id=' + id);
          var titles = document.querySelectorAll('.merlot_recommender_' + id + ' .merlot_recommender_title')
            , descriptions = document.querySelectorAll('.merlot_recommender_' + id + ' .merlot_recommender_description');
          for (var i = 0; i < titles.length; i++) {
            titles[i].innerHTML = title;
          }
          for (var i = 0; i < descriptions.length; i++) {
            descriptions[i].innerHTML = description;
          }
        });
      });

    });

  });

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