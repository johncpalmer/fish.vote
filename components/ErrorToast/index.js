import { Wrapper, Title } from './styled'

const ErrorToast = ({ description }) => (
  <Wrapper>
    <Title>Something went wrong</Title>
    { description ? <div>{ description }</div> : null }
  </Wrapper>
)

export default ErrorToast;
