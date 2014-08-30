
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>SmartThings</h1>
        <div class="installed">
          <ul class="sub-device-list">
            {{SMARTTHINGS_DYNAMIC}}
          </ul>
          <ul class="sub-device-list">
            <li><a href="/?smartthings=subdevice-mode-Home" class="fa fa-home{{DEVICE_STATE_HOME}}"><span>Home</span></a></li>
            <li><a href="/?smartthings=subdevice-mode-Away" class="fa fa-compass{{DEVICE_STATE_AWAY}}"><span>Away</span></a></li>
            <li><a href="/?smartthings=subdevice-mode-Night" class="fa fa-moon-o{{DEVICE_STATE_NIGHT}}"><span>Night</span></a></li>
          </ul>
        </div>
      </section>