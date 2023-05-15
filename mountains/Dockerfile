FROM nginx:stable-alpine3.17-slim
ENV NODE_ENV production
COPY ./build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD nginx -g 'daemon off;'