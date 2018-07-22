import React, { Component } from 'react';
import './App.css';
import {getData,getURL, sendData} from './urls';
import Map from './glmap.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state={axis:undefined,points:[],cprops:undefined};
  }
  componentDidMount(){
    getData(getURL.getAxis(),(ax)=>{
      this.setState({axis:ax});
    });
    getData(getURL.getPoints(),(st)=>{
      this.setState({points:st});
    });
  }
  render() {

    let clbClick=(props)=>{
      this.setState({cprops:props});
    };
    let opts=[];

    if (this.state.cprops!==undefined){
      opts=this.state.points.map((d)=>{
        let E=0;
        for (let i=0;i<this.state.axis.length;i++){
          let cV=+this.state.cprops[this.state.axis[i].var];
          let cMin=this.state.axis[i].min;
          let cDelta=this.state.axis[i].max-this.state.axis[i].min;
          E=E+(+d.coordinates[i]-(cV-cMin)/(cDelta))**2;
        }
        return({...d,E:Math.sqrt(E)});
      });  

      opts.sort((a,b)=>{return(a.E>b.E)});      
      console.log(opts);
    }
    

    return (
      <div className="App">
        <Map 
          URL={"./demo.geojson"}
          clbClick={clbClick}
        />
        <div className="options">
          {opts.map((d)=>{
            return(
              <div className="opt">
                <p>{d.name}</p>
                <img 
                  className="optImg"
                  src={getURL.getImage(d.image)} 
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
