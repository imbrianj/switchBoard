
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_CLIENTVIBRATE}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="text">
          <form class="text-form" action="/" method="get">
            <fieldset>
              <legend>{{i18n_VIBRATE_DURATION}}</legend>
              <label for="{{DEVICE_ID}}-duration">{{i18n_VIBRATE_DURATION}}:</label>
              <input id="{{DEVICE_ID}}-duration" class="text-input" type="number" max="10" min="1" name="{{DEVICE_ID}}" value="1" required />
              <input type="range" max="10" min="1" name="{{DEVICE_ID}}" value="1" />
              <input class="input-type" type="hidden" value="text" name="type" />
              <button type="submit" class="button">{{i18n_SUBMIT}}</button>
            </fieldset>
          </form>
        </div>
      </section>