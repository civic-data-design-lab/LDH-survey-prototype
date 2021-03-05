import pyrebase

config = {
  "apiKey": "AIzaSyBoYXnCZtsH9fzE8elPZgo5g9LksQ-Z-gc",
    "authDomain": "daraja-test-edf30.firebaseapp.com",
    "databaseURL": "https://daraja-test-edf30-default-rtdb.firebaseio.com/",
    "projectId": "daraja-test-edf30",
    "storageBucket": "daraja-test-edf30.appspot.com",
    "messagingSenderId": "116745284882",
    "appId": "1:116745284882:web:34ce1506c75c0179a957cb"
}
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

def create_user(username, password):
    user = auth.create_user_with_email_and_password(username, password)
    print(user)

    return user

def convert_to_csv(array:list):
    res = ''

    for i in range(len(array)):
        if i == len(array) - 1:
            res += str(array[i])
            return res

        res += (str(array[i]) + ", ")

    return res
