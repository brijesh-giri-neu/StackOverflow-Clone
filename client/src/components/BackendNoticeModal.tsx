import { useBackendNoticeModal } from '../hooks/useBackendNoticeModal';

/**
 * A modal component that displays a notice about the backend hosting on Render free tier.
 * Shows when the application first loads and can be dismissed by the user.
 */
const BackendNoticeModal = (): JSX.Element => {
  const { show, handleClose } = useBackendNoticeModal();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Close modal if clicking on the backdrop (not the modal content)
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!show) {
    return <></>;
  }

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="backendNoticeModalLabel"
      aria-hidden="true"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="backendNoticeModalLabel">
              Backend Service Notice
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              The backend has been hosted on Render's free tier, which can take up to a minute to boot up when idled out.
            </p>
            <p className="mb-0">
              Please allow a minute for the page to load.
            </p>
            <br />
            <p className="mb-0">
              Thank you :)
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendNoticeModal;

