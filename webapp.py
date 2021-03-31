import flask
import requests
import json
import re
import psycopg2

import pyrebase


from flask import request, redirect, url_for, flash, render_template, session
from utils import *

EMAIL_REGEX = "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
DB_CON = psycopg2.connect(database="daraja-test", user="postgres",
                          password="LARM_ghol6lick.jusm",
                          host="daraja-test.cclr5pzf7wtq.us-east-1.rds.amazonaws.com",
                          port=5432)

firebase_config = {
    "apiKey": "AIzaSyBoYXnCZtsH9fzE8elPZgo5g9LksQ-Z-gc",
    "authDomain": "daraja-test-edf30.firebaseapp.com",
    "databaseURL": "https://daraja-test-edf30-default-rtdb.firebaseio.com/",
    "projectId": "daraja-test-edf30",
    "storageBucket": "daraja-test-edf30.appspot.com",
    "messagingSenderId": "116745284882",
    "appId": "1:116745284882:web:34ce1506c75c0179a957cb"
}

# Reconfigure to use firebase-admin tools in the future
firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

webapp = flask.Flask(
    __name__,
    static_url_path="",
    static_folder="static")
webapp.config["DEBUG"] = True
webapp.secret_key = "aSdbadkajoajfdcd"

@webapp.route("/", methods=['POST', 'GET'])
def login():
    try:
        print(session['usr'])
        return redirect(url_for('welcome'))

    except KeyError:
        if request.method == "POST":
            username = request.form.get("inputEmail")
            password = request.form.get("inputPassword")

            if username is None or password is None:
                pass
            elif not re.search(EMAIL_REGEX, username):
                flash("Please enter a valid email.")
            else:
                try:
                    user = auth.sign_in_with_email_and_password(username, password)
                    user_id = user['localId']
                    session['usr'] = user_id

                    cur = DB_CON.cursor()
                    sql = '''SELECT * FROM profile WHERE uid=(%s)'''
                    cur.execute(sql, (user_id,))

                    if cur.fetchone():
                        return redirect(url_for("welcome"))
                    else:
                        sql = '''INSERT INTO profile (uid) VALUES (%s)'''
                        cur.execute(sql, (user_id,))
                        DB_CON.commit()
                        return redirect(url_for("welcome"))

                except requests.HTTPError as e:
                    error_json = e.args[1]
                    error = json.loads(error_json)['error']['message']
                    print(error)
                    if error == "INVALID_PASSWORD":
                        session['email'] = username
                        message = "Invalid password."
                        flash(message)
                    elif error == "EMAIL_NOT_FOUND":
                        flash("User does not exist. Please sign up.")
                    else:
                        pass

    return render_template("index.html")


@webapp.route("/welcome")
def welcome():
    try:
        print(session['usr'])
        return render_template('welcome.html')
    except KeyError:
        return redirect(url_for('login'))


@webapp.route("/join", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        username = request.form.get("inputEmail")
        password = request.form.get("inputPassword")
        confirm_password = request.form.get("inputConfirmPassword")

        if password != confirm_password:
            flash("The two passwords do not match.")
        elif not re.search(EMAIL_REGEX, username):
            flash("Please enter a valid email.")
        else:
            try:
                user = create_user(username, password)
                print(user)
                user_id = user['localId']
                session['usr'] = user_id

                cur = DB_CON.cursor()
                sql = '''INSERT INTO profile (uid) VALUES (%s)'''
                cur.execute(sql, (user_id,))
                DB_CON.commit()

                return redirect(url_for("welcome"))
            except requests.HTTPError as e:
                error_json = e.args[1]
                error = json.loads(error_json)['error']['message']
                print(error)
                if error == "EMAIL_EXISTS":
                    message = "Email already exists"
                    flash(message)

    return render_template("sign-up.html")


@webapp.route("/questions", methods=["POST", "GET"])
def question():
    return render_template("questions.html")


@webapp.route("/thank-you")
def thankyou():
    try:
        print(session['usr'])
        return render_template("thank-you.html")
    except KeyError:
        return redirect(url_for('login'))


@webapp.route("/reset")
def password_reset():
    auth.send_password_reset_email(session['email'])

    return redirect(url_for("login"))


if __name__ == "__main__":
    webapp.run(debug=True)
