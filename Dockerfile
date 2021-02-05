FROM nginx:stable

ADD ./dist /usr/share/nginx/html
ADD ./aA6VkBus4m.txt /usr/share/nginx/html/aA6VkBus4m.txt
ADD ./importTemplate /usr/share/nginx/html/importTemplate

ADD ./external /usr/share/nginx/html

# ADD ./QRCodeImg /usr/share/nginx/html/QRCodeImg
# ADD ./shouce /usr/share/nginx/html/shouce
# ADD ./2019NoteBook /usr/share/nginx/html/2019NoteBook
# ADD ./f8CSClCAvP.txt /usr/share/nginx/html/f8CSClCAvP.txt
# ADD ./shoucecases /usr/share/nginx/html/shoucecases

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80