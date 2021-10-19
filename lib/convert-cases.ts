export const firstLetterUpperCase = (str: string): string => {
  return [
    str.substr(0, 1).toLocaleUpperCase(),
    str.substr(1).toLocaleLowerCase()
  ].join('')
}

export const convertUnderlineToCamelCase = (str: string): string => {
  return str.split('_').map((chunk, index) => {
    if (index === 0) {
      return chunk;
    }

    return firstLetterUpperCase(chunk)
  }).join('');
}