import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './glmap.css';


mapboxgl.accessToken = 'pk.eyJ1IjoiZGlhc2YiLCJhIjoiY2pqc243cW9wNDN6NTNxcm1jYW1jajY2NyJ9.2C0deXZ03NJyH2f51ui4Jg';


let Map = class Map extends React.Component {
  constructor(props){
    super(props);
    this.state={map:{}};
  }

  componentDidUpdate() {
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.moving!==undefined)&&(this.moving)){
      return;
    }
    if (nextProps.boundsCallback!==undefined){
      nextProps.boundsCallback(undefined);
    }
  }


  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: 'mapbox://styles/diasf/cjl767ub60f4p2rmyup3vmmw7',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-80.1469974,26.0889407],
      zoom:10
    });

    let BoundsChange=(d)=>{
      if (d.originalEvent!==undefined){//&&(this.moving===false))  
        if (this.props.boundsCallback!==undefined){
          this.props.boundsCallback(this.map.getBounds());
        }
      }
    }

    this.map.on('dragend', BoundsChange);
    this.map.on('zoomend', BoundsChange);    
    this.map.on('movestart',()=>{this.moving=true;});
    this.map.on('moveend',()=>{this.moving=false;});
    this.map.on('click',(e)=>{
        // this.map.flyTo({center:[e.lngLat.lng,e.lngLat.lat]});
        // let layerName=
        var features = this.map.queryRenderedFeatures(e.point, 
            { 
              layers: ['broward'] 
            });
        console.log(features);
        if (features.length>0){
          if (this.props.clbClick!==undefined){
            let cData={};
            cData.fld_height=JSON.parse(features[0].properties.fld_height).avg;
            this.props.clbClick(cData);
          }
        }  
    });    
    this.map.on('load', () => {
      this.map.addLayer({
        "id": "broward",
        "type": "fill",
        "source": {
            type: 'vector',
            url: 'mapbox://diasf.66ka8y3f'
        },
        "source-layer": "r06_228-aqrjcd",
        paint: {
          'fill-color':'lightgray',
          'fill-outline-color':'black',
          'fill-opacity' : 0.5,
        }            
  }, 'country-label-lg'); 
      this.setState({'map':this.map});
    });
  }
    //fld_height, sat_idx_1, sat_idx_2, wtr_storag, storm_surg
    // const a={acres:15.236,
    //   actyrblt:1955,
    //   addr1:"800 SE 28 ST",
    //   broward_de:4.97569,
    //   city:"DANIA BEACH",
    //   climate_zo:6,
    //   descript:"INDUSTRIAL STORAGE (FUEL, EQUIP, AND MATERIAL)",
    //   effyrblt:1940,
    //   fld_height:0,
    //   fld_zone:"X",
    //   fld_zone_i:0,
    //   hydric:"null",
    //   id:765666,
    //   link:"16 - 504223000220",
    //   lndsqfoot:663755,
    //   lndval:5244420,
    //   lspos_desc:"Urban or Made Lands",
    //   lucode:"049",
    //   sat_idx_1:41,
    //   sat_idx_2:100,
    //   shwt_durat:"null",
    //   shwt_range:"highly variable",
    //   static_bfe:-9999,
    //   storm_su_1:20,
    //   storm_surg:5,
    //   wtr_storag:1,
    //   zip:33316,
    //   zone_subty:"AREA OF MINIMAL FLOOD HAZARD"
    // };


  render() {
    return (
      <div ref={el => this.mapContainer = el} 
      className={(this.props.className!==undefined)?this.props.className:"absolute top right left bottom"}
      />
    );
  }
}


export default Map;
