import { Modal as VoteModal } from "react-responsive-modal"; // React-responsive-modal

const Modal = ({
  open,
  openHandler,
  children,
}) => {
  return (
    <VoteModal
      open={open}
      onClose={() => openHandler(false)}
      // Prevent close icon X
      showCloseIcon={false}
      center
    >
      {children}
    </VoteModal>
  );
}

export default Modal;