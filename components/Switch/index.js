import Link from "next/link"; // Routing

import { Wrapper, StyledLink } from './styled'

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
      <StyledLink active={activePath === 0}>
        {fLabel}
      </StyledLink>
    </Link>

    {/* Second path (render white if selected) */}
    <Link href={sPath}>
      <StyledLink active={activePath === 1}>
        {sLabel}
      </StyledLink>
    </Link>
  </Wrapper>
)
    
export default Switch;