import * as React from "react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import uuidv4 from "uuid/v4";
import { IBullet } from "./IBullet";

interface IProps {
  className?: string;
  onCommit: (bullet: IBullet) => void;
  onCancel: VoidFunction;
}

const states = new Map<string, number>([
  [".", 0],
  ["x", 1],
  [">", 2],
  ["-", 3]
]);

const getStateAndTitle = (original: string) => {
  const rEx = /^([.|>|\-|x]{1})/gim;
  const symbol = rEx.exec(original)?.[0] ?? "";
  const state = states.get(symbol) ?? 0;
  const title = original.replace(rEx, "");
  return { state, title };
};

function View({ className, onCommit, onCancel }: IProps) {
  const ref = useRef<HTMLInputElement>(null);

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();

    if (e.keyCode === 13) {
      const { title, state } = getStateAndTitle(ref.current?.value ?? "");
      // enter
      const bullet: IBullet = {
        version: "1.0.0",
        id: uuidv4(),
        title,
        created: new Date().toISOString(),
        state
      };

      ref.current && (ref.current.value = "");

      onCommit(bullet);
    } else if (e.keyCode === 27) {
      // escape
      onCancel();
    }
  };

  const onBlur = () => onCancel();

  useEffect(() => {
    ref.current?.focus();
    // listen for enter+esc keys
    ref.current?.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      ref.current?.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return (
    <div className={className}>
      <input ref={ref} type="text" />
    </div>
  );
}

export const AddBullet = styled(View)`
  display: flex;
  background-color: red;
  margin-bottom: 1em;
  > input {
    width: 100%;
    padding: 0.2em;
    font-size: 3em;
    font-family: inherit;
    border: 1px dotted rgba(0, 0, 0, 0.5);
    &:focus {
      outline: none;
    }
  }
`;
