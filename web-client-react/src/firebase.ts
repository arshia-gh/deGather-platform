export const firebaseConfig = {
    apiKey: "AIzaSyAatlF6nvBVavXKc5mqwb6-cqWL9KlWKOg",
    authDomain: "degather-3d704.firebaseapp.com",
    projectId: "degather-3d704",
    storageBucket: "degather-3d704.appspot.com",
    messagingSenderId: "886715233515",
    appId: "1:886715233515:web:109d187095c3d51477baae",
    measurementId: "G-Q4XNTCK7H2"
};

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

import { initializeApp } from "firebase/app"
import { generateKey } from "./utils/generateKey";

export const googleProvider = new GoogleAuthProvider();
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { }
};

export const signUpWithEmailAndPassword = async (nickname: string, tag: string, email: string, password: string) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const { privateKey, publicKey } = await generateKey();

        const userQuery = addDoc(collection(db, "users"), {
            uid: user.uid,
            publicKey,
            nickname,
            tag,
        })

        console.log(privateKey)
        return privateKey
    } catch (err) { }
}

export const signInWithGoogle = async () => {
    try {
        const { user } = await signInWithPopup(auth, googleProvider);
        const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
        const queryResult = await getDocs(userQuery);
        if (queryResult.docs.length === 0) {
            const { publicKey } = await generateKey();

            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                publicKey,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
    }
};