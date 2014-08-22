
                <li class="thermostat subdevice {{SUB_DEVICE_ID}}{{DEVICE_STATE_OFF}}">
                  <dl>
                    <dt>{{SUB_DEVICE_NAME}}</dt>
                    <dd class="control-block full icon">
                      <div class="mode">
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-{{SUB_DEVICE_NAME}}-heat" class="fa fa-sun-o{{DEVICE_STATE_HEAT}}"><span>Heat</span></a>
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-{{SUB_DEVICE_NAME}}-off" class="fa fa-power-off"><span>Off</span></a>
                        <a href="/?{{DEVICE_ID}}=subdevice-mode-{{SUB_DEVICE_NAME}}-cool" class="fa fa-asterisk{{DEVICE_STATE_COOL}}"><span>Cool</span></a>
                      </div>
                      <div class="navigation">
                        <form class="text-form" action="/" method="get">
                          <fieldset>
                            <legend>Set Temperature</legend>
                            <label for="nest-{{SUB_DEVICE_ID}}-target">Target Temperature:</label>
                            <input id="nest-{{SUB_DEVICE_ID}}-target" class="text-input" type="number" max="100" min="50" name="{{DEVICE_ID}}" value="{{SUB_DEVICE_TARGET}}" required />
                            <input class="input-type" type="hidden" value="subdevice-temp-{{SUB_DEVICE_NAME}}" name="type" />
                            <button type="submit" class="button">Submit</button>
                          </fieldset>
                        </form>
                      </div>
                      <div class="presence">
                        <a href="/?{{DEVICE_ID}}=Home" class="fa fa-home{{DEVICE_STATE_HOME}}"><span>Home</span></a>
                        <a href="/?{{DEVICE_ID}}=Away" class="fa fa-compass{{DEVICE_STATE_AWAY}}"><span>Away</span></a>
                      </div>
                    </dd>
                    <dd class="target">Target: {{SUB_DEVICE_TARGET}}&deg;</dd>
                    <dd class="temp">Temp: {{SUB_DEVICE_TEMP}}&deg;</dd>
                    <dd class="humidity">Humidity: {{SUB_DEVICE_HUMIDITY}}%</dd>
                  </dl>
                </li>