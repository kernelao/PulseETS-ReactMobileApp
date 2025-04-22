export type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
    // Ajoute ici tous les écrans que tu as
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }
  