import React, { Component } from 'react';
import {getData,getURL} from './urls';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    let dragImg = new Image(0,0);
    dragImg.src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    this.state={points:[],axis:undefined, img : dragImg, allPoints:[], curClass:'',index:undefined}
  }
  componentDidMount(){
      getData(getURL.getAxis(),(ax)=>{
        this.setState({axis:ax,X:0,Y:11});
    });
    getData(getURL.getPoints(),(st)=>{
      this.setState({allPoints:st,points:st[0].options,curClass:st[0].class,index:0});
    });
  }
  render() {
    console.log(this.state);
    let retJSX=[];
    if (this.state.axis!==undefined){        
      let pJSX=[];
      let unused=[];
      // pJSX.push(<p key='ly'
      //             className="labelY"
      //           >
      //           {"(-)"+this.state.axis[this.state.Y].name+" (+) "}
      //           </p>
      //           );
      pJSX.push(<p key='lx'
                  className="labelX"
                >
                {"(-)"+this.state.axis[this.state.X].name+" (+) "}
                </p>
                );

      for (let i=0;i<this.state.points.length;i++){
          let p=this.state.points[i];
          if (!p.hasOwnProperty('coordinates')){
            p.coordinates=this.state.axis.map(()=>{return(-1)});
          }
          while (p.coordinates.length<this.state.axis.length){
            p.coordinates.push(-1);
          }
          if ((p.coordinates[this.state.X]===-1)){// && (p.coordinates[this.state.Y]===-1))
            unused.push(<div>
                         <p style={{width:'fit-content',margin:'auto'}}>{p.name}</p>
                          <img 
                          className="availablePoint" 
                          onClick={(d)=>{
                            let cp=this.state.points;
                            cp[i].coordinates[this.state.X]=0;
                            cp[i].coordinates[this.state.Y]=0;
                            this.setState({points:cp});
                          }}
                          key={'U'+i}
                          data-pid={i}
                          src={getURL.getImage(p.image)} 
                          alt={p.name}/>
                          </div>
                        );
          } else {
            let x=p.coordinates[this.state.X];
            let y=p.coordinates[this.state.Y];

            let left=(15 + 795*x).toString()+'px';
            let top=(809 - 795*y).toString()+'px';
            if ((x<0)&&(y>=0)){
              left=(0).toString()+'px';
            }
            if ((x>=0)&&(y<0)){
              top=(850).toString()+'px';
            }


            pJSX.push(<div className="point" key={"outer"+i}
                          style={{left:left, top : top}}
                          >
                          <img 
                            className="point" key={'image'+i}
                            onDragStart={(d)=>{
                              d.dataTransfer.setDragImage(this.state.img, 0, 0);
                            }}
                            onDrag={(d)=>{
                              if ((d.clientX!==0)&&(d.clientY!==0)){
                                d.dataTransfer.setDragImage(this.state.img, 0, 0);
                                let cp=this.state.points;
                                let x=(d.clientX-80)/795.0;
                                if (x<0){x=0;}
                                if (x>1){x=1;}
                                let y=(600-d.clientY+260)/795.0;
                                if (y<0){y=0;}
                                if (y>1){y=1;}

                                cp[i].coordinates[this.state.X]=x;
                                cp[i].coordinates[this.state.Y]=y;
                                this.setState({points:cp});  
                              }
                            }}  
                            src={getURL.getImage(p.image)} 
                            alt={p.name}/>
                        </div>
                      )
          }
      }

      retJSX.push(
        <div className="plotArea" key="parea">
          <div 
            className="plot" 
            key="plot">
            {pJSX}
          </div>
          <div className="unusedPoints" key="points">
            {unused}
          </div>
        </div>
      )
      retJSX.push(
        <div className="AxisSelectors" key="selectors">

          <select
            style={{height:'1.5rem',margin:'auto',display:'block'}}            
            onChange={(d)=>{
              let cap=this.state.allPoints.slice();
              cap[this.state.index].options=this.state.points;
              let newIndex=0;
              for (let i=0;i<cap.length;i++){
                if (cap[i].class===d.target.value){
                  newIndex=i;
                  break;
                }
              }
              this.setState(
                {
                  points:cap[newIndex].options,
                  curClass:cap[newIndex].class,
                  index:newIndex
                });
            }}
            defaultValue={this.state.curClass}
            >
            {this.state.allPoints.filter((d)=>{
              return(+d.class!==+this.state.curClass)
            }).map((d)=>{
                return(<option
                        key={'V'+d.class}
                        value={d.class}
                        >
                        {d.class}
                      </option>)
              })}
          </select>

          <p></p>

          {/* <select
            style={{height:'1.5rem',margin:'auto'}}            
            onChange={(d)=>{this.setState({Y:+d.target.value});}}
            defaultValue={this.state.Y}
            >
            {this.state.axis.filter((d)=>{
              return(+d.id!==+this.state.X)}).map((d)=>{
              return(<option
                      key={'V'+d.id}
                      value={d.id}
                      >
                      {d.name}
                    </option>)
            })}
          </select> */}

          <select
            style={{height:'1.5rem',margin:'auto'}}
            onChange={(d)=>{this.setState({X:+d.target.value});}}
            defaultValue={this.state.X}            
            >
            {this.state.axis.filter((d)=>{
              return(+d.id!==+this.state.Y)}).map((d)=>{
              return(<option
                      key={'H'+d.id}
                      value={d.id}
                      >
                      {d.name}
                    </option>)
            })}
          </select>

          <p></p>

          <button 
            style={{height:'1.5rem',margin:'auto'}}
            onClick={(d)=>{
              let cap=this.state.allPoints.slice();
              cap[this.state.index].options=this.state.points;

              var typedArray = JSON.stringify(cap);
              var blob = new Blob([typedArray], {type: 'text/json'});
              var e    = document.createEvent('MouseEvents');
              var a    = document.createElement('a');
      
              a.download = 'data.json';
              a.href = window.URL.createObjectURL(blob);
              a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
              e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              a.dispatchEvent(e);
            }}>
            Save
          </button>
          <div>
            <input
              type='file'
              id='files'
              onChange={(d)=>{
                this.setState({'file':d.target.files[0]});
              }}
            />
            <button 
              id={"import"}
              style={{height:'1.5rem',margin:'auto'}}
              onClick={(d)=>{
                if (this.state.file!==undefined){
                  var fr = new FileReader();
                  fr.onload = ()=>{ 
                    var result = JSON.parse(fr.result);
                    this.setState({allPoints:result,points:result[0].options,index:0})
                  }
                  fr.readAsText(this.state.file);
                }
              }}>
              Load
            </button>
          </div>
        </div>
        );
    }
    return (
      <div className="App">
      {retJSX}
      </div>
    );
  }
}

export default App;
