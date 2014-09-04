
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_SAMSUNG}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="control-block">
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VolUp" class="fa fa-volume-up"><span>{{i18n_VOLUME_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=VolDown" class="fa fa-volume-down"><span>{{i18n_VOLUME_DOWN}}</span></a>
            <a href="/?{{DEVICE_ID}}=Mute" class="fa fa-volume-off"><span>{{i18n_MUTE}}</span></a>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="fa fa-arrow-up"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="fa fa-arrow-left"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Enter" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>{{i18n_ENTER}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="fa fa-arrow-right"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="fa fa-arrow-down"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="channel">
            <a href="/?{{DEVICE_ID}}=ChUp" class="fa fa-chevron-up"><span>{{i18n_CHANNEL_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=ChDown" class="fa fa-chevron-down"><span>{{i18n_CHANNEL_DOWN}}</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=PowerOff" class="fa fa-power-off"><span>{{i18n_POWER_OFF}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Contents" class="fa fa-th"><span>{{i18n_SMART_HUB}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Source" class="fa fa-desktop"><span>{{i18n_SOURCE}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Convergence" class="fa fa-globe"><span>{{i18n_WEB_BROWSER}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI4" class="fa fa-sitemap"><span>{{i18n_MORE}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Tools" class="fa fa-cog"><span>{{i18n_TOOLS}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Menu" class="fa fa-list-ul"><span>{{i18n_MENU}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Exit" class="fa fa-sign-out"><span>{{i18n_EXIT}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Return" class="fa fa-undo"><span>{{i18n_RETURN}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI4,Down,Enter" class="fa fa-link"><span>{{i18n_CEC_SPEAKERS}}</span></a></li>
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
        <div class="numeric-controls">
          <ol>
            <li><a href="/?{{DEVICE_ID}}=1"><span>1</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=2"><span>2</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=3"><span>3</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=4"><span>4</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=5"><span>5</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=6"><span>6</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=7"><span>7</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=8"><span>8</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=9"><span>9</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=0"><span>0</span></a></li>
          </ol>
          <ul>
            <li><a href="/?{{DEVICE_ID}}=PreCh" class="fa fa-reply"><span>{{i18n_PREVIOUS_CHANNEL}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Ch_List" class="fa fa-list"><span>{{i18n_CHANNEL_LISTING}}</span></a></li>
          </ul>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=Rewind" class="fa fa-backward"><span>{{i18n_REWIND}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Stop" class="fa fa-stop"><span>{{i18n_STOP}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Pause" class="fa fa-pause"><span>{{i18n_PAUSE}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Play" class="fa fa-play"><span>{{i18n_PLAY}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=FF" class="fa fa-forward"><span>{{i18n_FAST_FORWARD}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Rec" class="fa fa-circle"><span>{{i18n_RECORD}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Red" class="fa fa-stop red"><span>{{i18n_RED}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Green" class="fa fa-stop green"><span>{{i18n_GREEN}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Yellow" class="fa fa-stop yellow"><span>{{i18n_YELLOW}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Blue" class="fa fa-stop blue"><span>{{i18n_BLUE}}</span></a></li>
          </ul>
        </div>
      </section>