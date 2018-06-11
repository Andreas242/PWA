<template>
  <div class="backdrop">
  <div v-if="currentStep === 1">
    <div class="centered">
    <div class="group">
      <input type="text" id="name" v-model="name" maxlength="8" required="required"/>
      <label for="name">Name</label>
      <div class="bar"></div>
    </div>
    <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="registerName()">RegName</button>
  </div>
  </div>
  <div class="waiting" v-if="currentStep === 2">
    <div>
      <video id="videoplayer" autoplay></video>
    </div>
    <canvas id="canvas" width="320px" height="240px"></canvas>
    <canvas id="blank" width="320px" height="240px" style="display: none"></canvas>
    <div class="capture-button" id="captureButton">
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="takePicture()">TAKE PHOTO</button>
    </div>
    <div id="image-picker__container">
      <img id="output" width="240px" height="200px" style="display: none"/>
      <h6>Choose a (small) picture!</h6>
      <div class="upload-container">
      <input type="file" name="image-picker" accept="image/*" id="image-picker" @change="showImage()" />
      <label for="image-picker"><strong>Upload image</strong></label>
    </div>
    <!--
      <div class="capture-button">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="choosePicture()" id="captureButton">CHOOSE IMAGE</button>
      </div>
        -->
    </div>

    <button @click="registerPlayer()" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">PLAY!</button>
  </div>
</div>
</template>
<script>
function initializeMedia () {
  setTimeout(function () {
    if (!('mediaDevices' in navigator)) {
      navigator.mediaDevices = {}
    }
    if (!('getUserMedia' in navigator.mediaDevices)) {
      this.videoFeed = false
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented!'))
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }

    const canvasElement = document.querySelector('#canvas')
    const captureButton = document.querySelector('#captureButton')
    const videoPlayer = document.querySelector('#videoplayer')
    const imagePickerArea = document.querySelector('#image-picker__container')
    canvasElement.style.display = 'none'
    captureButton.style.display = 'none'
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
      videoPlayer.style.display = 'block'
      captureButton.style.display = 'block'
      videoPlayer.srcObject = stream
      videoPlayer.style.display = 'block'
      imagePickerArea.style.display = 'none'
    }).catch(function (err) {
      if (err) {
        imagePickerArea.style.display = 'block'
        videoPlayer.style.display = 'none'
        captureButton.style.display = 'none'
        console.log(err.stack)
      }
    })
  }, 400)
}
export default {
  data () {
    return {
      'name': null,
      'score': null,
      'newPostKey': null,
      'newUserKey': null,
      'canvas': document.querySelector('#canvas'),
      'currentStep': 1,
      'uploadedFile': null,
      'videoFeed': true
    }
  },
  methods: {
    showImage () {
      let output = document.getElementById('output')
      output.src = URL.createObjectURL(event.target.files[0])
      this.choosePicture()
    },
    choosePicture () {
      setTimeout(function () {
        let output = document.getElementById('output')
        const canvasElement = document.querySelector('#canvas')
        const outputElement = document.querySelector('#output')
        var context = canvasElement.getContext('2d')
        context.drawImage(output, 0, 0)
        canvasElement.style.display = 'block'
        outputElement.style.display = 'none'
        console.log('done')
      }, 300)
    },
    takePicture () {
      const canvasElement = document.querySelector('#canvas')
      const captureButton = document.querySelector('#captureButton')
      const videoPlayer = document.querySelector('#videoplayer')
      canvasElement.style.display = 'block'
      videoPlayer.style.display = 'none'
      captureButton.style.display = 'none'
      var context = canvasElement.getContext('2d')
      context.drawImage(videoPlayer, 0, 0, canvasElement.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvasElement.width))
      videoPlayer.srcObject.getVideoTracks().forEach(function (track) {
        track.stop()
      })
    },
    registerName () {
      this.currentStep = 2
      initializeMedia()
    },
    registerPlayer () {
      if (!localStorage.id) {
        const canvasElement = document.querySelector('#canvas')
        const blankCanvasElement = document.querySelector('#blank')
        this.newPostKey = this.$root.$firebaseRefs.players.push()
        localStorage.id = this.newPostKey.key
        localStorage.name = this.name
        this.newPostKey.set({
          id: this.newPostKey.key,
          name: this.name,
          image: canvasElement.toDataURL() !== blankCanvasElement.toDataURL() ? canvasElement.toDataURL() : null,
          score: 1000
        }).then(this.$router.push('/play'))
      } else {
        alert('NOOO - Something went terribly wrong! The CUBE is collapsing!')
      }
    }
  }
}
</script>

<style scoped>
  .waiting {
    padding: 10px;
    color: #555;
  }
  .upload-container {
    position: relative;
  }
  #videoplayer {
    width: 15rem;
    height: 100%;
    margin: 0 auto;
    border-radius: 2rem;
    display: none;
  }
  .capture-button {
    margin-top: 3rem;
    text-align: center;
    -webkit-text-align: center;
  }

  #image-picker__container {
    display: none;
  }

  #image-picker {
  	width: 0.1px;
  	height: 0.1px;
  	opacity: 0;
  	overflow: hidden;
  	position: absolute;
  	z-index: -1;
  }

  #image-picker + label {
    font-size: 1.25em;
    font-weight: 700;
    color: white;
    background-color: black;
    border-radius: 2px;
    position: relative;
    height: 36px;
    margin: 0;
    min-width: 64px;
    padding: 0 16px;
    display: inline-block;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0;
    overflow: hidden;
    will-change: box-shadow;
    transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    line-height: 36px;
    vertical-align: middle;
  }

  #image-picker:focus + label,
  #image-picker + label:hover {
    background-color: red;
  }

  #image-picker + label * {
	pointer-events: none;
}

  #canvas {
    display: none;
    width: 15rem;
    height: 100%;
    margin: 0 auto;
    border-radius: 2rem;
  }

  .backdrop {
    background-color: #eee;
  }

  .waiting {
    text-align: center;
  }

  * {
  box-sizing: border-box;
}

body {
  background: #333;
}

.centered {
  width: 80vw;
  max-width: 550px;
  height: 110px;
  margin: 20vh auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.group {
  width: 100%;
  height: 110px;
  overflow: hidden;
  position: relative;
}

.mdl-button--raised.mdl-button--colored {
  background-color: #000;
  margin-top: 16px;
}

label {
  position: absolute;
  top: 36.6666666667px;
  color: rgba(235, 34, 57, 0.5);
  font: 400 36.6666666667px Roboto;
  cursor: text;
  transition: 0.25s ease;
  text-align: left;
}

input {
  display: block;
  width: 100%;
  padding-top: 36.6666666667px;
  border: none;
  border-radius: 0;
  color: black;
  background: #ddd;
  font-size: 36.6666666667px;
  transition: 0.3s ease;
}
input:valid ~ label {
  top: 0;
  font: 700 22px Roboto;
  color: rgba(235, 34, 57, 0.5);
}
input:focus {
  outline: none;
}
input:focus ~ label {
  top: 0;
  font: 700 22px Roboto;
  color: rgba(235, 34, 57, 1);
}
input:focus ~ .bar:before {
  transform: translateX(0);
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #333 inset;
  -webkit-text-fill-color: black !important;
}

.bar {
  background: rgba(235, 34, 57, 0.5);
  content: "";
  width: 550px;
  height: 3.6666666667px;
  transition: 0.3s ease;
  position: relative;
}
.bar:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 150%;
  background: rgba(235, 34, 57, 1);
  transform: translateX(-100%);
}

::selection {
  background: rgba(33, 150, 243, 0.3);
}
</style>
