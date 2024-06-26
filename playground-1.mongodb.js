const database = 'Store';
const collections = ['Products','Orders','Customers','Suppliers'];

use(database);





db.Products.find({name:'Wireless Mouse'}).pretty()

    