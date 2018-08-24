import React from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './glmap.css'


mapboxgl.accessToken = 'pk.eyJ1IjoiZGlhc2YiLCJhIjoiY2pqc243cW9wNDN6NTNxcm1jYW1jajY2NyJ9.2C0deXZ03NJyH2f51ui4Jg';



let Map = class Map extends React.Component {
  map;
    

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
      style: 'mapbox://styles/diasf/cjl767ub60f4p2rmyup3vmmw7',
      center: [-80.1469974,26.0889407],
      zoom:14
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
      this.map.flyTo({center:[e.lngLat.lng,e.lngLat.lat],zoom:16});
      var allfeatures = this.map.queryRenderedFeatures(e.point);
      console.log('all',allfeatures)
      var features = this.map.queryRenderedFeatures(e.point, { layers: ['gjlayer'] });
      if (features.length>0){
        if (this.props.clbClick!==undefined){
          this.props.clbClick(features[0].properties)
        }
      }
    });
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

    
    this.map.on('load', () => {
      if (this.props.URL!==undefined){
        console.log('Fetching',this.props.URL);
        fetch(this.props.URL)
        .then((response) => {
          if (response.status >= 400) {throw new Error("Bad response from server");}
          return response.json();
        })
        .then((ret)=>{
          console.log(ret)
          this.map.addSource('gj', {
            type: 'geojson',
            data: ret,
          });

          this.map.addLayer({
            id: 'gjlayer',
            type: 'fill',
            source: 'gj',
            paint: {'fill-color':'green',
                    'fill-opacity':0.8
                    },
          }, 'country-label-lg'); 
        });
      }
      this.setState({'map':this.map});
    });
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} 
      className={(this.props.className!==undefined)?this.props.className:"absolute top right left bottom"}
      />
    );
  }
}


export default Map;
