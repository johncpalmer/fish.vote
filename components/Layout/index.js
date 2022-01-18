import Header from '@components/Header';
import Footer from '@components/Footer';

import { Wrapper, Content, Sizer } from './styled'

export default function Layout({ children, short }) {
  return (
    <Wrapper>
      <Header />

      <Content short={short}>
        <Sizer>{children}</Sizer>
      </Content>

      <Footer />
    </Wrapper>
  );
}

