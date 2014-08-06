
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <div class="text">
          <form class="text-form" id="pushover-input-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="pushover-text-input">Text Input:</label>
              <input id="pushover-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="Text Input" required>
              <input class="input-type" type="hidden" value="text" name="type" />
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
      </div>