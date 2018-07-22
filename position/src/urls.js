const baseURL=()=>{
    return('http://142.1.190.38:9000/');
    // return('http://daedalus.zapto.org:9000/');
    // return('http://localhost:8000/');
    //return('http://142.1.190.14/bal/')
}

export const getURL  = {
    upload: () => {
        return(baseURL()+'upload');
    },
    getPoints: () =>{
        return(baseURL()+'getPoints');
    },
    getAxis: () =>{
        return(baseURL()+'getAxis');
    },
    setPoints: () =>{
        return(baseURL()+'setPoints');
    },    
    getImage: (img) =>{
        return(baseURL()+img);
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
