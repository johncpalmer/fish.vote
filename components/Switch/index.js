import Link from "next/link"; // Routing

import { Wrapper } from './styled'

// Switch slider
const Switch = ({
  // Currently selected route
  activePath = 0,
  // First route details
  firstPath: { name: fLabel, path: fPath },
  // Second route details
  secondPath: { name: sLabel, path: sPath },
}) => (
  <Wrapper active={activePath === 0}>
    {/* First path (render white if selected) */}
    <Link href={fPath}>
      <a className={activePath === 0 ? 'active' : ""}>
        {fLabel}
      </a>
    </Link>

    {/* Second path (render white if selected) */}
    <Link href={sPath}>
      <a className={activePath === 1 ? 'active' : ""}>
        {sLabel}
      </a>
    </Link>
  </Wrapper>
)
    
export default Switch;