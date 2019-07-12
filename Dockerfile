FROM nginx:stable

ADD ./dist /usr/share/nginx/html
ADD ./importTemplate /usr/share/nginx/html/importTemplate
ADD ./QRCodeImg /usr/share/nginx/html/QRCodeImg
ADD ./shouce /usr/share/nginx/html/shouce
ADD ./2019NoteBook /usr/share/nginx/html/2019NoteBook

ADD ./f8CSClCAvP.txt /usr/share/nginx/html/f8CSClCAvP.txt
ADD ./shoucecases /usr/share/nginx/html/shoucecases

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80