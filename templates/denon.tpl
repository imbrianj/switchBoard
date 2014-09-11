
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_DENON}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="control-block">
          <div class="control">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PowerOn" class="fa fa-power-off power-on" title="{{i18n_POWER_ON}}"><span>{{i18n_POWER_ON}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PowerOff" class="fa fa-power-off power-off" title="{{i18n_POWER_OFF}}"><span>{{i18n_POWER_OFF}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Select" class="fa fa-th" title="{{i18n_SELECT}}"><span>{{i18n_SELECT}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Start" class="fa fa-sign-in" title="{{i18n_START}}"><span>{{i18n_START}}</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Menu_Up" class="fa fa-arrow-up" title="{{i18n_UP}}"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Menu_Left" class="fa fa-arrow-left" title="{{i18n_LEFT}}"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Menu_Return" class="fa-stack" title="{{i18n_ENTER}}">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>{{i18n_ENTER}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Menu_Right" class="fa fa-arrow-right" title="{{i18n_RIGHT}}"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Menu_Down" class="fa fa-arrow-down" title="{{i18n_DOWN}}"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VolUp" class="fa fa-volume-up" title="{{i18n_VOLUME_UP}}"><span>{{i18n_VOLUME_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=VolDown" class="fa fa-volume-down" title="{{i18n_VOLUME_DOWN}}"><span>{{i18n_VOLUME_DOWN}}</span></a>
            <a href="/?{{DEVICE_ID}}=Mute" class="fa fa-volume-off" title="{{i18n_MUTE}}"><span>{{i18n_MUTE}}</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=Menu" class="fa fa-list-ul" title="{{i18n_MENU}}"><span>{{i18n_MENU}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_Game" class="fa fa-gamepad" title="{{i18n_GAME}}"><span>{{i18n_GAME}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_TV" class="fa fa-desktop" title="{{i18n_TV}}"><span>{{i18n_TV}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_Network" class="fa fa-globe" title="{{i18n_NETWORK}}"><span>{{i18n_NETWORK}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_MPlayer" class="fa fa-file-audio-o" title="{{i18n_MUSIC_PLAYER}}"><span>{{i18n_MUSIC_PLAYER}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_CD" class="fa fa-music" title="{{i18n_CD}}"><span>{{i18n_CD}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Input_Bluray" class="fa fa-video-camera" title="{{i18n_BLU_RAY}}"><span>{{i18n_BLU_RAY}}</span></a></li>
          </ul>
        </div>
        <div class="text-device-status">
          <ul>
            <li>{{i18n_POWER}}: {{DEVICE_POWER}}</li>
            <li>{{i18n_Z1}} ({{DEVICE_Z1_POWER}})</li>
            <li>{{i18n_INPUT}}: {{DEVICE_Z1_INPUT}}</li>
            <li>{{i18n_VOLUME}}: {{DEVICE_Z1_VOLUME}} MAX: {{DEVICE_Z1_MAXVOLUME}}</li>
            <li>{{i18n_SOUNDMODE}}: {{DEVICE_Z1_MODE}}</li>
            <li>{{i18n_MUTE}}: {{DEVICE_Z1_MUTE}}</li>
            <li>{{i18n_Z2}} ({{DEVICE_Z2_POWER}})</li>
            <li>{{i18n_INPUT}}: {{DEVICE_Z2_INPUT}}</li>
            <li>{{i18n_VOLUME}}: {{DEVICE_Z2_VOLUME}}</li>
            <li>{{i18n_Z3}} ({{DEVICE_Z3_POWER}})</li>
            <li>{{i18n_INPUT}}: {{DEVICE_Z3_INPUT}}</li>
            <li>{{i18n_VOLUME}}: {{DEVICE_Z3_VOLUME}}</li>
          </ul>
        </div>
      </section>