FROM quay.io/raysenpai69/nezuko:latest

WORKDIR /root/nezuko

RUN git clone https://github.com/Eternity-Bots/Nezuko /root/nezuko

RUN yarn

CMD ["node", "koyeb.js"]
