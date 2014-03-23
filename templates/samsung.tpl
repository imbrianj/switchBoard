      <div id="{{DEVICE_ID}}" class="device">
        <div class="control-block">
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VOLUP" class="fa fa-volume-up"><span>VolUp</span></a>
            <a href="/?{{DEVICE_ID}}=VOLDOWN" class="fa fa-volume-down"><span>VolDown</span></a>
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
            <a href="/?{{DEVICE_ID}}=CHUP" class="fa fa-chevron-up"><span>ChUp</span></a>
            <a href="/?{{DEVICE_ID}}=CHDOWN" class="fa fa-chevron-down"><span>ChDown</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=POWEROFF" class="fa fa-power-off"><span>PowerOff</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=CONTENTS" class="fa fa-th"><span>Contents</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=SOURCE" class="fa fa-desktop"><span>Source</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=CONVERGENCE" class="fa fa-globe"><span>Convergence</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI4" class="fa fa-sitemap"><span>HDMI4</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=TOOLS" class="fa fa-cog"><span>Tools</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=MENU" class="fa fa-list-ul"><span>Menu</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=EXIT" class="fa fa-sign-out"><span>Exit</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=RETURN" class="fa fa-undo"><span>Return</span></a></li>
            <!-- Macros can be programmed to run a series of commands.  This one will turn on my CEC ARC receiver. -->
            <li><a href="/?{{DEVICE_ID}}=HDMI4,DOWN,ENTER" class="fa fa-link"><span>HDMI4,DOWN,ENTER</span></a></li>
          </ul>
        </div>
        <div class="text">
          <form class="text-form" id="tv-search-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="samsung-text-input">Text Input:</label>
              <input id="samsung-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="Text Input" required>
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
        <div class="tv-controls">
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
            <li><a href="/?{{DEVICE_ID}}=PRECH" class="fa fa-reply"><span>PreCh</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=CH_LIST" class="fa fa-list"><span>Ch_List</span></a></li>
          </ul>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=REWIND" class="fa fa-backward"><span>Rewind</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=STOP" class="fa fa-stop"><span>Stop</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=PAUSE" class="fa fa-pause"><span>Pause</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=PLAY" class="fa fa-play"><span>Play</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=FF" class="fa fa-forward"><span>FF</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=REC" class="fa fa-circle"><span>Rec</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=RED" class="fa fa-stop red"><span>Red</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=GREEN" class="fa fa-stop green"><span>Green</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=YELLOW" class="fa fa-stop yellow"><span>Yellow</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=BLUE" class="fa fa-stop blue"><span>Blue</span></a></li>
          </ul>
        </div>
      </div>
