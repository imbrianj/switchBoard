
                <li class="thermostat subdevice {{SUB_DEVICE_ID}}{{DEVICE_STATE_OFF}}">
                  <dl>
                    <dt>{{SUB_DEVICE_NAME}} <em>{{SUB_DEVICE_STATUS}}</em></dt>
                    <dd class="control-block full icon">
                      <div class="mode">
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-{{SUB_DEVICE_ID}}-heat" class="fa fa-sun-o{{DEVICE_STATE_HEAT}}" title="{{i18n_HEAT}}"><span>{{i18n_HEAT}}</span></a>
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-{{SUB_DEVICE_ID}}-off" class="fa fa-power-off" title="{{i18n_POWER_OFF}}"><span>{{i18n_POWER_OFF}}</span></a>
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-{{SUB_DEVICE_ID}}-cool" class="fa fa-snowflake-o{{DEVICE_STATE_COOL}}" title="{{i18n_COOL}}"><span>{{i18n_COOL}}</span></a>
                      </div>
                      <div class="navigation">
                        <span class="fa fa-leaf{{DEVICE_STATE_LEAF}}" title="{{i18n_LEAF}}"><span>{{i18n_LEAF}}</span></span>
                        <form class="text-form" action="/" method="get">
                          <fieldset>
                            <legend>{{i18n_SET_TEMPERATURE}}</legend>
                            <label for="nest-{{SUB_DEVICE_ID}}-target">{{i18n_TARGET_TEMPERATURE}}:</label>
                            <input id="nest-{{SUB_DEVICE_ID}}-target" class="text-input" type="number" max="{{SUB_DEVICE_MAX}}" min="{{SUB_DEVICE_MIN}}" name="{{DEVICE_ID}}" value="{{SUB_DEVICE_TARGET}}" required />
                            <input class="temp" type="range" max="{{SUB_DEVICE_MAX}}" min="{{SUB_DEVICE_MIN}}" name="{{DEVICE_ID}}" value="{{SUB_DEVICE_TARGET}}" />
                            <input class="input-type" type="hidden" value="subdevice-temp-{{SUB_DEVICE_NAME}}" name="type" />
                            <button type="submit" class="button">{{i18n_SUBMIT}}</button>
                          </fieldset>
                        </form>
                      </div>
                      <div class="presence">
                        <a href="/?{{DEVICE_ID}}=Home" class="fa fa-home{{DEVICE_STATE_HOME}}" title="{{i18n_HOME}}"><span>{{i18n_HOME}}</span></a>
                        <a href="/?{{DEVICE_ID}}=Away" class="fa fa-compass{{DEVICE_STATE_AWAY}}" title="{{i18n_AWAY}}"><span>{{i18n_AWAY}}</span></a>
                      </div>
                    </dd>
                    <dd class="target">{{i18n_TARGET}}: {{SUB_DEVICE_TARGET}}&deg;</dd>
                    <dd class="temp">{{i18n_TEMP}}: {{SUB_DEVICE_TEMP}}&deg;</dd>
                    <dd class="humidity">{{i18n_HUMIDITY}}: {{SUB_DEVICE_HUMIDITY}}%</dd>
                  </dl>
                </li>
