const {Router} = require('express')
const router = Router()
const {Users} = require('../models')
const bcrypt = require('bcrypt')
const {sign} = require('jsonwebtoken')
const  {validateToken} = require('../middlewares/AuthMiddleware')

router.post('/',async(req,res) =>{
    const {username,password} = req.body
    bcrypt.hash(password,10).then((hash) =>{
        Users.create({
            username:username,
            password:hash
        })
        res.json('SUCCESS')
    })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json(accessToken);
  });
});


router.get('/auth',validateToken,(req,res) =>{
  res.json(req.user)
})

module.exports = router