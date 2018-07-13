import React, { Component } from 'react';
import {getData,getURL} from './urls';
import './App.css';
import FileUploadProgress  from 'react-fileupload-progress';

class App extends Component {
  constructor(props){
    super(props);
    this.state={points:[],axis:undefined}
  }
  componentDidMount(){
      getData(getURL.getAxis(),(ax)=>{
        this.setState({axis:ax,H:0,V:1});
    });
    getData(getURL.getPoints(),(st)=>{
      this.setState({points:st});
    });
  }
  render() {
    console.log(this.state);
    let retJSX=[];
    if (this.state.axis!==undefined){
      retJSX.push(
          <div className="AxisSelectors" key="selectors">
            <select
              onChange={(d)=>{this.setState({V:+d.target.value});}}
              defaultValue={this.state.V}
              >
              
              {this.state.axis.map((d)=>{
                return(<option
                        key={'V'+d.id}
                        value={d.id}
                        >
                        {d.name}
                      </option>)
              })}
            </select>
            <select
              onChange={(d)=>{this.setState({H:+d.target.value});}}
              defaultValue={this.state.H}            
              >
              {this.state.axis.map((d)=>{
                return(<option
                        key={'H'+d.id}
                        value={d.id}
                        >
                        {d.name}
                      </option>)
              })}
            </select>
        </div>);
        
      let pJSX=[];
      let unused=[];
      for (let i=0;i<this.state.points.length;i++){
          let p=this.state.points[i];
          if ((p.coordinates[this.state.H]===-1) && (p.coordinates[this.state.V]===-1)){
            unused.push(<img className="point" style={{position:'relative'}}  src={getURL.getImage(p.image)} alt={p.name}></img>);
          } else {
            console.log({left:200+p.coordinates[this.state.V],top:200+p.coordinates[this.state.H]})
            pJSX.push(<div 
                        className="point"
                        style={{left:200+p.coordinates[this.state.V],top:200+p.coordinates[this.state.H]}}
                        >
                        <img src={getURL.getImage(p.image)} alt={p.name}></img>
                      </div>)
          }
      }

      retJSX.push(
        <div className="plotArea" key="parea">
          <div className="plot" key="plot">
          </div>
          <div className="unusedPoints" key="points">
            {unused}
          </div>
        </div>
      )

      retJSX.push(<div key="outer">
                    {pJSX}
                  </div>)



      retJSX.push(
        <div className="AxisSelectors" key="outerouter">
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
