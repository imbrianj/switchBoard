
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_LOCATION}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <ul class="text-block">
          <li><span>{{i18n_EXTRUDER}}:</span> {{EXTRUDER_TEMP}}&deg; / {{EXTRUDER_TARGET}}&deg;</li>
          <li><span>{{i18n_BED}}:</span> {{BED_TEMP}}&deg; / {{BED_TARGET}}&deg;</li>
          <li>
            <progress max="100" value="{{PERCENT_COMPLETE}}" title="{{PERCENT_COMPLETE}}% {{i18n_COMPLETE}}">
              {{PERCENT_COMPLETE}}% {{i18n_COMPLETE}}
            </progress>
          </li>
        </ul>
      </section>