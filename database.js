// database.js
import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('little_lemon');


export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            description TEXT,
            image TEXT,
            category TEXT
          );`,
      [],
      () => { console.log('Table created successfully'); },
      (tx, error) => { console.error('Error creating table', error); }
    );
  });
};

export const fetchMenuFromDB = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM menu;',
          [],
          (_, { rows }) => { 
            console.log('Fetched menu from DB:', rows._array); 
            resolve(rows._array); 
          },
          (tx, error) => { 
            console.error('Error fetching menu', error); 
            reject(error); 
          }
        );
      });
    });
  };
  

export const saveMenuToDB = (menuItems) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      menuItems.forEach(item => {
        tx.executeSql(
          'INSERT INTO menu (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.description, item.price, item.category, item.image],
          () => {},
          (tx, error) => {
            console.error('Error inserting menu item:', error);
            reject(error);
          }
        );
      });
      resolve();
    });
  });
};


  export const clearSQLiteData = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM menu',
          [],
          () => {
            console.log('All rows from menu table cleared.');
            resolve();
          },
          (tx, error) => {
            console.error('Error clearing rows from menuitems table', error);
            reject(error);
          }
        );
      });
    });
  };
  

  export const filterMenuByCategoryAndSearchTerm = (categories, searchTerm, callback) => {
    let query = 'SELECT * FROM menu WHERE 1=1';
    let queryParams = [];
  
    if (categories.length > 0) {
        query += ' AND (';
        categories.forEach((category, index) => {
            if (index > 0) {
                query += ' OR';
            }
            query += ' category = ?';
            queryParams.push(category);
        });
        query += ')';
    }
  
    if (searchTerm) {
        query += ' AND name LIKE ?';
        queryParams.push(`%${searchTerm}%`);
    }
  
    db.transaction(tx => {
        tx.executeSql(
            query,
            queryParams,
            (_, { rows: { _array } }) => {
                callback(_array);
            },
            (tx, error) => {
                console.error('Error filtering menu', error);
                return true;
            }
        );
    });
};


  
  
