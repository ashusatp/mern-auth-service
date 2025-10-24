# ========================== Step 1 ==========================
# Use the official Node.js image as our base
FROM node:20 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of our app's source code into the container
COPY . .

RUN npm run build


# ========================== Step 2 ==========================
FROM node:20 as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY --from=builder /app/dist ./

EXPOSE 5500

CMD ["node", "src/server.js"]