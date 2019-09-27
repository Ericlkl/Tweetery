# use node as the base images
FROM node

# Setting /app as the working directory
WORKDIR /app
# Copy all the files to /app
COPY . /app

# install concurrently in order to run both project at the same time
RUN npm install
# install client side application modules
RUN npm run client-install
# install server side application modules
RUN npm run server-install
# Generating Production build client side application
RUN npm run client-build

# EXPOSE PORT 5000
EXPOSE 5000

# Turning on the server side application 
CMD npm run server