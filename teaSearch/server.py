import os
from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def mainIndex():
	return render_template('index.html')
	
@app.route('/white')
def showWhite():
	return render_template('results.html')
	
@app.route('/yellow')
def showYellow():
	return render_template('results.html')

@app.route('/green')
def showGreen():
	return render_template('results.html')
	
@app.route('/oolong')
def showOolong():
	return render_template('results.html')
	
@app.route('/black')
def showBlack():
	return render_template('results.html')
	
@app.route('/dark')
def showDark():
	return render_template('results.html')

@app.route('/red')
def showRed():
	return render_template('results.html')
	
@app.route('/herbal')
def showHerbal():
	return render_template('results.html')

@app.route('/flavour')
def showFlavour():
	return render_template('results.html')
	
@app.route('/ingredients')
def showIngredients():
	return render_template('results.html')

# start the server
if __name__ == '__main__':
    app.run(host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)