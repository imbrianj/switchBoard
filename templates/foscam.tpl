      <div id="{{DEVICE_ID}}" class="device">
        <div class="control-block">
          <div class="numeric-controls">
            <ol>
              <li><a href="/?{{DEVICE_ID}}=Preset1"><span>1</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Preset2"><span>2</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Preset3"><span>3</span></a></li>
            </ol>
            <ul class="alarm">
              <li><a href="/?{{DEVICE_ID}}=AlarmOn" class="fa fa-lock"><span>AlarmOn</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=AlarmOff" class="fa fa-unlock"><span>AlarmOff</span></a></li>
            </ul>
          </div>
        </div>
        <div class="preview-image">
          <img data-src="{{FOSCAM_DYNAMIC}}" alt="{{DEVICE_ID}} Preview" />
        </div>
      </div>
