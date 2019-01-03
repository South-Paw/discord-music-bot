const defaultGlobalPermissions = {
  help_command: true,
  setAvatar_command: false,
  setUsername_command: false,
};

const defaultGroupPermissions = {
  admin: {
    ...defaultGlobalPermissions,
    setAvatar_command: true,
    setUsername_command: true,
  },
};

module.exports = { defaultGlobalPermissions, defaultGroupPermissions };
