var chunktime = 1800;
const daily = [];
const weekly = [];
var data = [];
var calendar = [];
var test = false;

function main()
{
  if(!test) {
    navigator.geolocation.getCurrentPosition(savePosition);
  }
  document.getElementById('demo').innerHTML = "Process "+localStorage.length+ " data points!";
  setTimeout(main, 1000);
}

function savePosition(position)
{
localStorage.setItem(localStorage.length,JSON.stringify([position.coords.latitude, position.coords.longitude, position.timestamp]));
}

function clearMem()
{
  while (document.getElementById("list").hasChildNodes) {
    elementToBeRemoved = document.getElementById('child');
    elementToBeRemoved.remove()
  }
  localStorage.clear()
}

function process()
{
  const chunks = [];
  var start = startTime(); // compute start of last month
  var i = 0, amount, biggest,location;
  while (JSON.parse(localStorage.getItem(i))[2] < start)
    {
      i++;
    }

  for(var chunk = 0; chunk < 4*7*24*2; chunk++)
  {
    var inc = 0;
    data[chunk] = [NaN,NaN,NaN];
    while(i<localStorage.length && JSON.parse(localStorage.getItem(i))[2] < start + (chunk+1)*chunktime)
    { 
      chunks[inc]=JSON.parse(localStorage.getItem(i));
      i++;
      inc++;
    }    
    biggest = -1;
    for(var a = 0; a<chunks.length;a++) {
      amount = 0;
      for(var b = 0; b<chunks.length;b++) {
        if(isClose(chunks[a][0],chunks[b][0],chunks[a][1],chunks[b][1])) {
          amount++;
        }
      }
      if(amount>biggest) {
        biggest = amount;
        location = chunks[a];
      }
    }
    data[chunk]=location;
  }  
}

function getDaily() {
  var location;
  for(var i = 0; i<48;i++) {
    biggest = -1;
    for(var j = 0; i+48*j<data.length;j++) {
      amount = 0;
      location = data[i+48*j];
      for(var k = 0; i+48*k<data.length;k++) {
      if(!isNaN(data[i+48*j][0])&&!isNaN(data[i+48*k][0])&&isClose(data[i+48*j][0],data[i+48*k][0],data[i+48*j][1],data[i+48*k][1])) {
          amount++;
        }
      }
      if(amount>biggest) {
        biggest=amount;
        location = data[i+48*j];
      }
    }
    if(biggest > 14) {
      daily[i] = location;
    } 
    else {
      daily[i] = [NaN,NaN,NaN];
    }
  }
}

function getWeekly() {
  var location;
  for(var i = 0; i<48*7;i++) {
    biggest = -1;
    for(var j = 0; i+48*7*j<data.length;j++) {
      amount = 0;
      location = data[i+48*7*j];
      for(var k = 0; i+48*7*k<data.length;k++) {
      if(!isNaN(data[i+48*7*j][0])&&!isNaN(data[i+48*7*k][0])&&isClose(data[i+48*7*j][0],data[i+48*7*k][0],data[i+48*7*j][1],data[i+48*7*k][1])) {
          amount++;
        }
      }
      if(amount>biggest) {
        biggest=amount;
        location = data[i+48*7*j];
      }
    }
    if(biggest > 2) {
      weekly[i] = location;
    } 
    else {
      weekly[i] = [NaN,NaN,NaN];
    }
  }
}

function getCalendar() {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const amPm = ["AM","PM"];

  process();

  getDaily();

  getWeekly();

  calendar = [];
  for(var i = 0; i<daily.length;i++) {
    if(!isNaN(daily[i][0])) {
      calendar[calendar.length] = ["Daily",("0"+(Math.floor(daily[i][2]/3600-1)%12+1)).slice(-2)+":"+("0"+(Math.floor(daily[i][2]/60)%60)).slice(-2)+amPm[Math.floor(daily[i][2]/43200)%2], daily[i][0],daily[i][1]];
    }
  }
  for(var i = 0; i<weekly.length;i++) {
    if(!isNaN(weekly[i][0])) {
      calendar[calendar.length] = [days[Math.floor(weekly[i][2]/48)%7],("0"+(Math.floor(weekly[i][2]/3600-1)%12+1)).slice(-2)+":"+("0"+(Math.floor(weekly[i][2]/60)%60)).slice(-2)+amPm[Math.floor(weekly[i][2]/43200)%2], weekly[i][0],weekly[i][1]];
    }
  }
  //for(var i = 0;i<calendar.length;i++){
    //addDate(calendar[i]);
  //}
  addDate(calendar)
}

function isClose(lat1, lat2, lon1, lon2)
{
  return (Math.abs(lat1-lat2)+Math.abs(lon1-lon2) < 0.005);
}

function startTime()
{
  if (test) {
    return 0;
  }
  else {
    return (Math.floor((Date.now()-273600)/604800)-4)*604800+273600;
  }
}

function testMode() {
  localStorage.clear();
  
  if (!test) {
    for(var i = 0; i < 4*7*24*6; i++) {
      if(i%(48*3) == 0||i%(48*3) == 1||i%(48*21) == 2) {
        localStorage.setItem(i,JSON.stringify([0, 5, i*600]))
      }
      localStorage.setItem(localStorage.length,JSON.stringify([0, Math.floor(Math.random() * 100), i*600]));
    }
    document.getElementById('test').innerHTML = "testing";
  }
  else {
    document.getElementById('test').innerHTML = "standard";
  }
  test = !test;
}

function addDate(date) {
  var x = document.createElement("P");
  x.id = "child";
  var t = document.createTextNode(date);
  x.appendChild(t);
  document.getElementById("list").appendChild(x);
}