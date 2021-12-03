import Header from '@components/Header';
import Footer from '@components/Footer';
import Modal from "@components/Modal";

import { Content, Sizer } from './styled'

export default function Layout({ children, short, proposal }) {
  return (
    <div>
      <Header />

      <Content short={short}>
        <Sizer>{children}</Sizer>
      </Content>

      <Footer />
    </div>
  );
}

