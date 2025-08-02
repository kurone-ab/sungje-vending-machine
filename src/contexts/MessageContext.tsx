import type { ReactNode } from "react";
import { createContext, useContext, useRef, useState } from "react";
import type { PaymentMethod } from "../types/payment";

interface MessageProviderProps {
  children: ReactNode;
}

interface MessageState {
  message: string;
}

interface MessageActions {
  showMessage: (msg: string) => void;
  showTemporaryMessage: (msg: string, duration?: number) => Promise<boolean>;
  setDefaultMessage: (paymentMethod: PaymentMethod) => void;
}

interface MessageContextType extends MessageState, MessageActions {}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: MessageProviderProps) {
  const [message, setMessage] = useState("결제 방식을 선택해주세요.");
  const messageIdRef = useRef<number | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    if (messageIdRef.current !== null) {
      clearTimeout(messageIdRef.current);
    }
  };

  const setDefaultMessage = (paymentMethod: PaymentMethod) => {
    const defaultMessage =
      paymentMethod === "cash" ? "현금을 투입하거나 음료를 선택하세요." : "결제할 음료를 선택하세요.";
    setMessage(defaultMessage);
  };

  const showTemporaryMessage = (msg: string, duration = 2000) => {
    showMessage(msg);
    return new Promise<boolean>((resolve) => {
      messageIdRef.current = window.setTimeout(() => {
        setDefaultMessage("cash");
        messageIdRef.current = null;
        resolve(true);
      }, duration);
    });
  };

  const value: MessageContextType = {
    message,
    showMessage,
    showTemporaryMessage,
    setDefaultMessage,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
