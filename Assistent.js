var i = document.createElement("div")

i.innerHTML = '<div class="table-hm-title" style="color: #6e910d;">Ассистент</div>' +
  '<div id="work_claims_grid"><table class="table-hm">' +
  '<thead>' +
  '<tr>' +
  '<th>Тип Работы</th>' +
  '<th>Репликаций</th><th>Заявлений</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody>' +
  '<tr>' +
  '<td>ДС ТР ЕАЭС</td>' +
  '<td>Всего 1 штуки</td>' +
  '<td>Всего 2 штуки</td>' +
  '</tr><tr>' +
  '<td>СС ТР ЕАЭС</td>' +
  '<td>Всего 4 штуки</td>' +
  '<td>Всего 2 штуки</td>' +
  '</tr><tr>' +
  '<td>Гост Р ЕАЭС</td>' +
  '<td>Всего 3 штуки</td>' +
  '<td>Всего 7 штуки</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>'

document.querySelector('.col-xs-10.col-xs-offset-1').appendChild(i)
