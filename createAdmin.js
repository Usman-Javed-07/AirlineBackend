const bcrypt = require('bcryptjs');
const Admin = require('./models/admin.model');  // Path to your Admin model

async function createAdmin() {
  const username = 'admin';  // Change the username as needed
  const password = 'admin*0#11';  // Change the password as needed
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      console.log('Admin already exists!');
      return;
    }

    // Create a new admin user
    await Admin.create({
      username: username,
      password: hashedPassword
    });

    console.log('Admin created successfully');
  } catch (err) {
    console.error('Error creating admin:', err);
  }
}

createAdmin();
