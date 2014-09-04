
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_SMS}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="text">
          <form class="text-form" id="sms-input-form" action="/" method="get">
            <fieldset>
              <legend>Text Input</legend>
              <label for="{{DEVICE_ID}}-text-input">Text Input:</label>
              <input id="{{DEVICE_ID}}-text-input" class="text-input" type="text" name="{{DEVICE_ID}}" placeholder="Text Input" required />
              <input class="input-type" type="hidden" value="text" name="type" />
              <button type="submit" class="button">Submit</button>
            </fieldset>
          </form>
        </div>
      </section>