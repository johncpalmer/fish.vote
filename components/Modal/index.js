import { useRef } from 'react';
import { Modal as ReactModal } from "react-responsive-modal";

import { Wrapper } from './styled';

const Modal = ({
  open,
  openHandler,
  children,
}) => {
  const ref = useRef(null);

  return (
    <>
      {/* Used to set modal wrapper */}
      <Wrapper ref={ref} />
      <ReactModal
        center
        open={open}
        onClose={() => openHandler(false)}
        container={ref.current}
        showCloseIcon={false}
      >
        {children}
      </ReactModal>
    </>
  );
}

export default Modal;