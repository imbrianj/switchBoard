
              <li>
                <form class="text-form" action="/" method="get">
                  <fieldset>
                    <legend>{{SUB_DEVICE_NAME}}<span class="{{SUB_DEVICE_STATE_CLASS}}">{{SUB_DEVICE_STATE}}</span></legend>
                    <label for="powerview-{{SUB_DEVICE_ID}}-percentage">{{i18n_SET_PERCENTAGE}}:</label>
                    <input id="powerview-{{SUB_DEVICE_ID}}-percentage" class="text-input" type="number" max="100" min="0" name="{{DEVICE_ID}}" value="{{SUB_DEVICE_PERCENTAGE}}" required />
                    <input class="light" type="range" max="100" min="0" name="{{DEVICE_ID}}" value="{{SUB_DEVICE_PERCENTAGE}}" />
                    <input class="input-type" type="hidden" value="subdevice-{{SUB_DEVICE_NAME}}" name="type" />
                    <button type="submit" class="button">{{i18n_SUBMIT}}</button>
                  </fieldset>
                </form>
              </li>