import * as React from "react";
import { useRef, useEffect } from "react";
import produce from "immer";
import styled from "styled-components";
import { IBullet } from "./IBullet";

interface IProps {
  className?: string;
  bullet: IBullet;
  onCommit: (bullet: IBullet) => void;
  onCancel: () => void;
}

function View({ className, bullet, onCommit, onCancel }: IProps) {
  const ref = useRef<HTMLInputElement>(null);
  const win = useRef<HTMLDivElement>(null);

  function onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      // enter
      const input = e.target as HTMLInputElement;
      const updated = produce(bullet, draft => {
        draft.title = input.value;
      });
      onCommit(updated);
    } else if (e.keyCode === 27) {
      // escape
      onCancel();
    }
  }

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    ref.current?.focus();
    // listen for enter+esc keys
    window.addEventListener("keydown", onKeyDown);
    // clicks outside this dialog should close it
    window.addEventListener("click", onCancel);
    // do not close if we click inside
    win.current?.addEventListener("click", stopPropagation);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onCancel);
      win.current?.removeEventListener("click", stopPropagation);
    };
  }, []);

  return (
    <div ref={win} className={className}>
      <input ref={ref} type="text" defaultValue={bullet.title} />
      <footer>Enter / Esc</footer>
    </div>
  );
}

export const EditBullet = styled(View)`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 42em;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 2px solid black;

  > input {
    text-align: center;
    width: 100%;
    padding: 0.7em 0.9em 0.1em;
    font-size: 2.6em;
    border: none;
    font-family: inherit;
    &:focus {
      outline: none;
    }
  }

  > footer {
    color: grey;
    font-size: 1.1em;
    padding: 1em;
  }
`;
