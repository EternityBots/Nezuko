FROM quay.io/raysenpai69/nezuko:latest

WORKDIR /root/nezuko

COPY . /root/nezuko

RUN yarn

CMD ["node", "koyeb.js"]
