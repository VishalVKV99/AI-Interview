import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth } from '../firebase';

/**
 * ✅ Deeply sanitize an object by removing undefined values from nested objects/arrays.
 */
const deepSanitize = (input) => {
  if (Array.isArray(input)) {
    return input
      .map(deepSanitize)
      .filter((item) => item !== undefined);
  } else if (input !== null && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input)
        .map(([key, value]) => [key, deepSanitize(value)])
        .filter(([_, value]) => value !== undefined)
    );
  } else if (input !== undefined) {
    return input;
  }
  return undefined;
};

// ✅ Create interview session
export const createInterviewSession = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found.');
  }

  try {
    const docRef = await addDoc(collection(db, 'interviewSessions'), {
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    console.log('Session created with ownerId:', user.uid);
    return docRef.id;
  } catch (error) {
    console.error('Error creating interview session:', error);
    throw error;
  }
};

// ✅ Save answer inside interview session
export const saveAnswerToFirestore = async (sessionId, answerObj) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found.');
  }

  if (!sessionId) {
    throw new Error('Session ID is required!');
  }

  if (answerObj.questionId === undefined || answerObj.questionId === null) {
    console.error('Answer object missing questionId!', answerObj);
    throw new Error('Question ID is required to save an answer!');
  }

  try {
    const answerRef = doc(collection(db, 'interviewSessions', sessionId, 'answers'));
    await setDoc(answerRef, {
      ...deepSanitize(answerObj),
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });
    console.log('Answer saved to Firestore:', answerObj);
  } catch (error) {
    console.error('Error saving answer to Firestore:', error);
    throw error;
  }
};

// ✅ Save interview result to user's history
import { query, where } from 'firebase/firestore';

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
      await setDoc(userRef, {
        uid: userId,
        email: user.email,
        role: 'candidate',
        createdAt: serverTimestamp(),
      });
    }

    const sanitizedData = deepSanitize(resultData);
    const historyRef = collection(db, 'users', userId, 'history');

    // 👇 New: Check for similar result already existing
    const querySnapshot = await getDocs(query(
      historyRef,
      where('timestamp', '==', sanitizedData.timestamp || ''),
      where('interviewTime', '==', sanitizedData.interviewTime || 0)
    ));

    if (!querySnapshot.empty) {
      console.log('Duplicate result found, skipping save.');
      return; // Avoid saving duplicate
    }

    await addDoc(historyRef, {
      ...sanitizedData,
      createdAt: serverTimestamp(),
    });

    console.log('Interview result saved in Firestore');
  } catch (error) {
    console.error('Error saving interview result:', error);
  }
};


// ✅ Get interview results
export const getInterviewResults = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in.');
    return [];
  }

  try {
    const historyRef = collection(db, 'users', user.uid, 'history');
    const querySnapshot = await getDocs(historyRef);
    const results = [];

    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  } catch (error) {
    console.error('Error fetching interview history:', error);
    return [];
  }
};
