# Golf Thingy

To run setup launch configuration with path set to ./node_modules/.bin/babel-node
Also mark "dist", "node_modules", and "public/bower_components" as excluded so that webstorm doesn't try to index those files.
Runs on http://localhost:3000

#Local Database set up

Download http://postgresapp.com/
run command in terminal: export DATABASE_URL=postgres:///$(whoami)
heroku pg:pull DATABASE_URL  daddysgottaeat --app daddysgottaeat