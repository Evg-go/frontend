type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(next: UnauthorizedHandler | null) {
  handler = next;
}

export function runUnauthorizedHandler() {
  handler?.();
}
