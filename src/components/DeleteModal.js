import React, { useState } from "react";

export default function DeleteModal({ name, index, callback }) {
  const [status, setStatus] = useState("IDLE");
  const [showDeleteModal, toggleDeleteModal] = useState(false);

  return (
    <>
      <button
        style={{
          all: "unset",
          textDecoration: "underline",
          cursor: "pointer",
          color: "#008dd5"
        }}
        type="button"
        data-test={`delete-btn-${index}`}
        data-test-dir="left"
        onClick={() => toggleDeleteModal(true)}
      >
        Delete
      </button>
      {showDeleteModal && (
        <>
          <div className="alpha" onClick={() => toggleDeleteModal(false)}></div>
          <div className="modal">
            <div className="modal__content" data-test="modal">
              <h2 className="modal__title">Confirm</h2>
              <div className="modal__desc">
                <span data-test="desc">
                  Are you sure to delete {`"${name}"`}?
                </span>
              </div>
              <div className="modal__buttons">
                <button
                  type="button"
                  data-test="yes-btn"
                  className="btn btn-primary"
                  onClick={async () => {
                    setStatus("CALLING");

                    try {
                      await callback();
                    } catch (error) {
                      setStatus("IDLE");
                      Promise.reject(error);
                    }
                  }}
                  disabled={status === "CALLING"}
                >
                  Yes
                </button>
                <button
                  type="button"
                  data-test="no-btn"
                  className="btn btn-primary"
                  onClick={() => toggleDeleteModal(false)}
                  disabled={status === "CALLING"}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
