var ObjectId = require('mongodb').ObjectId;

var call = module.exports = {

    /* List Customers */
    listCustomers: function (db, res) {

        db.collection("customers").aggregate([
            { $project: 
                {
                    "firstName": 1,
                    "lastName" : 1,
                    "street" : 1,
                    "postcode" : 1,
                    "city" : 1,
                    "country" : 1,
                    "phoneNumber" : 1,
                    "insensitive": { "$toLower": "$lastName" }
                }
            },
            { "$sort": { "insensitive": 1 } }
        ]).toArray((err, result) => {
            if (err) throw err;
            res.status(200).send(result);
        }); 
    },

    /* List Products */
    listProducts: function (db, res) {
        db.collection("products").aggregate([
            { $project: 
                {
                    "title": 1,
                    "year" : 1,
                    "origin" : 1,
                    "quantity" : 1,
                    "available" : 1,
                    "buyingPrice" : 1,
                    "salePrice" : 1,
                    "insensitive": { "$toLower": "$title" }
                }
            },
            { "$sort": { "insensitive": 1 } }
        ]).toArray((err, result) => {
            if (err) throw err;
            result.map(item => {
                if(item.quantity > 0) {
                    item.available = true;
                } else {
                    item.available = false;
                }
            })
            res.status(200).send(result);
        }); 
    },

    /* List Suppliers */
    listSuppliers: function (db, res) {
        db.collection("suppliers").aggregate([
            { $project: 
                {
                    "firstName": 1,
                    "lastName" : 1,
                    "street" : 1,
                    "postcode" : 1,
                    "city" : 1,
                    "country" : 1,
                    "phoneNumber" : 1,
                    "insensitive": { "$toLower": "$lastName" }
                }
            },
            { "$sort": { "insensitive": 1 } }
        ]).toArray((err, result) => {
            if (err) throw err;
            res.status(200).send(result);
        }); 
    },

    /* Create Customer */
    createCustomer: function (db, res, customerData) {
        db.collection('customers').insert({
            "firstName" : customerData.firstName,
            "lastName" : customerData.lastName,
            "street" : customerData.street,
            "postcode" : customerData.postcode,
            "city" : customerData.city,
            "country" : customerData.country,
            "phoneNumber" : customerData.phoneNumber
        }, (err, result) => {
            if (err) throw err;
            res.status(200).send(true);
        });
    },

    /* Create Product */
    createProduct: function (db, res, productData) {
        if ( isNaN(parseInt(productData.quantity)) || parseInt(productData.quantity) < 0) {
            res.status(200).send(false);
        } else {
            db.collection('products').insert({
                "title" : productData.title,
                "year" : productData.year,
                "origin" : productData.origin,
                "quantity" : parseInt(productData.quantity),
                "buyingPrice" : parseFloat(productData.buyingPrice),
                "salePrice" : parseFloat(productData.salePrice)
            }, (err, result) => {
                if (err) throw err;
                res.status(200).send(true);
            });
        }
    },

    /* Create Supplier */
    createSupplier: function (db, res, supplierData) {
        db.collection('suppliers').insert({
            "company" : supplierData.company,
            "firstName" : supplierData.firstName,
            "lastName" : supplierData.lastName,
            "street" : supplierData.street,
            "postcode" : supplierData.postcode,
            "city" : supplierData.city,
            "country" : supplierData.country,
            "phoneNumber" : supplierData.phoneNumber
        }, (err, result) => {
            if (err) throw err;
            res.status(200).send(true);
        });
    },

    /* Delete Customer */
    deleteCustomer: function (db, res, customerId) {
        db.collection("customers").remove({ _id : new ObjectId(customerId) }, (err, docs) => {
            if (err) throw err;
            res.status(200).send(true);
        });
    },

    /* Delete Product */
    deleteProduct: function (db, res, productId) {
        db.collection("products").remove({ _id : new ObjectId(productId) }, (err, docs) => {
            if (err) throw err;
            res.status(200).send(true);
        });
    },

    /* Delete Supplier */
    deleteSupplier: function (db, res, supplierId) {
        db.collection("suppliers").remove({ _id : new ObjectId(supplierId) }, (err, docs) => {
            if (err) throw err;
            res.status(200).send(true);
        });
    },

    /* Increase Product */
    increaseProduct: function (db, res, productId) {
        db.collection("products").update(
            { 
                _id: ObjectId(productId) 
            },
            { 
                $inc: { quantity: 1, } 
            }, 
            (err, result) => {
                if (err) throw err;
                res.status(200).send(true);
            }
        );
    },

    /* Decrease Product */
    decreaseProduct: function (db, res, productId) {
        db.collection("products").findOne(
            { 
                _id: ObjectId(productId) 
            }, 
            (err_find_product, res_find_product) => {
                if (err_find_product) err_find_product;
                if(res_find_product.quantity > 0) {
                    res_find_product.quantity = res_find_product.quantity - 1;
                    db.collection("products").update(
                        { 
                            _id: ObjectId(productId) 
                        },
                        { 
                            $set: {
                                "quantity": res_find_product.quantity
                            }
                        }, 
                        (err_update_product, res_update_product) => {
                            if (err_update_product) throw err_update_product;
                        }
                    );
                }
                res.status(200).send(true);
          });
    },
    

}
