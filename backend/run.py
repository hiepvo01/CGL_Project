from flask import Flask, request, make_response, send_from_directory, jsonify
import os
import csv
import numpy as np
import pandas as pd


app = Flask(__name__)

print(os.path.dirname(os.path.abspath(__file__)))

@app.route('/all_data.csv')
def getFile():
    df = pd.read_csv(os.path.dirname(os.path.abspath(__file__)) + '\graphData\CGL_DataFinal_Mar2021.csv')
    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=all_data.csv"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Content-Type"] = "text/csv"
    return resp


if __name__ == '__main__':
    app.run()