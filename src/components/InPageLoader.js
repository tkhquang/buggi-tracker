import React from "react";
import styled from "styled-components";

const Loader = styled.div`
  @keyframes loader {
    0%,
    10%,
    80%,
    100% {
      transform: scaleY(0.3);
    }

    30%,
    60% {
      transform: scaleY(1);
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Line = styled.div`
  max-width: 8px;
  min-width: 5px;
  max-height: 80px;
  width: 100%;
  height: 100%;
  background: #225599;
  display: inline-block;
  margin: 0 5px;
  animation: loader 1s linear infinite;
  animation-delay: ${props => `-${props.delay}s`};
`;

export default function InPageLoader() {
  return (
    <Loader className="loader">
      <Line className="loader__line" delay={0} />
      <Line className="loader__line" delay={0.8} />
      <Line className="loader__line" delay={0.7} />
      <Line className="loader__line" delay={0.6} />
      <Line className="loader__line" delay={0.5} />
    </Loader>
  );
}
