#!/usr/bin/env python3

from flask import Flask, jsonify, request, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float
import os
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
import pandas as pd
from data.wordcloud import wordcloud_data
from flask_cors import CORS

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['JWT_SECRET_KEY'] = 'CGL_2015-2019'
CORS(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)


@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Databases created')

@app.cli.command('db_drop')
def db_drop():
    db.drop_all()
    print('Databases dropped')

@app.cli.command('db_seed')
def db_seed():
    jon = User(firstname = "Jon",
                lastname = "Lund",
                email = 'lundjo01@luther.edu',
                username = 'lundjo01',
                password = 'CGL_lund')

    hiep = User(firstname = "Hiep",
                lastname = "Vo",
                email = 'vohi01@luther.edu',
                username = 'vohi01',
                password = 'Bangfish0911@')

    db.session.add(jon)
    db.session.add(hiep)
    db.session.commit()
    print('Databases seeded')

@app.route('/')
def hello_world():
    return jsonify(message = "Hello World")

@app.route('/word_cloud')
def word_cloud():
    return jsonify(words=wordcloud_data)

@app.route('/users', methods=['GET'])
# @jwt_required()
def users():
    users_list = User.query.all()
    result = users_schema.dump(users_list)
    return jsonify(result)

@app.route('/allData', methods=['GET'])
@jwt_required()
def allData():
    df = pd.read_csv(os.path.dirname(os.path.abspath(__file__)) + '/data/CGL_DataFinal_Mar2021.csv')
    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=all_data.csv"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Content-Type"] = "text/csv"
    return resp

@app.route('/financial/<year>', methods=['GET'])
@jwt_required()
def financial(year):
    f = '/data/aid/{y} Study Abroad review by Jon.csv'.format(y=str(year))
    f.format(y=year)
    link = os.path.dirname(os.path.abspath(__file__)) + f
    df = pd.read_csv(link)
    df["Need Category"] = df["Need Category"].str.lower()
    terms = df.groupby(['Term 1','Need Category']).size().to_dict()
    programs = df.groupby(['Program Type 1','Need Category']).size().to_dict()
    finalTerms = {}
    for k in terms:
        if k[0] not in finalTerms:
            try:
                finalTerms[k[0]] = {k[1]:terms[k]}
            except:
                continue
        else:
            finalTerms[k[0]][k[1]] = terms[k]
    finalPrograms = {}
    for k in programs:
        if k[0] not in finalPrograms:
            try:
                finalPrograms[k[0]] = {k[1]:programs[k]}
            except:
                continue
        else:
            finalPrograms[k[0]][k[1]] = programs[k]
    return jsonify(terms=finalTerms, programTypes=finalPrograms)

@app.route('/register', methods=['POST'])
def register():
    email = request.form['email']
    test = User.query.filter_by(email = email).first()
    if test:
        return jsonify(message='That email already existed'), 409
    else:
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        username = request.form['username']
        password = request.form['password']
        user = User(firstname=firstname, lastname=lastname, email=email, username=username, password=password)
        db.session.add(user)
        db.session.commit()
        return jsonify(message="User created successfully"), 201

@app.route('/login', methods=['POST'])
def login():
    if request.is_json:
        email = request.json['email']
        password = request.json['password']
    else:
        email = request.form['email']
        password = request.form['password']

    test = User.query.filter_by(email=email, password=password).first()
    if test:
        access_token = create_access_token(identity=email)
        return jsonify(message="Login succeeded", access_token=access_token)
    else:
        return jsonify(message='Bad email or password'), 401

# Users database models
class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key = True)
    firstname = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    password = Column(String)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'firstname', 'lastname', 'email', 'username', 'password')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

if __name__ == "__main__":
    app.run()