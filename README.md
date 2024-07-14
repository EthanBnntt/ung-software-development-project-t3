# How do I install and setup this program?

## Prerquisites

Install node js from the [Node.js Download Page](https://nodejs.org/en/download/prebuilt-installer).

Install Git from the [Git Download Page](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

Run ```git clone https://github.com/EthanBnntt/ung-software-development-project-t3.git``` in the command prompt.

Run ```cd ./ung-software-development-project-t3.git``` in the commnad prompt.

Run ```npm install``` in the command prompt.

Add a ```.env``` file, with the following content:

```
DATABASE_URL="file:./db.sqlite"

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
# NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="password"

# Next Auth Discord Provider
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""

JWT_SECRET="password"
```

Your app should be running at ```http://localhost:3000/```.

To start the database manager, run ```npx prisma studio```.