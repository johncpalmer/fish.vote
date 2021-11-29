import { default as ReactLoader } from "react-loader-spinner";

import { Wrapper } from './styled'

const Loader = () => {
  return (
    <Wrapper>
      <ReactLoader type="Oval" color="#f5a788" height={50} width={50} />
    </Wrapper>
  )
}

export default Loader;
