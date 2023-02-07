#base image
FROM node:16.13.0 as build

WORKDIR /app

COPY package.json /app/package.json
RUN npm install -g npm@9.4.1
RUN npm install
RUN npm install -g @angular/cli@11.2.3

COPY . /app

RUN ng build 

# base image
FROM nginx:1.16.0-alpine

COPY ./nginx-docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/esim-managment-portal/ /usr/share/nginx/html

EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
