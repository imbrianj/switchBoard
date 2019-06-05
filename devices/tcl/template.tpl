
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h2>{{i18n_TCL}} <em>{{DEVICE_ACTIVE}}</em></h2>
        <div class="control-block">
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VolUp" class="fa fa-volume-up" title="{{i18n_VOLUME_UP}}"><span>{{i18n_VOLUME_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=VolDown" class="fa fa-volume-down" title="{{i18n_VOLUME_DOWN}}"><span>{{i18n_VOLUME_DOWN}}</span></a>
            <a href="/?{{DEVICE_ID}}=Mute" class="fa fa-volume-off" title="{{i18n_MUTE}}"><span>{{i18n_MUTE}}</span></a>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="fa fa-arrow-up" title="{{i18n_UP}}"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="fa fa-arrow-left" title="{{i18n_LEFT}}"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Select" class="fa-stack" title="{{i18n_SELECT}}">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>{{i18n_SELECT}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="fa fa-arrow-right" title="{{i18n_RIGHT}}"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="fa fa-arrow-down" title="{{i18n_DOWN}}"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="channel">
            <a href="/?{{DEVICE_ID}}=ChUp" class="fa fa-chevron-up" title="{{i18n_CHANNEL_UP}}"><span>{{i18n_CHANNEL_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=ChDown" class="fa fa-chevron-down" title="{{i18n_CHANNEL_DOWN}}"><span>{{i18n_CHANNEL_DOWN}}</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=PowerOff" class="fa fa-power-off" title="{{i18n_POWER_OFF}}"><span>{{i18n_POWER_OFF}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Back" class="fa fa-undo" title="{{i18n_BACK}}"><span>{{i18n_BACK}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Home" class="fa fa-home" title="{{i18n_HOME}}"><span>{{i18n_HOME}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Backspace" class="fa fa-long-arrow-left" title="{{i18n_BACKSPACE}}"><span>{{i18n_BACKSPACE}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI1" class="fa fa-gamepad" title="{{i18n_GAME}}"><span>{{i18n_GAME}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI2" class="fa fa-video-camera" title="{{i18n_BLURAY}}"><span>{{i18n_BLURAY}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Instant_Replay" class="fa fa-backward" title="{{i18n_INSTANT_REPLAY}}"><span>{{i18n_INSTANT_REPLAY}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Play" class="fa fa-play" title="{{i18n_PLAY}}"><span>{{i18n_PLAY}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Fwd" class="fa fa-forward" title="{{i18n_FORWARD}}"><span>{{i18n_FORWARD}}</span></a></li>
          </ul>
        </div>
        <div class="text">
          <form class="text-form" action="/" method="get">
            <fieldset>
              <legend>{{i18n_TEXT_INPUT}}</legend>
              <label for="{{DEVICE_ID}}-text-input">{{i18n_TEXT_INPUT}}:</label>
              <input id="{{DEVICE_ID}}-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="{{i18n_TEXT_INPUT}}" required />
              <input class="input-type" type="hidden" value="text" name="type" />
              <button type="submit" class="button">{{i18n_SUBMIT}}</button>
            </fieldset>
          </form>
        </div>
        <div class="installed-list">
          <ul class="tcl-launch">
            {{TCL_DYNAMIC}}
          </ul>
        </div>
      </section>
