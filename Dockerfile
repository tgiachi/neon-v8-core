# dockerfile
FROM node:slim

WORKDIR /app

# copy only node_modules/the-repo-package into the image because .dockerignore
# COPY "./node_modules" "/app/node_modules"
COPY ["./package.json", "./package-lock.json", "/app/"]

# because the package is existed in node_modules, so npm skips installing it
# use --production to only install the packages of dependencies
# can't use ci command because ci command only support install whole packages
RUN npm install --production

CMD [ "npm", "run", "start" ]
