export function neonService(constructorFunction: Function) {
  console.log(`test ${constructorFunction}`);
}

export function neonComponent(
  name: string,
  version: string,
  serviceName: string,
) {
  return function (constructor: Function) {
    constructor.prototype.name = name;
    constructor.prototype.version = version;
    constructor.prototype.serviceName = serviceName;
  };
}
