# OpenConverter
Open source video converter made with Electron and FFmpeg-WASM

## Templates
The converter utilizes JSON-based templates incorporating audio codecs, FFmpeg arguments, and video codecs. 
These templates have been intentionally designed to maximize flexibility and adhere to the following JSON structure:

<pre>
{
    "title": "Standard AVI",
    "value": "StAVI",
    "outputExtension": ".avi",
    "videoCodec": "MPEG4",
    "audioCodec": "MP3",
    "args": ["-c:v", "mpeg4", "-c:a","libmp3lame"]
}
</pre>
The program offers a range of pre-made templates in different formats, including WMV, AVI, MP4, and MP3.
## Captures
<img src='https://i.imgur.com/q1uVXqq.png'></img>
<img src="https://i.imgur.com/PPaag4h.png"></img>
## How to install
First, clone the repo, then install the dependencies:
<pre>
  npm install
</pre>
Finally, you need to run the program with
<pre>
  npm start
</pre>
## How to use
1. Drag your video files or import them with the add file button
2. Click Settings
3. Select the desired format to convert, and the output directory.
4. Click 'Send to Queue'
5. Click Convert
6. Done, check the output folder.
## To-do list
- Add the Youtube Download function
- Add Record Screen function
- ~~fix file at drag n drop~~ DONE!
