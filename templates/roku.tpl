
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <div class="control-block full">
          <div class="media">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=INSTANT_REPLAY" class="fa fa-backward"><span>Instant Replay</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PLAY" class="fa fa-play"><span>Play</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=FWD" class="fa fa-forward"><span>Forward</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=UP" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?{{DEVICE_ID}}=LEFT" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?{{DEVICE_ID}}=SELECT" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Select</span>
            </a>
            <a href="/?{{DEVICE_ID}}=RIGHT" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?{{DEVICE_ID}}=DOWN" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="shortcuts">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=BACK" class="fa fa-undo"><span>Back</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=HOME" class="fa fa-home"><span>Home</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=BACKSPACE" class="fa fa-long-arrow-left"><span>Backspace</span></a></li>
            </ul>
          </div>
        </div>
        <div class="text">
          <form class="text-form" id="roku-search-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="roku-text-input">Text Input:</label>
              <input id="roku-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="Text Input" required />
              <input class="input-type" type="hidden" value="text" name="type" />
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
        <div class="installed-list">
          <ul class="roku-launch">
            {{ROKU_DYNAMIC}}
          </ul>
        </div>
      </div>
