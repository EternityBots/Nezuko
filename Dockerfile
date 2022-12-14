FROM raysenpai/nezuko:latest

RUN npm install -g npm@latest

WORKDIR /root/nezuko

COPY . /root/nezuko

RUN yarn

CMD ["node", "koyeb.js"]
