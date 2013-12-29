      <div id="{{DEVICE_ID}}" class="device">
        <div class="control-block">
          <div class="control">
            <ul>
              <li><a href="/?device={{DEVICE_ID}}&command=PowerOn" class="fa fa-power-off"><span>PowerOn</span></a></li>
              <li><a href="/?device={{DEVICE_ID}}&command=Select" class="fa fa-th"><span>Select</span></a></li>
              <li><a href="/?device={{DEVICE_ID}}&command=Start" class="fa fa-sign-in"><span>Start</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?device={{DEVICE_ID}}&command=Up" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?device={{DEVICE_ID}}&command=Left" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?device={{DEVICE_ID}}&command=Cross" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Cross</span>
            </a>
            <a href="/?device={{DEVICE_ID}}&command=Right" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?device={{DEVICE_ID}}&command=Down" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="buttons">
            <ul>
              <li><a href="/?device={{DEVICE_ID}}&command=PS" class="fa fa-cog"><span>PS</span></a></li>
              <li><a href="/?device={{DEVICE_ID}}&command=Triangle" class="fa fa-sitemap"><span>Triangle</span></a></li>
              <li><a href="/?device={{DEVICE_ID}}&command=Circle" class="fa fa-undo"><span>Circle</span></a></li>
            </ul>
          </div>
        </div>
        <div class="powerState">
          {{PS3_DYNAMIC}}
        </div>
      </div>
