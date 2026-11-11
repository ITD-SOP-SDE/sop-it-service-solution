import { SESSION_EXPIRED_MESSAGE, isSessionError } from "@/services/session";

export const INVALID_CREDENTIALS_MESSAGE =
  "Brugernavn eller adgangskode er forkert";

export const NO_CONNECTION_MESSAGE =
  "Kunne ikke kontakte serveren. Tjek din forbindelse og prøv igen.";

export const SERVER_ERROR_MESSAGE =
  "Der opstod en fejl på serveren. Prøv igen senere.";

export function getLoginErrorMessage(status: number) {
  if (status === 400 || status === 401)
    return INVALID_CREDENTIALS_MESSAGE;

  if (status === 403)
    return "Du har ikke adgang til systemet";

  if (status === 0)
    return NO_CONNECTION_MESSAGE;

  return SERVER_ERROR_MESSAGE;
}

export function getLoanErrorMessage(err: any) {
  const response = err?.response;

  if (!response)
    return NO_CONNECTION_MESSAGE;

  const { status, data } = response;

  if (isSessionError(status, data))
    return SESSION_EXPIRED_MESSAGE;

  if (status === 401)
    return INVALID_CREDENTIALS_MESSAGE;

  if (status === 403)
    return "Du har ikke adgang til at oprette udlån";

  if (status === 400)
    return "Udlånet mangler oplysninger. Tjek felterne og prøv igen.";

  return SERVER_ERROR_MESSAGE;
}
