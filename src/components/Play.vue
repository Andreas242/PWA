<template>
  <div class='form'>
    <div class="score__container">
          Score: {{ score }}
    </div>
    <div class='play__information'>
      <table class='table table-striped table-bordered noshow'>
        <tr>
          <td>Tilt Left/Right [gamma]</td>
          <td id='doTiltLR'></td>
        </tr>
        <tr>
          <td>Tilt Front/Back [beta]</td>
          <td id='doTiltFB'></td>
        </tr>
        <tr>
          <td>Direction [alpha]</td>
          <td id='doDirection'></td>
        </tr>
        <tr>
          <td id='firstRandom'></td>
        </tr>
        <tr>
          <td id='firstDiff'></td>
        </tr>
        <tr>
          <td id='secondRandom'></td>
        </tr>
        <tr>
          <td id='secondDiff'></td>
        </tr>
      </table>
            <div class='container' id='logoContainer'>
        <img src='/static/img/PWA.png' id='imgLogo'>
      </div>
    </div>
    <div class='play__feedback'>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-if="iterations === 0" @click="startGame()">Start!</button>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      currentScore: 0,
      firstRandom: 1,
      secondRandom: 1,
      score: 1,
      iterations: 0
    }
  },
  methods: {
    startGame () {
      this.iterations = 1
      if ('DeviceOrientationEvent' in window) {
        let that = this
        let mu = setInterval(function () {
          that.iterations += 1
          that.score += Math.abs(Math.abs(parseInt(document.getElementById('doTiltLR').innerHTML, 10)) - Math.abs(that.firstRandom)) + Math.abs(Math.abs(parseInt(document.getElementById('doTiltFB').innerHTML, 10)) - Math.abs(that.secondRandom))
          that.firstRandom = Math.floor(Math.random() * 80) - 50
          that.secondRandom = Math.floor(Math.random() * 80) - 50
        }, 5000)
        setTimeout(function () {
          let finalScore = that.score
          clearInterval(mu)
          document.getElementById('secondRandom').innerHTML = finalScore + ' score'
          /* if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(function (sw) {
              let post = {
                id: new Date().toISOString(),
                score: parseInt(finalScore, 10)
              }
              localStorage.readyToSendScore = post
              sw.sync.register('sync-new-score')
            })
          } else { */
          that.$root.$firebaseRefs.players.child(`${window.localStorage.id}`).update({score: parseInt(finalScore, 10)}).then(that.$router.push('/'))
          // }
        }, 20002)
        window.addEventListener('deviceorientation', this.tiltImage, false)
      } else {
        alert('nooooo!!!!')
        document.getElementById('logoContainer').innerText = 'Device Orientation API not supported.'
      }
    },
    tiltImage (eventData) {
      let tiltLR = eventData.gamma
      let tiltFB = eventData.beta
      let dir = eventData.alpha
      document.getElementById('doTiltLR').innerHTML = Math.round(tiltLR)
      document.getElementById('doTiltFB').innerHTML = Math.round(tiltFB)
      document.getElementById('doDirection').innerHTML = Math.round(dir)
      document.getElementById('firstRandom').innerHTML = this.score
      let logo = document.getElementById('imgLogo')
      logo.style.webkitTransform = 'rotate(' + (tiltLR + this.firstRandom) + 'deg) rotate3d(1,0,0, ' + ((tiltFB + this.secondRandom) * -1) + 'deg)'
      logo.style.MozTransform = 'rotate(' + (tiltLR + this.firstRandom) + 'deg)'
      logo.style.transform = 'rotate(' + (tiltLR + this.firstRandom) + 'deg) rotate3d(1,0,0, ' + ((tiltFB + this.secondRandom) * -1) + 'deg)'
    }
  }
}
</script>

<style scoped>

.container {
  perspective: 300;
  -webkit-perspective: 300;
}

.noshow {
  display: none;
}

.mdl-button--raised.mdl-button--colored {
  background-color: #000;
}

#imgLogo {
  width: 275px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  padding: 15px;
  box-shadow: 0 0 0 5px;
}

.play__feedback {
  width: 80%;
  margin: auto;
  border-radius: 10%;
  box-shadow: 0 0 5;
  text-align: center;
}

.score__container {
  text-align: center;
  background-color: #000;
  font-size: 3rem;
  color: #eee;
  margin-bottom: 3rem;
  padding: 1rem;
}

</style>
