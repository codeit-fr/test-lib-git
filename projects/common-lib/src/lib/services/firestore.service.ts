import { Injectable } from '@angular/core';
import { FirebaseApp } from 'firebase/app';
import { Firestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";
import { SystemService } from "./system.service";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  // the port used when emulating Firestore service (only in local environment)
  private firestoreEmulatorPort: number = 8080;

  // the Firestore instance used to access underlying collections/documents
  public db!: Firestore;

  public constructor(private systemService: SystemService) {
  }

  public async init(app: FirebaseApp) {
    // Initialize Cloud Firestore and get a reference to the service

    const configuration = await this.systemService.getEnvironmentConfiguration();

    this.db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true
    });


    // in Local, we use Firestore emulator
    if (configuration.stage === 'local') {
      connectFirestoreEmulator(this.db, 'localhost', this.firestoreEmulatorPort);
    }
  }
}
