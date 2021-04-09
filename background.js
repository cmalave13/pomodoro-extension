const contextMenus = {};

// creates contextMenu
contextMenus.createPomCounter = chrome.contextMenus.create(
  {"title": "Pomodoro Counter"},
  // checks for errors
  () => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }
  }
);



const contextMenuHandler = (info, tab) => {
  if (info.menuItemId === contextMenus.createPomCounter) {
    console.log('menu clicked');
  }
}

chrome.contextMenus.onClicked.addListener(contextMenuHandler);
