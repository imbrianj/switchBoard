
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}">
        <div class="control-block">
          
          <div class="alarm">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=Take" class="fa fa-camera"><span>Take</span></a></li>
            </ul>
          </div>
        </div>

        <div class="preview-image">
          <img {{LAZY_LOAD_IMAGE}}="{{FOSCAM_DYNAMIC}}" alt="{{DEVICE_ID}} Preview" />
        </div>
      </div>