import { STORAGE_KEYS } from "@constants/storage";
import { User } from "@interfaces/api/user";

class UserSession {
  private storageKey = STORAGE_KEYS.USER_SESSION;

  public storeUserProfile(profile: User | null) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  public getUserProfile(): User | null {
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
