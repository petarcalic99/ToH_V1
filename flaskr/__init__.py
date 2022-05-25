import os
from urllib import request
import creator as cr
import matplotlib.pyplot as plt
import numpy as np

from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request


def create_app(test_config=None):
    #create and config the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY = 'calic',
        DATABASE = os.path.join(app.instance_path, 'flaskr.sqlite')
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent = True)
    else: 
        app.config.from_mapping(test_config)    

    #test existence
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass


    #routing
    @app.route('/img_array', methods = ['GET'])
    def serveArray():
        LI = cr.retImGrid()
        return jsonify(array=LI)

    @app.route('/snap_array', methods = ['POST'])
    def snapArray():
        data = request.json 
        dataList = list(data['data'].values())
        datanp = np.array(dataList)
        
        #First lets remove every 4th elemnnt from the vector
        datanp = np.delete(datanp, np.arange(0, datanp.size, 4))

        #Now from vector Lets construct an array of shape [28x3, 28x3, 3]
        dataMatrix = np.empty(shape = (28*3, 28*3, 3), dtype=int)
        datanp = datanp.reshape(84,84,3)

        #Test
        #plt.imshow(datanp)
        #plt.show()           
                                      
        return data        

    @app.route('/')
    def index():
        return render_template("index.html")
    
    @app.route('/about')
    def about():
        return "Internship at ledger 2022, AI Master student at UPMC"

    return app


