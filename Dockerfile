FROM quay.io/raysenpai69/nezuko:latest

RUN git clone https://github.com/Eternity-Bots/Nezuko /root/nezuko

WORKDIR /root/nezuko

RUN yarn

CMD ["node", "koyeb.js"]
