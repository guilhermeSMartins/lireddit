import { UsernamePasswordInput } from 'src/resolvers/UsernamePasswordInput';

export const validateUser = (options: UsernamePasswordInput) => {
  const { email, password, username } = options;

  console.log(`
  \n${email}
  \n${password}
  \n${username}`);

  if (username.length <= 3) {
    return [
      {
        field: 'username',
        message: 'length must be greater than 3',
      },
    ];
  }

  if (username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include an @',
      },
    ];
  }

  if (!email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  if (password.length <= 2) {
    return [
      {
        field: 'password',
        message: 'length must be greater than 2',
      },
    ];
  }

  return null;
};
