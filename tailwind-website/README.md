# experiments/tailwind-website

Experiment with [tailwindcss](https://tailwindcss.com/).

I am just trying to create a simple website, and figuring out how to create a
nice workflow for processing the css using PostCSS.

## Running

Attaches to the [buoy](https://github.com/lightster/buoy) network as
`xp-tailwind-website`.

```
# Serve the public/ via http-server
docker-compose up
```

### Changing docker user

If you are running Docker on Linux for development then you can create a `.env`
file and add `DOCKER_USER=1000:1000`, where 1000 is the uid and gid. Run
`id zacharyrankin` (or your username) to figure out what those are.

This makes it so npm commands write files as your user and not root.
