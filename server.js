const express = require('express')
const app = express()
const cors = require('cors');
const session = require('express-session')
const dbService = require('./dbService');
const res = require('express/lib/response');
app.set('view-engine', 'ejs')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/static", express.static('./static/'));



app.get('/home', (req, res) => {
  res.render('home.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/register', async (req, res) => {
  try {
    console.log(req.body.email, req.body.password, req.body.firstname, req.body.lastname);
    const db = dbService.getDbServiceInstance();
    const result = db.insertUser(req.body.email, req.body.password, req.body.firstname, req.body.lastname);

    result
      .then(data => response.json({ data: data }))
      .catch(err => console.log(err));

    res.render('signupsuccessfull.ejs')

  } catch {
    res.redirect('/register');
  }

})

app.post('/login', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  var result = db.login(req.body.email, req.body.password);
  var log=false;
  result
    .then(data => {
      for (var i = 0; i < data.length; i = i + 1) {
        if (data[i].email == req.body.email && data[i].password == req.body.password) {
          data[i].k = true;
          log=true;
        }
        else {
          data[i].k = false;
        }
      }
      if(log)
      {
        res.render('output.ejs', { res: data });
      }
      else
      {
        res.redirect('/login');
      }
    }
    )
    .catch(err => console.log(err));

})

app.post('/logout', async (req, res) => {
  try {
    if(req.body.logout === '1')
    {
      res.redirect('/login');
    }
  } catch {
    res.redirect('/register');
  }

})


app.delete('/delete/:email', (request, response) => {
  const { email } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowBy(email);

  result
    .then(data => { response.json({ success: data });})
    .catch(err => console.log(err));
});

app.patch('/update', (request, response) => {
  const { email,password, firstname, lastname } = request.body;
  console.log(email,password, firstname, lastname);
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(email,password, firstname, lastname);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
  
});

app.listen(3000)