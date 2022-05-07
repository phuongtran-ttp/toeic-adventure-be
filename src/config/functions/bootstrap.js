const roleServices = require('../../services/role.services');

const DEFAULT_ROLES = [{
  name: 'Authenticated',
  desc: 'The role for users who authenticated'
}];

module.exports = async () => {
  // create default roles
  const createRolesPromises = DEFAULT_ROLES.map(async (role) => {
    const existedRole = await roleServices.findOne({
      name: role.name,
    });

    if (!existedRole) {
      console.log('Created role: ' + role.name);
      return await roleServices.create(role);
    }
  });
  await Promise.all(createRolesPromises)
};