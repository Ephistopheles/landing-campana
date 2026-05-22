interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      class={`toast${visible ? " toast--visible" : ""}`}
      aria-live="polite"
    >
      {message}
    </div>
  );
}
