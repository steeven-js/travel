import { useState, useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";

import { auth } from "../../firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userAuthUid, setUserAuthUid] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setUserAuthUid(authUser.uid);
        if (authUser.displayName) { // Vérifie si displayName est défini avant de l'utiliser
          setDisplayName(authUser.displayName);
        }
        setLoading(false);
      } else {
        setUser(null);
        setUserAuthUid('');
        setDisplayName('');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);


  return { user, loading, userAuthUid, displayName};
}
