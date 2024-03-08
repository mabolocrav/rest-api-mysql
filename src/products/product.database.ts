import {Product, UnitProduct, Products} from "./product.interface";
import { v4 as random} from "uuid"
import fs from "fs"
import mysql from "mysql";

/* let products : Products = loadProducts()

function loadProducts(): Products{
    try{
        const data = fs.readFileSync('./products.json', 'utf-8')
        return JSON.parse(data)
    }catch(error){
        console.log(`Error ${error}`)
        return {}
    }
}

function saveProducts(){
    try{
        fs.writeFileSync('./products.json', JSON.stringify(products), 'utf-8')
        console.log(`Products saved successfully`)
    }catch(error){
        console.log(`Error ${error}`)
    }
}
 */
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "api_db" // Your MySQL database name
});

const FIND_BY_ID = "SELECT * FROM products WHERE id = ?";
const INSERT_NEW_PRODUCT = "INSERT INTO products (id, name, quantity, price) VALUES (?, ?, ?, ?)";
const UPDATE_PRODUCT_BY_ID = "UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?";
const DELETE_PRODUCT_BY_ID = "DELETE FROM products WHERE id = ?";
const FIND_ALL_PRODUCTS = "SELECT * FROM products";

export const findAll = async (): Promise<UnitProduct[]> => {
    return new Promise((resolve, reject) => {
        db.query(FIND_ALL_PRODUCTS, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

/* export const findAll = async() : Promise<UnitProduct[]> => Object.values(products)

export const findOne = async (id : string) : Promise<UnitProduct> => products[id]

export const create = async (productInfo : Product) : Promise<null | UnitProduct> =>{

    let id = random()

    let product = await findOne(id)

    while(product){
        id = random()
        await findOne(id)
    }

    products[id] = {
        id : id,
        ...productInfo
    }

    saveProducts()

    return products[id]
}
 */
export const findOne = async (id: string): Promise<UnitProduct | null> => {
    return new Promise((resolve, reject) => {
        db.query(FIND_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results && results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null);
            }
        });
    });
}

export const create = async (productInfo: Product): Promise<UnitProduct | null> => {
    return new Promise((resolve, reject) => {
        const id = random();
        const { name, quantity, price } = productInfo;
        db.query(INSERT_NEW_PRODUCT, [id, name, quantity, price], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, ...productInfo });
        });
    });
}
export const update = async (id: string, updateValues: Product): Promise<UnitProduct | null> => {
    return new Promise((resolve, reject) => {
        db.query(UPDATE_PRODUCT_BY_ID, [updateValues.name, updateValues.quantity, updateValues.price, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, ...updateValues });
        });
    });
}

export const remove = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.query(DELETE_PRODUCT_BY_ID, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
/* export const update = async(id:string, updateValues : Product) : Promise <UnitProduct | null> => {
    
    const product = await findOne(id)

    if(!product){
        return null
    }

    products[id] = {
        id,
        ...updateValues
    }

    saveProducts()

    return products[id]
}

export const remove = async (id : string) : Promise <null | void > => {

    const product = await findOne(id)

    if(!product){
        return null
    }

    delete products[id]

    saveProducts()
}
*/