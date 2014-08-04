
                <li class="thermostat">
                  <dl>
                    <dt>{{SUB_DEVICE_NAME}}</dt>
                    <dd class="control-block full icon">
                      <div class="mode">
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-heat-{{SUB_DEVICE_NAME}}" class="fa fa-sun-o{{DEVICE_STATE_HEAT}}"><span>Heat</span></a>
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-off-{{SUB_DEVICE_NAME}}" class="fa fa-power-off{{DEVICE_STATE_OFF}}"><span>Off</span></a>
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-cool-{{SUB_DEVICE_NAME}}" class="fa fa-asterisk{{DEVICE_STATE_COOL}}"><span>Cool</span></a>
                      </div>
                      <div class="navigation">
                        <form class="text-form" action="/" method="post">
                          <fieldset>
                            <legend>Set Temperature</legend>
                            <label for="nest-{{SUB_DEVICE_ID}}-target">Target temperature:</label>
                            <input id="nest-{{SUB_DEVICE_ID}}-target" type="number" max="100" min="50" class="text-input auto-submit" value="{{SUB_DEVICE_TARGET}}" name="{{DEVICE_ID}}" data-prefix="subdevice-temp-" data-subdevice="{{SUB_DEVICE_NAME}}" />
                          </fieldset>
                        </form>
                      </div>
                      <div class="presence">
                        <a href="/?{{DEVICE_ID}}=Home" class="fa fa-home{{DEVICE_STATE_HOME}}"><span>Home</span></a>
                        <a href="/?{{DEVICE_ID}}=Away" class="fa fa-compass{{DEVICE_STATE_AWAY}}"><span>Away</span></a>
                      </div>
                    </dd>
                    <dd class="temp">Temp: {{SUB_DEVICE_TEMP}}&deg;</dd>
                    <dd class="humidity">Humidity: {{SUB_DEVICE_HUMIDITY}}%</dd>
                  </dl>
                </li>
