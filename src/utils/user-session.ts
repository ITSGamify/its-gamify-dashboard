import { STORAGE_KEYS } from "@constants/storage";
import { LoginResponse } from "@interfaces/api/auth";

class UserSession {
  private storageKey = STORAGE_KEYS.USER_SESSION;

  public storeUserProfile(profile: LoginResponse | null) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  public getUserProfile(): LoginResponse | null {
    const storedProfile = sessionStorage.getItem(this.storageKey);
    return storedProfile ? JSON.parse(storedProfile) : null;
  }

  public isAuthenticated(): boolean {
    return sessionStorage.getItem(this.storageKey) !== null;
  }

  public clearUserProfile(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}

const userSession = new UserSession();
export default userSession;
