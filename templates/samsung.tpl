
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>Samsung</h1>
        <div class="control-block">
          <div class="volume">
            <a href="/?{{DEVICE_ID}}=VolUp" class="fa fa-volume-up"><span>Volume Up</span></a>
            <a href="/?{{DEVICE_ID}}=VolDown" class="fa fa-volume-down"><span>Volume Down</span></a>
            <a href="/?{{DEVICE_ID}}=Mute" class="fa fa-volume-off"><span>Mute</span></a>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?{{DEVICE_ID}}=Enter" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Enter</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="channel">
            <a href="/?{{DEVICE_ID}}=ChUp" class="fa fa-chevron-up"><span>Channel Up</span></a>
            <a href="/?{{DEVICE_ID}}=ChDown" class="fa fa-chevron-down"><span>Channel Down</span></a>
          </div>
        </div>
        <div class="shortcuts">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=PowerOff" class="fa fa-power-off"><span>Power Off</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Contents" class="fa fa-th"><span>Smart Hub</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Source" class="fa fa-desktop"><span>Source</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Convergence" class="fa fa-globe"><span>Web Browser</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI4" class="fa fa-sitemap"><span>More</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Tools" class="fa fa-cog"><span>Tools</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Menu" class="fa fa-list-ul"><span>Menu</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Exit" class="fa fa-sign-out"><span>Exit</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Return" class="fa fa-undo"><span>Return</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=HDMI4,Down,Enter" class="fa fa-link"><span>CEC Speakers</span></a></li>
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
            <li><a href="/?{{DEVICE_ID}}=PreCh" class="fa fa-reply"><span>Previous Chanenl</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Ch_List" class="fa fa-list"><span>Channel Listing</span></a></li>
          </ul>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=Rewind" class="fa fa-backward"><span>Rewind</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Stop" class="fa fa-stop"><span>Stop</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Pause" class="fa fa-pause"><span>Pause</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Play" class="fa fa-play"><span>Play</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=FF" class="fa fa-forward"><span>Fast Forward</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Rec" class="fa fa-circle"><span>Record</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Red" class="fa fa-stop red"><span>Red</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Green" class="fa fa-stop green"><span>Green</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Yellow" class="fa fa-stop yellow"><span>Yellow</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Blue" class="fa fa-stop blue"><span>Blue</span></a></li>
          </ul>
        </div>
      </section>
