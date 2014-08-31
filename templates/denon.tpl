
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_DENON}}</h1>
        <div class="control-block">
          <div class="control">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PowerOn" class="fa fa-power-off power-on"><span>{{i18n_POWER_ON}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PowerOff" class="fa fa-power-off power-off"><span>{{i18n_POWER_OFF}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Select" class="fa fa-th"><span>{{i18n_SELECT}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Start" class="fa fa-sign-in"><span>{{i18n_START}}</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Menu_Up" class="fa fa-arrow-up"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Menu_Left" class="fa fa-arrow-left"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Menu_Return" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>{{i18n_ENTER}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Menu_Right" class="fa fa-arrow-right"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Menu_Down" class="fa fa-arrow-down"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VolUp" class="fa fa-volume-up"><span>{{i18n_VOLUME_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=VolDown" class="fa fa-volume-down"><span>{{i18n_VOLUME_DOWN}}</span></a>
            <a href="/?{{DEVICE_ID}}=Mute" class="fa fa-volume-off"><span>{{i18n_MUTE}}</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=Menu" class="fa fa-list-ul"><span>{{i18n_MENU}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_Game" class="fa fa-gamepad"><span>{{i18n_GAME}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_TV" class="fa fa-desktop"><span>{{i18n_TV}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_Network" class="fa fa-globe"><span>{{i18n_NETWORK}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_MPlayer" class="fa fa-file-audio-o"><span>{{i18n_MUSIC_PLAYER}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_CD" class="fa fa-music"><span>{{i18n_CD}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_Bluray" class="fa fa-video-camera"><span>{{i18n_BLU_RAY}}</span></a></li>
          </ul>
        </div>
      </section>