      <div id="{{DEVICE_ID}}" class="device">
        <div class="control-block">
          <div class="volume">
            <a href="/?device={{DEVICE_ID}}&command=VOLUP" class="fa fa-volume-up"><span>VolUp</span></a>
            <a href="/?device={{DEVICE_ID}}&command=VOLDOWN" class="fa fa-volume-down"><span>VolDown</span></a>
            <a href="/?device={{DEVICE_ID}}&command=MUTE" class="fa fa-volume-off"><span>Mute</span></a>
          </div>
          <div class="navigation">
            <a href="/?device={{DEVICE_ID}}&command=UP" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?device={{DEVICE_ID}}&command=LEFT" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?device={{DEVICE_ID}}&command=ENTER" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Enter</span>
            </a>
            <a href="/?device={{DEVICE_ID}}&command=RIGHT" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?device={{DEVICE_ID}}&command=DOWN" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="channel">
            <a href="/?device={{DEVICE_ID}}&command=CHUP" class="fa fa-chevron-up"><span>ChUp</span></a>
            <a href="/?device={{DEVICE_ID}}&command=CHDOWN" class="fa fa-chevron-down"><span>ChDown</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?device={{DEVICE_ID}}&command=POWEROFF" class="fa fa-power-off"><span>PowerOff</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=CONTENTS" class="fa fa-th"><span>Contents</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=SOURCE" class="fa fa-desktop"><span>Source</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=CONVERGENCE" class="fa fa-globe"><span>Convergence</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=HDMI4" class="fa fa-sitemap"><span>HDMI4</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=TOOLS" class="fa fa-cog"><span>Tools</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=MENU" class="fa fa-list-ul"><span>Menu</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=EXIT" class="fa fa-sign-out"><span>Exit</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=RETURN" class="fa fa-undo"><span>Return</span></a></li>
            <!-- Macros can be programmed to run a series of commands.  This one will turn on my CEC ARC receiver. -->
            <li><a href="/?device={{DEVICE_ID}}&macro=HDMI4,DOWN,ENTER" class="fa fa-link"><span>HDMI4,DOWN,ENTER</span></a></li>
          </ul>
        </div>
        <div class="text">
          <form class="text-form" id="tv-search-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="samsung-text-input">Text Input:</label>
              <input id="samsung-text-input" class="text-input" type="text" name="text" placeholder="Text Input" required>
              <input class="device-input" type="hidden" name="device" value="samsung">
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
        <div class="tv-controls">
          <ol>
            <li><a href="/?device={{DEVICE_ID}}&command=1"><span>1</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=2"><span>2</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=3"><span>3</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=4"><span>4</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=5"><span>5</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=6"><span>6</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=7"><span>7</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=8"><span>8</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=9"><span>9</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=0"><span>0</span></a></li>
          </ol>
          <ul>
            <li><a href="/?device={{DEVICE_ID}}&command=PRECH" class="fa fa-reply"><span>PreCh</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=CH_LIST" class="fa fa-list"><span>Ch_List</span></a></li>
          </ul>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?device={{DEVICE_ID}}&command=REWIND" class="fa fa-backward"><span>Rewind</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=STOP" class="fa fa-stop"><span>Stop</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=PAUSE" class="fa fa-pause"><span>Pause</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=PLAY" class="fa fa-play"><span>Play</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=FF" class="fa fa-forward"><span>FF</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=REC" class="fa fa-circle"><span>Rec</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=RED" class="fa fa-stop red"><span>Red</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=GREEN" class="fa fa-stop green"><span>Green</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=YELLOW" class="fa fa-stop yellow"><span>Yellow</span></a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=BLUE" class="fa fa-stop blue"><span>Blue</span></a></li>
          </ul>
        </div>
        <div class="information">
          <ul>
            <li><a href="/?device={{DEVICE_ID}}&command=GUIDE" class="fa fa-question"><span>Guide</span> Guide</a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=INFO" class="fa fa-question"><span>Info</span> Info</a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=CONTENTS" class="fa fa-question"><span>Contents</span> Contents</a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=PICTURE_SIZE" class="fa fa-question"><span>Picture_Size</span> Picture_Size</a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=W_LINK" class="fa fa-question"><span>W_Link</span> W_Link</a></li>
            <li><a href="/?device={{DEVICE_ID}}&command=CONTENT" class="fa fa-question"><span>Content</span> Content</a></li>
          </ul>
        </div>
      </div>
