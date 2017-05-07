
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_LOCATION}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="text-block">
          <dl>
            <dt>{{i18n_PRINTER_STATUS}}</dt>
            <dd>{{i18n_EXTRUDER}}: {{EXTRUDER_TEMP}}&deg;C / {{EXTRUDER_TARGET}}&deg;C</dd>
            <dd>{{i18n_BED}}: {{BED_TEMP}}&deg;C / {{BED_TARGET}}&deg;C</dd>
            <dd>
              <progress max="100" value="{{PERCENT_COMPLETE}}">
                {{PERCENT_COMPLETE}}% {{i18n_COMPLETE}}
              </progress>
            </dd>
          </dl>
        </div>
      </section>