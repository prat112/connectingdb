const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user =>{
        //adding a new object to the request field
        //and not overidding it
        //user in the right is an sequelize object with all sequelize functionalities
        req.user = user;
        next();
        //this req.user will be user by Product.create
        //for linking userID in Product table
    })
    .catch(err=> console.log(err))
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//Association
//A user has created a product but  has not purchased it yet
//second argument defines how the relationship will be managed
//CASCADE- means if the user is deleted, all the products created by it will be deleted too. 
Product.belongsTo(User,{contraints:true , onDelete: 'CASCADE'});
User.hasMany(Product);//optional
User.hasOne(Cart);
Cart.belongsTo(User);
// This only works when there is an intermediate table
//that connects the two table and stores combination of 
//product id and cart id
Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart , {through : CartItem});


//sync method syncs the models to the database
// by creating an appropiate table
sequelize.sync(/*{force:true}*/)
//{force : true} inside sync :drops the existing tables
.then(result =>{
    return User.findByPk(1)
    //console.log(result);
   
})
.then( user =>{
    if(!user){
        User.create({name:'Pattu', 
        email:'pattu@gmail.com'
        })
    }
    return user;
})
.then(user =>{
    console.log(user);
    return user.createCart();
    
})
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err));