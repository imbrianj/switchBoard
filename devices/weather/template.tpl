
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}" data-string-current="{{i18n_CURRENT}}" data-string-unavailable="{{i18n_UNAVAILABLE}}">
        <h1>{{i18n_WEATHER}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="text-block">
          <h2><span class="fa fa-{{WEATHER_ICON}}"></span> {{WEATHER_CURRENT}} ({{WEATHER_SUNRISE}}/{{WEATHER_SUNSET}})</h2>
          <p>{{WEATHER_SUMMARY}}</p>
          <ul>
            {{WEATHER_DYNAMIC}}
          </ul>
        </div>
      </section>