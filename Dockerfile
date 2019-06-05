FROM nginx:stable

ADD ./dist /usr/share/nginx/html
ADD ./importTemplate /usr/share/nginx/html/importTemplate

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80