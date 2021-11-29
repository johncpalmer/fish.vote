import { forwardRef } from 'react'

import { Wrapper } from './styled';

const HomeProposalLink = forwardRef(({ children, href }, ref) => (
  <Wrapper href={href} ref={ref}>
    {children}
  </Wrapper>
))

export default HomeProposalLink;
