import { isBrowser } from 'react-device-detect';

import { Wrapper } from './styled'

const Footer = () => (
  <>
    { isBrowser ? (
      <Wrapper>
        <div>
          <ul>
            <li>
              <a href="https://docs.vexchange.io/docs/v2" rel="noopener noreferrer" target="_blank">
                Docs
              </a>
            </li>
            <li>
              <a href="https://medium.com/vexchange" rel="noopener noreferrer" target="_blank">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <ul>
            <li>
              <a
                href="https://discord.gg/krPDhtcumr" target="_blank" rel="noopener noreferrer">
                Discord
              </a>
            </li>
            <li>
              <a href="https://twitter.com/VexchangeIO" rel="noopener noreferrer" target="_blank">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com/vexchange" target="_blank" rel="noopener noreferrer">
                Github
              </a>
            </li>
          </ul>
        </div>

      </Wrapper>
    ) : null}
  </>
);

export default Footer;