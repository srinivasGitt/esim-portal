#base image
FROM node:16 as build

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --save --legacy-peer-deps
RUN npm install angular-password-strength-meter
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
