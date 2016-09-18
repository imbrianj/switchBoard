
                <li class="{{GAME_STATUS}}">
                  <dl>
                    <dt><h2><a href="{{GAME_LINK}}" rel="external">{{GAME_TITLE}}</a></h2></dt>
                    <dd class="away{{GAME_AWAY_WINNER_CLASS}}">
                      <h3>{{GAME_AWAY_TEAM}}{{GAME_AWAY_WINNER}}</h3>
                      <img {{LAZY_LOAD_IMAGE}}="{{GAME_AWAY_IMAGE}}" alt="{{i18n_AWAY_TEAM_LOGO}}" title="{{i18n_AWAY_TEAM_LOGO}}" />
                      <span>{{GAME_AWAY_SCORE}}</span>
                    </dd>
                    <dd class="home{{GAME_HOME_WINNER_CLASS}}">
                      <h3>{{GAME_HOME_TEAM}}{{GAME_HOME_WINNER}}</h3>
                      <img {{LAZY_LOAD_IMAGE}}="{{GAME_HOME_IMAGE}}" alt="{{i18n_HOME_TEAM_LOGO}}" title="{{i18n_HOME_TEAM_LOGO}}" />
                      <span>{{GAME_HOME_SCORE}}</span>
                    </dd>
                    <dd class="state">{{GAME_TIME}}: {{GAME_STATE}}</dd>
                  </dl>
                </li>