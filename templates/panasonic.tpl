
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <div class="control-block">
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VOLUP" class="fa fa-volume-up"><span>Volume Up</span></a>
            <a href="/?{{DEVICE_ID}}=VOLDOWN" class="fa fa-volume-down"><span>Volume Down</span></a>
            <a href="/?{{DEVICE_ID}}=MUTE" class="fa fa-volume-off"><span>Mute</span></a>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=UP" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?{{DEVICE_ID}}=LEFT" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?{{DEVICE_ID}}=ENTER" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Enter</span>
            </a>
            <a href="/?{{DEVICE_ID}}=RIGHT" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?{{DEVICE_ID}}=DOWN" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="channel">
            <a href="/?{{DEVICE_ID}}=CH_UP" class="fa fa-chevron-up"><span>Channel Up</span></a>
            <a href="/?{{DEVICE_ID}}=CH_DOWN" class="fa fa-chevron-down"><span>Channel Down</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=POWER" class="fa fa-power-off"><span>Power</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=VIERA_LINK" class="fa fa-th"><span>Viera Link</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=CHG_INPUT" class="fa fa-desktop"><span>Change Input</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=INTERNET" class="fa fa-globe"><span>Internet</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI4" class="fa fa-sitemap"><span>HDMI4</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=SUBMENU" class="fa fa-cog"><span>Submenu</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=MENU" class="fa fa-list-ul"><span>Menu</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=CANCEL" class="fa fa-sign-out"><span>Cancel</span></a></li>
          </ul>
        </div>
        <div class="text">
          <form class="text-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="{{DEVICE_ID}}-text-input">Text Input:</label>
              <input id="{{DEVICE_ID}}-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="Text Input" required />
              <input class="input-type" type="hidden" value="text" name="type" />
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
        <div class="numeric-controls">
          <ol>
            <li><a href="/?{{DEVICE_ID}}=D1"><span>1</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D2"><span>2</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D3"><span>3</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D4"><span>4</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D5"><span>5</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D6"><span>6</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D7"><span>7</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D8"><span>8</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D9"><span>9</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=D0"><span>0</span></a></li>
          </ol>
          <ul>
            <li><a href="/?{{DEVICE_ID}}=RETURN" class="fa fa-reply"><span>Return</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=INFO" class="fa fa-list"><span>Info</span></a></li>
          </ul>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=REW" class="fa fa-backward"><span>Rewind</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=STOP" class="fa fa-stop"><span>Stop</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=PAUSE" class="fa fa-pause"><span>Pause</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=PLAY" class="fa fa-play"><span>Play</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=FF" class="fa fa-forward"><span>Fast Forward</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=REC" class="fa fa-circle"><span>Record</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=RED" class="fa fa-stop red"><span>Red</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=GREEN" class="fa fa-stop green"><span>Green</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=YELLOW" class="fa fa-stop yellow"><span>Yellow</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=BLUE" class="fa fa-stop blue"><span>Blue</span></a></li>
          </ul>
        </div>
      </div>