
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}" data-string-camera_armed="{{i18n_CAMERA_ARMED}}" data-string-camera_disarmed="{{i18n_CAMERA_DISARMED}}" data-string-photo="{{i18n_PHOTO}}" data-string-screenshot="{{i18n_SCREENSHOT}}" data-string-thumbnail="{{i18n_THUMBNAIL}}" data-string-video="{{i18n_VIDEO}}">
        <h1>{{i18n_FOSCAM}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="control-block">
          <div class="presets">
            <ol>
              <li><a href="/?{{DEVICE_ID}}=Preset1" title="{{i18n_PRESET}} 1"><span>1</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Preset2" title="{{i18n_PRESET}} 2"><span>2</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Preset3" title="{{i18n_PRESET}} 3"><span>3</span></a></li>
            </ol>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="icon fa fa-arrow-up" title="{{i18n_UP}}"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="icon fa fa-arrow-left" title="{{i18n_LEFT}}"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Stop" class="icon fa-stack" title="{{i18n_STOP}}">
              <i class="icon far fa-square fa-stack-2x"></i>
              <i class="icon fa fa-level-up-alt fa-rotate-90"></i>
              <span>{{i18n_STOP}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="icon fa fa-arrow-right" title="{{i18n_RIGHT}}"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="icon fa fa-arrow-down" title="{{i18n_DOWN}}"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="alarm">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=Preset1,Sleep,Sleep,Alarm_On" class="icon fa fa-lock{{DEVICE_STATE_ON}}" title="{{i18n_ARM}}"><span>{{i18n_ARM}}</span> <em>{{ARMED_STATUS}}</em></a></li>
              <li><a href="/?{{DEVICE_ID}}=Take" class="icon fa fa-camera" title="{{i18n_TAKE}}"><span>{{i18n_TAKE}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Take,Take,Take,Take,Take" class="icon fa fa-bolt" title="{{i18n_BURST}}"><span>{{i18n_BURST}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Alarm_Off,Preset3" class="icon fa fa-unlock{{DEVICE_STATE_OFF}}" title="{{i18n_DISARM}}"><span>{{i18n_DISARM}}</span> <em>{{DISARMED_STATUS}}</em></a></li>
            </ul>
          </div>
        </div>

        <div class="preview-image">
          <img {{LAZY_LOAD_IMAGE}}="{{FOSCAM_DYNAMIC}}" alt="{{DEVICE_ID}} Preview" class="streaming" />
        </div>

        <div class="image-list">
          {{FOSCAM_PHOTO_LIST}}
        </div>

        <div class="video-list">
          {{FOSCAM_VIDEO_LIST}}
        </div>
      </section>