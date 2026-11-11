import { useContext, useEffect } from "react";

import { CurrentUserContext } from "@/App";
import axios from "axios";

export const validateSession = async () => {
  try {
    const { data } = await axios.post("auth/validate");

    return { ...data, user: data };
  } catch {
    return { error: true, user: null };
  }
};

export function useLoginViaSession() {
  const { setCurrentUser } = useContext(CurrentUserContext);

  async function loginViaSession() {
    let { data } = await axios.get("auth/cookies");

    const { token } = data;

    if (!token) {
      setCurrentUser(null);
      return false;
    }

    let res = await validateSession();

    if (res && !res.error && res.user.moderatorLevel > 0) {
      setCurrentUser(res.user);
      return true;
    } else {
      setCurrentUser(null);
      return false;
    }
  }

  useEffect(() => {
    loginViaSession();
  }, []);

  return { loginViaSession };
}

interface LoginResult {
  status: number;
  user?: userState;
}

export async function loginViaCredentials(
  username: string,
  password: string,
): Promise<LoginResult> {
  try {
    const { data } = await axios.post("auth/login", { username, password });

    if (data?.moderatorLevel == 0) return { status: 403 };
    if (data?.username) return { status: 200, user: data };

    return { status: 500 };
  } catch (err: any) {
    return { status: err?.response?.status ?? 0 };
  }
}
export function logout(
  setCurrentUser: React.Dispatch<React.SetStateAction<userState>>,
) {
  axios.post("auth/logout");

  setCurrentUser(null);
}
