
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_LOCATION}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <ul class="text-block">
          <li><span>{{i18n_EXTRUDER}}:</span> {{EXTRUDER_TEMP}}&deg;C / {{EXTRUDER_TARGET}}&deg;C</li>
          <li><span>{{i18n_BED}}:</span> {{BED_TEMP}}&deg;C / {{BED_TARGET}}&deg;C</li>
          <li>
            <progress max="100" value="{{PERCENT_COMPLETE}}" title="{{PERCENT_COMPLETE}}% {{i18n_COMPLETE}}">
              {{PERCENT_COMPLETE}}% {{i18n_COMPLETE}}
            </progress>
          </li>
        </ul>
      </section>