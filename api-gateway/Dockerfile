# API Gateway Dockerfile
FROM node:18-alpine

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install --production

# 타입스크립트 컴파일
RUN npm install -D typescript ts-node
COPY . .
RUN npm run build

EXPOSE 3000

# 시작 명령
CMD ["npm", "start"]
