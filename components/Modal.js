import { Modal as FishModal } from "react-responsive-modal"; // React-responsive-modal

export default function Modal({
  // True == modal open
  open,
  // Function handler to update open
  openHandler,
  // Inject modal content
  children,
}) {
  return (
    <FishModal
      open={open}
      onClose={() => openHandler(false)}
      // Prevent close icon X
      showCloseIcon={false}
      center
    >
      {children}
    </FishModal>
  );
}
