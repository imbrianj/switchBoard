
      <section id="{{DEVICE_ID}}" class="{{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <h1>{{i18n_PS3}} <em>{{DEVICE_ACTIVE}}</em></h1>
        <div class="control-block">
          <div class="control">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PowerOn" class="icon fa fa-power-off power-on" title="{{i18n_POWER_ON}}"><span>{{i18n_POWER_ON}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PS,Sleep,Down,Down,Down,Up,Cross,Cross" class="icon fa fa-power-off power-off" title="{{i18n_POWER_OFF}}"><span>{{i18n_POWER_OFF}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Select" class="icon fa fa-th" title="{{i18n_SELECT}}"><span>{{i18n_SELECT}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Start" class="icon fa fa-sign-in-alt" title="{{i18n_START}}"><span>{{i18n_START}}</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=Up" class="icon fa fa-arrow-up" title="{{i18n_UP}}"><span>{{i18n_UP}}</span></a>
            <a href="/?{{DEVICE_ID}}=Left" class="icon fa fa-arrow-left" title="{{i18n_LEFT}}"><span>{{i18n_LEFT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Cross" class="fa-stack" title="{{i18n_CROSS}}">
              <i class="icon far fa-square fa-stack-2x"></i>
              <i class="icon fa fa-level-up-alt fa-rotate-90"></i>
              <span>{{i18n_CROSS}}</span>
            </a>
            <a href="/?{{DEVICE_ID}}=Right" class="icon fa fa-arrow-right" title="{{i18n_RIGHT}}"><span>{{i18n_RIGHT}}</span></a>
            <a href="/?{{DEVICE_ID}}=Down" class="icon fa fa-arrow-down" title="{{i18n_DOWN}}"><span>{{i18n_DOWN}}</span></a>
          </div>
          <div class="buttons">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PS" class="icon fa fa-cog" title="{{i18n_PS}}"><span>{{i18n_PS}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Triangle" class="icon fa fa-sitemap" title="{{i18n_TRIANGLE}}"><span>{{i18n_TRIANGLE}}</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=Circle" class="icon fa fa-undo" title="{{i18n_CIRCLE}}"><span>{{i18n_CIRCLE}}</span></a></li>
            </ul>
          </div>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=L1" class="icon fa fa-step-backward" title="{{i18n_L1}}"><span>{{i18n_L1}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=L2" class="icon fa fa-backward" title="{{i18n_L2}}"><span>{{i18n_L2}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=R2" class="icon fa fa-forward" title="{{i18n_R2}}"><span>{{i18n_R2}}</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=R1" class="icon fa fa-step-forward" title="{{i18n_R1}}"><span>{{i18n_R1}}</span></a></li>
          </ul>
        </div>
      </section>