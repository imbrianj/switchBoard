
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}" data-string-camera_armed="{{i18n_CAMERA_ARMED}}" data-string-camera_disarmed="{{i18n_CAMERA_DISARMED}}">
        <h1>{{i18n_FOSCAM}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="control-block">
          <div class="presets">
            <ol>
              <li><a href="/?{{DEVICE_ID}}=Preset1"><span>1</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Preset2"><span>2</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Preset3"><span>3</span></a></li>
            </ol>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="fa fa-arrow-up"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="fa fa-arrow-left"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Stop" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>{{i18n_STOP}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="fa fa-arrow-right"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="fa fa-arrow-down"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="alarm">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=Preset1,Sleep,Sleep,Alarm_On" class="fa fa-lock{{DEVICE_STATE_ON}}"><span>{{i18n_ARM}}</span> <em>{{ARMED_STATUS}}</em></a></li>
              <li><a href="/?{{DEVICE_ID}}=Take" class="fa fa-camera"><span>{{i18n_TAKE}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Take,Take,Take,Take,Take" class="fa fa-bolt"><span>{{i18n_BURST}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Alarm_Off,Preset3" class="fa fa-unlock{{DEVICE_STATE_OFF}}"><span>{{i18n_DISARM}}</span> <em>{{DISARMED_STATUS}}</em></a></li>
            </ul>
          </div>
        </div>

        <div class="preview-image">
          <img {{LAZY_LOAD_IMAGE}}="{{FOSCAM_DYNAMIC}}" alt="{{DEVICE_ID}} Preview" class="streaming" />
        </div>
      </section>