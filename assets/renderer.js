// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const API_INPUT_NAME = "api"
const TAG_INPUT_NAME = "tag"
const Store = require('electron-store')
const {ipcRenderer } = require('electron')
const db = new Store()

var SAVED_API = db.get(API_INPUT_NAME) || ""
var SAVED_TAG = db.get(TAG_INPUT_NAME) || "FlomoBar"

const API_ELE = document.getElementById(API_INPUT_NAME)
const TAG_ELE = document.getElementById(TAG_INPUT_NAME)

API_ELE.setAttribute("placeholder", SAVED_API)
TAG_ELE.setAttribute("placeholder", SAVED_TAG)

function SaveSetting() {
  SAVED_API = API_ELE.value || SAVED_API
  SAVED_TAG = TAG_ELE.value || SAVED_TAG

  db.set(API_INPUT_NAME, SAVED_API)
  db.set(TAG_INPUT_NAME, SAVED_TAG)

  API_ELE.setAttribute("placeholder", SAVED_API)
  TAG_ELE.setAttribute("placeholder", SAVED_TAG)

  toast("Saved!")

  return false;
}
function send(){
  let text = document.getElementById("flomoArea");
  if (text.value) {
    console.log(`Sending ${text.value} to ${SAVED_API}`)
    post(text.value, ()=>{
      text.value = "";
      notification()

    });
  }
}
function post(data, callback){
  var XHR = new XMLHttpRequest();
  XHR.addEventListener("error", (event) => {
    console.log(event)
    toast("Failed to send!")
  })

  XHR.addEventListener("load", ()=>{
    callback()
  })

  XHR.open('POST', SAVED_API);
  XHR.setRequestHeader('Content-Type', 'application/json');
  XHR.send(JSON.stringify({
    "content": `#${SAVED_TAG} ${data}`
  }))
}

function toast(text) {
  var msg = document.createElement("span")
  msg.innerText = text
  msg.style.backgroundColor = "rgba(0,0,0,0.75)"
  msg.style.color = "white"
  msg.style.borderRadius = "4px"
  msg.style.padding = "5px"

  document.getElementById("msgCont").append(msg)
  setTimeout(() => {
    msg.remove()
  }, 2000)
}

function openMainWin() {
  console.log("show main window")
  ipcRenderer.send('SHOWMAIN', 'open')
}
function notification() {
  const notfy = new Notification('Flomo 🚀', {
    body: '成功添加一条记录！'
  })
  notfy.onclick = () => {
    ipcRenderer.send('SHOWMAIN', 'open')
  }
  notfy.show()
}