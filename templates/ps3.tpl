
      <div id="{{DEVICE_ID}}" class="device {{DEVICE_TYPE}}{{DEVICE_SELECTED}}{{DEVICE_STATE}}">
        <div class="control-block">
          <div class="control">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=POWERON" class="fa fa-power-off power-on"><span>Power On</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=PS,SLEEP,DOWN,DOWN,DOWN,UP,CROSS,CROSS" class="fa fa-power-off power-off"><span>Power Off</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=SELECT" class="fa fa-th"><span>Select</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=START" class="fa fa-sign-in"><span>Start</span></a></li>
            </ul>
          </div>
          <div class="navigation">
            <a href="/?{{DEVICE_ID}}=UP" class="fa fa-arrow-up"><span>Up</span></a>
            <a href="/?{{DEVICE_ID}}=LEFT" class="fa fa-arrow-left"><span>Left</span></a>
            <a href="/?{{DEVICE_ID}}=CROSS" class="fa-stack">
              <i class="fa fa-square-o fa-stack-2x"></i>
              <i class="fa fa-level-up fa-rotate-90"></i>
              <span>Cross</span>
            </a>
            <a href="/?{{DEVICE_ID}}=RIGHT" class="fa fa-arrow-right"><span>Right</span></a>
            <a href="/?{{DEVICE_ID}}=DOWN" class="fa fa-arrow-down"><span>Down</span></a>
          </div>
          <div class="buttons">
            <ul>
              <li><a href="/?{{DEVICE_ID}}=PS" class="fa fa-cog"><span>PS</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=TRIANGLE" class="fa fa-sitemap"><span>Triangle</span></a></li>
              <li><a href="/?{{DEVICE_ID}}=CIRCLE" class="fa fa-undo"><span>Circle</span></a></li>
            </ul>
          </div>
        </div>
        <div class="media">
          <ul>
            <li><a href="/?{{DEVICE_ID}}=L1" class="fa fa-step-backward"><span>L1</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=L2" class="fa fa-backward"><span>L2</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=R2" class="fa fa-forward"><span>R2</span></a></li>
            <li><a href="/?{{DEVICE_ID}}=R1" class="fa fa-step-forward"><span>R1</span></a></li>
          </ul>
        </div>
      </div>
