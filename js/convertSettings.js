const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');
const remote = require('@electron/remote');
const { dialog } = remote;
const directory = './templates';
const templateSelect = document.querySelector('#templates');
let temp = [];
let videoData;
let outputDirectory;
// Function to read the JSON files
const readJSONFiles = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (error, files) => {
      if (error) {
        console.error('Error reading directory:', error);
        reject(error);
        return;
      }

      const jsonFiles = files.filter((file) => path.extname(file) === '.json');
      const jsonString = [];
      jsonFiles.forEach((file, index) => {
        fs.readFile(path.join(directory, file), 'utf8', (error, content) => {
          if (error) {
            console.error('Error reading file:', error);
            reject(error);
            return;
          }
          jsonString.push(JSON.parse(content));
          if (index === jsonFiles.length - 1) {
            resolve(jsonString);
          }
        });
      });
    });
  });
};

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function (e) {
  readJSONFiles(directory)
    .then((templates) => {
      temp = templates
        for (let template = 0; template < templates.length; template++) {
            console.log(templates[template])
            const option = document.createElement('option');
            option.value = templates[template].value;
            option.text = templates[template].title;
            templateSelect.appendChild(option);
            console.log(templates[template]);
        }
          document.querySelector('#arguments').value = templates[0].args.join(', ');
        setOutputPath();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
const setOutputFilePath = (extension, filepath) => {
  dialog.showSaveDialog({
    defaultPath: filepath,
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Output File', extensions: [extension.replace(".", "")] }
    ]
  }).then((result) => {
    if (!result.canceled && result.filePath) {
      outputDirectory = result.filePath;
      document.querySelector("#output").value = outputDirectory;
    } else {
      // Handle the case when the save dialog is cancelled
      console.log("Save dialog cancelled.");
    }
  });
};

document.querySelector('#button-addon2').addEventListener('click', (e) => {
  setOutputFilePath(getOutputExtension(),document.querySelector("#output").value)
})
document.querySelector('#templates').addEventListener('change', (e) => {
  const val = document.querySelector('#templates').value
  let args;
   for (const template of temp) {
    if(template.value == val) {
       args = template
    }
  }
  document.querySelector('#arguments').value = args.args.join(', ');
  setOutputPath()
})
const getOutputExtension = () => {
  for (const template of temp) {
    console.log(template)
    if (template.value == templateSelect.value) {
      return template.outputExtension;
    }
  }
}
document.querySelector('#queue').addEventListener('click', (e)=> {
  const args = document.querySelector('#arguments').value.split(",")
  const request = {
    input: videoData.path,
    output:  document.querySelector("#output").value,
    args: args,
    size: videoData.size
  }
  ipcRenderer.send('settingsDone', request)
})
// Event listener for the 'convertSettings' event from the main process
ipcRenderer.on('file', (event, data) => {
  videoData = data
});
const setOutputPath = () => {
  let outputFileExtension;
  console.log(temp)
  outputFileExtension = getOutputExtension();
  const outputPath= (outputDirectory!="")?videoData.parentDir+'\\' + videoData.name + outputFileExtension: outputDirectory;
  document.querySelector("#output").value = outputPath;  
}
document.querySelector("#output").addEventListener('click', (e) => {
	e.preventDefault();
	e.stopPropagation();
});