import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ data }) {
  return (
    <div
      className="breadcrumb"
      data-test="breadcrumb"
      data-test-dir="top-center"
    >
      {data.map((item, index) => {
        return (
          <Fragment key={`${item.path || item.name}`}>
            {item.path ? (
              <Link
                to={`${item.path}`}
                data-test={`bc-${index + 1}`}
                data-test-dir="top"
              >
                {item.name}
              </Link>
            ) : (
              <span data-test={`bc-${index + 1}`} data-test-dir="top">
                {item.name}
              </span>
            )}
            {data.length - 1 > index ? (
              <span className="breadcrumb__separator">&gt;</span>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
