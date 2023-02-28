const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} = require('firebase/auth')
const { initializeApp } = require('firebase/app')
const { getFirebaseApiKey } = require('../Config/connections')

const app = initializeApp(getFirebaseApiKey())
const auth = getAuth(app)

const firebaseLogin = ({ email, password }) => {
  return signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const { user } = userCredential
      return user
    }
  )
}

const firebaseSignup = ({ email, password }) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const { user } = userCredential
      return user
    }
  )
}

module.exports = {
  firebaseLogin,
  firebaseSignup
}
