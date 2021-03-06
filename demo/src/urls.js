const baseURL=()=>{
    return('./');
}

export const getURL  = {
    getPoints: () =>{
        return(baseURL()+'points.json');
    },
    getAxis: () =>{
        return(baseURL()+'axis.json');
    },
    getImage: (img) =>{
        return(baseURL()+'images/'+img);
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

export const sendData=(url,data,callBackFcn)=>{
    fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *omit
        headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
        },
        method: 'POST', // *GET, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *same-origin
        redirect: 'follow', // *manual, error
        referrer: 'no-referrer', // *client
      }).then(
        ret => {
            ret.json().then((d)=> {//promise of a promise. really.
                callBackFcn(d);
            })
            
        },
        error => console.log('Error in fetching post')
    );
}
