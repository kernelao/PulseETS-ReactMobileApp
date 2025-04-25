import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();

export function navigateSafe(name, params) {
    setTimeout(() => {
      if (!navigationRef.isReady()) {
        console.warn(`⚠️ navigateSafe appelé trop tôt pour ${name}`);
        console.trace("TRACE: navigationRef not ready");
        return;
      }
  
      const current = navigationRef.getCurrentRoute();
      console.log('🧭 Current route:', current);
      if (current?.name !== name) {
        console.log(`🔁 Navigation vers ${name}`);
        navigationRef.navigate(name, params);
      } else {
        console.log(`⛔ Déjà sur ${name}, navigation ignorée`);
      }
    }, 300);
  }  