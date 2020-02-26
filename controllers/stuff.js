const Thing = require('../models/thing'); //connect table schema
/*to add a file to the request, the front end needed to send the request data as form-data as opposed to JSON — 
the request body contains a  thing  string, 
which is simply a stringified  thing  object — 
we therefore need to parse it using  JSON.parse()  to get a usable object*/
/*we also need to resolve the full URL for our image, as  req.file.filename  only contains the filename segment — 
we use  req.protocol  to get the first segment ( 'http' , in this case); we add the  '://' , and then use  req.get('host')  to resolve the 
server host ('localhost:3000'  in this case); we finally add  '/images/'  and the filename to complete our URL*/
exports.createThing = (req, res, next) => {
  req.body.thing = JSON.parse(req.body.thing);
  const url = req.protocol + '://' + req.get('host');
  const thing = new Thing({
    title: req.body.thing.title,
    description: req.body.thing.description,
    imageUrl: url + '/images/' + req.file.filename,
    price: req.body.thing.price,
    userId: req.body.thing.userId
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
/*we first create a new instance of our  Thing  model with the received  _id 
 so as not to cause problems when trying to update that  Thing  in the database

if we receive a new file with the request (via  multer  ), we handle the form-data and generate the image URL

if we do not receive a new file, we simply capture the request body JSON

we save the updated  Thing  to the database*/
exports.modifyThing = (req, res, next) => {
  let thing = new Thing({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.thing = JSON.parse(req.body.thing);
    thing = {
      _id: req.params.id,
      title: req.body.thing.title,
      description: req.body.thing.description,
      imageUrl: url + '/images/' + req.file.filename,
      price: req.body.thing.price,
      userId: req.body.thing.userId
    };
  } else {
    thing = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId
    };
  }
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};