const bcrypt = require("bcryptjs");

// Replace with actual values from DB and login attempt
const storedHashedPassword = "$2a$10$yourHashedPasswordFromDBHere";
const enteredPassword = "yourTestPassword";

async function testPasswordMatch() {
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    console.log("Password Match:", isMatch);
}

testPasswordMatch();
