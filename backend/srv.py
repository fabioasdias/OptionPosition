import cherrypy
import os
import json

def cors():
  if cherrypy.request.method == 'OPTIONS':
    # preflight request 
    # see http://www.w3.org/TR/cors/#cross-origin-request-with-preflight-0
    cherrypy.response.headers['Access-Control-Allow-Methods'] = 'POST'
    cherrypy.response.headers['Access-Control-Allow-Headers'] = 'content-type'
    cherrypy.response.headers['Access-Control-Allow-Origin']  = '*'
    # tell CherryPy To avoid normal handler
    return True
  else:
    cherrypy.response.headers['Access-Control-Allow-Origin'] = '*'

cherrypy.tools.cors = cherrypy._cptools.HandlerTool(cors)

def savePoints(p):
    with open('points.json','w') as f:
        json.dump(p,f)



@cherrypy.expose
class server(object):
    @cherrypy.expose
    def index(self):
        return("It works!")

    @cherrypy.expose
    @cherrypy.tools.gzip()
    @cherrypy.tools.json_out()
    def getAxis(self):
        cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
        return(axis)

    @cherrypy.expose
    @cherrypy.tools.gzip()
    @cherrypy.tools.json_out()
    def getPoints(self):
        cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
        return(points)

    @cherrypy.expose
    @cherrypy.tools.gzip()
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    @cherrypy.config(**{'tools.cors.on': True})        
    def setPoints(self):
        cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
        input_json = cherrypy.request.json
        print(input_json)
        global points
        points=input_json
        savePoints(points)
        # VarID=input_json['VarID']
        return([])


    @cherrypy.expose
    @cherrypy.config(**{'tools.cors.on': True})    
    @cherrypy.tools.gzip()
    @cherrypy.tools.json_out()
    def upload(self, file):
        myFile=file
        cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
        try:
            savedImage='images/{0}.png'.format(len(points))
            print(savedImage)
            with open(savedImage,'wb') as outFile:        
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    outFile.write(data)            
            print('written')
            points.append({'name':'',
                        'coordinates':[-1,]*len(axis),
                        'image':savedImage})
            savePoints(points)

        except:
            print('error')
            return({'status':'error'})
        ret=dict()
        ret['status']='ok'
        return(ret)


if __name__ == '__main__':

    with open('axis.json','r') as f:
        axis=json.load(f)
    with open('points.json','r') as f:
        points=json.load(f)


    webapp = server()
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.gzip.on': True,
            'tools.gzip.mime_types': ['text/*','application/*']
        },
        '/images': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './images'
        }
    }

    cherrypy.server.max_request_body_size = 0
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.server.socket_port = 8000
    cherrypy.quickstart(webapp, '/', conf)

