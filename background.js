var actualtimer
browser.runtime.onMessage.addListener(listener);

function listener(message) {
  if (message.name == "widget") {
    switch (message.action) {
      case "stop":
        clertTimer()
        break;
      case "start":
        clertTimer()
        StartNotification()
        break;
      case "Reload":
        reload()
      default:
    }
  }
}

function clertTimer() {
  clearTimeout(actualtimer)
}

function reload() {
  browser.storage.local.get("DomenUrl").then((obj) => {
    if (obj.DomenUrl == null) {
      console.log("obj.DomenUrl == null");
    }
  }).then((obj) => {
    console.log("111111111111");
    var refreshpromise = []
    refreshpromise.push(GetReplicationCount("DTREA"))
    refreshpromise.push(GetReplicationCount("SSTREA"))
    refreshpromise.push(GetReplicationCount("GTREA"))
    refreshpromise.push(GetCaseCount("DTREA"))
    refreshpromise.push(GetCaseCount("SSTREA"))
    refreshpromise.push(GetCaseCount("GTREA"))
  }).then(() => {
    console.log("111111111111");
    return Promise.all(refreshpromise)
  }).then((obj) => {
    console.log(obj);
    sendResponse({
      obj: obj
    });
  });



}


browser.storage.local.get("assistentTimerOn").then((obj) => {
  if (obj.assistentTimerOn == true) {
    StartNotification()
  }
})


function StartNotification() {
  browser.storage.local.get("turn_assistent").then((obj) => {
    if (obj["turn_assistent"] == true) {
      TicTimer().then((obj) => {
        browser.storage.local.get("assistentTimerInterval").then((obj) => {
          actualtimer = setTimeout(StartNotification, obj.assistentTimerInterval * 1000);
          console.log(actualtimer);
        })

      })
    }
  });
}

function TicTimer() {
  browser.notifications.create({
    "type": "basic",
    // "iconUrl": browser.extension.getURL("icons/96.png"),
    "title": "_state.settings.index",
    "message": "22"
  })
  return Promise.resolve()
}





function GetCaseCount(doc) {
  var url = "https://stage-2-docs.advance-docs.ru/api/v1/rsa_statement/" + doc + "/" +
    'queue?' +
    'agency_code=' + encodeURIComponent("АА22") +
    '&agency_keyword=' + encodeURIComponent("qwerty1345678")
  return fetch(url).then(responce => {
    return responce.json()
  }).then(data => {

    if (!data.data) {
      return {
        doc: doc,
        count: "Ошибка",
        type: "case"
      }
    }
    var d = data.data;
    d.sort(function(a, b) {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });
    var ndata = []
    var today = new Date();
    // var nDays = _state.settings.pastdays ? _state.settings.pastdays : 3;
    var nDays = 500;
    var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - nDays, 12);
    for (var cnt = 0, m = d.length; cnt < m; cnt++) {
      if (!d[cnt].title || !d[cnt].date) continue;
      if (d[cnt].date.match(/[0]*(\d+)\.[0]*(\d+)\.(\d+)/)) {
        var td = new Date(RegExp.$3, RegExp.$2 - 1, RegExp.$1, 12);
        if (td >= startDate) {
          ndata.push(d[cnt])
        };
      }
    }
    if (data && data.status == "success") {
      return {
        doc: doc,
        count: ndata.length.toString(),
        type: "case"
      }
    } else {
      return {
        doc: doc,
        count: "Ошибка",
        type: "case"
      }
    }


  })


}

function GetReplicationCount(doc) {
  // DTREA
  var url = 'https://stage-2-docs.advance-docs.ru/api/v1/rsa_publish/' + doc + '/' +
    'packets?' +
    'agency_code=' + encodeURIComponent("АА22") +
    '&agency_keyword=' + encodeURIComponent("qwerty1345678") +
    '&packet_size_max=500'
  return fetch(url).then(responce => {
    return responce.json()
  }).then(data => {
    if (data && data.status == "success") {
      return {
        doc: doc,
        count: data.data.length.toString(),
        type: "replication"
      }
    } else {
      return {
        doc: doc,
        count: "Ошибка",
        type: "replication"
      }
    }

  })
}
