      <div id="roku" class="device">
        <div class="control-block">
          <div class="media">
            <ul>
              <li><a href="/?device=roku&command=InstantReplay" class="fa fa-backward"><span>InstantReplay</span></a></li>
              <li><a href="/?device=roku&command=Play" class="fa fa-play"><span>Play</span></a></li>
              <li><a href="/?device=roku&command=Fwd" class="fa fa-forward"><span>Fwd</span></a></li>
            <ul>
          </div>
          <div class="navigation">
            <a href="/?device=roku&command=Up" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?device=roku&command=Left" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?device=roku&command=Select" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Select</span>
            </a>
            <a href="/?device=roku&command=Right" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?device=roku&command=Down" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="shortcuts">
            <ul>
              <li><a href="/?device=roku&command=Back" class="fa fa-undo"><span>Back</span></a></li>
              <li><a href="/?device=roku&command=Home" class="fa fa-home"><span>Home</span></a></li>
              <li><a href="/?device=roku&command=Backspace" class="fa fa-long-arrow-left"><span>Backspace</span></a></li>
            </ul>
          </div>
        </div>
        <div class="text">
          <form class="text-form" id="roku-search-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="roku-text-input">Text Input:</label>
              <input id="roku-text-input" class="text-input" type="text" name="text" placeholder="Text Input" required>
              <input class="device-input" type="hidden" name="device" value="roku">
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
        <div class="installed">
          {{ROKU_DYNAMIC}}
        </div>
      </div>