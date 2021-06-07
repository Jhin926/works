const val = window.getComputedStyle(document.getElementById('ymb'), null).getPropertyValue('height');
document.getElementById('ymb').innerText = `${val}\n${navigator.appVersion}`;