var DomenUrl = location.hostname.replace(".advance-docs.ru", "")


ShowPanel()
RefreshAll()






function ShowPanel() {
  var i = document.querySelector('#start_panel');
  if (!i) {
    i = document.createElement("div")
    i.id = "start_panel"
    i.innerHTML = "Панель управления Ассистент"
    i.style.border = "1px black solid"
    document.querySelector('.col-xs-10.col-xs-offset-1').appendChild(i)
  }
  i.innerHTML = 'Панель управления Ассистент' +
    '<div><label id="status">Приостановленно</label><input type="checkbox" id="turn_assistent"/><label for="turn_assistent"></label></div>' +
    '<div>' +
    '<label><span>Таймаут (сек.)</span><input type="text" id="assistentTimerInterval" value ="60" size="4"></label>' +
    '<label><span>Включать при запуске</span><input type="checkbox" id="assistentTimerOn"</label>' +
    '</div>'
  LeadSettings()
  document.querySelector('#assistentTimerInterval').addEventListener("blur", (e) => {
    // localStorage.setItem(e.target.id, e.target.value);
    browser.storage.local.set({
      [e.target.id]: e.target.value
    });
    browser.runtime.sendMessage({
      name: "widget",
      action: "start"
    });
  })
  document.querySelector('#assistentTimerOn').addEventListener("change", (e) => {
    browser.storage.local.set({
      [e.target.id]: e.target.checked
    });
  })

  document.querySelector('#turn_assistent').addEventListener("click", (e) => {
    browser.storage.local.set({
      [e.target.id]: e.target.checked
    });
    if (document.querySelector('#turn_assistent').checked) {
      document.querySelector('#status').innerText = "Работает"
      browser.runtime.sendMessage({
        name: "widget",
        action: "start"
      });
    } else {
      document.querySelector('#status').innerText = "Приостановленно"
      browser.runtime.sendMessage({
        name: "widget",
        action: "stop"
      });
    }
  })

}


function LeadSettings() {
  browser.storage.local.get("assistentTimerInterval").then((obj) => {
    if (obj["assistentTimerInterval"] == undefined) {
      document.querySelector('#assistentTimerInterval').value = "60"
    } else {
      document.querySelector('#assistentTimerInterval').value = obj["assistentTimerInterval"]
    }
  }).then(() => {
    browser.storage.local.get("assistentTimerOn").then((obj) => {
      document.querySelector('#assistentTimerOn').checked = (obj["assistentTimerOn"] == true)
    });
  }).then(() => {
    browser.storage.local.get("turn_assistent").then((obj) => {
      document.querySelector('#turn_assistent').checked = (obj["turn_assistent"] == true)
    });
  }).then((obj) => {
    if (document.querySelector('#turn_assistent').checked) {
      document.querySelector('#status').innerText = "Работает"
    } else {
      document.querySelector('#status').innerText = "Приостановленно"
    }
  });
}

function RefreshAll() {
  var i = document.querySelector('#assistent_widget');
  if (!i) {
    i = document.createElement("div")
    i.id = "assistent_widget"
    document.querySelector('.col-xs-10.col-xs-offset-1').appendChild(i)
  }
  i.innerHTML = "Reload"
  browser.runtime.sendMessage({
    name: "widget",
    action: "Reload"
  }).then((obj) => {

    console.log(obj);
    // var btn = document.createElement("button")
    // btn.innerHTML = "Обновить все"
    // btn.onclick = RefreshAll
    // i.innerHTML = '<div class="table-hm-title assistent-box" style="color: #3ba4e1;">Ассистент</div>' +
    //   '<div id="work_claims_grid"><table class="table-hm">' +
    //   '<thead>' +
    //   '<tr>' +
    //   '<th>Тип Работы</th>' +
    //   '<th>Репликаций</th>' +
    //   '<th>Заявлений</th>' +
    //   '<th></th>' +
    //   '</tr>' +
    //   '</thead>' +
    //   '<tbody>' +
    //   '<tr>' +
    //   '<td>ДС ТР ЕАЭС</td>' +
    //   '<td>' + ReturnCount("DTREA", "count", obj, "replication") + '</td>' +
    //   '<td>' + ReturnCount("DTREA", "count", obj, "case") + '</td>' +
    //   '</tr><tr>' +
    //   '<td>СС ТР ЕАЭС</td>' +
    //   '<td>' + ReturnCount("SSTREA", "count", obj, "replication") + '</td>' +
    //   '<td>' + ReturnCount("SSTREA", "count", obj, "case") + '</td>' +
    //   '</tr><tr>' +
    //   '<td>Гост Р ЕАЭС</td>' +
    //   '<td>' + ReturnCount("GTREA", "count", obj, "replication") + '</td>' +
    //   '<td>' + ReturnCount("GTREA", "count", obj, "case") + '</td>' +
    //   '</tr>' +
    //   '</tbody>' +
    //   '</table>' +
    //   '</div>'
    // i.appendChild(btn);
  });
}

function ReturnCount(doc, count, array, type) {
  var res = array.find(item => {
    if (item.doc == doc && item.type == type) {
      // console.log(item);
      return item
    }
  })
  if (res && res[count]) {
    return res[count]
  } else {
    return "системная ошибка в 'ReturnCount'"
  }
}
