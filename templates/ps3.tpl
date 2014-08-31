
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_PS3}}</h1>
        <div class="control-block">
          <div class="control">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PowerOn" class="fa fa-power-off power-on"><span>{{i18n_POWER_ON}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PS,Sleep,Down,Down,Down,Up,Cross,Cross" class="fa fa-power-off power-off"><span>{{i18n_POWER_OFF}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Select" class="fa fa-th"><span>{{i18n_SELECT}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Start" class="fa fa-sign-in"><span>{{i18n_START}}</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="fa fa-arrow-up"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="fa fa-arrow-left"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Cross" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>{{i18n_CROSS}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="fa fa-arrow-right"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="fa fa-arrow-down"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="buttons">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PS" class="fa fa-cog"><span>{{i18n_PS}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Triangle" class="fa fa-sitemap"><span>{{i18n_TRIANGLE}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Circle" class="fa fa-undo"><span>{{i18n_CIRCLE}}</span></a></li>
            </ul>
          </div>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=L1" class="fa fa-step-backward"><span>{{i18n_L1}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=L2" class="fa fa-backward"><span>{{i18n_L2}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=R2" class="fa fa-forward"><span>{{i18n_R2}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=R1" class="fa fa-step-forward"><span>{{i18n_R1}}</span></a></li>
          </ul>
        </div>
      </section>