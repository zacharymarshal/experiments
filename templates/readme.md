# Experiments

A place for me to learn, play, and experiment with different technologies that I
am interested in without having to worry about project names, public/private
repos, etc. --just one big monorepo for all the little things I tinker with.

Anything that I feel proud of or becomes more offical can be moved out into it's
own repo.

## Usage

Most of the experiments will use [Docker](https://www.docker.com) and
[buoy](https://github.com/lightster/buoy).

### Changing Docker user

If you are running Docker on Linux for development then you can create a `.env`
file and add `DOCKER_USER=1000:1000` or add the env variable to your shell,
where 1000 is the uid and gid. Run `id zacharyrankin` (or your username) to
figure out what those are.

This makes it so docker containers run as your user and not root.

## Experiments

{{#each experiments}}
- [{{Name}}](./experiments/{{Name}}) - {{Description}}
{{/each}}
