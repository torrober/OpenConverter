document.querySelector('#download-vid').addEventListener('click',(e)=> {
	ipcRenderer.send('changeView', 'download.html')
})