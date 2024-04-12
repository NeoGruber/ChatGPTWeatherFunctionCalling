import { Firestore } from '@google-cloud/firestore';
import admin, { storage } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export class FirebaseService {
  private static firestore: Firestore = null;
  private static app: admin.app.App;
  private static storage: storage.Storage;

  static getFirestore(): Firestore {
    if (this.firestore == null) {
      this.firestore = this.getFireStoreFromFirebase();
    }

    return this.firestore;
  }

  private static getFireStoreFromFirebase(): Firestore {
    if (this.firestore == null) {
      this.firestore = getFirestore();
    }

    return this.firestore;
  }
}
