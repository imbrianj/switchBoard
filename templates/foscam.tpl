
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <div class="control-block">
          <div class="presets">
            <ol>
              <li><a href="/?{{DEVICE_ID}}=PRESET1"><span>1</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PRESET1"><span>2</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PRESET1"><span>3</span></a></li>
            </ol>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=UP" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?{{DEVICE_ID}}=LEFT" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?{{DEVICE_ID}}=STOP" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Stop</span>
            </a>
            <a href="/?{{DEVICE_ID}}=RIGHT" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?{{DEVICE_ID}}=DOWN" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="alarm">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PRESET1,SLEEP,SLEEP,ALARM_ON" class="fa fa-lock{{DEVICE_STATE_ON}}"><span>Alarm On</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=TAKE" class="fa fa-camera"><span>Take</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=TAKE,TAKE,TAKE,TAKE,TAKE" class="fa fa-bolt"><span>Burst</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=ALARM_OFF,PRESET3" class="fa fa-unlock{{DEVICE_STATE_OFF}}"><span>Alarm Off</span></a></li>
            </ul>
          </div>
        </div>

        <div class="preview-image">
          <img {{LAZY_LOAD_IMAGE}}="{{FOSCAM_DYNAMIC}}" alt="{{DEVICE_ID}} Preview" class="streaming" />
        </div>
      </div>
