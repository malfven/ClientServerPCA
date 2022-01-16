import pcadata as PcaData
from sanic import Sanic
from sanic.response import html, json, text

# sqlite
import sqlite3
from databases import Database

dbpca = Database('sqlite:///database/cancer.db')

# Database fetch functionality
async def getpca(query, values = {}):
  rows = await dbpca.fetch_all(query=query, values=values)
  dicts = []
  for row in rows:
    dicts.append(dict(row))
  return dicts


app = Sanic(__name__)
app.config.CORS_ORIGINS = "http://foobar.com,http://bar.com,http://localhost:8000, http://localhost"
app.config['CORS_HEADERS'] = 'Content-Type'

@app.get('/rest', host="")

#API declarations
async def get_rest(request):
    restDescription = [
        {
        "route":"/rest",
        "methods": ["GET"],
        "description":"This route: The API documentation"
        },        
        {
        "route":"/rest/pcaxy",
        "methods": ["GET"],
        "description":"pcaxy"
        },       
        {
        "route":"/rest/patient/:id",
        "methods": ["GET"],
        "description":"patient matching id"
        },
        {
        "route":"/rest/patients",
        "methods": ["GET"],
        "description":"patients"
        },
        {
        "route":"/rest/pcacolumns",
        "methods": ["GET"],
        "description":"pcacolumns"
        },
        {
        "route":"/rest/get_patientdata/:id/:marker",
        "methods": ["GET"],
        "description":"patient data"
        },
        {
        "route":"/rest/patientclass",
        "methods": ["GET"],
        "description":"patientclass"
        },                
    ]
    return json(restDescription)


#API definitions
@app.get('/rest/pcaxy/')
async def get_pcaxy(request):    
  return json(PcaData.PCAxyxValues)
    
@app.get('/rest/patients')
async def get_patients(request):
  patients = await getpca('SELECT * FROM patientdata')
  return json(patients)

@app.get('/rest/patient/<id>')
async def get_patient(request, id):
  patient = await getpca('SELECT * FROM patientdata WHERE rowid = :id', { "id": id })
  return json(patient)

@app.get('/rest/patientdata/<id>/<marker>')
async def get_patientdata(request, id, marker):
  patientData = await getpca('SELECT * FROM patientdata WHERE rowid = :one', { "one": id })
  terms = [patientData[0][marker]]  
  return text(str(terms[0]))   

@app.get('/rest/pcacolumns')
async def get_pcacolumns(request):
  pcacolumns = await getpca('SELECT * FROM patientdata WHERE rowid = :id', { "id": 1 })  
  return json(pcacolumns)

@app.get('/rest/patientclass')
async def get_patientclass(request):
  patientclass = await getpca('SELECT * FROM patientclass')
  return json(patientclass)

if __name__ == '__api__':
    app.run(host="0.0.0.0", port=8000, debug=True)
