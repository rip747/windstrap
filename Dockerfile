# WindStrap — containerized build toolchain
#
# Builds the project (Tailwind CSS -> dist/windstrap.css + docs/ -> docs pages)
# inside a container so you do NOT need Node.js or npm on your host machine.
#
#   docker compose build           # build the image (installs node_modules inside it)
#   docker compose run --rm build  # npm run build  -> dist/windstrap.css
#   docker compose run --rm docs   # npm run docs   -> docs/ pages
#   docker compose up watch        # watch mode (regenerates CSS on change)

FROM node:20-alpine

WORKDIR /app

# Install dependencies first — keeps the npm layer cached across rebuilds.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project (node_modules, dist and docs are excluded via .dockerignore).
COPY . .

# Default action when running the image without a command override.
CMD ["npm", "run", "build:all"]
