import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import InPageLoader from "./InPageLoader";

const withLoader = (
  promise,
  options = { useParams: false, params: [] }
) => InnerComponent =>
  function WithLoader(props) {
    const params = useParams();
    const [status, setStatus] = useState("LOADING");
    const [data, setData] = useState(null);

    useEffect(() => {
      const requestParams = [];
      if (options.useParams) {
        options.params.forEach(param => {
          requestParams.push(params[param]);
        });
      }

      promise(...requestParams)
        .then(data => {
          setData(data);
          setStatus("IDLE");
        })
        .catch(error => {
          console.log(error);
          setStatus("ERROR");
        });
    }, [params]);

    return status === "LOADING" ? (
      <InPageLoader />
    ) : (
      <InnerComponent {...props} data={data} />
    );
  };

export default withLoader;
