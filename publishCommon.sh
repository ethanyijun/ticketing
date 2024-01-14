#!/bin/bash

# Change to the "common" directory and run "npm run pub"
cd common/
npm run pub

# Go back to the parent directory
cd ..

# Change to the "tickets" directory and install the "@ethtickets/common" package
cd tickets/
npm install @ethtickets/common

# Go back to the parent directory
cd ..

# Change to the "orders" directory and install the "@ethtickets/common" package
cd orders/
npm install @ethtickets/common

cd ..

# Change to the "orders" directory and install the "@ethtickets/common" package
cd payments/
npm install @ethtickets/common


cd ..

# Change to the "orders" directory and install the "@ethtickets/common" package
cd expiration/
npm install @ethtickets/common