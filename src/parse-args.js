module.exports = (args) => {
  const argsObject = {
    factoryName: args[0],
    traitNames: [],
    customFillers: {},
    callback: undefined,
  };

  for (let i = 1; i < args.length; i += 1) {
    const arg = args[i];
    switch (typeof arg) {
      case 'string':
        argsObject.traitNames.push(arg);
        break;
      case 'object':
        argsObject.customFillers = arg;
        break;
      case 'function':
        argsObject.callback = arg;
        break;
      default:
        throw new Error('Arguments can be only string, object or function');
    }
  }

  return argsObject;
};
