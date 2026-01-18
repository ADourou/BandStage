const express = require('express');
const session = require('express-session');
const path = require('path');
const { getReviews, updateReviewStatus, deleteReview, checkBand } = require('./databaseQueriesReviews');
const { initDatabase, dropDatabase } = require('./database');
const { insertUser, insertBand, insertReview, insertMessage, insertPublicEvent, insertPrivateEvent } = require('./databaseInsert');
const { users, bands, public_events, private_events, reviews, messages } = require('./resources');
const { getAllUsers, getUserByCredentials, updateUser, deleteUser } = require('./databaseQueriesUsers');
const { getAllBands, getBandByCredentials, updateBand, deleteBand } = require('./databaseQueriesBands');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json()); // read JSON 
app.use(express.urlencoded({ extended: true })); //form data

app.use(session({
  secret: 'secret-key-123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Route to serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});




app.get('/initdb', async (req, res) => {
  try {
    const result = await initDatabase();
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/insertRecords', async (req, res) => {
  try {
    for (const user of users)
      var result = await insertUser(user);
    for (const band of bands)
      var result = await insertBand(band);
    for (const pev of public_events)
      var result = await insertPublicEvent(pev);
    for (const rev of reviews)
      var result = await insertReview(rev);
    for (const priv of private_events)
      var result = await insertPrivateEvent(priv);
    for (const msg of messages)
      var result = await insertMessage(msg);
    res.send(result);
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message);
  }
});


app.get('/dropdb', async (req, res) => {
  try {
    const message = await dropDatabase();
    res.send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/users/details', async (req, res) => {
  const { username, password } = req.query;

  // console.log("Username:", username);
  // console.log("Password:", password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {

    let results = await getUserByCredentials(username, password);
    let role = 'user';

    if (results.length === 0) {
      results = await getBandByCredentials(username, password);
      role = 'band';
    }

    if (results.length > 0) {
      const user = results[0];

      user.role = role;
      user.id = user.user_id || user.band_id;
      req.session.loggedUser = user;


      res.json(user);
    } else {
      res.status(401).json({ error: 'User not exists or incorrect password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/register', async (req, res) => {
  const userData = req.body; // get data from frontend

  // console.log("data we got:", userData);

  if (userData.lat) userData.lat = parseFloat(userData.lat);
  if (userData.lon) userData.lon = parseFloat(userData.lon);

  try {
    // database function to insert the user
    await insertUser(userData);

    res.status(200).json({ message: "Your registration was successfull" });

  } catch (error) {
    console.error(error);
    // check if error is because username/email already exists
    if (error.code === 'ER_DUP_ENTRY' || error.message.includes('Duplicate')) {
      res.status(409).json({ message: "Username or Email already exists." });
    } else {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  }
});

// route for band reg
app.post('/registerBand', async (req, res) => {
  const bandData = req.body;

  try {
    await insertBand(bandData);


    res.status(200).json({ message: "Your registration was successfull" });

  } catch (error) {
    console.error(error);
    // check for duplicates
    if (error.code === 'ER_DUP_ENTRY' || error.message.includes('Duplicate')) {
      res.status(409).json({ message: "Username or Email already exists." });
    } else {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  }
});

// route to check if user is logged in 
app.get('/check-login', (req, res) => {
  if (req.session.loggedUser) {
    res.json({ loggedIn: true, user: req.session.loggedUser });
  } else {
    res.json({ loggedIn: false });
  }
});

// route for Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.json({ message: "Logout successful" });
  });
});


app.post('/updateUser', async (req, res) => {
  if (!req.session.loggedUser) {
    return res.status(401).json({ message: "Δεν είστε συνδεδεμένος." });
  }

  //username from session not body (safety)
  const username = req.session.loggedUser.username;
  const updateData = req.body;


  delete updateData.username;
  delete updateData.email;

  if (updateData.lat) updateData.lat = parseFloat(updateData.lat);
  if (updateData.lon) updateData.lon = parseFloat(updateData.lon);

  try {
    await updateUser(username, updateData);

    //update session with new info 
    req.session.loggedUser = { ...req.session.loggedUser, ...updateData };

    res.json({
      message: "Info updated succesfully.",
      user: req.session.loggedUser
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "error server: " + error.message });
  }
});



app.post('/review', async (req, res) => {
    const data = req.body;

   
    const exists = await checkBand(data.band_name);
    if (!exists) {
        return res.status(404).json({ message: "Band not found" });
    }

    
    data.status = 'pending';
    data.date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        await insertReview(data); 
        res.status(200).json({ message: "Review added (pending)" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/reviews/:band_name', async (req, res) => {
    const bandName = req.params.band_name;
    const rFrom = req.query.ratingFrom;
    const rTo = req.query.ratingTo;

    try {
        const results = await getReviews(bandName, rFrom, rTo);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.put('/reviewStatus/:review_id/:status', async (req, res) => {
    const id = req.params.review_id;
    const status = req.params.status;

    try {
        const result = await updateReviewStatus(id, status);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Status updated" });
        } else {
            res.status(404).json({ message: "Review ID not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.delete('/reviewDeletion/:review_id', async (req, res) => {
    const id = req.params.review_id;

    try {
        const result = await deleteReview(id);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Review deleted" });
        } else {
            res.status(404).json({ message: "Review ID not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});