const functions = require('firebase-functions');
const Filter = require('bad-words')

const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

exports.detectGoodUsers = functions.firestore
  .document('messages/{msgId}')
  .onCreate(async (doc, ctx) => {
    const filter = new Filter()
    const { text, uid } = doc.data()

    if (!filter.isProfane(text)) {
      await doc.ref.update({
        text: 'I got banned for not using foul language :('
      })

      await db.collection('banned').doc(uid).set({})
    }
  })
