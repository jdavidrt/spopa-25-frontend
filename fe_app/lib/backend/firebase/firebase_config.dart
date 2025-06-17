import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyBJdte8un50zox-ZBBmMYmzjdnTu2faCnk",
            authDomain: "front-x4pe6z.firebaseapp.com",
            projectId: "front-x4pe6z",
            storageBucket: "front-x4pe6z.firebasestorage.app",
            messagingSenderId: "912633018080",
            appId: "1:912633018080:web:238368cc3e21323df0c285"));
  } else {
    await Firebase.initializeApp();
  }
}
