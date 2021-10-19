export const isServer = () => typeof window === 'undefined';
export const isBrowser = () => !isServer();

export const getServerEnv = () => {
  return {
    jwtPasscode: process.env.ACCESS_TOKEN_PASSCODE as string,
    hostname: process.env.NEXT_PUBLIC_HOSTNAME as string,
    matrixServerUrl: process.env.NEXT_PUBLIC_MATRIX_URL as string,
    matrixUser1Id: process.env.NEXT_PUBLIC_MATRIX_USER_1_ID as string,
    matrixUser2Id: process.env.NEXT_PUBLIC_MATRIX_USER_2_ID as string,
    matrixUser1Password: process.env.MATRIX_USER_1_PASSWORD as string,
    matrixUser2Password: process.env.MATRIX_USER_2_PASSWORD as string,
  }
}

export const getBrowserEnv = () => {
  return {
    hostname: process.env.NEXT_PUBLIC_HOSTNAME as string,
    matrixServerUrl: process.env.NEXT_PUBLIC_MATRIX_URL as string,
    matrixUser1Id: process.env.NEXT_PUBLIC_MATRIX_USER_1_ID as string,
    matrixUser2Id: process.env.NEXT_PUBLIC_MATRIX_USER_2_ID as string,
  }
}

export const getEnv = () => {
  if (isBrowser()) {
    return getBrowserEnv()
  } else {
    return getServerEnv()
  }
}