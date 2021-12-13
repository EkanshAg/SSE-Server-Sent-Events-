const http=require('http');
const express = require('express');
const app = express();
const ssePort=8010;
const ajaxPort=8011;
//var fs = require("fs");
let id=1;
let idAJAX=1;
let clientsCount=0;

http.createServer((req, res)=>{
  let intervalId;      
  let clientId=getUniqueID();

  res.writeHead(200,{
    'Access-Control-Allow-Origin': '*',
    'Content-Type':'text/event-stream',
    'Cache-Control':'no-cache'
  });

  switch (req.url) {
    //Server Sent Events
    case '/stream':
      intervalId=sendStream(req, res, clientId);
      break;

    default:
      // Unknown URL
      res.writeHead(404);
      res.end();
  }

    console.log("++++++++++++++++++++++++++++++++++++++++++");
    console.log("listening on port "+ssePort );
    console.log("clientsCount "+ ++clientsCount + ", clientId "+clientId) ;
    console.log("##########################################");

  req.on('close',()=>{
      //res.end();
      console.log("##########################################");
      clearInterval(intervalId);
      clientsCount--;
      console.log("connection closed....")
      console.log("clientsCount "+ clientsCount + ", clientId "+clientId) ;
      console.log("##########################################");
     
  })

  req.on('error',()=>{
    //res.end();
    console.log("##########################################");
    clearInterval(intervalId);
    clientsCount--;
    console.log("connection closed due to error....")
    console.log("clientsCount "+ clientsCount + ", clientId "+clientId) ;
    console.log("##########################################");
   
})
}).listen(ssePort);

getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

/** This function is responsible to send the data from the server to the client */
var  sendStream=(req, res, clientId)=>{
  //console.log(res);

  // res.write(`event:myEvent\n id:${id}\ndata:${clientId},  myEvent ${id}.`);
  // res.write("\n\n");

  // res.write(`event:myEvent2\n id:${id}\ndata:${clientId},  myEvent2 ${id}.`);
  // res.write("\n\n");

  res.write(`event:count\ndata:${id}`);
  res.write("\n\n");


  //res.write(`id:${id}\ndata:This is event ${id}.\ndata: My message\n\n`);
  id++;

  let intervalId=setInterval(()=>{
    // res.write(`event:myEvent\n id:${id}\ndata:${clientId},  myEvent ${id}.`);
    // res.write("\n\n");

    // res.write(`event:myEvent2\n id:${id}\ndata:${clientId},  myEvent2 ${id}.`);
    // res.write("\n\n");

    res.write(`event:counter\ndata:${id}`);
    res.write("\n\n");

    res.write(`event:sharedWorker1\ndata:${id+' sharedWorker1'}`);
    res.write("\n\n");

    res.write(`event:sharedWorker2\ndata:${id+' sharedWorker2'}`);
    res.write("\n\n");

    id++;
  },5000);

   setTimeout(()=>{
    res.write(`event:pageAction\ndata:openModal`);
    res.write("\n\n");
   },10000);

   /**
    * Don't delete:-
    * Default events: handlers are available in SDK
    */
  //  setTimeout(()=>{
  //   res.write(`event:pageAction\ndata:refresh`);
  //   res.write("\n\n");
  //  },30000);


   setTimeout(()=>{
    res.write(`event:pageAction\ndata:close`);
    res.write("\n\n");
   },60000);

   /**
    * End of default events
    */

  return intervalId;
}




/**Enable cors */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/** REST end points*/
app.get('/ajaxPoll', function (req, res) {
  let clientId=getUniqueID();

  let responseData={
    data:{
      event:"counter",
      id:clientId,
      data: idAJAX
    }
  }
  
  // let responseData=`event:myEvent\n id:${idAJAX}\ndata:${clientId},  myEvent ${idAJAX}.
  //  event:myEvent2\n id:${idAJAX}\ndata:${clientId},  myEvent2 ${idAJAX}.`
  
   console.log(responseData);
   res.end( JSON.stringify(responseData));
   idAJAX++;

   req.on('close',()=>{
    console.log("##########################################");
    console.log("connection closed....")
    console.log("##########################################");
    clearInterval(intervalId);
    clientsCount--;
})


})


let server = app.listen(ajaxPort, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})



