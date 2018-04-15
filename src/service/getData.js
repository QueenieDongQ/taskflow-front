export const getData = (that, url,callback = undefined) => {

  that.$http.get(url).then(response => {
    // get body data
    if(response.data.code != 0) {
      // this.notify(response.data.error);
      alert(response.data.error);
      return;
    }
    let data = response.data.data;
    if(callback) {
      callback(data);
    }else {
      return data;
    }

  }, error=> {
    // error callback
    // that.notify(error)
    alert(error);
  });
};


export const people = getData(this,"api/user/all")
