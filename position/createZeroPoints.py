
import sys
import json
from os.path import basename

# <div class="filterDiv PARKS">
#       <div class="tooltip"><img src="img/2.29.2.png" class="image" width="100%">
# {
#     "name": "Coastal Flux - Ecological Services", 
#     "image": "Coastal Flux - Ecological Services.png"
# }, 


if len(sys.argv)!=2:
    print('.py base.html')

res=[]
c2i={}

with open(sys.argv[1],'r') as fin:
    curClass=''
    for line in fin:
        if 'class="filterDiv' in line:
            curClass=line.strip().split('"')[1].split(' ')[1]
            if (curClass not in c2i):
                c2i[curClass]=len(res)
                res.append({'class':curClass, 'options':[]})
        if 'src="img/' in line:
            l=line.strip()
            image=basename(l[l.find('src=')+5:l.find('.png')+4])
            res[c2i[curClass]]['options'].append({'name':image[:-4],'image':image})

with open('zeroPoints.json','w') as fout:
    json.dump(res,fout)


