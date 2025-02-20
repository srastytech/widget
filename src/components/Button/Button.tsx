import React, { ReactNode } from "react";
import styles from "./button.module.css";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
