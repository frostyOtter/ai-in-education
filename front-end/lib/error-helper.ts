import { IS_DEVELOPMENT } from "@/constants";

export const ErrorHelper = (
  message?: unknown,
  ...optionalParams: unknown[]
) => {
  // Log the error to the console for development
  // In production, you might want to send it to a logging service
  // or handle it differently.
  if (IS_DEVELOPMENT) {
    // eslint-disable-next-line no-console
    console.error(message, optionalParams);
  }
};
