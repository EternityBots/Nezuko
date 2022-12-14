FROM raysenpai/nezuko:latest

WORKDIR /root/nezuko

COPY . /root/nezuko

EXPOSE 8080 

RUN yarn

CMD ["node", "koyeb.js"]
