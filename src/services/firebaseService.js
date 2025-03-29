import { db } from '../firebase';
import {collection, addDoc, getDocs, doc, setDoc, getDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';

// Create interview session

export const createInterviewSession = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found.');
  }

  try {
    const docRef = await addDoc(collection(db, 'interviewSessions'), {
      ownerId: user.uid,       // ✅ REQUIRED for security rules!
      createdAt: serverTimestamp(),
    });

    console.log('Session created with ownerId:', user.uid);
    return docRef.id;
  } catch (error) {
    console.error('Error creating interview session:', error);
    throw error;
  }
};
// Save answer inside an interview session (answers subcollection)

export const saveAnswerToFirestore = async (sessionId, answerObj) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found.');
  }

  if (!sessionId) {
    throw new Error('Session ID is required!');
  }

  if (!answerObj.questionId) {
    console.error('Answer object missing questionId!', answerObj);
    throw new Error('Question ID is required to save an answer!');
  }

  try {
    const answerRef = doc(collection(db, 'interviewSessions', sessionId, 'answers'));
    await setDoc(answerRef, {
      ...answerObj,
      ownerId: user.uid,               // optional but can help debug
      createdAt: serverTimestamp(),
    });
    console.log('Answer saved to Firestore:', answerObj);
  } catch (error) {
    console.error('Error saving answer to Firestore:', error);
    throw error;
  }
};

// Save interview result to user's history subcollection
export const saveInterviewResult = async (resultData) => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user');
    return;
  }

  const userId = user.uid;

  try {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      console.log('Creating missing user profile...');
      await setDoc(userRef, {
        uid: userId,
        email: user.email,
        role: 'candidate',
        createdAt: serverTimestamp()
      });
    }

    const historyRef = collection(db, 'users', userId, 'history');
    await addDoc(historyRef, {
      ...resultData,
      createdAt: serverTimestamp(),
    });

    console.log('Interview result saved in Firestore');
  } catch (error) {
    console.error('Error saving interview result:', error);
  }
};

export const getInterviewResults = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in.');
    return [];
  }

  try {
    const q = query(
      collection(db, 'interviewResults'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  } catch (error) {
    console.error('Error fetching interview results:', error);
    return [];
  }
};
