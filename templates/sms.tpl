
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <div class="text">
          <form class="text-form" id="sms-input-form" action="/" method="post">
            <fieldset>
              <legend>Text Input</legend>
              <label for="sms-text-input">Text Input:</label>
              <input id="sms-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="Text Input" required>
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
      </div>