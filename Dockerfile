FROM quay.io/raysenpai69/nezuko:latest

RUN git clone https://github.com/Eternity-Bots/Nezuko /root/nezuko

WORKDIR /root/nezuko

EXPOSE 8000

RUN yarn

CMD ["node", "koyeb.js"]
