
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_DENON}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="zone">
          <h3>{{i18n_Z1}} ({{DEVICE_Z1_POWER}})</h3>
          <ul>
            <li class="zinput">{{DEVICE_Z1_INPUT}}</li>
            <li>{{DEVICE_Z1_MODE}}</li>
            <div class="text">
              <form class="text-form" action="/" method="get">
                <fieldset>
                  <legend>{{i18n_VOLUME}}</legend>
                  <label for="{{DEVICE_ID}}-z1-input">{{i18n_VOLUME}}:</label>
                  <input id="{{DEVICE_ID}}-z1-input" class="text-input" type="number" max="{{DEVICE_Z1_MAXVOLUME}}" min="0" name="{{DEVICE_ID}}" value="{{DEVICE_Z1_VOLUME}}" required />
                  <input class="input-type" type="hidden" value="subdevice-zone1" name="type" />
                  <button type="submit" class="button">{{i18n_SUBMIT}}</button>
                </fieldset>
              </form>
            </div>
            <li>
              <div class="button">
                <a href="/?{{DEVICE_ID}}=Zone1_On" class="fa fa-power-off" title="Z1_ON"><span>Z1_ON</span></a>
              </div>
            </li>
            <li>
              <div class="button">
                <a href="/?{{DEVICE_ID}}=Zone1_Off" class="fa fa-times-circle-o" title="Z1_OFF"><span>Z1_OFF</span></a>
              </div>
            </li>
            <li class="topmenu">
              <div class="button">
                <a href="" class="fa fa-sign-in"><span>{{i18n_INPUT}}</span></a>
                <ul>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Bluray">{{i18n_BD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Mplayer">{{i18n_MPLAY}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_CD">{{i18n_CD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_DVD">{{i18n_DVD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Game">{{i18n_GAME}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Network">{{i18n_NET}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_TV">{{i18n_SAT_CBL}}</a></li>
                </ul>
              </div>
            </li>
            <li class="topmenu">
              <div class="button">
                <a href="" class="fa fa-music"><span>{{i18n_SOUNDMODE}}</span></a>
                <ul>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Sound_Movie">{{i18n_MOVIE}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Sound_MCHStereo">{{i18n_MUSIC}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Sound_Movie">{{i18n_GAME}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Sound_Pure">{{i18n_PURE_DIRECT}}</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="zone">
          <h3>{{i18n_Z3}} ({{DEVICE_Z3_POWER}})</h3>
          <ul>
            <li class="zinput">{{DEVICE_Z3_INPUT}}</li>
            <div class="text">
              <form class="text-form" action="/" method="get">
                <fieldset>
                  <legend>{{i18n_VOLUME}}</legend>
                  <label for="{{DEVICE_ID}}-z3-input">{{i18n_VOLUME}}:</label>
                  <input id="{{DEVICE_ID}}-z3-input" class="text-input" type="number" max="100" min="0" name="{{DEVICE_ID}}" value="{{DEVICE_Z3_VOLUME}}" required />
                  <input class="input-type" type="hidden" value="subdevice-zone3" name="type" />
                  <button type="submit" class="button">{{i18n_SUBMIT}}</button>
                </fieldset>
              </form>
            </div>
            <li>
              <div class="button">
                <a href="/?{{DEVICE_ID}}=Zone3_On" class="fa fa-power-off" title="Z3_ON"><span>Z3_ON</span></a>
              </div>
            </li>
            <li>
              <div class="button">
                <a href="/?{{DEVICE_ID}}=Zone3_Off" class="fa fa-times-circle-o" title="Z3_OFF"><span>Z3_OFF</span></a>
              </div>
            </li>
            <li class="topmenu">
              <div class="button">
                <a href="" class="fa fa-sign-in"><span>{{i18n_INPUT}}</span></a>
                <ul>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Bluray">{{i18n_BD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Mplayer">{{i18n_MPLAY}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_CD">{{i18n_CD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_DVD">{{i18n_DVD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Game">{{i18n_GAME}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Network">{{i18n_NET}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_TV">{{i18n_SAT_CBL}}</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="zone">
          <h3>{{i18n_Z2}} ({{DEVICE_Z2_POWER}})</h3>
          <ul>
            <li class="zinput">{{DEVICE_Z2_INPUT}}</li>
            <div class="text">
              <form class="text-form" action="/" method="get">
                <fieldset>
                  <legend>{{i18n_VOLUME}}</legend>
                  <label for="{{DEVICE_ID}}-z2-input">{{i18n_VOLUME}}:</label>
                  <input id="{{DEVICE_ID}}-z2-input" class="text-input" type="number" max="80" min="0" name="{{DEVICE_ID}}" value="{{DEVICE_Z2_VOLUME}}" required />
                  <input class="input-type" type="hidden" value="subdevice-zone2" name="type" />
                  <button type="submit" class="button">{{i18n_SUBMIT}}</button>
                </fieldset>
              </form>
            </div>
            <li>
              <div class="button">
                <a href="/?{{DEVICE_ID}}=Zone2_On" class="fa fa-power-off" title="Z2_ON"><span>Z2_ON</span></a>
              </div>
            </li>
            <li>
              <div class="button">
                <a href="/?{{DEVICE_ID}}=Zone2_Off" class="fa fa-times-circle-o" title="Z2_OFF"><span>Z2_OFF</span></a>
              </div>
            </li>
            <li class="topmenu">
              <div class="button">
                <a href="" class="fa fa-sign-in"><span>{{i18n_INPUT}}</span></a>
                <ul>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Bluray">{{i18n_BD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Mplayer">{{i18n_MPLAY}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_CD">{{i18n_CD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_DVD">{{i18n_DVD}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Game">{{i18n_GAME}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_Network">{{i18n_NET}}</a></li>
                  <li class="submenu"><a href="/?{{DEVICE_ID}}=Input_TV">{{i18n_SAT_CBL}}</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </section>