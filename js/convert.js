const addFileButton = document.querySelector('#addFile')
const remote = require('@electron/remote');
const { dialog } = remote;
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const { ipcRenderer } = require('electron')
const Swal = require('sweetalert2');
let sAlert;
let vid = [];
function generateCard(data,elem) {
	return `
	  <div class="card" style="margin-top: 20px; margin-bottom: 20px;">
		<h5 class="card-header">${data.name}</h5>
		<div class="card-body">
		<div class="row">
			<div class="col-3" style="align-items: center;display: flex; justify-content: center;">
				<img src="data:image/png;base64,${data.thumb}" width="256" height="144px" class="img-fluid" style="object-fit: contain; border-radius: 5px; background-color: black; height: 144px;" ></img>
			</div>
			<div class="col-7" style="align-items: center;display: flex; justify-content: center;">
				${data.name} - ${data.extension}
			</div>
			<div class="col-2" style="align-items: center;display: flex; justify-content: center;">
				<a href="#" id="settings" data-clip="${elem}" class="btn btn-primary m-10" style="margin-top: 10px;">Set Output</a>
			</div>
		</div>
		</div>
	  </div>
	`;
}
function setConversionSettings() {
	const videos = document.querySelectorAll('#settings');
	
	for (let video = 0; video < videos.length; video++) {
	  videos[video].addEventListener('click', (e) => {
		selectedVideo(video);
	  });
	}
  }
function selectedVideo(num) {
	ipcRenderer.send('convertSettings', vid[num])
}
addFileButton.addEventListener('click', (e) => {
	dialog.showOpenDialog({
		properties: ['openFile', 'multiSelections'],
		filters: [
			{ name: 'Video Files', extensions: ['mkv', 'avi', 'mp4', 'wmv'] },
			{ name: 'All Files', extensions: ['*'] }
		]
	}).then((result) => {
		const filePaths = result.filePaths;
		ipcRenderer.send('fileImported', filePaths)
	});
})
ipcRenderer.on('fileInfo', (event,data) => {
	sAlert.closeModal();
	console.log(data)
	let elem = 0;
	for (const video of data) {
		document.querySelector('.content').innerHTML += generateCard(video, elem)
		elem++;
		vid.push(video)
	}
	setConversionSettings();
})
ipcRenderer.on('fileAnalysis', (event, data) => {
	sAlert = Swal.fire({
		text: data,
		showConfirmButton: false,
		allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
	})
})
ipcRenderer.on('progressBar', (event,data) => {
	document.querySelector('.progress-bar').style.setProperty('width', data)
})
ipcRenderer.on('conversionEnded', (event, data) => {
	document.querySelector('#main').innerHTML = "";
	sAlert.closeModal();
	Swal.fire(
		'Success',
		'Video Conversion finished',
		'success'
	).show()
})
document.querySelector('#convertButton').addEventListener('click', () => {
	ipcRenderer.send('startConversion')
})
ipcRenderer.on('ffmpegError', async (event,data) => {
	if(sAlert) {
	  sAlert.close()
	}
	Swal.fire(
		'Error',
		data,
		'error'
	).show()
})
document.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();
	let filePaths = []
	console.log(event.dataTransfer.files)
	for (const f of event.dataTransfer.files) {
		filePaths.push(f.path)
	}
	ipcRenderer.send('fileImported', filePaths)
});

document.addEventListener('dragover', (e) => {
	e.preventDefault();
	e.stopPropagation();
});

