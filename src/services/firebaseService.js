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

    // ✅ Validate timestamp before querying
    if (
      !sanitizedData.timestamp ||
      typeof sanitizedData.timestamp !== 'string' ||
      isNaN(Date.parse(sanitizedData.timestamp))
    ) {
      console.error('Invalid or missing timestamp in resultData:', sanitizedData);
      return;
    }

    const historyRef = collection(db, 'users', userId, 'history');

    // ✅ Safe duplicate check
    const querySnapshot = await getDocs(query(
      historyRef,
      where('timestamp', '==', sanitizedData.timestamp),
      where('interviewTime', '==', sanitizedData.interviewTime)
    ));

    if (!querySnapshot.empty) {
      console.log('Duplicate result found, skipping save.');
      return;
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
// Add these new functions to your existing firebaseService.js
export const saveUserAnalysis = async (userId, analysisData) => {
  try {
    const sanitizedData = deepSanitize({
      ...analysisData,
      lastUpdated: serverTimestamp()
    });
    
    const userAnalyticsRef = doc(db, 'userAnalytics', userId);
    await setDoc(userAnalyticsRef, sanitizedData, { merge: true });
    console.log('User analysis saved successfully');
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
};

export const getUserDashboardData = async (userId) => {
  try {
    const docRef = doc(db, 'userAnalytics', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    console.log('No analytics data found for user');
    return null;
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
};

export const getCompleteInterviewResults = async (userId) => {
  try {
    const resultsRef = collection(db, 'users', userId, 'history');
    const q = query(resultsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching interview results:", error);
    throw error;
  }
};