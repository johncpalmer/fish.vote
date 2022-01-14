import Link from "next/link"; // Routing

import { Wrapper, StyledLink } from './styled'

// Switch slider
const Switch = ({
  activePath = 0,
  paths = [],
}) => (
  <Wrapper active={activePath === 0}>
    {paths.map((path, index) => (
      <Link key={path.name} href={path.url}>
        <StyledLink active={activePath === index}>
          {path.name}
        </StyledLink>
      </Link>
    ))}
  </Wrapper>
)

export default Switch;
