
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}" data-string-docked="{{i18n_DOCKED}}" data-string-undocked="{{i18n_UNDOCKED}}">
        <h2>{{i18n_NEATO}} <em>{{DEVICE_ACTIVE}}</em></h2>
	<div class="text-block">
	  <h3>
            <span class="fa fa-battery-{{DEVICE_STATE_BATTERY_CLASS}}{{DEVICE_STATE_CHARGING}}" title="{{i18n_BATTERY_LEVEL}}: {{DEVICE_BATTERY_LEVEL}}"></span>
            {{i18n_BATTERY_LEVEL}}: {{DEVICE_BATTERY_LEVEL}}
	  </h3>
	</div>
        <div class="installed">
          <ul class="sub-device-list">
            <li><a href="/?{{DEVICE_ID}}=Start" class="fa fa-play" title="{{i18n_START}}"><span>{{i18n_START}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Pause" class="fa fa-pause" title="{{i18n_PAUSE}}"><span>{{i18n_PAUSE}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Resume" class="fa fa-forward" title="{{i18n_RESUME}}"><span>{{i18n_RESUME}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Stop" class="fa fa-stop" title="{{i18n_STOP}}"><span>{{i18n_STOP}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=Return" class="fa fa-fast-backward" title="{{i18n_RETURN}}: {{DOCK_STATUS}}"><span>{{i18n_RETURN}} ({{DOCK_STATUS}})</span></a></li>
          </ul>
        </div>
      </section>