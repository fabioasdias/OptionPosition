import React, { Component } from 'react';
import {getData,getURL, sendData} from './urls';
import './App.css';
import FileUploadProgress  from 'react-fileupload-progress';
// import Draggable from 'react-draggable';

class App extends Component {
  constructor(props){
    super(props);
    let dragImg = new Image(0,0);
    dragImg.src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    this.state={points:[],axis:undefined, img : dragImg}
  }
  componentDidMount(){
      getData(getURL.getAxis(),(ax)=>{
        this.setState({axis:ax,X:0,Y:1});
    });
    getData(getURL.getPoints(),(st)=>{
      this.setState({points:st});
    });
  }
  render() {
    console.log(this.state);
    let retJSX=[];
    if (this.state.axis!==undefined){        
      let pJSX=[];
      let unused=[];
      pJSX.push(<p key='ly'
                  className="labelY"
                >
                {"(-)"+this.state.axis[this.state.Y].name+" (+) "}
                </p>
                );
      pJSX.push(<p key='lx'
                  className="labelX"
                >
                {"(-)"+this.state.axis[this.state.X].name+" (+) "}
                </p>
                )


      for (let i=0;i<this.state.points.length;i++){
          let p=this.state.points[i];
          if ((p.coordinates[this.state.X]===-1) && (p.coordinates[this.state.Y]===-1)){
            unused.push(<img 
                          className="availablePoint" 
                          onClick={(d)=>{
                            let cp=this.state.points;
                            cp[i].coordinates[this.state.X]=0;
                            cp[i].coordinates[this.state.Y]=0;
                            this.setState({points:cp});
                          }}
                          key={'U'+p.id}
                          data-pid={p.id}
                          src={getURL.getImage(p.image)} 
                          alt={p.name}/>
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
          </select>
          <div style={{width:'50px'}}></div>
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
          <div style={{width:'100px'}}></div>
          <button 
            style={{height:'1.5rem',margin:'auto'}}
            onClick={(d)=>{
              sendData(getURL.setPoints(),this.state.points,(ret)=>{
                console.log(ret);
              });
            }}>
            Save
            </button>

            <FileUploadProgress 
            key='fup' 
            url={getURL.upload()}
            // onProgress={(e, request, progress) => {
            //     console.log('progress', e, request, progress);
            // }}
            onLoad={ (e, request) => {
                let data=JSON.parse(e.target.response);
                console.log(data);
                if (data.status==='ok'){
                    getData(getURL.getPoints(),(st)=>{
                      console.log('points',st);
                      this.setState({points:st});
                  })            
                }
            }}
            onError={ (e, request) => {console.log('error', e, request);}}
            onAbort={ (e, request) => {console.log('abort', e, request);}}
          />        
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
