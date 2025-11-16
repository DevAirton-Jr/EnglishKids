import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!currentUser) return null;
    if (isFirebaseConfigured) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (!userData.currentLevel) userData.currentLevel = 1;
        if (!userData.completedLevels) userData.completedLevels = [];
        if (!userData.role) userData.role = "student";
        setUserProfile(userData);
        return userData;
      }
      return null;
    } else {
      const raw = localStorage.getItem("demoProfile");
      let data = raw ? JSON.parse(raw) : null;
      if (!data) {
        data = {
          name: currentUser?.displayName || "Aluno",
          email: currentUser?.email || "",
          bio: "",
          age: "",
          photoURL: "",
          completedLevels: [],
          currentLevel: 1,
          role: "student",
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("demoProfile", JSON.stringify(data));
      }
      setUserProfile(data);
      return data;
    }
  }, [currentUser]);

  async function signup(email, password, name, role = "student") {
    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        bio: "",
        age: "",
        photoURL: "",
        completedLevels: [],
        currentLevel: 1,
        role,
        createdAt: new Date().toISOString()
      });
      return userCredential;
    } else {
      const demoUser = { uid: "demo-" + Date.now(), email, displayName: name };
      setCurrentUser(demoUser);
      localStorage.setItem("demoCurrentUser", JSON.stringify(demoUser));
      const profile = {
        name,
        email,
        bio: "",
        age: "",
        photoURL: "",
        completedLevels: [],
        currentLevel: 1,
        role,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("demoProfile", JSON.stringify(profile));
      return { user: demoUser };
    }
  }

  function login(email, password, isTeacher = false) {
    if (isFirebaseConfigured) {
      return signInWithEmailAndPassword(auth, email, password);
    } else {
      const stored = localStorage.getItem("demoCurrentUser");
      let demoUser = stored ? JSON.parse(stored) : null;
      if (!demoUser) {
        demoUser = { uid: "demo", email, displayName: "Aluno" };
      }
      setCurrentUser(demoUser);
      localStorage.setItem("demoCurrentUser", JSON.stringify(demoUser));
      const raw = localStorage.getItem("demoProfile");
      let profile = raw ? JSON.parse(raw) : null;
      if (!profile) profile = { name: "Aluno", email, role: isTeacher ? "teacher" : "student", completedLevels: [], currentLevel: 1 };
      if (isTeacher) profile.role = "teacher";
      localStorage.setItem("demoProfile", JSON.stringify(profile));
      setUserProfile(profile);
      return Promise.resolve({ user: demoUser });
    }
  }

  function logout() {
    if (isFirebaseConfigured) {
      return signOut(auth);
    } else {
      localStorage.removeItem("demoCurrentUser");
      return new Promise((resolve) => {
        setCurrentUser(null);
        resolve(true);
      });
    }
  }

  async function updateUserProfile(data) {
    if (!currentUser) return;
    if (isFirebaseConfigured) {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, data, { merge: true });
      setUserProfile(prev => ({ ...prev, ...data }));
      if (data.name && data.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: data.name });
      }
    } else {
      const prev = userProfile || {};
      const merged = { ...prev, ...data };
      localStorage.setItem("demoProfile", JSON.stringify(merged));
      setUserProfile(merged);
      if (data.name) {
        const updatedUser = { ...(currentUser || {}), displayName: data.name };
        setCurrentUser(updatedUser);
        localStorage.setItem("demoCurrentUser", JSON.stringify(updatedUser));
      }
    }
  }

  async function uploadProfilePicture(file) {
    if (!currentUser) return;
    if (isFirebaseConfigured) {
      const fileRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
      await updateUserProfile({ photoURL });
      return photoURL;
    } else {
      const photoURL = typeof file === "string" ? file : "";
      await updateUserProfile({ photoURL });
      return photoURL;
    }
  }

  async function completeLevel(levelId) {
    if (!userProfile) return;
    const completedLevels = [...(userProfile.completedLevels || [])];
    if (!completedLevels.includes(levelId)) completedLevels.push(levelId);
    const nextLevel = Math.max(userProfile.currentLevel || 1, levelId + 1);
    await updateUserProfile({ completedLevels, currentLevel: nextLevel });
  }

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          await fetchUserProfile();
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      const raw = localStorage.getItem("demoCurrentUser");
      const demoUser = raw ? JSON.parse(raw) : null;
      setCurrentUser(demoUser);
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    updateUserProfile,
    uploadProfilePicture,
    completeLevel,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
