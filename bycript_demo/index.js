const bcrypt = require('bcrypt');
const hashPassword = async (pw) => {
    const salt = await bcrypt.genSalt(10)
    console.log(salt);
    const hash = await bcrypt.hash(pw, salt)
    console.log(hash);
}

// hashPassword('password')

const comparePassword = async (pw, hash) => {
    const compare = await bcrypt.compare(pw, hash)
    console.log(compare);
}

comparePassword('password', '$2b$10$MOswWcHXdCdKOL4s5L/AvuiCrAqqNTHBIw.BEaLKQ0Ez6vj7WqWae')