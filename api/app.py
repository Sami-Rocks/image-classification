from flask import Flask, request
import os
import shutil

app = Flask(__name__)

@app.route("/postjson", methods = ['POST', 'GET'])
def hello():
    contents = request.get_json()
    newpath = r'C:\new_folder' 
    if not os.path.exists(newpath):
        os.makedirs(newpath)
    for content in contents:
        src = r'C:\Users\sowus\Desktop\images\{}'
        shutil.copy2(src.format(content), r'C:\new_folder')
    return "content"


if __name__ == "__main__":
    app.run(debug=True)