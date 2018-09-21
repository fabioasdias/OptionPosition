
export const getURL  = {
    getAxis: () =>{
        return('axis.json');
    },
    getImage: (img) =>{
        return('./img/'+img);
    },
    getPoints: () =>{
        return('zeroPoints.json');
    }
};


export const getData = (url,actionThen) => {
    fetch(url)
    .then((response) => {
      if (response.status >= 400) {throw new Error("Bad response from server");}
      return response.json();
    })
    .then(actionThen);
}
